import {
  Product,
  ProductCategory,
  RetailOrder,
  BulkEnquiry,
  WholesaleOrder,
  CustomerRecord,
  AdminDashboardData,
} from '../types';

import { isSupabaseConfigured } from '../lib/supabaseClient';

import {
  fetchCategoriesFromSupabase,
  fetchProductsFromSupabase,
  fetchProductByIdFromSupabase,
  submitRetailOrderToSupabase,
  trackRetailOrderFromSupabase,
  submitBulkEnquiryToSupabase,
  trackBulkEnquiryFromSupabase,
} from './supabaseService';

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
// PUBLIC CATALOG — SUPABASE
// ----------------------------------------------------

export async function fetchCategories(): Promise<ProductCategory[]> {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.'
    );
  }

  return fetchCategoriesFromSupabase();
}

export async function fetchProducts(
  params?: {
    category?: string;
    search?: string;
    featured?: boolean;
  }
): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.'
    );
  }

  return fetchProductsFromSupabase(params);
}

export async function fetchProductById(id: number): Promise<Product> {
  if (isSupabaseConfigured) {
    try {
      return await fetchProductByIdFromSupabase(id);
    } catch (err) {
      console.warn('Supabase fetchProductById failed:', err);
      throw err;
    }
  }

  const res = await fetch(`${API_BASE}/products/${id}`, {
    headers: { ...getCustomerAuthHeader(), ...getAuthHeader() },
  });

  if (!res.ok) {
    throw new Error('Failed to load product');
  }

  return res.json();
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
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to login');
  }

  return data;
}

// ----------------------------------------------------
// RETAIL ORDERS
// ----------------------------------------------------

export async function submitRetailOrder(payload: any): Promise<any> {
  if (isSupabaseConfigured) {
    return submitRetailOrderToSupabase(payload);
  }

  const res = await fetch(`${API_BASE}/retail-orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getCustomerAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to place order');
  }

  return data;
}

export async function trackRetailOrder(query: string): Promise<any> {
  if (isSupabaseConfigured) {
    return trackRetailOrderFromSupabase(query);
  }

  const res = await fetch(
    `${API_BASE}/retail-orders/track/${encodeURIComponent(query)}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Order not found');
  }

  return data;
}

// ----------------------------------------------------
// BULK ENQUIRIES
// ----------------------------------------------------

export async function submitBulkEnquiry(payload: any): Promise<any> {
  if (isSupabaseConfigured) {
    return submitBulkEnquiryToSupabase(payload);
  }

  const res = await fetch(`${API_BASE}/bulk-enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to submit bulk enquiry');
  }

  return data;
}

export async function trackBulkEnquiry(ref: string): Promise<any> {
  if (isSupabaseConfigured) {
    return trackBulkEnquiryFromSupabase(ref);
  }

  const res = await fetch(
    `${API_BASE}/bulk-enquiries/track/${encodeURIComponent(ref)}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Enquiry not found');
  }

  return data;
}

// ----------------------------------------------------
// ADMIN AUTHENTICATION
// ----------------------------------------------------

export async function loginAdmin(
  email: string,
  password: string
): Promise<any> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Login failed');
  }

  return data;
}

// ----------------------------------------------------
// ADMIN DASHBOARD
// ----------------------------------------------------

export async function fetchAdminDashboard(
  dateRange: string = 'all'
): Promise<AdminDashboardData> {
  const res = await fetch(
    `${API_BASE}/admin/dashboard?dateRange=${encodeURIComponent(dateRange)}`,
    { headers: { ...getAuthHeader() } }
  );

  if (!res.ok) {
    throw new Error('Failed to load dashboard data');
  }

  return res.json();
}

export async function fetchAdminRetailOrders(
  status?: string,
  search?: string
): Promise<RetailOrder[]> {
  const query = new URLSearchParams();

  if (status) query.append('status', status);
  if (search) query.append('search', search);

  const res = await fetch(
    `${API_BASE}/admin/retail-orders?${query.toString()}`,
    { headers: { ...getAuthHeader() } }
  );

  if (!res.ok) {
    throw new Error('Failed to load retail orders');
  }

  return res.json();
}

