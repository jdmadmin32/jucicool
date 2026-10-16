import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import {
  Product,
  ProductCategory,
  RetailOrder,
  BulkEnquiry,
  WholesaleOrder,
  AdminDashboardData
} from '../types';

// ====================================================
// PUBLIC DATA OPERATIONS VIA SUPABASE
// ====================================================

export async function fetchCategoriesFromSupabase(): Promise<ProductCategory[]> {
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchProductsFromSupabase(params?: {
  category?: string;
  search?: string;
  featured?: boolean;
}): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select(`
      *,
      product_categories (
        name,
        slug
      ),
      product_images (
        image_url,
        display_order
      )
    `)
    .eq('is_active', 1);

  if (params?.featured) {
    query = query.eq('featured', 1);
  }

  if (params?.category && params.category !== 'all') {
    // Look up category id by slug first, then filter
    const { data: cat } = await supabase
      .from('product_categories')
      .select('id')
      .eq('slug', params.category)
      .maybeSingle();
    if (cat) {
      query = query.eq('category_id', cat.id);
    }
  }

  if (params?.search) {
    const s = params.search.trim();
    query = query.or(`name.ilike.%${s}%,flavor.ilike.%${s}%,description.ilike.%${s}%`);
  }

  query = query
    .order('featured', { ascending: false })
    .order('id', { ascending: true });

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data || []).map((row: any) => ({
    ...row,
    retail_price: Number(row.retail_price),
    wholesale_price: Number(row.wholesale_price || 0),
    category_name: row.product_categories?.name,
    category_slug: row.product_categories?.slug,
    extra_images: (row.product_images || [])
      .sort((a: any, b: any) => a.display_order - b.display_order)
      .map((img: any) => img.image_url),
  }));
}

export async function fetchProductByIdFromSupabase(id: number): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_categories (
        name,
        slug
      )
    `)
    .eq('id', id)
    .single();

  if (error || !data) throw new Error(error?.message || 'Product not found');

  return {
    ...data,
    category_name: data.product_categories?.name,
    category_slug: data.product_categories?.slug,
  };
}

export async function submitRetailOrderToSupabase(payload: {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  city: string;
  state: string;
  pincode: string;
  payment_method: string;
  items: Array<{
    product_id: number;
    product_name: string;
    pack_size: string;
    unit_price: number;
    quantity: number;
    total_price: number;
  }>;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  notes?: string;
}): Promise<{ success: boolean; order_number: string; order_id: number }> {
  const orderNumber = `JC-RET-${Date.now().toString().slice(-6)}`;

  // 1. Insert Order
  const { data: order, error: orderErr } = await supabase
    .from('retail_orders')
    .insert([
      {
        order_number: orderNumber,
        customer_name: payload.customer_name,
        customer_phone: payload.customer_phone,
        customer_email: payload.customer_email || null,
        delivery_address: payload.delivery_address,
        city: payload.city,
        state: payload.state,
        pincode: payload.pincode,
        subtotal: payload.subtotal,
        delivery_fee: payload.delivery_fee,
        total_amount: payload.total_amount,
        payment_method: payload.payment_method || 'COD',
        payment_status: 'Pending',
        order_status: 'New',
        notes: payload.notes || null,
      },
    ])
    .select('id, order_number')
    .single();

  if (orderErr || !order) {
    throw new Error(orderErr?.message || 'Failed to create retail order in Supabase');
  }

  // 2. Insert Line Items
  const itemsToInsert = payload.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name,
    pack_size: item.pack_size,
    unit_price: item.unit_price,
    quantity: item.quantity,
    total_price: item.total_price,
  }));

  const { error: itemsErr } = await supabase.from('retail_order_items').insert(itemsToInsert);

  if (itemsErr) {
    console.error('Failed to insert retail order items:', itemsErr);
  }

  return {
    success: true,
    order_number: order.order_number,
    order_id: order.id,
  };
}

export async function trackRetailOrderFromSupabase(query: string): Promise<any> {
  const clean = query.trim();

  const { data: orders, error } = await supabase
    .from('retail_orders')
    .select(`
      *,
      retail_order_items (*)
    `)
    .or(`order_number.ilike.%${clean}%,customer_phone.ilike.%${clean}%`)
    .order('created_at', { ascending: false });

  if (error || !orders || orders.length === 0) {
    throw new Error('No orders found matching this order number or phone');
  }

  return orders[0];
}

export async function submitBulkEnquiryToSupabase(payload: {
  customer_name: string;
  phone_number: string;
  email?: string;
  business_name: string;
  customer_type: string;
  city: string;
  state: string;
  preferred_contact_method?: string;
  gstin?: string;
  delivery_location?: string;
  additional_notes?: string;
  items: Array<{
    product_id: number;
    product_name: string;
    pack_size: string;
    requested_quantity: number;
    unit_label?: string;
  }>;
}): Promise<{ success: boolean; enquiry_number: string; enquiry_id: number }> {
  const enquiryNumber = `JC-BLK-${Date.now().toString().slice(-4)}`;

  const { data: enquiry, error: enqErr } = await supabase
    .from('bulk_enquiries')
    .insert([
      {
        enquiry_number: enquiryNumber,
        customer_name: payload.customer_name,
        phone_number: payload.phone_number,
        email: payload.email || null,
        business_name: payload.business_name,
        customer_type: payload.customer_type,
        city: payload.city,
        state: payload.state,
        preferred_contact_method: payload.preferred_contact_method || 'Phone',
        gstin: payload.gstin || null,
        delivery_location: payload.delivery_location || null,
        additional_notes: payload.additional_notes || null,
        status: 'New',
      },
    ])
    .select('id, enquiry_number')
    .single();

  if (enqErr || !enquiry) {
    throw new Error(enqErr?.message || 'Failed to submit bulk enquiry to Supabase');
  }

  if (payload.items && payload.items.length > 0) {
    const itemsToInsert = payload.items.map((item) => ({
      enquiry_id: enquiry.id,
      product_id: item.product_id,
      product_name: item.product_name,
      pack_size: item.pack_size,
      requested_quantity: item.requested_quantity,
      unit_label: item.unit_label || 'Units',
    }));

    await supabase.from('bulk_enquiry_items').insert(itemsToInsert);
  }

  return {
    success: true,
    enquiry_number: enquiry.enquiry_number,
    enquiry_id: enquiry.id,
  };
}

export async function trackBulkEnquiryFromSupabase(ref: string): Promise<any> {
  const clean = ref.trim();

  const { data, error } = await supabase
    .from('bulk_enquiries')
    .select(`
      *,
      bulk_enquiry_items (*),
      quotations (*)
    `)
    .or(`enquiry_number.ilike.%${clean}%,phone_number.ilike.%${clean}%`)
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    throw new Error('Enquiry not found');
  }

  return data[0];
}
