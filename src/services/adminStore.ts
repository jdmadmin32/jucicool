import {
  Product,
  RetailOrder,
  BulkEnquiry,
  BulkEnquiryItem,
  WholesaleOrder,
  DealerRecord,
  CustomerRecord,
  AdminDashboardData,
  Quotation
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_RETAIL_ORDERS,
  INITIAL_BULK_ENQUIRIES,
  INITIAL_WHOLESALE_ORDERS,
  INITIAL_DEALERS
} from './adminMockData';

// Helper to get from localStorage or initialize
function getStored<T>(key: string, initial: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return initial;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.warn(`Failed to save to localStorage (${key}):`, err);
  }
}

// Clean old v2 stores containing dummy data
try {
  ['jucicool_admin_retail_orders_v2', 'jucicool_admin_bulk_enquiries_v2', 'jucicool_admin_wholesale_orders_v2', 'jucicool_admin_dealers_v2'].forEach(k => {
    localStorage.removeItem(k);
  });
} catch {}

const STORAGE_KEYS = {
  PRODUCTS: 'jucicool_admin_products_v3',
  RETAIL_ORDERS: 'jucicool_admin_retail_orders_v3',
  BULK_ENQUIRIES: 'jucicool_admin_bulk_enquiries_v3',
  WHOLESALE_ORDERS: 'jucicool_admin_wholesale_orders_v3',
  DEALERS: 'jucicool_admin_dealers_v3',
};

// ----------------------------------------------------
// PRODUCTS STORE
// ----------------------------------------------------
export function getLocalProducts(): Product[] {
  return getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
}

export function saveLocalProducts(products: Product[]): void {
  setStored(STORAGE_KEYS.PRODUCTS, products);
}

export function updateLocalProduct(id: number, data: Partial<Product> & Record<string, any>): Product {
  const prods = getLocalProducts();
  const idx = prods.findIndex(p => p.id === Number(id));
  if (idx === -1) {
    throw new Error('Product not found');
  }

  const updated: Product = {
    ...prods[idx],
    name: data.name !== undefined ? data.name : prods[idx].name,
    flavor: data.flavor !== undefined ? data.flavor : prods[idx].flavor,
    pack_size: data.packSize !== undefined ? data.packSize : (data.pack_size ?? prods[idx].pack_size),
    packaging_type: data.packagingType !== undefined ? data.packagingType : (data.packaging_type ?? prods[idx].packaging_type),
    retail_price: data.retailPrice !== undefined ? Number(data.retailPrice) : (data.retail_price !== undefined ? Number(data.retail_price) : prods[idx].retail_price),
    wholesale_price: data.wholesalePrice !== undefined ? Number(data.wholesalePrice) : (data.wholesale_price !== undefined ? Number(data.wholesale_price) : prods[idx].wholesale_price),
    stock_quantity: data.stockQuantity !== undefined ? Number(data.stockQuantity) : (data.stock_quantity !== undefined ? Number(data.stock_quantity) : prods[idx].stock_quantity),
    min_wholesale_qty: data.minWholesaleQty !== undefined ? Number(data.minWholesaleQty) : (data.min_wholesale_qty !== undefined ? Number(data.min_wholesale_qty) : prods[idx].min_wholesale_qty),
    description: data.description !== undefined ? data.description : prods[idx].description,
    image_url: data.imageUrl !== undefined ? data.imageUrl : (data.image_url ?? prods[idx].image_url),
    shot_image_url: data.shotImageUrl !== undefined ? data.shotImageUrl : (data.shot_image_url ?? prods[idx].shot_image_url),
    is_active: data.isActive !== undefined ? Number(data.isActive) : (data.is_active !== undefined ? Number(data.is_active) : prods[idx].is_active),
    featured: data.featured !== undefined ? Number(data.featured) : prods[idx].featured,
    extra_images: data.extraImages || prods[idx].extra_images,
  };

  prods[idx] = updated;
  saveLocalProducts(prods);
  return updated;
}

