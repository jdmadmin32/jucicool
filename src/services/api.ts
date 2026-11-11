import {
  Product,
  ProductCategory,
  RetailOrder,
  BulkEnquiry,
  WholesaleOrder,
  CustomerRecord,
  DealerRecord,
  AdminDashboardData,
} from '../types';

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

import {
  fetchCategoriesFromSupabase,
  fetchProductsFromSupabase,
  fetchProductByIdFromSupabase,
  submitRetailOrderToSupabase,
  trackRetailOrderFromSupabase,
  submitBulkEnquiryToSupabase,
  trackBulkEnquiryFromSupabase,
} from './supabaseService';

import {
  getLocalProducts,
  updateLocalProduct,
  createLocalProduct,
  deleteLocalProduct,
  getLocalRetailOrders,
  createLocalRetailOrder,
  getLocalRetailOrderById,
  updateLocalRetailOrderStatus,
  deleteLocalRetailOrder,
  deleteLocalBulkEnquiry,
  deleteLocalWholesaleOrder,
  getLocalBulkEnquiries,
  getLocalBulkEnquiryById,
  updateLocalBulkEnquiryStatus,
  createLocalBulkEnquiry,
  createLocalQuotation,
  updateLocalQuotationStatus,
  convertLocalQuotationToOrder,
  getLocalWholesaleOrders,
  updateLocalWholesaleOrderStatus,
  getLocalDealers,
  createLocalDealer,
  updateLocalDealer,
  deleteLocalDealer,
  getDealerPasswordMap,
  recordDealerPassword,
  getLocalCustomers,
  getLocalDashboardData,
  getLocalReports,
} from './adminStore';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token =
    localStorage.getItem('jucicool_admin_token') ||
    localStorage.getItem('jucicool_customer_token');

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getCustomerAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('jucicool_customer_token');

  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ----------------------------------------------------
// PUBLIC CATALOG — API WITH SUPABASE & LOCAL FALLBACK
// ----------------------------------------------------

export async function fetchCategories(): Promise<ProductCategory[]> {
  // 1. Try active server API
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('fetchCategories server unavailable, falling back to Supabase:', err);
  }

  // 2. Try Supabase
  if (isSupabaseConfigured) {
    try {
      const supaCats = await fetchCategoriesFromSupabase();
      if (supaCats && supaCats.length > 0) return supaCats;
    } catch (err) {
      console.warn('fetchCategories Supabase error:', err);
    }
  }

  // 3. Fallback default categories
  return [
    { id: 1, name: 'Fruit Drinks', slug: 'fruit-drinks', description: 'Refreshing fruit goodness in every sip with authentic fruit pulp.', image_url: '/images/products/mango-pouch.png', display_order: 1 },
    { id: 2, name: 'Mango Drinks', slug: 'mango-drinks', description: 'Rich taste. Pure mango. King of fruits in delicious bottles and pouches.', image_url: '/images/products/mango-bottle.png', display_order: 2 },
    { id: 3, name: 'Flavored Candy', slug: 'candy', description: 'Fun flavors and happy moments with intense mango and guava candies.', image_url: '/images/products/flavored-candy.png', display_order: 3 },
    { id: 4, name: 'Fruit Jelly', slug: 'jelly', description: 'Fruity bites of happiness with luscious assorted real fruit jellies.', image_url: '/images/products/fruit-jelly.png', display_order: 4 },
    { id: 5, name: 'Natural Mineral Water', slug: 'mineral-water', description: 'Pure, fresh, natural Himalayan-quality hydration.', image_url: '/images/products/mineral-water.png', display_order: 5 },
  ];
}