export async function fetchAdminRetailOrderById(id: number): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/retail-orders/${id}`, {
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) {
    throw new Error('Failed to load retail order details');
  }

  return res.json();
}

export async function updateRetailOrderStatus(
  id: number,
  data: {
    orderStatus?: string;
    paymentStatus?: string;
    notes?: string;
  }
): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/retail-orders/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  const resData = await res.json();

  if (!res.ok) {
    throw new Error(resData.error || 'Failed to update order');
  }

  return resData;
}

export async function fetchAdminBulkEnquiries(
  status?: string,
  search?: string
): Promise<BulkEnquiry[]> {
  const query = new URLSearchParams();

  if (status) query.append('status', status);
  if (search) query.append('search', search);

  const res = await fetch(
    `${API_BASE}/admin/bulk-enquiries?${query.toString()}`,
    { headers: { ...getAuthHeader() } }
  );

  if (!res.ok) {
    throw new Error('Failed to load bulk enquiries');
  }

  return res.json();
}

export async function fetchAdminBulkEnquiryById(id: number): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/bulk-enquiries/${id}`, {
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) {
    throw new Error('Failed to load bulk enquiry details');
  }

  return res.json();
}

export async function updateBulkEnquiryStatus(
  id: number,
  data: {
    status?: string;
    assignedTo?: string;
    internalNotes?: string;
  }
): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/bulk-enquiries/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  const resData = await res.json();

  if (!res.ok) {
    throw new Error(resData.error || 'Failed to update enquiry');
  }

  return resData;
}

export async function createQuotationForEnquiry(
  enquiryId: number,
  quotationData: any
): Promise<any> {
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

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to create quotation');
  }

  return data;
}

export async function updateQuotationStatus(
  quotationId: number,
  status: string,
  notes?: string
): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/quotations/${quotationId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ status, notes }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to update quotation');
  }

  return data;
}

export async function convertQuotationToWholesaleOrder(
  quotationId: number,
  orderData: any
): Promise<any> {
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

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to convert quotation to order');
  }

  return data;
}

export async function fetchAdminWholesaleOrders(
  status?: string,
  search?: string
): Promise<WholesaleOrder[]> {
  const query = new URLSearchParams();

  if (status) query.append('status', status);
  if (search) query.append('search', search);

  const res = await fetch(
    `${API_BASE}/admin/wholesale-orders?${query.toString()}`,
    { headers: { ...getAuthHeader() } }
  );

  if (!res.ok) {
    throw new Error('Failed to load wholesale orders');
  }

  return res.json();
}

export async function updateWholesaleOrderStatus(
  id: number,
  data: any
): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/wholesale-orders/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  const resData = await res.json();

  if (!res.ok) {
    throw new Error(resData.error || 'Failed to update wholesale order');
  }

  return resData;
}

// ----------------------------------------------------
// ADMIN PRODUCTS
// ----------------------------------------------------

export async function fetchAdminProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/admin/products`, {
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) {
    throw new Error('Failed to load admin products');
  }

  return res.json();
}

export async function createAdminProduct(productData: any): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(productData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to create product');
  }

  return data;
}

export async function updateAdminProduct(
  id: number,
  productData: any
): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/products/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(productData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to update product');
  }

  return data;
}

export async function deleteAdminProduct(id: number): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/products/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete product');
  }

  return data;
}

export async function addProductImage(
  productId: number,
  imageUrl: string,
  displayOrder = 0
): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/products/${productId}/images`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ imageUrl, displayOrder }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to add product image');
  }

  return data;
}

export async function deleteProductImage(
  productId: number,
  imageId: number
): Promise<any> {
  const res = await fetch(
    `${API_BASE}/admin/products/${productId}/images/${imageId}`,
    {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete image');
  }

  return data;
}

// ----------------------------------------------------
// ADMIN CUSTOMERS & REPORTS
// ----------------------------------------------------

export async function fetchAdminCustomers(): Promise<CustomerRecord[]> {
  const res = await fetch(`${API_BASE}/admin/customers`, {
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) {
    throw new Error('Failed to load customers');
  }

  return res.json();
}

export async function fetchAdminReports(): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/reports`, {
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) {
    throw new Error('Failed to load reports');
  }

  return res.json();
}