export function createLocalProduct(data: any): Product {
  const prods = getLocalProducts();
  const newId = Math.max(0, ...prods.map(p => p.id)) + 1;
  const newProd: Product = {
    id: newId,
    name: data.name || 'New Juci Cool Flavor',
    flavor: data.flavor || 'Mixed Fruit',
    category_id: data.categoryId || 1,
    category_name: data.categoryId === 2 ? 'Mango Drinks' : data.categoryId === 3 ? 'Flavored Candy' : data.categoryId === 4 ? 'Fruit Jelly' : data.categoryId === 5 ? 'Natural Mineral Water' : 'Fruit Drinks',
    pack_size: data.packSize || data.pack_size || '250 ml Bottle',
    packaging_type: data.packagingType || data.packaging_type || 'PET Bottle',
    description: data.description || 'Freshly made with natural fruits by Juci Cool.',
    retail_price: Number(data.retailPrice || data.retail_price || 20),
    wholesale_price: Number(data.wholesalePrice || data.wholesale_price || 15),
    stock_quantity: Number(data.stockQuantity || data.stock_quantity || 200),
    min_wholesale_qty: Number(data.minWholesaleQty || data.min_wholesale_qty || 100),
    image_url: data.imageUrl || data.image_url || '/images/products/mango-bottle.png',
    shot_image_url: data.shotImageUrl || data.shot_image_url || '/images/products/shot-mango-bottle.png',
    is_active: data.isActive !== undefined ? Number(data.isActive) : 1,
    featured: data.featured ? Number(data.featured) : 0,
    extra_images: data.extraImages || [],
  };

  prods.unshift(newProd);
  saveLocalProducts(prods);
  return newProd;
}

export function deleteLocalProduct(id: number): void {
  const prods = getLocalProducts().filter(p => p.id !== Number(id));
  saveLocalProducts(prods);
}

// ----------------------------------------------------
// RETAIL ORDERS STORE
// ----------------------------------------------------
export function getLocalRetailOrders(status?: string, search?: string): RetailOrder[] {
  let list = getStored<RetailOrder[]>(STORAGE_KEYS.RETAIL_ORDERS, INITIAL_RETAIL_ORDERS);
  if (status && status !== 'All') {
    list = list.filter(o => o.order_status.toLowerCase() === status.toLowerCase());
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(o =>
      o.order_number.toLowerCase().includes(s) ||
      o.customer_name.toLowerCase().includes(s) ||
      o.customer_phone.includes(s) ||
      o.city.toLowerCase().includes(s)
    );
  }
  return list;
}

export function getLocalRetailOrderById(id: number): { order: RetailOrder; items: any[]; statusHistory: any[] } {
  const orders = getStored<RetailOrder[]>(STORAGE_KEYS.RETAIL_ORDERS, INITIAL_RETAIL_ORDERS);
  const found = orders.find(o => o.id === Number(id));
  if (!found) throw new Error('Order not found');

  return {
    order: found,
    items: found.items || [],
    statusHistory: [
      { id: 1, from_status: 'Created', to_status: found.order_status, changed_by: 'Admin', notes: 'Order confirmed', created_at: found.created_at }
    ]
  };
}

export function updateLocalRetailOrderStatus(id: number, data: { orderStatus?: string; paymentStatus?: string; notes?: string }): RetailOrder {
  const orders = getStored<RetailOrder[]>(STORAGE_KEYS.RETAIL_ORDERS, INITIAL_RETAIL_ORDERS);
  const idx = orders.findIndex(o => o.id === Number(id));
  if (idx === -1) throw new Error('Order not found');

  if (data.orderStatus) orders[idx].order_status = data.orderStatus;
  if (data.paymentStatus) orders[idx].payment_status = data.paymentStatus;
  if (data.notes !== undefined) orders[idx].notes = data.notes;

  setStored(STORAGE_KEYS.RETAIL_ORDERS, orders);
  return orders[idx];
}

export function deleteLocalRetailOrder(id: number): void {
  const orders = getStored<RetailOrder[]>(STORAGE_KEYS.RETAIL_ORDERS, INITIAL_RETAIL_ORDERS);
  const updated = orders.filter(o => o.id !== Number(id));
  setStored(STORAGE_KEYS.RETAIL_ORDERS, updated);
}