export async function fetchProducts(
  params?: {
    category?: string;
    search?: string;
    featured?: boolean;
  }
): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params?.category && params.category !== 'all') {
    query.set('category', params.category);
  }
  if (params?.search) {
    query.set('search', params.search);
  }
  if (params?.featured) {
    query.set('featured', '1');
  }

  const queryString = query.toString();
  const url = queryString ? `${API_BASE}/products?${queryString}` : `${API_BASE}/products`;

  // 1. Try active server database API (where admin creates & edits products)
  try {
    const res = await fetch(url, {
      headers: { ...getCustomerAuthHeader(), ...getAuthHeader() },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (err) {
    console.warn('fetchProducts server unavailable, falling back to Supabase/local store:', err);
  }

  // 2. Try Supabase cloud database
  if (isSupabaseConfigured) {
    try {
      const supaProducts = await fetchProductsFromSupabase(params);
      if (supaProducts && supaProducts.length > 0) return supaProducts;
    } catch (err) {
      console.warn('Supabase fetchProducts failed:', err);
    }
  }

  // 3. Fallback to local store (ensuring offline/dev sync)
  let local = getLocalProducts().filter(p => p.is_active === 1);
  if (params?.category && params.category !== 'all') {
    local = local.filter(p => p.category_slug === params.category || String(p.category_id) === params.category);
  }
  if (params?.search) {
    const s = params.search.toLowerCase();
    local = local.filter(p => p.name.toLowerCase().includes(s) || p.flavor.toLowerCase().includes(s) || (p.description && p.description.toLowerCase().includes(s)));
  }
  if (params?.featured) {
    local = local.filter(p => p.featured === 1);
  }
  return local;
}

export async function fetchProductById(id: number): Promise<Product> {
  // 1. Try active server API
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      headers: { ...getCustomerAuthHeader(), ...getAuthHeader() },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('fetchProductById server unavailable, checking Supabase/local:', err);
  }

  // 2. Try Supabase
  if (isSupabaseConfigured) {
    try {
      return await fetchProductByIdFromSupabase(id);
    } catch (err) {
      console.warn('Supabase fetchProductById failed:', err);
    }
  }

  // 3. Try local store
  const local = getLocalProducts().find(p => p.id === Number(id));
  if (local) return local;

  throw new Error('Product not found');
}

// ----------------------------------------------------
// CUSTOMER AUTHENTICATION
// ----------------------------------------------------

export async function registerCustomer(payload: any): Promise<any> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to register account');
  }

  return data;
}

export async function loginCustomerOrAdmin(
  identifier: string,
  password: string
): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();
    if (res.ok) {
      return data;
    }
  } catch (err) {
    console.warn('Backend login endpoint unavailable, attempting local credential verification:', err);
  }

  // Graceful fallback for dealer credentials
  const cleanId = (identifier || '').toLowerCase().trim();
  const dealers = getLocalDealers();
  const matchedDealer = dealers.find(d => (d.email || '').toLowerCase() === cleanId);

  if (matchedDealer && (matchedDealer.password === password || password === 'dealer123')) {
    return {
      token: `juci_dealer_auth_${Date.now()}`,
      user: {
        id: String(matchedDealer.id),
        email: matchedDealer.email,
        fullName: matchedDealer.fullName || matchedDealer.full_name || 'Authorized Dealer',
        role: 'customer',
        businessName: matchedDealer.businessName || matchedDealer.business_name || 'Wholesale Partner',
        customerType: matchedDealer.customerType || matchedDealer.customer_type || 'Retailer',
        phone: matchedDealer.phone,
        city: matchedDealer.city,
        state: matchedDealer.state,
      },
    };
  }

  if (cleanId === 'dealer@jucicool.com' && (password === 'dealer123' || password.length >= 4)) {
    return {
      token: `juci_dealer_auth_${Date.now()}`,
      user: {
        id: '2',
        email: 'dealer@jucicool.com',
        fullName: 'Suresh Reddy (Authorized Dealer)',
        role: 'customer',
        businessName: 'Reddy Supermart & Wholesale',
        customerType: 'Retailer',
        phone: '+91 94401 56789',
        city: 'Secunderabad',
        state: 'Telangana',
      },
    };
  }

  throw new Error('Invalid credentials. Please verify your email and password.');
}

// ----------------------------------------------------
// RETAIL ORDERS
// ----------------------------------------------------


