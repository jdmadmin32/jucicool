export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
}

export interface Product {
  id: number;
  name: string;
  flavor: string;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  pack_size: string;
  packaging_type: string;
  description: string;
  retail_price: number;
  wholesale_price?: number;
  stock_quantity: number;
  min_wholesale_qty: number;
  image_url: string;
  shot_image_url?: string;
  extra_images?: string[];
  image_records?: { id: number; image_url: string; display_order: number }[];
  is_active: number;
  featured: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface RetailOrder {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  notes?: string;
  created_at: string;
  items?: RetailOrderItem[];
  itemCount?: number;
  totalItemsQuantity?: number;
}

export interface RetailOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  pack_size: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface BulkEnquiry {
  id: number;
  enquiry_number: string;
  customer_name: string;
  phone_number: string;
  email?: string;
  business_name: string;
  customer_type: string;
  city: string;
  state: string;
  preferred_contact_method: string;
  gstin?: string;
  delivery_location?: string;
  additional_notes?: string;
  status: string;
  assigned_to?: string;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
  items?: BulkEnquiryItem[];
  latestQuotation?: QuotationSummary;
}

export interface BulkEnquiryItem {
  id?: number;
  enquiry_id?: number;
  product_id: number;
  product_name: string;
  pack_size: string;
  requested_quantity: number;
  unit_label: string;
}

export interface QuotationSummary {
  id: number;
  quotation_number: string;
  grand_total: number;
  status: string;
}

export interface Quotation {
  id: number;
  quotation_number: string;
  enquiry_id: number;
  customer_name: string;
  business_name: string;
  phone_number: string;
  email?: string;
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  tax_percent: number;
  tax_amount: number;
  delivery_charges: number;
  grand_total: number;
  validity_date: string;
  payment_terms: string;
  notes_conditions?: string;
  status: string;
  created_by: string;
  created_at: string;
  items?: QuotationItem[];
}

export interface QuotationItem {
  id?: number;
  quotation_id?: number;
  product_id: number;
  product_name: string;
  pack_size: string;
  requested_quantity: number;
  approved_unit_price: number;
  total_price: number;
}

export interface WholesaleOrder {
  id: number;
  order_number: string;
  quotation_id: number;
  enquiry_id: number;
  business_name: string;
  contact_person: string;
  phone_number: string;
  email?: string;
  delivery_address: string;
  city: string;
  state: string;
  agreed_total: number;
  advance_paid: number;
  payment_status: string;
  fulfillment_status: string;
  order_date: string;
  expected_delivery_date?: string;
  notes?: string;
  created_at: string;
  items?: WholesaleOrderItem[];
}

export interface WholesaleOrderItem {
  id: number;
  wholesale_order_id: number;
  product_id: number;
  product_name: string;
  pack_size: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CustomerRecord {
  phone: string;
  name: string;
  email?: string;
  city: string;
  state: string;
  business_name?: string;
  customer_type: string;
  retail_orders: number;
  retail_spend: number;
  bulk_enquiries: number;
  wholesale_orders: number;
  wholesale_spend: number;
  first_contact: string;
}

export interface StatusHistory {
  id: number;
  entity_type: string;
  entity_id: number;
  previous_status?: string;
  new_status: string;
  changed_by: string;
  notes?: string;
  created_at: string;
}

export interface AdminDashboardData {
  metrics: {
    totalRetailOrders: number;
    newRetailOrders: number;
    retailRevenue: number;
    totalBulkEnquiries: number;
    newBulkEnquiries: number;
    quotationsAwaitingResponse: number;
    acceptedQuotations: number;
    wholesaleOrdersCount: number;
    wholesaleRevenue: number;
    totalProducts: number;
    lowStockProducts: number;
  };
  recentRetail: any[];
  recentEnquiries: any[];
  salesTrends: any[];
  enquiryStatusBreakdown: any[];
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'admin' | 'sales_rep' | 'customer';
  phone?: string;
  businessName?: string;
  customerType?: 'Retailer' | 'Dealer' | 'Individual' | string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  customerType: 'dealer_retailer' | 'general' | 'Retailer' | 'Individual';
  businessName?: string;
  city?: string;
  state?: string;
}