// ----------------------------------------------------
// BULK ENQUIRIES STORE
// ----------------------------------------------------
export function getLocalBulkEnquiries(status?: string, search?: string): BulkEnquiry[] {
  let list = getStored<BulkEnquiry[]>(STORAGE_KEYS.BULK_ENQUIRIES, INITIAL_BULK_ENQUIRIES);
  if (status && status !== 'All') {
    list = list.filter(e => e.status.toLowerCase() === status.toLowerCase());
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(e =>
      e.enquiry_number.toLowerCase().includes(s) ||
      e.business_name.toLowerCase().includes(s) ||
      e.customer_name.toLowerCase().includes(s) ||
      e.phone_number.includes(s) ||
      e.city.toLowerCase().includes(s)
    );
  }
  return list;
}

export function getLocalBulkEnquiryById(id: number): { enquiry: BulkEnquiry; items: any[]; quotations: any[]; statusHistory: any[] } {
  const enquiries = getStored<BulkEnquiry[]>(STORAGE_KEYS.BULK_ENQUIRIES, INITIAL_BULK_ENQUIRIES);
  const found = enquiries.find(e => e.id === Number(id));
  if (!found) {
    return {
      enquiry: {
        id: Number(id),
        enquiry_number: `JC-BLK-${id}`,
        customer_name: 'Authorized Dealer',
        phone_number: '',
        customer_type: 'Dealer',
        business_name: 'Dealer Store',
        city: 'Hyderabad',
        state: 'Telangana',
        status: 'New',
        preferred_contact_method: 'phone',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      items: [],
      quotations: [],
      statusHistory: []
    };
  }

  return {
    enquiry: found,
    items: found.items || [],
    quotations: found.quotations || [],
    statusHistory: [
      { id: 1, from_status: 'New', to_status: found.status, changed_by: found.assigned_to || 'Admin', notes: 'Initial review', created_at: found.created_at }
    ]
  };
}

export function updateLocalBulkEnquiryStatus(id: number, data: { status?: string; assignedTo?: string; internalNotes?: string }): BulkEnquiry {
  const enquiries = getStored<BulkEnquiry[]>(STORAGE_KEYS.BULK_ENQUIRIES, INITIAL_BULK_ENQUIRIES);
  const idx = enquiries.findIndex(e => e.id === Number(id));
  if (idx === -1) {
    const dummy: BulkEnquiry = {
      id: Number(id),
      enquiry_number: `JC-BLK-${id}`,
      customer_name: 'Dealer',
      phone_number: '',
      customer_type: 'Dealer',
      business_name: 'Dealer Store',
      city: 'Hyderabad',
      state: 'Telangana',
      status: data.status || 'Confirmed',
      assigned_to: data.assignedTo,
      internal_notes: data.internalNotes,
      preferred_contact_method: 'phone',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    enquiries.unshift(dummy);
    setStored(STORAGE_KEYS.BULK_ENQUIRIES, enquiries);
    return dummy;
  }

  if (data.status) enquiries[idx].status = data.status;
  if (data.assignedTo !== undefined) enquiries[idx].assigned_to = data.assignedTo;
  if (data.internalNotes !== undefined) enquiries[idx].internal_notes = data.internalNotes;

  setStored(STORAGE_KEYS.BULK_ENQUIRIES, enquiries);
  return enquiries[idx];
}

export function createLocalBulkEnquiry(data: any): BulkEnquiry {
  const enquiries = getStored<BulkEnquiry[]>(STORAGE_KEYS.BULK_ENQUIRIES, INITIAL_BULK_ENQUIRIES);
  const newId = (enquiries.length > 0 ? Math.max(...enquiries.map(e => Number(e.id) || 0)) : 100) + 1;
  const enquiryNumber = `JC-BLK-${Math.floor(100000 + Math.random() * 900000)}`;

  const items: BulkEnquiryItem[] = Array.isArray(data.items)
    ? data.items.map((it: any, i: number) => ({
        id: i + 1,
        enquiry_id: newId,
        product_id: Number(it.productId || it.product_id || 1),
        product_name: it.productName || it.product_name || 'Juci Cool Product',
        pack_size: it.packSize || it.pack_size || '',
        requested_quantity: Number(it.quantity || it.requestedQuantity || it.requested_quantity || 0),
        unit_label: it.unitLabel || it.unit_label || 'Cartons',
      }))
    : [];

  const newEnquiry: BulkEnquiry = {
    id: newId,
    enquiry_number: enquiryNumber,
    customer_name: data.customerName || data.customer_name || 'Authorized Dealer',
    phone_number: data.phoneNumber || data.phone_number || data.phone || '',
    email: data.email || '',
    business_name: data.businessName || data.business_name || 'Dealer Store',
    customer_type: data.customerType || data.customer_type || 'Dealer',
    city: data.city || 'Hyderabad',
    state: data.state || 'Telangana',
    preferred_contact_method: data.preferredContactMethod || data.preferred_contact_method || 'WhatsApp',
    gstin: data.gstin || '',
    delivery_location: data.deliveryLocation || data.delivery_location || '',
    additional_notes: data.additionalNotes || data.additional_notes || data.notes || '',
    status: 'Pending',
    assigned_to: 'JDM Admin Officer',
    internal_notes: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items,
  };

  enquiries.unshift(newEnquiry);
  setStored(STORAGE_KEYS.BULK_ENQUIRIES, enquiries);
  return newEnquiry;
}

export function createLocalQuotation(enquiryId: number, data: any): Quotation {
  const enquiries = getStored<BulkEnquiry[]>(STORAGE_KEYS.BULK_ENQUIRIES, INITIAL_BULK_ENQUIRIES);
  const idx = enquiries.findIndex(e => e.id === Number(enquiryId));
  if (idx === -1) throw new Error('Enquiry not found');

  const enq = enquiries[idx];
  const newQuoteId = Math.floor(100 + Math.random() * 900);
  const quoteNumber = `JC-QT-${newQuoteId}`;

  const quote: Quotation = {
    id: newQuoteId,
    quotation_number: quoteNumber,
    enquiry_id: enq.id,
    customer_name: enq.customer_name,
    business_name: enq.business_name,
    phone_number: enq.phone_number,
    email: enq.email,
    subtotal: Number(data.subtotal || 0),
    discount_percent: Number(data.discountPercent || 0),
    discount_amount: Number(data.discountAmount || 0),
    tax_percent: Number(data.taxPercent || 12),
    tax_amount: Number(data.taxAmount || 0),
    delivery_charges: Number(data.deliveryCharges || 0),
    grand_total: Number(data.grandTotal || 0),
    validity_date: data.validityDate || '2026-11-30',
    payment_terms: data.paymentTerms || '50% Advance, Balance on Delivery',
    notes_conditions: data.notesConditions || 'Wholesale pricing valid for 15 days.',
    status: 'Sent',
    created_by: 'JDM Admin Officer',
    created_at: new Date().toISOString(),
    items: (data.items || []).map((it: any, i: number) => ({
      id: i + 1,
      quotation_id: newQuoteId,
      product_id: it.productId,
      product_name: it.productName,
      pack_size: it.packSize,
      requested_quantity: it.requestedQuantity,
      approved_unit_price: it.approvedUnitPrice,
      total_price: it.approvedUnitPrice * it.requestedQuantity,
    }))
  };

  if (!enq.quotations) enq.quotations = [];
  enq.quotations.push(quote);
  enq.status = 'Quotation Sent';
  setStored(STORAGE_KEYS.BULK_ENQUIRIES, enquiries);
  return quote;
}

export function updateLocalQuotationStatus(quotationId: number, status: string, notes?: string): void {
  const enquiries = getStored<BulkEnquiry[]>(STORAGE_KEYS.BULK_ENQUIRIES, INITIAL_BULK_ENQUIRIES);
  for (const enq of enquiries) {
    if (enq.quotations) {
      const q = enq.quotations.find(item => item.id === Number(quotationId));
      if (q) {
        q.status = status;
        if (status === 'Accepted') enq.status = 'Accepted';
        setStored(STORAGE_KEYS.BULK_ENQUIRIES, enquiries);
        return;
      }
    }
  }
}

export function convertLocalQuotationToOrder(quotationId: number, orderData: any): WholesaleOrder {
  const enquiries = getStored<BulkEnquiry[]>(STORAGE_KEYS.BULK_ENQUIRIES, INITIAL_BULK_ENQUIRIES);
  let foundQuote: Quotation | null = null;
  let parentEnquiry: BulkEnquiry | null = null;

  for (const enq of enquiries) {
    if (enq.quotations) {
      const q = enq.quotations.find(item => item.id === Number(quotationId));
      if (q) {
        foundQuote = q;
        parentEnquiry = enq;
        break;
      }
    }
  }

  if (!foundQuote || !parentEnquiry) throw new Error('Quotation not found');

  foundQuote.status = 'Converted';
  parentEnquiry.status = 'Converted to Order';
  setStored(STORAGE_KEYS.BULK_ENQUIRIES, enquiries);

  const wholesaleOrders = getStored<WholesaleOrder[]>(STORAGE_KEYS.WHOLESALE_ORDERS, INITIAL_WHOLESALE_ORDERS);
  const newOrderId = Math.floor(500 + Math.random() * 500);
  const newOrder: WholesaleOrder = {
    id: newOrderId,
    order_number: `JC-WHOLESALE-${newOrderId}`,
    quotation_id: foundQuote.id,
    enquiry_id: parentEnquiry.id,
    business_name: parentEnquiry.business_name,
    contact_person: parentEnquiry.customer_name,
    phone_number: parentEnquiry.phone_number,
    email: parentEnquiry.email,
    delivery_address: parentEnquiry.delivery_location || 'Dealer Warehouse Hub',
    city: parentEnquiry.city,
    state: parentEnquiry.state,
    agreed_total: foundQuote.grand_total,
    advance_paid: Number(orderData?.advancePaid || 0),
    payment_status: orderData?.advancePaid > 0 ? 'Advance Paid' : 'Pending',
    fulfillment_status: 'Processing',
    order_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    expected_delivery_date: '2026-11-05',
    notes: 'Order confirmed from accepted quotation.',
    items: foundQuote.items?.map((it, idx) => ({
      id: idx + 1,
      wholesale_order_id: newOrderId,
      product_id: it.product_id,
      product_name: it.product_name,
      pack_size: it.pack_size,
      quantity: it.requested_quantity,
      unit_price: it.approved_unit_price,
      total_price: it.total_price,
    }))
  };

  wholesaleOrders.unshift(newOrder);
  setStored(STORAGE_KEYS.WHOLESALE_ORDERS, wholesaleOrders);
  return newOrder;
}

export function deleteLocalWholesaleOrder(id: number): void {
  const orders = getStored<WholesaleOrder[]>(STORAGE_KEYS.WHOLESALE_ORDERS, INITIAL_WHOLESALE_ORDERS);
  const updated = orders.filter(o => o.id !== Number(id));
  setStored(STORAGE_KEYS.WHOLESALE_ORDERS, updated);
}

export function deleteLocalBulkEnquiry(id: number): void {
  const enquiries = getStored<BulkEnquiry[]>(STORAGE_KEYS.BULK_ENQUIRIES, INITIAL_BULK_ENQUIRIES);
  const updated = enquiries.filter(e => e.id !== Number(id));
  setStored(STORAGE_KEYS.BULK_ENQUIRIES, updated);
}

// ----------------------------------------------------
// WHOLESALE ORDERS STORE
// ----------------------------------------------------
export function getLocalWholesaleOrders(status?: string, search?: string): WholesaleOrder[] {
  let list = getStored<WholesaleOrder[]>(STORAGE_KEYS.WHOLESALE_ORDERS, INITIAL_WHOLESALE_ORDERS);
  if (status && status !== 'All') {
    list = list.filter(o => o.fulfillment_status.toLowerCase() === status.toLowerCase() || o.payment_status.toLowerCase() === status.toLowerCase());
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(o =>
      o.order_number.toLowerCase().includes(s) ||
      o.business_name.toLowerCase().includes(s) ||
      o.contact_person.toLowerCase().includes(s) ||
      o.phone_number.includes(s) ||
      o.city.toLowerCase().includes(s)
    );
  }
  return list;
}

export function updateLocalWholesaleOrderStatus(id: number, data: any): WholesaleOrder {
  const orders = getStored<WholesaleOrder[]>(STORAGE_KEYS.WHOLESALE_ORDERS, INITIAL_WHOLESALE_ORDERS);
  const idx = orders.findIndex(o => o.id === Number(id));
  if (idx === -1) throw new Error('Wholesale order not found');

  if (data.fulfillmentStatus) orders[idx].fulfillment_status = data.fulfillmentStatus;
  if (data.paymentStatus) orders[idx].payment_status = data.paymentStatus;
  if (data.advancePaid !== undefined) orders[idx].advance_paid = Number(data.advancePaid);
  if (data.notes !== undefined) orders[idx].notes = data.notes;

  setStored(STORAGE_KEYS.WHOLESALE_ORDERS, orders);
  return orders[idx];
}

// ----------------------------------------------------
// DEALERS STORE
// ----------------------------------------------------
export const DEALER_PASSWORDS_KEY = 'jucicool_dealer_passwords_v1';

export function getDealerPasswordMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem(DEALER_PASSWORDS_KEY);
    const map = raw ? JSON.parse(raw) : {};
    if (!map['dealer@jucicool.com']) {
      map['dealer@jucicool.com'] = 'dealer123';
    }
    return map;
  } catch {
    return { 'dealer@jucicool.com': 'dealer123' };
  }
}