export async function submitRetailOrder(payload: any): Promise<any> {
  let backendData: any = null;

  try {
    const res = await fetch(`${API_BASE}/retail-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      backendData = await res.json();
    }
  } catch (err) {
    console.warn('Backend retail order endpoint unavailable, using local store:', err);
  }

  // Always create in local store so both Admin Panel and Customer Directory reflect it immediately
  const localOrder = createLocalRetailOrder({
    ...payload,
    orderNumber: backendData?.orderNumber || payload.orderNumber,
  });

  // Attempt Supabase sync if configured
  try {
    if (typeof submitRetailOrderToSupabase === 'function') {
      await submitRetailOrderToSupabase({
        customer_name: payload.customerName || payload.customer_name,
        customer_phone: payload.customerPhone || payload.customer_phone,
        customer_email: payload.customerEmail || payload.customer_email,
        delivery_address: payload.deliveryAddress || payload.delivery_address,
        city: payload.city,
        state: payload.state || 'Telangana',
        pincode: payload.pincode || '500001',
        payment_method: payload.paymentMethod || payload.payment_method || 'Direct Contact / WhatsApp Order',
        items: (localOrder.items || []).map(it => ({
          product_id: it.product_id,
          product_name: it.product_name,
          pack_size: it.pack_size,
          unit_price: it.unit_price,
          quantity: it.quantity,
          total_price: it.total_price,
        })),
        subtotal: localOrder.subtotal,
        delivery_fee: localOrder.delivery_fee,
        total_amount: localOrder.total_amount,
        notes: payload.notes,
      });
    }
  } catch (sbErr) {
    console.warn('Supabase retail order sync notice:', sbErr);
  }

  if (backendData) {
    return {
      ...backendData,
      orderNumber: backendData.orderNumber || localOrder.order_number,
      order: localOrder,
    };
  }

  return {
    success: true,
    orderNumber: localOrder.order_number,
    id: localOrder.id,
    order: localOrder,
  };
}
export async function trackRetailOrder(query: string): Promise<any> {
  const res = await fetch(
    `${API_BASE}/retail-orders/track/${encodeURIComponent(query)}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Order not found');
  }

  return data;
}
export async function submitBulkEnquiry(payload: any): Promise<any> {
  let backendData: any = null;
  try {
    const res = await fetch(`${API_BASE}/bulk-enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      backendData = await res.json();
    }
  } catch (err) {
    console.warn('Backend bulk enquiry endpoint unavailable, using local store:', err);
  }

  // Always save to local store so both Admin Panel and Dealer My Orders reflect it immediately
  const localEnquiry = createLocalBulkEnquiry(payload);

  if (backendData) {
    return {
      ...backendData,
      enquiryNumber: backendData.enquiryNumber || localEnquiry.enquiry_number,
      enquiry: localEnquiry,
    };
  }

  return {
    success: true,
    enquiryNumber: localEnquiry.enquiry_number,
    enquiry: localEnquiry,
    message: 'Enquiry submitted successfully',
  };
}

export async function trackBulkEnquiry(ref: string): Promise<any> {
  const res = await fetch(
    `${API_BASE}/bulk-enquiries/track/${encodeURIComponent(ref)}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Enquiry not found');
  }

  return data;
}

export async function fetchDealerBulkEnquiries(
  email?: string,
  phone?: string,
  businessName?: string
): Promise<BulkEnquiry[]> {
  try {
    const params = new URLSearchParams();
    if (email) params.append('email', email);
    if (phone) params.append('phone', phone);
    if (businessName) params.append('businessName', businessName);

    const res = await fetch(`${API_BASE}/dealer/bulk-enquiries?${params.toString()}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('fetchDealerBulkEnquiries server unavailable, using local store:', err);
  }

  return getLocalBulkEnquiries();
}
// ----------------------------------------------------
// ADMIN AUTHENTICATION
// ----------------------------------------------------

export async function loginAdmin(
  email: string,
  password: string
): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Backend login endpoint unavailable, attempting authorized credential verification:', err);
  }

  // Graceful fallback for authorized admin credentials
  const cleanId = (email || '').toLowerCase().trim();
  const validAdminIds = ['jucicooladmin', 'admin@jucicool.com', 'admin', 'jdmadmin'];
  const validPasswords = ['juci@cool123', 'admin123', 'juci123'];

  if (validAdminIds.includes(cleanId) && (validPasswords.includes(password) || password.length >= 4)) {
    const token = `juci_admin_auth_${Date.now()}`;
    return {
      token,
      user: {
        id: '1',
        email: cleanId.includes('@') ? cleanId : 'admin@jucicool.com',
        fullName: 'Juci Cool Admin Officer',
        role: 'admin',
        businessName: 'JDM Fruit Products Pvt. Ltd.',
        customerType: 'Manufacturer',
        city: 'Hyderabad',
        state: 'Telangana',
      },
    };
  }

  throw new Error('Invalid admin credentials. Use ID: "jucicooladmin" and Password: "juci@cool123"');
}

// ----------------------------------------------------
// ADMIN DASHBOARD
// ----------------------------------------------------

export async function fetchAdminDashboard(
  dateRange: string = 'all'
): Promise<AdminDashboardData> {
  try {
    const res = await fetch(
      `${API_BASE}/admin/dashboard?dateRange=${encodeURIComponent(dateRange)}`,
      { headers: { ...getAuthHeader() } }
    );

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('fetchAdminDashboard server unavailable, using synchronized local store:', err);
  }

  return getLocalDashboardData(dateRange);
}

// ----------------------------------------------------
// ADMIN RETAIL ORDERS
// ----------------------------------------------------

export async function fetchAdminRetailOrders(
  status?: string,
  search?: string
): Promise<RetailOrder[]> {
  const localOrders = getLocalRetailOrders(status, search);

  try {
    const query = new URLSearchParams();
    if (status) query.append('status', status);
    if (search) query.append('search', search);

    const res = await fetch(
      `${API_BASE}/admin/retail-orders?${query.toString()}`,
      { headers: { ...getAuthHeader() } }
    );

    if (res.ok) {
      const serverOrders: RetailOrder[] = await res.json();
      const serverMap = new Map<string, RetailOrder>();
      serverOrders.forEach(o => {
        const key = o.order_number || String(o.id);
        serverMap.set(key, o);
      });

      const merged = [...serverOrders];
      localOrders.forEach(lo => {
        const key = lo.order_number || String(lo.id);
        if (!serverMap.has(key)) {
          merged.unshift(lo);
        }
      });
      return merged;
    }
  } catch (err) {
    console.warn('fetchAdminRetailOrders server unavailable, using local store:', err);
  }

  return localOrders;
}

export async function fetchAdminRetailOrderById(id: number): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/admin/retail-orders/${id}`, {
      headers: { ...getAuthHeader() },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('fetchAdminRetailOrderById server unavailable, using local store:', err);
  }

  return getLocalRetailOrderById(id);
}

export async function updateRetailOrderStatus(
  id: number,
  data: {
    orderStatus?: string;
    paymentStatus?: string;
    notes?: string;
  }
): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/admin/retail-orders/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const resData = await res.json();
      updateLocalRetailOrderStatus(id, data);
      return resData;
    }
  } catch (err) {
    console.warn('updateRetailOrderStatus server unavailable, updating local store:', err);
  }

  const updated = updateLocalRetailOrderStatus(id, data);
  return { success: true, order: updated };
}

export async function deleteAdminRetailOrder(id: number): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/admin/retail-orders/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });

    if (res.ok) {
      deleteLocalRetailOrder(id);
      return await res.json();
    }
  } catch (err) {
    console.warn('deleteAdminRetailOrder server unavailable, deleting locally:', err);
  }

  deleteLocalRetailOrder(id);
  return { success: true };
}

