import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data folder exists
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'jucicool.db');
export const db = new Database(dbPath);

// Enable WAL mode and foreign keys for performance and consistency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    -- Categories
    CREATE TABLE IF NOT EXISTS product_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      image_url TEXT,
      display_order INTEGER DEFAULT 0
    );

    -- Products
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      flavor TEXT NOT NULL,
      category_id INTEGER NOT NULL,
      pack_size TEXT NOT NULL,
      packaging_type TEXT NOT NULL,
      description TEXT,
      retail_price REAL NOT NULL,
      wholesale_price REAL DEFAULT 0,
      stock_quantity INTEGER NOT NULL DEFAULT 100,
      min_wholesale_qty INTEGER NOT NULL DEFAULT 50,
      image_url TEXT NOT NULL,
      shot_image_url TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      featured INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES product_categories (id)
    );

    -- Users (Admin & Registered Customers)
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'customer', -- 'admin', 'sales_rep', 'customer'
      business_name TEXT,
      customer_type TEXT DEFAULT 'Individual', -- 'Retailer', 'Dealer', 'Distributor', 'Individual'
      city TEXT,
      state TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Retail Orders
    CREATE TABLE IF NOT EXISTS retail_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT NOT NULL UNIQUE,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      delivery_address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pincode TEXT NOT NULL,
      subtotal REAL NOT NULL,
      delivery_fee REAL NOT NULL DEFAULT 0,
      total_amount REAL NOT NULL,
      payment_method TEXT NOT NULL DEFAULT 'COD', -- 'COD', 'UPI', 'CARD'
      payment_status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Paid', 'Failed'
      order_status TEXT NOT NULL DEFAULT 'New', -- 'New', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Retail Order Items
    CREATE TABLE IF NOT EXISTS retail_order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      pack_size TEXT NOT NULL,
      unit_price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      total_price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES retail_orders (id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products (id)
    );

    -- Bulk Enquiries ("Get Best Price")
    CREATE TABLE IF NOT EXISTS bulk_enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enquiry_number TEXT NOT NULL UNIQUE,
      customer_name TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      email TEXT,
      business_name TEXT NOT NULL,
      customer_type TEXT NOT NULL, -- 'Retailer', 'Dealer', 'Distributor', 'Supermarket', 'Other'
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      preferred_contact_method TEXT NOT NULL DEFAULT 'Phone', -- 'Phone', 'WhatsApp', 'Email'
      gstin TEXT,
      delivery_location TEXT,
      additional_notes TEXT,
      status TEXT NOT NULL DEFAULT 'New', -- 'New', 'Contacted', 'Quotation Prepared', 'Quotation Sent', 'Negotiation', 'Accepted', 'Converted to Order', 'Declined', 'Closed'
      assigned_to TEXT,
      internal_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Bulk Enquiry Items
    CREATE TABLE IF NOT EXISTS bulk_enquiry_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enquiry_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      pack_size TEXT NOT NULL,
      requested_quantity INTEGER NOT NULL,
      unit_label TEXT DEFAULT 'Units', -- 'Units', 'Cartons'
      FOREIGN KEY (enquiry_id) REFERENCES bulk_enquiries (id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products (id)
    );

    -- Wholesale Quotations (Private to Admin/Authorized)
    CREATE TABLE IF NOT EXISTS quotations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quotation_number TEXT NOT NULL UNIQUE,
      enquiry_id INTEGER NOT NULL,
      customer_name TEXT NOT NULL,
      business_name TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      email TEXT,
      subtotal REAL NOT NULL,
      discount_percent REAL DEFAULT 0,
      discount_amount REAL DEFAULT 0,
      tax_percent REAL DEFAULT 12, -- 12% GST standard on beverages
      tax_amount REAL DEFAULT 0,
      delivery_charges REAL DEFAULT 0,
      grand_total REAL NOT NULL,
      validity_date TEXT NOT NULL,
      payment_terms TEXT NOT NULL,
      notes_conditions TEXT,
      status TEXT NOT NULL DEFAULT 'Draft', -- 'Draft', 'Sent', 'Accepted', 'Declined', 'Converted'
      created_by TEXT NOT NULL DEFAULT 'Admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (enquiry_id) REFERENCES bulk_enquiries (id)
    );

    -- Quotation Items
    CREATE TABLE IF NOT EXISTS quotation_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quotation_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      pack_size TEXT NOT NULL,
      requested_quantity INTEGER NOT NULL,
      approved_unit_price REAL NOT NULL, -- Private wholesale price set by admin
      total_price REAL NOT NULL,
      FOREIGN KEY (quotation_id) REFERENCES quotations (id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products (id)
    );

    -- Wholesale Orders (Converted from accepted quotations)
    CREATE TABLE IF NOT EXISTS wholesale_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT NOT NULL UNIQUE,
      quotation_id INTEGER NOT NULL,
      enquiry_id INTEGER NOT NULL,
      business_name TEXT NOT NULL,
      contact_person TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      email TEXT,
      delivery_address TEXT,
      city TEXT,
      state TEXT,
      agreed_total REAL NOT NULL,
      advance_paid REAL DEFAULT 0,
      payment_status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Partial Advance', 'Paid', 'Credit'
      fulfillment_status TEXT NOT NULL DEFAULT 'Order Placed', -- 'Order Placed', 'Processing', 'Packed', 'Dispatched', 'Delivered', 'Cancelled'
      order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      expected_delivery_date TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quotation_id) REFERENCES quotations (id),
      FOREIGN KEY (enquiry_id) REFERENCES bulk_enquiries (id)
    );

    -- Wholesale Order Items
    CREATE TABLE IF NOT EXISTS wholesale_order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wholesale_order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      pack_size TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      total_price REAL NOT NULL,
      FOREIGN KEY (wholesale_order_id) REFERENCES wholesale_orders (id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products (id)
    );

    -- Status Change History for Enquiries & Orders
    CREATE TABLE IF NOT EXISTS status_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT NOT NULL, -- 'retail_order', 'bulk_enquiry', 'wholesale_order'
      entity_id INTEGER NOT NULL,
      previous_status TEXT,
      new_status TEXT NOT NULL,
      changed_by TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Audit Logs
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      performed_by TEXT NOT NULL,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Product Extra Images (multiple pictures per product)
    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      display_order INTEGER DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
    );
  `);

  // Migration: Ensure wholesale_price column exists
  try {
    const tableInfo = db.prepare("PRAGMA table_info(products)").all() as { name: string }[];
    const hasWholesalePrice = tableInfo.some(col => col.name === 'wholesale_price');
    if (!hasWholesalePrice) {
      db.exec('ALTER TABLE products ADD COLUMN wholesale_price REAL DEFAULT 0');
      console.log('Added wholesale_price column to products table.');
    }
  } catch (migErr) {
    console.error('Migration notice for wholesale_price:', migErr);
  }

  console.log('Database schema verified.');
}