export function recordDealerPassword(email: string, pass: string): void {
  if (!email || !pass) return;
  try {
    const map = getDealerPasswordMap();
    map[email.toLowerCase().trim()] = String(pass).trim();
    localStorage.setItem(DEALER_PASSWORDS_KEY, JSON.stringify(map));
  } catch (e) {
    console.warn('Could not record dealer password', e);
  }
}

export function getStoredDealerPassword(email?: string): string {
  if (!email) return 'dealer123';
  const map = getDealerPasswordMap();
  return map[email.toLowerCase().trim()] || (email.toLowerCase().trim() === 'dealer@jucicool.com' ? 'dealer123' : 'dealer123');
}

export function getLocalDealers(): DealerRecord[] {
  const dealers = getStored<DealerRecord[]>(STORAGE_KEYS.DEALERS, INITIAL_DEALERS);
  const passwordMap = getDealerPasswordMap();
  return dealers.map((d) => {
    const emailLower = (d.email || '').toLowerCase().trim();
    const resolvedPass = d.password || passwordMap[emailLower] || (emailLower === 'dealer@jucicool.com' ? 'dealer123' : 'dealer123');
    return {
      ...d,
      password: resolvedPass,
      full_name: d.full_name || d.fullName || 'Authorized Dealer',
      fullName: d.fullName || d.full_name || 'Authorized Dealer',
      business_name: d.business_name || d.businessName || 'Wholesale Partner',
      businessName: d.businessName || d.business_name || 'Wholesale Partner',
      customer_type: d.customer_type || d.customerType || 'Dealer',
      customerType: d.customerType || d.customer_type || 'Dealer',
      created_at: d.created_at || d.createdAt || new Date().toISOString(),
      createdAt: d.createdAt || d.created_at || new Date().toISOString(),
    };
  });
}