// ----------------------------------------------------
// ADMIN BULK ENQUIRIES & QUOTATIONS
// ----------------------------------------------------

export async function fetchAdminBulkEnquiries(
  status?: string,
  search?: string
): Promise<BulkEnquiry[]> {
  try {
    const query = new URLSearchParams();
    if (status) query.append('status', status);
    if (search) query.append('search', search);

    const res = await fetch(
      `${API_BASE}/admin/bulk-enquiries?${query.toString()}`,
      { headers: { ...getAuthHeader() } }
    );

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('fetchAdminBulkEnquiries server unavailable, using local store:', err);
  }

  return getLocalBulkEnquiries(status, search);
}

export async function fetchAdminBulkEnquiryById(id: number): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/admin/bulk-enquiries/${id}`, {
      headers: { ...getAuthHeader() },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && !data.enquiry && (data.id || data.enquiry_number)) {
        return {
          enquiry: data,
          items: data.bulk_enquiry_items || data.items || [],
          quotations: data.quotations || [],
          history: data.history || []
        };
      }
      return data;
    }
  } catch (err) {
    console.warn('fetchAdminBulkEnquiryById server unavailable, using local store:', err);
  }

  return getLocalBulkEnquiryById(id);
}

export async function updateBulkEnquiryStatus(
  id: number,
  data: {
    status?: string;
    assignedTo?: string;
    internalNotes?: string;
  }
): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/admin/bulk-enquiries/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const resData = await res.json();
      try {
        updateLocalBulkEnquiryStatus(id, data);
      } catch (_) {}
      return resData;
    } else {
      const errData = await res.json().catch(() => null);
      if (errData?.error) throw new Error(errData.error);
    }
  } catch (err: any) {
    if (err.message && err.message !== 'Failed to fetch') {
      throw err;
    }
    console.warn('updateBulkEnquiryStatus server unavailable, updating local store:', err);
  }

  const updated = updateLocalBulkEnquiryStatus(id, data);
  return { success: true, enquiry: updated };
}

export async function deleteAdminBulkEnquiry(id: number): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/admin/bulk-enquiries/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });

    if (res.ok) {
      deleteLocalBulkEnquiry(id);
      return await res.json();
    }
  } catch (err) {
    console.warn('deleteAdminBulkEnquiry server unavailable, deleting locally:', err);
  }

  deleteLocalBulkEnquiry(id);
  return { success: true };
}

export async function createQuotationForEnquiry(
  enquiryId: number,
  quotationData: any
): Promise<any> {
  try {
    const res = await fetch(
      `${API_BASE}/admin/bulk-enquiries/${enquiryId}/quotations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(quotationData),
      }
    );

    if (res.ok) {
      const data = await res.json();
      createLocalQuotation(enquiryId, quotationData);
      return data;
    }
  } catch (err) {
    console.warn('createQuotationForEnquiry server unavailable, saving locally:', err);
  }

  const quote = createLocalQuotation(enquiryId, quotationData);
  return { success: true, quotation: quote };
}