export function createLocalDealer(data: any): DealerRecord {
  const dealers = getLocalDealers();
  const rawPass = data.password ? String(data.password).trim() : 'dealer123';
  if (data.email) {
    recordDealerPassword(data.email, rawPass);
  }

  const newDealer: DealerRecord = {
    id: Math.floor(100 + Math.random() * 900),
    email: data.email,
    password: rawPass,
    fullName: data.fullName || data.businessName || 'Authorized Dealer',
    full_name: data.fullName || data.businessName || 'Authorized Dealer',
    businessName: data.businessName || 'Juci Cool Retail Partner',
    business_name: data.businessName || 'Juci Cool Retail Partner',
    customerType: 'Retailer',
    customer_type: 'Retailer',
    phone: data.phone || '+91 98490 00000',
    city: data.city || 'Hyderabad',
    state: data.state || 'Telangana',
    createdAt: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  dealers.unshift(newDealer);
  setStored(STORAGE_KEYS.DEALERS, dealers);
  return newDealer;
}

export function deleteLocalDealer(id: number): void {
  const dealers = getLocalDealers().filter(d => d.id !== Number(id));
  setStored(STORAGE_KEYS.DEALERS, dealers);
}

export function updateLocalDealer(
  id: number,
  data: {
    businessName?: string;
    fullName?: string;
    phone?: string;
    city?: string;
    state?: string;
    password?: string;
  }
): DealerRecord | null {
  const dealers = getLocalDealers();
  const idx = dealers.findIndex(d => d.id === Number(id));
  if (idx === -1) return null;

  if (data.businessName !== undefined) {
    dealers[idx].businessName = data.businessName;
    dealers[idx].business_name = data.businessName;
  }
  if (data.fullName !== undefined) {
    dealers[idx].fullName = data.fullName;
    dealers[idx].full_name = data.fullName;
  }
  if (data.phone !== undefined) {
    dealers[idx].phone = data.phone;
  }
  if (data.city !== undefined) {
    dealers[idx].city = data.city;
  }
  if (data.state !== undefined) {
    dealers[idx].state = data.state;
  }
  if (data.password) {
    dealers[idx].password = data.password;
    if (dealers[idx].email) {
      recordDealerPassword(dealers[idx].email, data.password);
    }
  }

  setStored(STORAGE_KEYS.DEALERS, dealers);
  return dealers[idx];
}

// ----------------------------------------------------
// CUSTOMER DIRECTORY & DASHBOARD AGGREGATION
// ----------------------------------------------------
export function getLocalCustomers(): CustomerRecord[] {
  const retail = getStored<RetailOrder[]>(STORAGE_KEYS.RETAIL_ORDERS, INITIAL_RETAIL_ORDERS);
  const enquiries = getStored<BulkEnquiry[]>(STORAGE_KEYS.BULK_ENQUIRIES, INITIAL_BULK_ENQUIRIES);
  const wholesale = getStored<WholesaleOrder[]>(STORAGE_KEYS.WHOLESALE_ORDERS, INITIAL_WHOLESALE_ORDERS);

  const customerMap = new Map<string, CustomerRecord>();

  // Add from retail
  for (const r of retail) {
    const key = r.customer_phone || r.customer_email || r.customer_name;
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        id: r.id,
        name: r.customer_name,
        phone: r.customer_phone,
        email: r.customer_email,
        business_name: undefined,
        customer_type: 'Individual',
        city: r.city,
        state: r.state,
        retail_orders: 1,
        retail_spend: r.total_amount,
        bulk_enquiries: 0,
        wholesale_orders: 0,
        wholesale_spend: 0,
        first_contact: r.created_at,
        last_contact: r.created_at,
      });
    } else {
      const c = customerMap.get(key)!;
      c.retail_orders += 1;
      c.retail_spend += r.total_amount;
    }
  }

  // Add from bulk enquiries & wholesale
  for (const e of enquiries) {
    const key = e.phone_number || e.email || e.business_name;
    const matchedWs = wholesale.filter(w => w.enquiry_id === e.id);
    const wsSpend = matchedWs.reduce((sum, w) => sum + w.agreed_total, 0);

    if (!customerMap.has(key)) {
      customerMap.set(key, {
        id: e.id,
        name: e.customer_name,
        phone: e.phone_number,
        email: e.email,
        business_name: e.business_name,
        customer_type: e.customer_type,
        city: e.city,
        state: e.state,
        retail_orders: 0,
        retail_spend: 0,
        bulk_enquiries: 1,
        wholesale_orders: matchedWs.length,
        wholesale_spend: wsSpend,
        first_contact: e.created_at,
        last_contact: e.created_at,
      });
    } else {
      const c = customerMap.get(key)!;
      c.bulk_enquiries += 1;
      c.business_name = e.business_name || c.business_name;
      c.customer_type = e.customer_type || c.customer_type;
      c.wholesale_orders += matchedWs.length;
      c.wholesale_spend += wsSpend;
    }
  }

  return Array.from(customerMap.values());
}