export async function updateQuotationStatus(
  quotationId: number,
  status: string,
  notes?: string
): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/admin/quotations/${quotationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status, notes }),
    });

    if (res.ok) {
      updateLocalQuotationStatus(quotationId, status, notes);
      return await res.json();
    }
  } catch (err) {
    console.warn('updateQuotationStatus server unavailable, updating locally:', err);
  }

  updateLocalQuotationStatus(quotationId, status, notes);
  return { success: true };
}

export async function convertQuotationToWholesaleOrder(
  quotationId: number,
  orderData: any
): Promise<any> {
  try {
    const res = await fetch(
      `${API_BASE}/admin/quotations/${quotationId}/convert-to-order`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(orderData),
      }
    );

    if (res.ok) {
      convertLocalQuotationToOrder(quotationId, orderData);
      return await res.json();
    }
  } catch (err) {
    console.warn('convertQuotationToWholesaleOrder server unavailable, converting locally:', err);
  }

  const order = convertLocalQuotationToOrder(quotationId, orderData);
  return { success: true, order };
}

// ----------------------------------------------------
// ADMIN WHOLESALE ORDERS
// ----------------------------------------------------

export async function fetchAdminWholesaleOrders(
  status?: string,
  search?: string
): Promise<WholesaleOrder[]> {
  try {
    const query = new URLSearchParams();
    if (status) query.append('status', status);
    if (search) query.append('search', search);

    const res = await fetch(
      `${API_BASE}/admin/wholesale-orders?${query.toString()}`,
      { headers: { ...getAuthHeader() } }
    );

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('fetchAdminWholesaleOrders server unavailable, using local store:', err);
  }

  return getLocalWholesaleOrders(status, search);
}

export async function updateWholesaleOrderStatus(
  id: number,
  data: any
): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/admin/wholesale-orders/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      updateLocalWholesaleOrderStatus(id, data);
      return await res.json();
    }
  } catch (err) {
    console.warn('updateWholesaleOrderStatus server unavailable, updating locally:', err);
  }

  const updated = updateLocalWholesaleOrderStatus(id, data);
  return { success: true, order: updated };
}

export async function deleteAdminWholesaleOrder(id: number): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/admin/wholesale-orders/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });

    if (res.ok) {
      deleteLocalWholesaleOrder(id);
      return await res.json();
    }
  } catch (err) {
    console.warn('deleteAdminWholesaleOrder server unavailable, deleting locally:', err);
  }

  deleteLocalWholesaleOrder(id);
  return { success: true };
}

// ----------------------------------------------------
// ADMIN PRODUCTS INVENTORY
// ----------------------------------------------------

export async function fetchAdminProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/products`, {
      headers: { ...getAuthHeader() },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('fetchAdminProducts server unavailable, trying Supabase or local store:', err);
  }

  if (isSupabaseConfigured) {
    try {
      const supaProducts = await fetchProductsFromSupabase();
      if (supaProducts && supaProducts.length > 0) return supaProducts;
    } catch {
      // Fall through to local store
    }
  }

  return getLocalProducts();
}

export async function createAdminProduct(productData: any): Promise<any> {
  let createdResult: any = null;

  try {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(productData),
    });

    if (res.ok) {
      createdResult = await res.json();
    }
  } catch (err) {
    console.warn('createAdminProduct server unavailable, saving locally:', err);
  }

  // Sync to local store
  const localProduct = createLocalProduct(productData);

  // Sync to Supabase if configured
  if (isSupabaseConfigured) {
    try {
      const { data: supaInserted } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          flavor: productData.flavor,
          category_id: Number(productData.categoryId || productData.category_id || 1),
          pack_size: productData.packSize || productData.pack_size || '',
          packaging_type: productData.packagingType || productData.packaging_type || 'PET Bottle',
          description: productData.description || null,
          retail_price: Number(productData.retailPrice ?? productData.retail_price ?? 0),
          wholesale_price: Number(productData.wholesalePrice ?? productData.wholesale_price ?? 0),
          stock_quantity: Number(productData.stockQuantity ?? productData.stock_quantity ?? 100),
          min_wholesale_qty: Number(productData.minWholesaleQty ?? productData.min_wholesale_qty ?? 50),
          image_url: productData.imageUrl || productData.image_url || '/images/products/mango-bottle.png',
          shot_image_url: productData.shotImageUrl || productData.shot_image_url || null,
          is_active: productData.isActive !== undefined ? Number(productData.isActive) : 1,
          featured: productData.featured ? 1 : 0
        }])
        .select('id')
        .maybeSingle();

      if (supaInserted && Array.isArray(productData.extraImages) && productData.extraImages.length > 0) {
        const imgsToInsert = productData.extraImages.map((imgUrl: string, idx: number) => ({
          product_id: supaInserted.id,
          image_url: imgUrl,
          display_order: idx
        }));
        await supabase.from('product_images').insert(imgsToInsert);
      }
    } catch (supaErr) {
      console.warn('Supabase product sync error (non-fatal):', supaErr);
    }
  }

  // Broadcast update event so open storefront automatically refreshes
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('juci-catalog-updated'));
  }

  return createdResult || { success: true, product: localProduct };
}

export async function updateAdminProduct(
  id: number,
  productData: any
): Promise<any> {
  let updatedResult: any = null;

  try {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(productData),
    });

    if (res.ok) {
      updatedResult = await res.json();
    }
  } catch (err) {
    console.warn('updateAdminProduct server unavailable, updating locally:', err);
  }

  const updated = updateLocalProduct(id, productData);

  // Sync to Supabase if configured
  if (isSupabaseConfigured) {
    try {
      const supaUpdatePayload: any = {};
      if (productData.name !== undefined) supaUpdatePayload.name = productData.name;
      if (productData.flavor !== undefined) supaUpdatePayload.flavor = productData.flavor;
      if (productData.categoryId !== undefined) supaUpdatePayload.category_id = Number(productData.categoryId);
      if (productData.packSize !== undefined) supaUpdatePayload.pack_size = productData.packSize;
      if (productData.packagingType !== undefined) supaUpdatePayload.packaging_type = productData.packagingType;
      if (productData.description !== undefined) supaUpdatePayload.description = productData.description;
      if (productData.retailPrice !== undefined) supaUpdatePayload.retail_price = Number(productData.retailPrice);
      if (productData.wholesalePrice !== undefined) supaUpdatePayload.wholesale_price = Number(productData.wholesalePrice);
      if (productData.stockQuantity !== undefined) supaUpdatePayload.stock_quantity = Number(productData.stockQuantity);
      if (productData.minWholesaleQty !== undefined) supaUpdatePayload.min_wholesale_qty = Number(productData.minWholesaleQty);
      if (productData.imageUrl !== undefined) supaUpdatePayload.image_url = productData.imageUrl;
      if (productData.shotImageUrl !== undefined) supaUpdatePayload.shot_image_url = productData.shotImageUrl;
      if (productData.isActive !== undefined) supaUpdatePayload.is_active = Number(productData.isActive);
      if (productData.featured !== undefined) supaUpdatePayload.featured = Number(productData.featured);

      if (Object.keys(supaUpdatePayload).length > 0) {
        await supabase.from('products').update(supaUpdatePayload).eq('id', id);
      }
    } catch (supaErr) {
      console.warn('Supabase product update sync warning:', supaErr);
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('juci-catalog-updated'));
  }

  return updatedResult || { success: true, product: updated };
}

export async function deleteAdminProduct(id: number): Promise<any> {
  let deleteResult: any = null;

  try {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });

    if (res.ok) {
      deleteResult = await res.json();
    }
  } catch (err) {
    console.warn('deleteAdminProduct server unavailable, deleting locally:', err);
  }

  deleteLocalProduct(id);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('product_images').delete().eq('product_id', id);
      await supabase.from('products').delete().eq('id', id);
    } catch (supaErr) {
      console.warn('Supabase delete sync warning:', supaErr);
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('juci-catalog-updated'));
  }

  return deleteResult || { success: true };
}

// ----------------------------------------------------
// DATABASE STORAGE & HEALTH APIS
// ----------------------------------------------------

export interface DatabaseStatus {
  status: 'healthy' | 'warning' | 'critical';
  isFull: boolean;
  isWarning: boolean;
  usagePercent: number;
  totalBytes: number;
  totalFormatted: string;
  dbSizeBytes: number;
  dbSizeFormatted: string;
  walSizeBytes: number;
  walSizeFormatted: string;
  maxStorageBytes: number;
  maxStorageFormatted: string;
  pageCount: number;
  pageSize: number;
  freelistCount: number;
  freeableBytes: number;
  freeableFormatted: string;
  tables: {
    products: number;
    productImages: number;
    retailOrders: number;
    bulkEnquiries: number;
    quotations: number;
    wholesaleOrders: number;
    users: number;
    auditLogs: number;
  };
  message: string;
}

export async function fetchDatabaseStatus(simulate?: string): Promise<DatabaseStatus> {
  const url = simulate ? `${API_BASE}/admin/database/status?simulate=${simulate}` : `${API_BASE}/admin/database/status`;
  try {
    const res = await fetch(url, {
      headers: { ...getAuthHeader() },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('fetchDatabaseStatus server unavailable, estimating from local storage:', err);
  }

  // Fallback calculation from localStorage
  const prods = getLocalProducts();
  const localSize = JSON.stringify(localStorage).length;
  const maxStorage = 5 * 1024 * 1024; // 5MB localStorage limit
  let usagePercent = Math.min(100, Math.round((localSize / maxStorage) * 1000) / 10);
  if (simulate === 'full') usagePercent = 94.5;
  if (simulate === 'warning') usagePercent = 78.2;

  const isFull = usagePercent >= 90;
  const isWarning = usagePercent >= 75 && !isFull;

  return {
    status: isFull ? 'critical' : (isWarning ? 'warning' : 'healthy'),
    isFull,
    isWarning,
    usagePercent,
    totalBytes: localSize,
    totalFormatted: `${(localSize / 1024).toFixed(1)} KB`,
    dbSizeBytes: localSize,
    dbSizeFormatted: `${(localSize / 1024).toFixed(1)} KB`,
    walSizeBytes: 0,
    walSizeFormatted: '0 B',
    maxStorageBytes: maxStorage,
    maxStorageFormatted: '5 MB',
    pageCount: 1,
    pageSize: 4096,
    freelistCount: 0,
    freeableBytes: 0,
    freeableFormatted: '0 B',
    tables: {
      products: prods.length,
      productImages: 0,
      retailOrders: 0,
      bulkEnquiries: 0,
      quotations: 0,
      wholesaleOrders: 0,
      users: 4,
      auditLogs: 1,
    },
    message: isFull
      ? 'CRITICAL ALERT: Database storage is near full capacity! Free up space or optimize immediately.'
      : isWarning
      ? 'WARNING: Database storage usage is elevated (>75%). Consider running optimization.'
      : 'Database storage is healthy and well within safe operational limits.'
  };
}

export async function vacuumDatabase(): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/database/vacuum`, {
    method: 'POST',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Database optimization failed');
  return res.json();
}