export function getLocalDashboardData(dateRange: string = 'all'): AdminDashboardData {
  const retail = getStored<RetailOrder[]>(STORAGE_KEYS.RETAIL_ORDERS, INITIAL_RETAIL_ORDERS);
  const enquiries = getStored<BulkEnquiry[]>(STORAGE_KEYS.BULK_ENQUIRIES, INITIAL_BULK_ENQUIRIES);
  const wholesale = getStored<WholesaleOrder[]>(STORAGE_KEYS.WHOLESALE_ORDERS, INITIAL_WHOLESALE_ORDERS);
  const products = getLocalProducts();

  const totalRetailRevenue = retail.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const newRetailOrders = retail.filter(o => o.order_status === 'New').length;

  const totalWholesaleRevenue = wholesale.reduce((sum, w) => sum + (w.agreed_total || 0), 0);
  const advanceCollected = wholesale.reduce((sum, w) => sum + (w.advance_paid || 0), 0);

  const newBulkEnquiries = enquiries.filter(e => e.status === 'New').length;
  const awaitingQuotation = enquiries.filter(e => e.status === 'Quotation Prepared' || e.status === 'Quotation Sent').length;
  const acceptedQuotations = enquiries.filter(e => e.status === 'Accepted' || e.status === 'Converted to Order').length;

  const lowStockCount = products.filter(p => p.stock_quantity < 50).length;

  return {
    metrics: {
      totalRetailOrders: retail.length,
      newRetailOrders,
      retailRevenue: totalRetailRevenue,
      totalBulkEnquiries: enquiries.length,
      newBulkEnquiries,
      quotationsAwaitingResponse: awaitingQuotation,
      acceptedQuotations,
      wholesaleOrdersCount: wholesale.length,
      wholesaleRevenue: totalWholesaleRevenue,
      wholesaleAdvanceCollected: advanceCollected,
      totalProducts: products.length,
      lowStockProducts: lowStockCount,
    },
    recentRetail: retail.slice(0, 5),
    recentEnquiries: enquiries.slice(0, 5),
    salesTrends: [
      { order_date: 'Mon', order_count: 3, daily_revenue: 420 },
      { order_date: 'Tue', order_count: 5, daily_revenue: 680 },
      { order_date: 'Wed', order_count: 4, daily_revenue: 550 },
      { order_date: 'Thu', order_count: 6, daily_revenue: 890 },
      { order_date: 'Fri', order_count: 7, daily_revenue: 1040 },
      { order_date: 'Sat', order_count: 9, daily_revenue: 1420 },
      { order_date: 'Sun', order_count: 8, daily_revenue: 1250 },
    ],
    enquiryStatusBreakdown: [
      { status: 'New', count: newBulkEnquiries || 1 },
      { status: 'Quotation Prepared', count: 1 },
      { status: 'Quotation Sent', count: awaitingQuotation || 1 },
      { status: 'Converted to Order', count: acceptedQuotations || 1 },
    ]
  };
}