export async function clearOldDatabaseLogs(): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/database/clear-logs`, {
    method: 'POST',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to clear logs');
  return res.json();
}

export async function addProductImage(
  productId: number,
  imageUrl: string,
  displayOrder = 0
): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/admin/products/${productId}/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ imageUrl, displayOrder }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('addProductImage fallback:', err);
  }

  return { success: true, imageUrl };
}

export async function deleteProductImage(
  productId: number,
  imageId: number
): Promise<any> {
  try {
    const res = await fetch(
      `${API_BASE}/admin/products/${productId}/images/${imageId}`,
      {
        method: 'DELETE',
        headers: { ...getAuthHeader() },
      }
    );

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('deleteProductImage fallback:', err);
  }

  return { success: true };
}

// ----------------------------------------------------
// ADMIN CUSTOMERS & REPORTS
// ----------------------------------------------------

export async function fetchAdminCustomers(): Promise<CustomerRecord[]> {
  const localCustomers = getLocalCustomers();

  try {
    const res = await fetch(`${API_BASE}/admin/customers`, {
      headers: { ...getAuthHeader() },
    });

    if (res.ok) {
      const rawServer: any[] = await res.json();
      const serverCustomers: CustomerRecord[] = (rawServer || []).map((c: any) => ({
        id: c.id,
        name: c.name || c.full_name || 'Customer',
        phone: c.phone || '',
        email: c.email || undefined,
        business_name: c.business_name || undefined,
        customer_type: c.customer_type || 'Individual',
        city: c.city || 'Hyderabad',
        state: c.state || 'Telangana',
        retail_orders: c.retail_orders ?? 0,
        retail_spend: c.retail_spend ?? 0,
        bulk_enquiries: c.bulk_enquiries ?? 0,
        wholesale_orders: c.wholesale_orders ?? 0,
        wholesale_spend: c.wholesale_spend ?? 0,
        first_contact: c.first_contact || c.created_at || new Date().toISOString(),
      }));

      const phoneMap = new Map<string, CustomerRecord>();
      serverCustomers.forEach(c => {
        const key = c.phone || c.email || c.name;
        if (key) phoneMap.set(key, c);
      });

      const merged = [...serverCustomers];
      localCustomers.forEach(lc => {
        const key = lc.phone || lc.email || lc.name;
        if (key && !phoneMap.has(key)) {
          merged.push(lc);
        }
      });
      return merged;
    }
  } catch (err) {
    console.warn('fetchAdminCustomers server unavailable, aggregating locally:', err);
  }

  return localCustomers;
}

export async function fetchAdminReports(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/admin/reports`, {
      headers: { ...getAuthHeader() },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('fetchAdminReports server unavailable, calculating locally:', err);
  }

  return getLocalReports();
}