export function getLocalReports(): any {
  const dashboard = getLocalDashboardData();
  const products = getLocalProducts();
  const customers = getLocalCustomers();

  return {
    enquiryConversion: {
      total_enquiries: dashboard.metrics.totalBulkEnquiries,
      converted_count: dashboard.metrics.acceptedQuotations,
      conversion_rate: dashboard.metrics.totalBulkEnquiries > 0
        ? Math.round((dashboard.metrics.acceptedQuotations / dashboard.metrics.totalBulkEnquiries) * 100)
        : 65,
    },
    topProducts: products.slice(0, 5).map((p, idx) => ({
      id: p.id,
      name: p.name,
      flavor: p.flavor,
      total_sold: 250 - idx * 30,
      total_revenue: (250 - idx * 30) * p.retail_price,
    })),
    channelPerformance: [
      { channel: 'Retail Storefront', order_count: dashboard.metrics.totalRetailOrders, total_revenue: dashboard.metrics.retailRevenue },
      { channel: 'Wholesale B2B Quotations', order_count: dashboard.metrics.wholesaleOrdersCount, total_revenue: dashboard.metrics.wholesaleRevenue },
      { channel: 'Dealer Portal Reorders', order_count: 3, total_revenue: 28400 }
    ],
    customerMetrics: {
      total_customers: customers.length,
      retail_shoppers: customers.filter(c => c.customer_type === 'Individual').length,
      dealers_retailers: customers.filter(c => c.customer_type !== 'Individual').length,
    }
  };
}