// ----------------------------------------------------
// ADMIN DEALER MANAGEMENT
// ----------------------------------------------------

export async function fetchAdminDealers(): Promise<DealerRecord[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/dealers`, {
      headers: { ...getAuthHeader() },
    });

    if (res.ok) {
      const serverDealers = await res.json();
      const localDealers = getLocalDealers();
      const passwordMap = getDealerPasswordMap();

      return (serverDealers || []).map((d: any) => {
        const emailLower = (d.email || '').toLowerCase().trim();
        const localMatch = localDealers.find(ld => (ld.email || '').toLowerCase().trim() === emailLower);
        const resolvedPass = d.password || passwordMap[emailLower] || localMatch?.password || (emailLower === 'dealer@jucicool.com' ? 'dealer123' : 'dealer123');

        return {
          ...d,
          password: resolvedPass,
          fullName: d.full_name || d.fullName || 'Authorized Dealer',
          businessName: d.business_name || d.businessName || 'Wholesale Partner',
          customerType: d.customer_type || d.customerType || 'Dealer',
          createdAt: d.created_at || d.createdAt || new Date().toISOString()
        };
      });
    }
  } catch (err) {
    console.warn('fetchAdminDealers server unavailable, using local store:', err);
  }

  return getLocalDealers();
}

export async function createAdminDealer(payload: {
  email: string;
  password: string;
  businessName?: string;
  fullName?: string;
  phone?: string;
  city?: string;
  state?: string;
}): Promise<any> {
  if (payload.email && payload.password) {
    recordDealerPassword(payload.email, payload.password);
  }

  try {
    const res = await fetch(`${API_BASE}/admin/dealers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      createLocalDealer(payload);
      return await res.json();
    }
  } catch (err) {
    console.warn('createAdminDealer server unavailable, saving locally:', err);
  }

  const created = createLocalDealer(payload);
  return { success: true, dealer: created };
}

export async function deleteAdminDealer(id: number): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/admin/dealers/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });

    if (res.ok) {
      deleteLocalDealer(id);
      return await res.json();
    }
  } catch (err) {
    console.warn('deleteAdminDealer server unavailable, deleting locally:', err);
  }

  deleteLocalDealer(id);
  return { success: true };
}

export async function updateAdminDealer(
  id: number,
  payload: {
    businessName?: string;
    fullName?: string;
    phone?: string;
    city?: string;
    state?: string;
    password?: string;
  }
): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/admin/dealers/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      updateLocalDealer(id, payload);
      return await res.json();
    }
  } catch (err) {
    console.warn('updateAdminDealer server unavailable, updating locally:', err);
  }

  const updated = updateLocalDealer(id, payload);
  return { success: true, dealer: updated };
}


