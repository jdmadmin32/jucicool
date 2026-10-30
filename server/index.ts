import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { db, initDatabase } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'juci-cool-super-secret-jwt-key-2026';

app.use(cors());
app.use(express.json());

// Serve public static images if needed
app.use('/images', express.static(path.resolve(process.cwd(), 'public/images')));

// Initialize DB schema
initDatabase();

// ==========================================
// SERVER ROOT & HEALTH DASHBOARD (Fixes "Cannot GET /")
// ==========================================
app.get('/', (req: Request, res: Response) => {
  const acceptsHtml = req.accepts('html');
  if (acceptsHtml) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Juci Cool API Server • JDM Fruit Products Pvt. Ltd.</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
        <style>
          :root {
            --primary: #138443;
            --primary-dark: #183D2B;
            --accent: #FFC928;
            --lime: #8CC63E;
            --bg: #F8FAF6;
            --card: #FFFFFF;
            --text: #183D2B;
            --muted: #68756B;
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            background: linear-gradient(135deg, #183D2B 0%, #0d6131 50%, #138443 100%);
            color: var(--text);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
          }
          .card {
            background: var(--card);
            max-width: 680px;
            width: 100%;
            border-radius: 28px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          .header {
            background: linear-gradient(135deg, #FFFEF7 0%, #F4F8F0 100%);
            padding: 32px 32px 24px;
            border-bottom: 1px solid #E6EBDD;
            display: flex;
            align-items: center;
            gap: 20px;
          }
          .logo {
            height: 64px;
            width: auto;
            object-fit: contain;
            background: white;
            padding: 8px;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.06);
            border: 1px solid #E6EBDD;
          }
          .header-text h1 {
            font-family: 'Poppins', sans-serif;
            font-size: 22px;
            font-weight: 800;
            color: var(--primary-dark);
          }
          .header-text p {
            font-size: 13px;
            color: var(--muted);
            margin-top: 2px;
          }
          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-top: 8px;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            background: #E8F5E9;
            color: #138443;
            border: 1px solid #C8E6C9;
          }
          .pulse {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #138443;
            box-shadow: 0 0 0 0 rgba(19, 132, 67, 0.7);
            animation: pulse 1.6s infinite;
          }
          @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(19, 132, 67, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(19, 132, 67, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(19, 132, 67, 0); }
          }
          .body { padding: 32px; }
          .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin: 20px 0;
          }
          .grid-item {
            background: #F9FAF6;
            border: 1px solid #E6EBDD;
            padding: 14px 16px;
            border-radius: 16px;
          }
          .grid-item span {
            display: block;
            font-size: 11px;
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 700;
          }
          .grid-item strong {
            display: block;
            font-size: 14px;
            color: var(--primary-dark);
            margin-top: 4px;
          }
          .actions {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 24px;
          }
          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 20px;
            border-radius: 14px;
            font-size: 13px;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.2s ease;
          }
          .btn-primary {
            background: var(--primary);
            color: white;
            box-shadow: 0 4px 14px rgba(19, 132, 67, 0.35);
          }
          .btn-primary:hover { background: #0e6f37; transform: translateY(-1px); }
          .btn-secondary {
            background: white;
            color: var(--primary-dark);
            border: 1px solid #E6EBDD;
          }
          .btn-secondary:hover { background: #F4F8F0; border-color: var(--primary); }
          .footer {
            padding: 16px 32px;
            background: #F9FAF6;
            border-top: 1px solid #E6EBDD;
            font-size: 12px;
            color: var(--muted);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <img src="/images/juci-cool-logo.png" alt="Juci Cool" class="logo" onerror="this.style.display='none'">
            <div class="header-text">
              <h1>Juci Cool API Server</h1>
              <p>JDM Fruit Products Pvt. Ltd. • Medchal, Hyderabad</p>
              <div class="status-badge">
                <span class="pulse"></span> Server Status: Active & Operational
              </div>
            </div>
          </div>
          <div class="body">
            <p style="font-size: 14px; color: var(--muted); line-height: 1.6;">
              Welcome to the official backend service for <strong>Juci Cool</strong>. The API server powers product catalogs, real-time orders, dealer wholesale portals, quotations, and administrative inventory management.
            </p>
            <div class="grid">
              <div class="grid-item">
                <span>Port & Host</span>
                <strong>http://localhost:5000</strong>
              </div>
              <div class="grid-item">
                <span>Database Engine</span>
                <strong>SQLite (Active WAL Mode)</strong>
              </div>
              <div class="grid-item">
                <span>Manufacturer</span>
                <strong>JDM Fruit Products Pvt. Ltd.</strong>
              </div>
              <div class="grid-item">
                <span>Facility Location</span>
                <strong>Ravakole, Medchal, Telangana</strong>
              </div>
            </div>
            <div class="actions">
              <a href="http://localhost:5173" class="btn btn-primary" target="_blank">🌐 Open Website Storefront (Port 5173)</a>
              <a href="/api/products" class="btn btn-secondary">📦 View Products API</a>
              <a href="/api/categories" class="btn btn-secondary">📂 Categories API</a>
            </div>
          </div>
          <div class="footer">
            <span>Built on Manufacturing Experience. Driven by Quality.</span>
            <span>Est. 2012</span>
          </div>
        </div>
      </body>
      </html>
    `);
    return;
  }

  res.json({
    status: 'online',
    service: 'Juci Cool API Server',
    company: 'JDM Fruit Products Pvt. Ltd.',
    established: 2012,
    location: 'Sri Siddi Vinayaka Eco Industrial Park, Ravakole, Medchal, Telangana',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      retailOrders: '/api/retail-orders',
      bulkEnquiries: '/api/bulk-enquiries',
      adminStatus: '/api/admin/database/status'
    },
    storefrontUrl: 'http://localhost:5173'
  });
});

app.get('/api', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'Juci Cool API',
    version: '1.0.0',
    company: 'JDM Fruit Products Pvt. Ltd.'
  });
});

// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================
interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
    fullName: string;
  };
}

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decodedUser as any;
    next();
  });
}

function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'sales_rep')) {
    return res.status(403).json({ error: 'Admin authorization required' });
  }
  next();
}

// Log admin action helper
function logAction(action: string, performedBy: string, details: string) {
  try {
    db.prepare('INSERT INTO audit_logs (action, performed_by, details) VALUES (?, ?, ?)')
      .run(action, performedBy, details);
  } catch (e) {
    console.error('Failed to write audit log:', e);
  }
}

// ==========================================
// PUBLIC AUTH ENDPOINTS
// ==========================================

app.post('/api/auth/login', (req: Request, res: Response) => {
  const identifier = (req.body.email || req.body.identifier || req.body.id || req.body.username || '').toString().toLowerCase().trim();
  const { password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Username/Email and password are required' });
  }

  // Look up user by identifier or synthesized email
  let user = db.prepare('SELECT * FROM users WHERE lower(email) = ?').get(identifier) as any;
  if (!user && !identifier.includes('@')) {
    user = db.prepare('SELECT * FROM users WHERE lower(email) = ?').get(`${identifier}@jucicool.com`) as any;
  }
  if (!user) {
    return res.status(401).json({ error: 'Invalid username/email or password' });
  }

  const validPassword = bcrypt.compareSync(password, user.password_hash);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid username/email or password' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, fullName: user.full_name, customerType: user.customer_type },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      phone: user.phone,
      businessName: user.business_name,
      customerType: user.customer_type
    }
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const {
    email,
    password,
    fullName,
    phone,
    customerType = 'Individual', // 'Retailer' | 'Individual'
    businessName,
    city,
    state
  } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Email, password, and full name are required' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const existing = db.prepare('SELECT id FROM users WHERE lower(email) = ?').get(cleanEmail);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  // Standardize type
  const isDealer = customerType === 'dealer_retailer' || customerType === 'Dealer' || customerType === 'Retailer';
  const normalizedType = isDealer ? 'Retailer' : 'Individual';

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const insertUser = db.prepare(`
    INSERT INTO users (email, password_hash, full_name, phone, role, business_name, customer_type, city, state)
    VALUES (?, ?, ?, ?, 'customer', ?, ?, ?, ?)
  `);

  const result = insertUser.run(
    cleanEmail,
    passwordHash,
    fullName.trim(),
    phone ? phone.trim() : null,
    businessName ? businessName.trim() : null,
    normalizedType,
    city ? city.trim() : null,
    state ? state.trim() : null
  );

  const newUserId = result.lastInsertRowid;
  const token = jwt.sign(
    { id: newUserId, email: cleanEmail, role: 'customer', fullName: fullName.trim(), customerType: normalizedType },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    token,
    user: {
      id: newUserId,
      email: cleanEmail,
      fullName: fullName.trim(),
      role: 'customer',
      phone: phone || null,
      businessName: businessName || null,
      customerType: normalizedType
    }
  });
});

app.get('/api/auth/me', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = db.prepare('SELECT id, email, full_name, role, phone, business_name, customer_type FROM users WHERE id = ?')
    .get(req.user!.id) as any;
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

// ==========================================
// PUBLIC PRODUCTS & CATEGORIES
// ==========================================

app.get('/api/categories', (req: Request, res: Response) => {
  const categories = db.prepare('SELECT * FROM product_categories ORDER BY display_order ASC').all();
  res.json(categories);
});

function checkCanViewWholesale(req: Request): boolean {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as any;
      if (
        decoded.role === 'admin' ||
        decoded.role === 'sales_rep' ||
        decoded.customerType === 'Retailer' ||
        decoded.customerType === 'Dealer' ||
        decoded.customerType === 'dealer_retailer'
      ) {
        return true;
      }
    } catch {}
  }
  return false;
}

app.get('/api/products', (req: Request, res: Response) => {
  const { category, search, featured } = req.query;
  const canViewWholesale = checkCanViewWholesale(req);

  let query = `
    SELECT p.id, p.name, p.flavor, p.category_id, p.pack_size, p.packaging_type,
           p.description, p.retail_price, p.wholesale_price, p.stock_quantity, p.min_wholesale_qty,
           p.image_url, p.shot_image_url, p.is_active, p.featured,
           c.name as category_name, c.slug as category_slug
    FROM products p
    JOIN product_categories c ON p.category_id = c.id
    WHERE p.is_active = 1
  `;
  const params: any[] = [];

  if (category && category !== 'all') {
    query += ` AND (c.slug = ? OR c.name = ?)`;
    params.push(category, category);
  }

  if (search) {
    query += ` AND (p.name LIKE ? OR p.flavor LIKE ? OR p.description LIKE ?)`;
    const s = `%${search}%`;
    params.push(s, s, s);
  }

  if (featured === '1' || featured === 'true') {
    query += ` AND p.featured = 1`;
  }

  query += ` ORDER BY p.featured DESC, p.id ASC`;

  const products = db.prepare(query).all(...params) as any[];

  // Attach extra images and sanitize wholesale price for non-dealers
  try {
    const getImages = db.prepare('SELECT image_url FROM product_images WHERE product_id = ? ORDER BY display_order ASC, id ASC');
    for (const prod of products) {
      const imgs = getImages.all(prod.id) as { image_url: string }[];
      prod.extra_images = imgs.map(i => i.image_url);

      if (!canViewWholesale) {
        delete prod.wholesale_price;
      }
    }
  } catch (err) {
    console.warn('Could not query product_images:', err);
  }

  res.json(products);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const canViewWholesale = checkCanViewWholesale(req);
  const product = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    JOIN product_categories c ON p.category_id = c.id
    WHERE p.id = ? AND p.is_active = 1
  `).get(req.params.id) as any;

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  try {
    const imgs = db.prepare('SELECT image_url FROM product_images WHERE product_id = ? ORDER BY display_order ASC, id ASC').all(product.id) as { image_url: string }[];
    product.extra_images = imgs.map(i => i.image_url);
  } catch {
    product.extra_images = [];
  }

  if (!canViewWholesale) {
    delete product.wholesale_price;
  }

  res.json(product);
});

// ==========================================
// PUBLIC RETAIL ORDERS
// ==========================================

app.post('/api/retail-orders', (req: Request, res: Response) => {
  const {
    customerName,
    customerPhone,
    customerEmail,
    deliveryAddress,
    city,
    state,
    pincode,
    items,
    paymentMethod,
    notes
  } = req.body;

  if (!customerName || !customerPhone || !deliveryAddress || !city || !items || !items.length) {
    return res.status(400).json({ error: 'Please provide all required checkout details and products' });
  }

  // Check if dealer/retailer pricing applies (via auth token or user email)
  let isDealer = false;
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as any;
      if (decoded.customerType === 'Retailer' || decoded.customerType === 'Dealer' || decoded.customerType === 'dealer_retailer') {
        isDealer = true;
      }
    } catch {}
  }
  if (!isDealer && customerEmail) {
    const userMatch = db.prepare('SELECT customer_type FROM users WHERE lower(email) = ?').get(customerEmail.toLowerCase().trim()) as any;
    if (userMatch && (userMatch.customer_type === 'Retailer' || userMatch.customer_type === 'Dealer' || userMatch.customer_type === 'dealer_retailer')) {
      isDealer = true;
    }
  }

  // Validate items & calculate subtotal from approved DB prices (security check)
  let subtotal = 0;
  const verifiedItems: any[] = [];

  const getProduct = db.prepare('SELECT id, name, pack_size, retail_price, wholesale_price, stock_quantity, min_wholesale_qty FROM products WHERE id = ? AND is_active = 1');

  for (const item of items) {
    if (!item.productId || !item.quantity || item.quantity <= 0) {
      return res.status(400).json({ error: 'Invalid product or quantity specified' });
    }
    const prod = getProduct.get(item.productId) as any;
    if (!prod) {
      return res.status(400).json({ error: `Product ID ${item.productId} is not available` });
    }
    // MOQ enforcement for dealer/retailer
    if (isDealer && prod.min_wholesale_qty && item.quantity < prod.min_wholesale_qty) {
      return res.status(400).json({
        error: `Minimum Order Quantity (MOQ) for ${prod.name} is ${prod.min_wholesale_qty} units for dealers/retailers.`
      });
    }
    if (prod.stock_quantity < item.quantity) {
      return res.status(400).json({ error: `Insufficient stock for ${prod.name}. Available: ${prod.stock_quantity}` });
    }

    // Dealer gets admin-configured wholesale price; General customer gets retail price
    const unitPrice = isDealer && prod.wholesale_price && prod.wholesale_price > 0
      ? prod.wholesale_price
      : prod.retail_price;
    const itemTotal = Math.round(unitPrice * item.quantity * 100) / 100;
    subtotal += itemTotal;
    verifiedItems.push({
      productId: prod.id,
      name: prod.name,
      packSize: prod.pack_size,
      unitPrice,
      quantity: item.quantity,
      totalPrice: itemTotal
    });
  }

  // Delivery fee rule: Free delivery above ₹100, else ₹20
  const deliveryFee = subtotal >= 100 ? 0 : 20;
  const totalAmount = subtotal + deliveryFee;

  // Generate unique readable order enquiry number
  const orderNumber = `JC-ORD-${Date.now().toString().slice(-6)}`;

  const paymentMethodLabel = paymentMethod || 'Direct Enquiry / In-Person Confirmation';
  const paymentStatus = 'Pending';

  const insertOrderTx = db.transaction(() => {
    const orderResult = db.prepare(`
      INSERT INTO retail_orders (
        order_number, customer_name, customer_phone, customer_email,
        delivery_address, city, state, pincode, subtotal, delivery_fee,
        total_amount, payment_method, payment_status, order_status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New', ?)
    `).run(
      orderNumber,
      customerName.trim(),
      customerPhone.trim(),
      customerEmail ? customerEmail.trim() : null,
      deliveryAddress.trim(),
      city.trim(),
      state ? state.trim() : 'Telangana',
      pincode ? pincode.trim() : '500001',
      subtotal,
      deliveryFee,
      totalAmount,
      paymentMethodLabel,
      paymentStatus,
      notes || 'Submitted online order enquiry'
    );

    const orderId = orderResult.lastInsertRowid;

    const insertItem = db.prepare(`
      INSERT INTO retail_order_items (order_id, product_id, product_name, pack_size, unit_price, quantity, total_price)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const updateStock = db.prepare(`
      UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?
    `);

    for (const item of verifiedItems) {
      insertItem.run(orderId, item.productId, item.name, item.packSize, item.unitPrice, item.quantity, item.totalPrice);
      updateStock.run(item.quantity, item.productId);
    }

    // Status history
    db.prepare(`
      INSERT INTO status_history (entity_type, entity_id, previous_status, new_status, changed_by, notes)
      VALUES ('retail_order', ?, null, 'New', 'Customer', 'Order enquiry submitted online')
    `).run(orderId);

    return { orderId, orderNumber };
  });

  try {
    const result = insertOrderTx();
    res.status(201).json({
      message: 'Your order enquiry has been received successfully. Our team will get in touch with you shortly.',
      orderNumber: result.orderNumber,
      orderId: result.orderId,
      subtotal,
      deliveryFee,
      totalAmount,
      paymentStatus,
      orderStatus: 'New'
    });
  } catch (err: any) {
    console.error('Order enquiry placement error:', err);
    res.status(500).json({ error: 'Failed to place order enquiry: ' + err.message });
  }
});

// Track retail order
app.get('/api/retail-orders/track/:query', (req: Request, res: Response) => {
  const query = String(req.params.query || '').trim();
  const order = db.prepare(`
    SELECT * FROM retail_orders
    WHERE order_number = ? OR customer_phone = ?
    ORDER BY id DESC LIMIT 1
  `).get(query, query) as any;

  if (!order) {
    return res.status(404).json({ error: 'Order not found with the provided details' });
  }

  const items = db.prepare('SELECT * FROM retail_order_items WHERE order_id = ?').all(order.id);
  const history = db.prepare("SELECT * FROM status_history WHERE entity_type = 'retail_order' AND entity_id = ? ORDER BY id ASC").all(order.id);

  res.json({
    order,
    items,
    history
  });
});

// Track bulk enquiry by reference, phone number, or email
app.get('/api/bulk-enquiries/track/:query', (req: Request, res: Response) => {
  const query = String(req.params.query || '').trim();
  const enquiry = db.prepare(`
    SELECT * FROM bulk_enquiries
    WHERE enquiry_number = ? OR phone_number = ? OR lower(email) = lower(?)
    ORDER BY id DESC LIMIT 1
  `).get(query, query, query) as any;

  if (!enquiry) {
    return res.status(404).json({ error: 'Bulk enquiry not found with the provided reference or phone number' });
  }

  const items = db.prepare('SELECT * FROM bulk_enquiry_items WHERE enquiry_id = ?').all(enquiry.id);
  const quotations = db.prepare('SELECT * FROM quotations WHERE enquiry_id = ? ORDER BY id DESC').all(enquiry.id) as any[];
  const history = db.prepare("SELECT * FROM status_history WHERE entity_type = 'bulk_enquiry' AND entity_id = ? ORDER BY id ASC").all(enquiry.id);

  res.json({
    enquiry: {
      id: enquiry.id,
      enquiryNumber: enquiry.enquiry_number,
      customerName: enquiry.customer_name,
      businessName: enquiry.business_name,
      phoneNumber: enquiry.phone_number,
      email: enquiry.email,
      city: enquiry.city,
      state: enquiry.state,
      status: enquiry.status,
      createdAt: enquiry.created_at,
      ...enquiry
    },
    items,
    quotations,
    quotation: quotations[0] || null,
    quotationAvailable: quotations.length > 0,
    history
  });
});

// Dealer bulk enquiries for dealer portal
app.get('/api/dealer/bulk-enquiries', (req: Request, res: Response) => {
  const email = (req.query.email || '').toString().toLowerCase().trim();
  const phone = (req.query.phone || '').toString().trim();
  const businessName = (req.query.businessName || '').toString().toLowerCase().trim();

  let query = 'SELECT * FROM bulk_enquiries WHERE 1=1';
  const params: any[] = [];

  if (email || phone || businessName) {
    const conditions: string[] = [];
    if (email) {
      conditions.push('lower(email) = ?');
      params.push(email);
    }
    if (phone) {
      conditions.push('phone_number = ?');
      params.push(phone);
    }
    if (businessName) {
      conditions.push('lower(business_name) = ?');
      params.push(businessName);
    }
    query += ` AND (${conditions.join(' OR ')})`;
  } else {
    query += " AND customer_type = 'Dealer'";
  }

  query += ' ORDER BY id DESC';
  const enquiries = db.prepare(query).all(...params) as any[];

  const getItems = db.prepare('SELECT * FROM bulk_enquiry_items WHERE enquiry_id = ?');
  const getQuotes = db.prepare('SELECT * FROM quotations WHERE enquiry_id = ? ORDER BY id DESC');

  const enriched = enquiries.map(e => ({
    ...e,
    items: getItems.all(e.id),
    quotations: getQuotes.all(e.id)
  }));

  res.json(enriched);
});


// ==========================================
// PUBLIC BULK ENQUIRIES ("GET BEST PRICE")
// ==========================================

app.post('/api/bulk-enquiries', (req: Request, res: Response) => {
  const {
    customerName,
    phoneNumber,
    email,
    businessName,
    customerType,
    city,
    state,
    preferredContactMethod,
    gstin,
    deliveryLocation,
    additionalNotes,
    items
  } = req.body;

  const finalBusinessName = (businessName || customerName || 'Wholesale Buyer').toString().trim();
  const finalCity = (city || 'Hyderabad').toString().trim();

  // Validate required fields
  if (
    !customerName ||
    !phoneNumber ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({
      error: 'Please provide all required business and product information'
    });
  }

  // Validate phone number
  const cleanPhone = String(phoneNumber).replace(/[^0-9+]/g, '');

  if (cleanPhone.replace(/\D/g, '').length < 10) {
    return res.status(400).json({
      error: 'Please enter a valid 10-digit phone number'
    });
  }

  // Validate product quantities
  for (const item of items) {
    if (
      !Number.isInteger(Number(item.quantity)) ||
      Number(item.quantity) <= 0
    ) {
      return res.status(400).json({
        error: 'Each requested product must have a quantity greater than zero'
      });
    }
  }

  // Generate enquiry reference number
  const enquiryNumber = `JC-BLK-${Date.now().toString().slice(-6)}`;

  // Save enquiry, products and status history in one transaction
  const insertEnquiryTx = db.transaction(() => {
    const enqResult = db.prepare(`
      INSERT INTO bulk_enquiries (
        enquiry_number,
        customer_name,
        phone_number,
        email,
        business_name,
        customer_type,
        city,
        state,
        preferred_contact_method,
        gstin,
        delivery_location,
        additional_notes,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New')
    `).run(
      enquiryNumber,
      String(customerName).trim(),
      cleanPhone,
      email ? String(email).trim() : null,
      finalBusinessName,
      customerType || 'Retailer',
      finalCity,
      state ? String(state).trim() : 'Telangana',
      preferredContactMethod || 'Phone',
      gstin ? String(gstin).trim().toUpperCase() : null,
      deliveryLocation ? String(deliveryLocation).trim() : null,
      additionalNotes ? String(additionalNotes).trim() : null
    );

    const enquiryId = enqResult.lastInsertRowid;

    const insertItem = db.prepare(`
      INSERT INTO bulk_enquiry_items (
        enquiry_id,
        product_id,
        product_name,
        pack_size,
        requested_quantity,
        unit_label
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const getProduct = db.prepare(`
      SELECT id, name, pack_size
      FROM products
      WHERE id = ?
    `);

    const firstProduct = db.prepare('SELECT id FROM products LIMIT 1').get() as { id: number } | undefined;
    const defaultProductId = firstProduct?.id || 1;

    for (const item of items) {
      let product: { id: number; name: string; pack_size: string } | undefined;
      if (item.productId) {
        product = getProduct.get(item.productId) as any;
      }

      const prodName = product?.name || item.productName || item.product_name || 'Juci Cool Beverage';
      const pSize = product?.pack_size || item.packSize || item.pack_size || 'Standard';
      const pId = product ? product.id : defaultProductId;

      insertItem.run(
        enquiryId,
        pId,
        prodName,
        pSize,
        Number(item.quantity),
        item.unitLabel || 'Units'
      );
    }

    // Record initial status history
    db.prepare(`
      INSERT INTO status_history (
        entity_type,
        entity_id,
        previous_status,
        new_status,
        changed_by,
        notes
      )
      VALUES (
        'bulk_enquiry',
        ?,
        NULL,
        'New',
        'Customer',
        'Bulk price enquiry submitted online'
      )
    `).run(enquiryId);

    return {
      enquiryId,
      enquiryNumber
    };
  });

  try {
    const result = insertEnquiryTx();

    return res.status(201).json({
      message:
        'Your bulk price request has been submitted successfully. Our team will review your requirements and contact you with a quotation.',
      enquiryNumber: result.enquiryNumber,
      enquiryId: result.enquiryId,
      status: 'New'
    });
  } catch (err: any) {
    console.error('Bulk enquiry error:', err);

    return res.status(500).json({
      error: 'Failed to submit bulk enquiry: ' + err.message
    });
  }
});


// ==========================================
// ADMIN PROTECTED ROUTES
// ==========================================

// 1. Dashboard Overview Metrics
app.get('/api/admin/dashboard', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const { dateRange } = req.query; // 'today', '7days', '30days', 'all'

  let dateFilter = '';
  if (dateRange === 'today') {
    dateFilter = "date(created_at) = date('now')";
  } else if (dateRange === '7days') {
    dateFilter = "created_at >= datetime('now', '-7 days')";
  } else if (dateRange === '30days') {
    dateFilter = "created_at >= datetime('now', '-30 days')";
  }

  const whereRetail = dateFilter ? `WHERE ${dateFilter}` : '';
  const whereEnquiry = dateFilter ? `WHERE ${dateFilter}` : '';
  const whereWholesale = dateFilter ? `WHERE ${dateFilter}` : '';

  // Retail metrics
  const retailStats = db.prepare(`
    SELECT
      COUNT(*) as total_orders,
      SUM(CASE WHEN order_status = 'New' THEN 1 ELSE 0 END) as new_orders,
      COALESCE(SUM(total_amount), 0) as total_revenue
    FROM retail_orders ${whereRetail}
  `).get() as any;

  // Bulk Enquiry metrics
  const enquiryStats = db.prepare(`
    SELECT
      COUNT(*) as total_enquiries,
      SUM(CASE WHEN status = 'New' THEN 1 ELSE 0 END) as new_enquiries,
      SUM(CASE WHEN status = 'Quotation Prepared' OR status = 'Quotation Sent' THEN 1 ELSE 0 END) as awaiting_response,
      SUM(CASE WHEN status = 'Accepted' OR status = 'Converted to Order' THEN 1 ELSE 0 END) as accepted_quotations
    FROM bulk_enquiries ${whereEnquiry}
  `).get() as any;

  // Wholesale Orders metrics
  const wholesaleStats = db.prepare(`
    SELECT
      COUNT(*) as total_wholesale_orders,
      COALESCE(SUM(agreed_total), 0) as wholesale_revenue,
      COALESCE(SUM(advance_paid), 0) as wholesale_advance_collected
    FROM wholesale_orders ${whereWholesale}
  `).get() as any;

  // Product Inventory metrics
  const productStats = db.prepare(`
    SELECT
      COUNT(*) as total_products,
      SUM(CASE WHEN stock_quantity < 50 THEN 1 ELSE 0 END) as low_stock_products
    FROM products WHERE is_active = 1
  `).get() as any;

  // Recent retail orders
  const recentRetail = db.prepare(`
    SELECT id, order_number, customer_name, customer_phone, total_amount, order_status, payment_status, created_at
    FROM retail_orders ORDER BY id DESC LIMIT 5
  `).all();

  // Recent bulk enquiries
  const recentEnquiries = db.prepare(`
    SELECT id, enquiry_number, customer_name, business_name, phone_number, city, status, created_at
    FROM bulk_enquiries ORDER BY id DESC LIMIT 5
  `).all();

  // Sales Trends (Daily aggregation for last 7 or 30 days)
  const salesTrends = db.prepare(`
    SELECT date(created_at) as order_date, COUNT(*) as order_count, SUM(total_amount) as daily_revenue
    FROM retail_orders
    WHERE created_at >= datetime('now', '-30 days')
    GROUP BY date(created_at)
    ORDER BY order_date ASC
  `).all();

  // Bulk Enquiry breakdown by status
  const enquiryStatusBreakdown = db.prepare(`
    SELECT status, COUNT(*) as count
    FROM bulk_enquiries
    GROUP BY status
  `).all();

  res.json({
    metrics: {
      totalRetailOrders: retailStats.total_orders,
      newRetailOrders: retailStats.new_orders,
      retailRevenue: retailStats.total_revenue,
      totalBulkEnquiries: enquiryStats.total_enquiries,
      newBulkEnquiries: enquiryStats.new_enquiries,
      quotationsAwaitingResponse: enquiryStats.awaiting_response,
      acceptedQuotations: enquiryStats.accepted_quotations,
      wholesaleOrdersCount: wholesaleStats.total_wholesale_orders,
      wholesaleRevenue: wholesaleStats.wholesale_revenue,
      totalProducts: productStats.total_products,
      lowStockProducts: productStats.low_stock_products
    },
    recentRetail,
    recentEnquiries,
    salesTrends,
    enquiryStatusBreakdown
  });
});

// 2. Retail Orders Management
app.get('/api/admin/retail-orders', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const { status, search } = req.query;
  let query = 'SELECT * FROM retail_orders WHERE 1=1';
  const params: any[] = [];

  if (status && status !== 'All') {
    query += ' AND order_status = ?';
    params.push(status);
  }

  if (search) {
    query += ' AND (order_number LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ? OR city LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s, s);
  }

  query += ' ORDER BY id DESC';

  const orders = db.prepare(query).all(...params) as any[];

  // Attach items count to each order for summary view
  const getItemCount = db.prepare('SELECT COUNT(*) as count, SUM(quantity) as total_qty FROM retail_order_items WHERE order_id = ?');
  const enrichedOrders = orders.map(o => {
    const stats = getItemCount.get(o.id) as any;
    return {
      ...o,
      itemCount: stats.count,
      totalItemsQuantity: stats.total_qty
    };
  });

  res.json(enrichedOrders);
});

app.get('/api/admin/retail-orders/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const order = db.prepare('SELECT * FROM retail_orders WHERE id = ?').get(req.params.id) as any;
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const items = db.prepare('SELECT * FROM retail_order_items WHERE order_id = ?').all(order.id);
  const history = db.prepare("SELECT * FROM status_history WHERE entity_type = 'retail_order' AND entity_id = ? ORDER BY id ASC").all(order.id);

  res.json({ order, items, history });
});

app.patch('/api/admin/retail-orders/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const { orderStatus, paymentStatus, notes } = req.body;
  const orderId = req.params.id;

  const currentOrder = db.prepare('SELECT * FROM retail_orders WHERE id = ?').get(orderId) as any;
  if (!currentOrder) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const updates: string[] = [];
  const params: any[] = [];

  if (orderStatus && orderStatus !== currentOrder.order_status) {
    updates.push('order_status = ?');
    params.push(orderStatus);

    // Record status history
    db.prepare(`
      INSERT INTO status_history (entity_type, entity_id, previous_status, new_status, changed_by, notes)
      VALUES ('retail_order', ?, ?, ?, ?, ?)
    `).run(orderId, currentOrder.order_status, orderStatus, req.user!.fullName, notes || 'Status updated by admin');
  }

  if (paymentStatus) {
    updates.push('payment_status = ?');
    params.push(paymentStatus);
  }

  if (notes !== undefined) {
    updates.push('notes = ?');
    params.push(notes);
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');

  if (updates.length > 0) {
    params.push(orderId);
    db.prepare(`UPDATE retail_orders SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  }

  logAction('UPDATE_RETAIL_ORDER', req.user!.fullName, `Updated retail order #${currentOrder.order_number} status to ${orderStatus || currentOrder.order_status}`);

  res.json({ message: 'Order updated successfully' });
});

// 3. Bulk Enquiries Management
app.get('/api/admin/bulk-enquiries', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const { status, search } = req.query;
  let query = 'SELECT * FROM bulk_enquiries WHERE 1=1';
  const params: any[] = [];

  if (status && status !== 'All') {
    query += ' AND status = ?';
    params.push(status);
  }

  if (search) {
    query += ' AND (enquiry_number LIKE ? OR customer_name LIKE ? OR business_name LIKE ? OR phone_number LIKE ? OR city LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s, s, s);
  }

  query += ' ORDER BY id DESC';

  const enquiries = db.prepare(query).all(...params) as any[];

  // Attach items count and latest quotation summary
  const getItems = db.prepare('SELECT * FROM bulk_enquiry_items WHERE enquiry_id = ?');
  const getQuote = db.prepare('SELECT id, quotation_number, grand_total, status FROM quotations WHERE enquiry_id = ? ORDER BY id DESC LIMIT 1');

  const enriched = enquiries.map(e => ({
    ...e,
    items: getItems.all(e.id),
    latestQuotation: getQuote.get(e.id)
  }));

  res.json(enriched);
});

app.get('/api/admin/bulk-enquiries/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const enquiry = db.prepare('SELECT * FROM bulk_enquiries WHERE id = ?').get(req.params.id) as any;
  if (!enquiry) {
    return res.status(404).json({ error: 'Bulk enquiry not found' });
  }

  const items = db.prepare('SELECT * FROM bulk_enquiry_items WHERE enquiry_id = ?').all(enquiry.id);
  const quotations = db.prepare('SELECT * FROM quotations WHERE enquiry_id = ? ORDER BY id DESC').all(enquiry.id) as any[];

  // Attach items to quotations
  const getQuoteItems = db.prepare('SELECT * FROM quotation_items WHERE quotation_id = ?');
  const quotesWithItems = quotations.map(q => ({
    ...q,
    items: getQuoteItems.all(q.id)
  }));

  const history = db.prepare("SELECT * FROM status_history WHERE entity_type = 'bulk_enquiry' AND entity_id = ? ORDER BY id ASC").all(enquiry.id);

  res.json({
    enquiry,
    items,
    quotations: quotesWithItems,
    history
  });
});

app.patch('/api/admin/bulk-enquiries/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const { status, assignedTo, internalNotes } = req.body;
  const enquiryId = req.params.id;

  const currentEnquiry = db.prepare('SELECT * FROM bulk_enquiries WHERE id = ?').get(enquiryId) as any;
  if (!currentEnquiry) {
    return res.status(404).json({ error: 'Enquiry not found' });
  }

  const updates: string[] = [];
  const params: any[] = [];

  if (status && status !== currentEnquiry.status) {
    updates.push('status = ?');
    params.push(status);

    db.prepare(`
      INSERT INTO status_history (entity_type, entity_id, previous_status, new_status, changed_by, notes)
      VALUES ('bulk_enquiry', ?, ?, ?, ?, ?)
    `).run(enquiryId, currentEnquiry.status, status, req.user!.fullName, internalNotes || 'Status updated by admin');
  }

  if (assignedTo !== undefined) {
    updates.push('assigned_to = ?');
    params.push(assignedTo);
  }

  if (internalNotes !== undefined) {
    updates.push('internal_notes = ?');
    params.push(internalNotes);
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');

  if (updates.length > 0) {
    params.push(enquiryId);
    db.prepare(`UPDATE bulk_enquiries SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  }

  logAction('UPDATE_BULK_ENQUIRY', req.user!.fullName, `Updated enquiry #${currentEnquiry.enquiry_number} to status ${status || currentEnquiry.status}`);

  res.json({ message: 'Enquiry updated successfully' });
});

// 4. Quotations Management (Build & Manage Private Quotations)
app.post('/api/admin/bulk-enquiries/:id/quotations', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const enquiryId = req.params.id;
  const {
    items,
    discountPercent = 0,
    taxPercent = 12,
    deliveryCharges = 0,
    validityDate,
    paymentTerms,
    notesConditions
  } = req.body;

  const enquiry = db.prepare('SELECT * FROM bulk_enquiries WHERE id = ?').get(enquiryId) as any;
  if (!enquiry) {
    return res.status(404).json({ error: 'Enquiry not found' });
  }

  if (!items || !items.length) {
    return res.status(400).json({ error: 'Quotation must include at least one product with approved wholesale price' });
  }

  // Calculate Subtotal & Totals
  let subtotal = 0;
  for (const it of items) {
    const qty = Number(it.requestedQuantity) || 0;
    const price = Number(it.approvedUnitPrice) || 0;
    subtotal += qty * price;
  }

  const discountAmount = (subtotal * (Number(discountPercent) || 0)) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * (Number(taxPercent) || 0)) / 100;
  const grandTotal = taxableAmount + taxAmount + (Number(deliveryCharges) || 0);

  const quotationNumber = `JC-QT-${Date.now().toString().slice(-5)}`;

  const createQuoteTx = db.transaction(() => {
    const quoteResult = db.prepare(`
      INSERT INTO quotations (
        quotation_number, enquiry_id, customer_name, business_name,
        phone_number, email, subtotal, discount_percent, discount_amount,
        tax_percent, tax_amount, delivery_charges, grand_total, validity_date,
        payment_terms, notes_conditions, status, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Sent', ?)
    `).run(
      quotationNumber,
      enquiryId,
      enquiry.customer_name,
      enquiry.business_name,
      enquiry.phone_number,
      enquiry.email,
      subtotal,
      discountPercent,
      discountAmount,
      taxPercent,
      taxAmount,
      deliveryCharges,
      grandTotal,
      validityDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      paymentTerms || '50% Advance via Bank Transfer / RTGS, Balance on Delivery',
      notesConditions || 'Wholesale rates subject to approved carton minimums. Valid for 15 days.',
      req.user!.fullName
    );

    const quoteId = quoteResult.lastInsertRowid;

    const insertItem = db.prepare(`
      INSERT INTO quotation_items (quotation_id, product_id, product_name, pack_size, requested_quantity, approved_unit_price, total_price)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const it of items) {
      const lineTotal = Number(it.requestedQuantity) * Number(it.approvedUnitPrice);
      insertItem.run(quoteId, it.productId, it.productName, it.packSize, it.requestedQuantity, it.approvedUnitPrice, lineTotal);
    }

    // Automatically update Enquiry status to 'Quotation Sent'
    db.prepare("UPDATE bulk_enquiries SET status = 'Quotation Sent', updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .run(enquiryId);

    // Record status history
    db.prepare(`
      INSERT INTO status_history (entity_type, entity_id, previous_status, new_status, changed_by, notes)
      VALUES ('bulk_enquiry', ?, ?, 'Quotation Sent', ?, ?)
    `).run(enquiryId, enquiry.status, req.user!.fullName, `Created & sent formal quotation #${quotationNumber} total ₹${grandTotal.toFixed(2)}`);

    return { quoteId, quotationNumber, grandTotal };
  });

  try {
    const result = createQuoteTx();
    logAction('CREATE_QUOTATION', req.user!.fullName, `Created wholesale quotation #${result.quotationNumber} for ${enquiry.business_name}`);
    res.status(201).json({
      message: 'Quotation created successfully',
      quotationId: result.quoteId,
      quotationNumber: result.quotationNumber,
      grandTotal: result.grandTotal
    });
  } catch (err: any) {
    console.error('Failed to create quotation:', err);
    res.status(500).json({ error: 'Failed to create quotation: ' + err.message });
  }
});

// Update Quotation Status (Accept / Decline / Send)
app.patch('/api/admin/quotations/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const { status, notes } = req.body;
  const quoteId = req.params.id;

  const quote = db.prepare('SELECT * FROM quotations WHERE id = ?').get(quoteId) as any;
  if (!quote) {
    return res.status(404).json({ error: 'Quotation not found' });
  }

  db.prepare('UPDATE quotations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, quoteId);

  // If quotation accepted, update enquiry status to 'Accepted'
  if (status === 'Accepted') {
    db.prepare("UPDATE bulk_enquiries SET status = 'Accepted', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(quote.enquiry_id);
    db.prepare(`
      INSERT INTO status_history (entity_type, entity_id, previous_status, new_status, changed_by, notes)
      VALUES ('bulk_enquiry', ?, 'Quotation Sent', 'Accepted', ?, ?)
    `).run(quote.enquiry_id, req.user!.fullName, notes || 'Quotation accepted by customer');
  } else if (status === 'Declined') {
    db.prepare("UPDATE bulk_enquiries SET status = 'Declined', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(quote.enquiry_id);
    db.prepare(`
      INSERT INTO status_history (entity_type, entity_id, previous_status, new_status, changed_by, notes)
      VALUES ('bulk_enquiry', ?, 'Quotation Sent', 'Declined', ?, ?)
    `).run(quote.enquiry_id, req.user!.fullName, notes || 'Quotation declined');
  }

  logAction('UPDATE_QUOTATION', req.user!.fullName, `Updated quotation #${quote.quotation_number} status to ${status}`);
  res.json({ message: 'Quotation status updated successfully' });
});

// Convert Accepted Quotation to Wholesale Order
app.post('/api/admin/quotations/:id/convert-to-order', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const quoteId = req.params.id;
  const { advancePaid = 0, paymentStatus = 'Partial Advance', expectedDeliveryDate, deliveryAddress, notes } = req.body;

  const quote = db.prepare('SELECT * FROM quotations WHERE id = ?').get(quoteId) as any;
  if (!quote) {
    return res.status(404).json({ error: 'Quotation not found' });
  }

  const enquiry = db.prepare('SELECT * FROM bulk_enquiries WHERE id = ?').get(quote.enquiry_id) as any;
  const quoteItems = db.prepare('SELECT * FROM quotation_items WHERE quotation_id = ?').all(quoteId) as any[];

  const orderNumber = `JC-WHOLESALE-${Date.now().toString().slice(-5)}`;

  const convertTx = db.transaction(() => {
    // 1. Create wholesale order
    const orderResult = db.prepare(`
      INSERT INTO wholesale_orders (
        order_number, quotation_id, enquiry_id, business_name, contact_person,
        phone_number, email, delivery_address, city, state, agreed_total,
        advance_paid, payment_status, fulfillment_status, expected_delivery_date, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Processing', ?, ?)
    `).run(
      orderNumber,
      quote.id,
      quote.enquiry_id,
      quote.business_name,
      quote.customer_name,
      quote.phone_number,
      quote.email,
      deliveryAddress || enquiry.delivery_location || `${enquiry.city}, ${enquiry.state}`,
      enquiry.city,
      enquiry.state,
      quote.grand_total,
      advancePaid,
      paymentStatus,
      expectedDeliveryDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      notes || 'Converted from accepted wholesale quotation'
    );

    const wholesaleOrderId = orderResult.lastInsertRowid;

    // 2. Insert items and deduct warehouse inventory
    const insertWholesaleItem = db.prepare(`
      INSERT INTO wholesale_order_items (wholesale_order_id, product_id, product_name, pack_size, quantity, unit_price, total_price)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const deductStock = db.prepare(`
      UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?
    `);

    for (const it of quoteItems) {
      insertWholesaleItem.run(wholesaleOrderId, it.product_id, it.product_name, it.pack_size, it.requested_quantity, it.approved_unit_price, it.total_price);
      deductStock.run(it.requested_quantity, it.product_id);
    }

    // 3. Mark quotation as converted
    db.prepare("UPDATE quotations SET status = 'Converted', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(quoteId);

    // 4. Mark enquiry as 'Converted to Order'
    db.prepare("UPDATE bulk_enquiries SET status = 'Converted to Order', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(quote.enquiry_id);

    // 5. History
    db.prepare(`
      INSERT INTO status_history (entity_type, entity_id, previous_status, new_status, changed_by, notes)
      VALUES ('bulk_enquiry', ?, 'Accepted', 'Converted to Order', ?, ?)
    `).run(quote.enquiry_id, req.user!.fullName, `Converted into confirmed wholesale order #${orderNumber}`);

    db.prepare(`
      INSERT INTO status_history (entity_type, entity_id, previous_status, new_status, changed_by, notes)
      VALUES ('wholesale_order', ?, null, 'Processing', ?, 'Order confirmed from quotation')
    `).run(wholesaleOrderId, req.user!.fullName);

    return { wholesaleOrderId, orderNumber };
  });

  try {
    const result = convertTx();
    logAction('CONVERT_TO_WHOLESALE_ORDER', req.user!.fullName, `Converted quotation #${quote.quotation_number} into wholesale order #${result.orderNumber}`);
    res.status(201).json({
      message: 'Successfully converted quotation to confirmed wholesale order!',
      wholesaleOrderId: result.wholesaleOrderId,
      orderNumber: result.orderNumber
    });
  } catch (err: any) {
    console.error('Conversion error:', err);
    res.status(500).json({ error: 'Failed to convert quotation to order: ' + err.message });
  }
});

// 5. Wholesale Orders Management
app.get('/api/admin/wholesale-orders', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const { status, search } = req.query;
  let query = 'SELECT * FROM wholesale_orders WHERE 1=1';
  const params: any[] = [];

  if (status && status !== 'All') {
    query += ' AND fulfillment_status = ?';
    params.push(status);
  }

  if (search) {
    query += ' AND (order_number LIKE ? OR business_name LIKE ? OR contact_person LIKE ? OR phone_number LIKE ? OR city LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s, s, s);
  }

  query += ' ORDER BY id DESC';

  const orders = db.prepare(query).all(...params) as any[];

  const getItems = db.prepare('SELECT * FROM wholesale_order_items WHERE wholesale_order_id = ?');
  const enriched = orders.map(o => ({
    ...o,
    items: getItems.all(o.id)
  }));

  res.json(enriched);
});

app.patch('/api/admin/wholesale-orders/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const { fulfillmentStatus, paymentStatus, advancePaid, notes } = req.body;
  const orderId = req.params.id;

  const current = db.prepare('SELECT * FROM wholesale_orders WHERE id = ?').get(orderId) as any;
  if (!current) {
    return res.status(404).json({ error: 'Wholesale order not found' });
  }

  const updates: string[] = [];
  const params: any[] = [];

  if (fulfillmentStatus && fulfillmentStatus !== current.fulfillment_status) {
    updates.push('fulfillment_status = ?');
    params.push(fulfillmentStatus);

    db.prepare(`
      INSERT INTO status_history (entity_type, entity_id, previous_status, new_status, changed_by, notes)
      VALUES ('wholesale_order', ?, ?, ?, ?, ?)
    `).run(orderId, current.fulfillment_status, fulfillmentStatus, req.user!.fullName, notes || 'Fulfillment status updated');
  }

  if (paymentStatus) {
    updates.push('payment_status = ?');
    params.push(paymentStatus);
  }

  if (advancePaid !== undefined) {
    updates.push('advance_paid = ?');
    params.push(advancePaid);
  }

  if (notes !== undefined) {
    updates.push('notes = ?');
    params.push(notes);
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');

  if (updates.length > 0) {
    params.push(orderId);
    db.prepare(`UPDATE wholesale_orders SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  }

  logAction('UPDATE_WHOLESALE_ORDER', req.user!.fullName, `Updated wholesale order #${current.order_number}`);
  res.json({ message: 'Wholesale order updated successfully' });
});

// 6. Product and Inventory Management
app.get('/api/admin/products', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const products = db.prepare(`
    SELECT p.*, c.name as category_name
    FROM products p
    JOIN product_categories c ON p.category_id = c.id
    ORDER BY p.id ASC
  `).all() as any[];

  try {
    const getImages = db.prepare('SELECT id, image_url, display_order FROM product_images WHERE product_id = ? ORDER BY display_order ASC, id ASC');
    for (const prod of products) {
      const imgs = getImages.all(prod.id) as any[];
      prod.extra_images = imgs.map(i => i.image_url);
      prod.image_records = imgs;
    }
  } catch (err) {
    console.warn('Failed to load product extra images:', err);
  }

  res.json(products);
});

app.post('/api/admin/products', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const {
    name,
    flavor,
    categoryId,
    packSize,
    packagingType,
    description,
    retailPrice,
    wholesalePrice = 0,
    stockQuantity = 100,
    minWholesaleQty = 50,
    imageUrl,
    shotImageUrl,
    isActive = 1,
    featured = 0,
    extraImages = []
  } = req.body;

  if (!name || !flavor || !categoryId || !packSize || retailPrice === undefined) {
    return res.status(400).json({ error: 'Name, flavor, category, pack size, and retail price are required' });
  }

  const result = db.prepare(`
    INSERT INTO products (
      name, flavor, category_id, pack_size, packaging_type, description,
      retail_price, wholesale_price, stock_quantity, min_wholesale_qty, image_url, shot_image_url,
      is_active, featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    name.trim(),
    flavor.trim(),
    categoryId,
    packSize.trim(),
    packagingType || 'PET Bottle',
    description || null,
    Number(retailPrice),
    Number(wholesalePrice || 0),
    Number(stockQuantity),
    Number(minWholesaleQty),
    imageUrl || '/images/products/mango-bottle.png',
    shotImageUrl || null,
    isActive ? 1 : 0,
    featured ? 1 : 0
  );

  const newProdId = result.lastInsertRowid;

  // Insert extra images if provided
  if (Array.isArray(extraImages) && extraImages.length > 0) {
    const insertImg = db.prepare('INSERT INTO product_images (product_id, image_url, display_order) VALUES (?, ?, ?)');
    extraImages.forEach((img: string, idx: number) => {
      if (img && typeof img === 'string' && img.trim()) {
        insertImg.run(newProdId, img.trim(), idx);
      }
    });
  }

  logAction('CREATE_PRODUCT', req.user!.fullName, `Created product: ${name}`);
  res.status(201).json({ message: 'Product created successfully', productId: newProdId });
});

app.patch('/api/admin/products/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const prodId = req.params.id;
  const current = db.prepare('SELECT * FROM products WHERE id = ?').get(prodId) as any;
  if (!current) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const {
    name,
    flavor,
    categoryId,
    packSize,
    packagingType,
    description,
    retailPrice,
    wholesalePrice,
    stockQuantity,
    minWholesaleQty,
    imageUrl,
    shotImageUrl,
    isActive,
    featured,
    extraImages
  } = req.body;

  const updates: string[] = [];
  const params: any[] = [];

  if (name !== undefined) { updates.push('name = ?'); params.push(name); }
  if (flavor !== undefined) { updates.push('flavor = ?'); params.push(flavor); }
  if (categoryId !== undefined) { updates.push('category_id = ?'); params.push(categoryId); }
  if (packSize !== undefined) { updates.push('pack_size = ?'); params.push(packSize); }
  if (packagingType !== undefined) { updates.push('packaging_type = ?'); params.push(packagingType); }
  if (description !== undefined) { updates.push('description = ?'); params.push(description); }
  if (retailPrice !== undefined) { updates.push('retail_price = ?'); params.push(Number(retailPrice)); }
  if (wholesalePrice !== undefined || req.body.wholesale_price !== undefined) {
    updates.push('wholesale_price = ?');
    params.push(Number(wholesalePrice ?? req.body.wholesale_price));
  }
  if (stockQuantity !== undefined) { updates.push('stock_quantity = ?'); params.push(Number(stockQuantity)); }
  if (minWholesaleQty !== undefined) { updates.push('min_wholesale_qty = ?'); params.push(Number(minWholesaleQty)); }
  if (imageUrl !== undefined) { updates.push('image_url = ?'); params.push(imageUrl); }
  if (shotImageUrl !== undefined) { updates.push('shot_image_url = ?'); params.push(shotImageUrl); }
  if (isActive !== undefined) { updates.push('is_active = ?'); params.push(isActive ? 1 : 0); }
  if (featured !== undefined) { updates.push('featured = ?'); params.push(featured ? 1 : 0); }

  if (updates.length > 0) {
    params.push(prodId);
    db.prepare(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  }

  // Update extra images if explicitly provided as array
  if (Array.isArray(extraImages)) {
    db.prepare('DELETE FROM product_images WHERE product_id = ?').run(prodId);
    const insertImg = db.prepare('INSERT INTO product_images (product_id, image_url, display_order) VALUES (?, ?, ?)');
    extraImages.forEach((img: string, idx: number) => {
      if (img && typeof img === 'string' && img.trim()) {
        insertImg.run(prodId, img.trim(), idx);
      }
    });
  }

  logAction('UPDATE_PRODUCT', req.user!.fullName, `Updated product #${prodId}: ${name || current.name}`);
  res.json({ message: 'Product updated successfully' });
});

// Delete Product Endpoint
app.delete('/api/admin/products/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const prodId = req.params.id;
  const current = db.prepare('SELECT * FROM products WHERE id = ?').get(prodId) as any;
  if (!current) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Remove related product images
  db.prepare('DELETE FROM product_images WHERE product_id = ?').run(prodId);
  // Remove product
  db.prepare('DELETE FROM products WHERE id = ?').run(prodId);

  logAction('DELETE_PRODUCT', req.user!.fullName, `Deleted product #${prodId}: ${current.name}`);
  res.json({ message: 'Product deleted successfully', id: Number(prodId) });
});

// Manage Extra Images per product
app.post('/api/admin/products/:id/images', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const prodId = req.params.id;
  const { imageUrl, displayOrder = 0 } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  const result = db.prepare('INSERT INTO product_images (product_id, image_url, display_order) VALUES (?, ?, ?)')
    .run(prodId, imageUrl.trim(), displayOrder);
  res.status(201).json({ id: result.lastInsertRowid, imageUrl, displayOrder });
});

app.delete('/api/admin/products/:id/images/:imageId', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  db.prepare('DELETE FROM product_images WHERE id = ? AND product_id = ?').run(req.params.imageId, req.params.id);
  res.json({ message: 'Product image deleted' });
});

// 6.5 Dealer Accounts Management (Admin Only)
app.get('/api/admin/dealers', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const dealers = db.prepare(`
    SELECT id, email, full_name, phone, role, business_name, customer_type, city, state, created_at,
           COALESCE(raw_password, 'dealer123') as password
    FROM users
    WHERE customer_type IN ('Dealer', 'Retailer', 'dealer_retailer') OR role = 'dealer'
    ORDER BY created_at DESC
  `).all();
  res.json(dealers);
});

app.post('/api/admin/dealers', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const { email, password, businessName, fullName, phone, city, state } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Dealer email and password are required' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const existing = db.prepare('SELECT id FROM users WHERE lower(email) = ?').get(cleanEmail);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);
  const storeName = businessName ? businessName.trim() : (fullName ? `${fullName.trim()} Store` : 'Authorized Dealer');
  const contactName = fullName ? fullName.trim() : storeName;

  const result = db.prepare(`
    INSERT INTO users (email, password_hash, raw_password, full_name, phone, role, business_name, customer_type, city, state)
    VALUES (?, ?, ?, ?, ?, 'customer', ?, 'Dealer', ?, ?)
  `).run(
    cleanEmail,
    passwordHash,
    password,
    contactName,
    phone ? phone.trim() : null,
    storeName,
    city ? city.trim() : 'Hyderabad',
    state ? state.trim() : 'Telangana'
  );

  logAction('CREATE_DEALER', req.user!.fullName, `Created dealer account for ${cleanEmail} (${storeName})`);
  res.status(201).json({
    message: 'Dealer account created successfully',
    dealerId: result.lastInsertRowid,
    dealer: {
      id: result.lastInsertRowid,
      email: cleanEmail,
      password: password,
      fullName: contactName,
      businessName: storeName,
      phone: phone || null,
      city: city || 'Hyderabad',
      state: state || 'Telangana'
    }
  });
});

app.delete('/api/admin/dealers/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const dealerId = req.params.id;
  const dealer = db.prepare('SELECT * FROM users WHERE id = ?').get(dealerId) as any;
  if (!dealer) {
    return res.status(404).json({ error: 'Dealer account not found' });
  }

  if (dealer.role === 'admin') {
    return res.status(400).json({ error: 'Cannot delete an administrator account' });
  }

  db.prepare('DELETE FROM users WHERE id = ?').run(dealerId);
  logAction('DELETE_DEALER', req.user!.fullName, `Deleted dealer account #${dealerId} (${dealer.email})`);
  res.json({ message: 'Dealer account deleted successfully' });
});

// 7. Centralized Customer Directory
app.get('/api/admin/customers', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  // Aggregate unique customers across retail and wholesale
  const customers = db.prepare(`
    WITH retail_summary AS (
      SELECT
        customer_phone,
        MAX(customer_name) as name,
        MAX(customer_email) as email,
        MAX(city) as city,
        MAX(state) as state,
        COUNT(*) as retail_order_count,
        SUM(total_amount) as total_retail_spend,
        MIN(created_at) as first_seen,
        MAX(created_at) as last_seen
      FROM retail_orders
      GROUP BY customer_phone
    ),
    bulk_summary AS (
      SELECT
        phone_number,
        MAX(customer_name) as name,
        MAX(business_name) as business_name,
        MAX(customer_type) as customer_type,
        MAX(email) as email,
        MAX(city) as city,
        MAX(state) as state,
        COUNT(*) as bulk_enquiry_count,
        MIN(created_at) as first_seen,
        MAX(created_at) as last_seen
      FROM bulk_enquiries
      GROUP BY phone_number
    ),
    wholesale_summary AS (
      SELECT
        phone_number,
        COUNT(*) as wholesale_order_count,
        SUM(agreed_total) as total_wholesale_spend
      FROM wholesale_orders
      GROUP BY phone_number
    )
    SELECT
      COALESCE(b.phone_number, r.customer_phone) as phone,
      COALESCE(b.name, r.name) as name,
      COALESCE(b.email, r.email) as email,
      COALESCE(b.city, r.city) as city,
      COALESCE(b.state, r.state) as state,
      b.business_name,
      COALESCE(b.customer_type, 'Individual') as customer_type,
      COALESCE(r.retail_order_count, 0) as retail_orders,
      COALESCE(r.total_retail_spend, 0) as retail_spend,
      COALESCE(b.bulk_enquiry_count, 0) as bulk_enquiries,
      COALESCE(w.wholesale_order_count, 0) as wholesale_orders,
      COALESCE(w.total_wholesale_spend, 0) as wholesale_spend,
      COALESCE(b.first_seen, r.first_seen) as first_contact
    FROM bulk_summary b
    FULL OUTER JOIN retail_summary r ON b.phone_number = r.customer_phone
    LEFT JOIN wholesale_summary w ON COALESCE(b.phone_number, r.customer_phone) = w.phone_number
  `).all();

  res.json(customers);
});

// 8. Reports and Exports
app.get('/api/admin/reports', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  // Best selling products (Retail)
  const topRetailProducts = db.prepare(`
    SELECT product_name, SUM(quantity) as units_sold, SUM(total_price) as revenue
    FROM retail_order_items
    GROUP BY product_id, product_name
    ORDER BY revenue DESC
    LIMIT 5
  `).all();

  // Top Wholesale Products
  const topWholesaleProducts = db.prepare(`
    SELECT product_name, SUM(quantity) as units_ordered, SUM(total_price) as wholesale_revenue
    FROM wholesale_order_items
    GROUP BY product_id, product_name
    ORDER BY wholesale_revenue DESC
    LIMIT 5
  `).all();

  // Conversion rate
  const enquiryConversion = db.prepare(`
    SELECT
      COUNT(*) as total_enquiries,
      SUM(CASE WHEN status = 'Accepted' OR status = 'Converted to Order' THEN 1 ELSE 0 END) as converted_count,
      ROUND(CAST(SUM(CASE WHEN status = 'Accepted' OR status = 'Converted to Order' THEN 1 ELSE 0 END) as REAL) / COUNT(*) * 100, 1) as conversion_rate
    FROM bulk_enquiries
  `).get() as any;

  res.json({
    topRetailProducts,
    topWholesaleProducts,
    enquiryConversion
  });
});

// ==========================================
// 9. DATABASE STORAGE & HEALTH MANAGEMENT
// ==========================================

app.get('/api/admin/database/status', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const dataDir = path.resolve(process.cwd(), 'data');
    const dbFilePath = path.join(dataDir, 'jucicool.db');
    const walFilePath = path.join(dataDir, 'jucicool.db-wal');

    let dbSizeBytes = 0;
    let walSizeBytes = 0;

    if (fs.existsSync(dbFilePath)) {
      dbSizeBytes = fs.statSync(dbFilePath).size;
    }
    if (fs.existsSync(walFilePath)) {
      walSizeBytes = fs.statSync(walFilePath).size;
    }

    const totalBytes = dbSizeBytes + walSizeBytes;

    // Pragma checks
    const pageCount = (db.prepare('PRAGMA page_count').get() as any)?.page_count || 0;
    const pageSize = (db.prepare('PRAGMA page_size').get() as any)?.page_size || 4096;
    const freelistCount = (db.prepare('PRAGMA freelist_count').get() as any)?.freelist_count || 0;

    // Row counts for key tables
    const productCount = (db.prepare('SELECT COUNT(*) as c FROM products').get() as any)?.c || 0;
    const imageCount = (db.prepare('SELECT COUNT(*) as c FROM product_images').get() as any)?.c || 0;
    const retailCount = (db.prepare('SELECT COUNT(*) as c FROM retail_orders').get() as any)?.c || 0;
    const enquiryCount = (db.prepare('SELECT COUNT(*) as c FROM bulk_enquiries').get() as any)?.c || 0;
    const quoteCount = (db.prepare('SELECT COUNT(*) as c FROM quotations').get() as any)?.c || 0;
    const wholesaleCount = (db.prepare('SELECT COUNT(*) as c FROM wholesale_orders').get() as any)?.c || 0;
    const userCount = (db.prepare('SELECT COUNT(*) as c FROM users').get() as any)?.c || 0;
    const auditCount = (db.prepare('SELECT COUNT(*) as c FROM audit_logs').get() as any)?.c || 0;

    // Capacity metrics (50 MB standard safe limit threshold for local SQLite deployment)
    const MAX_STORAGE_BYTES = 50 * 1024 * 1024; // 50MB
    const WARNING_PERCENT = 75;
    const FULL_PERCENT = 90;

    let usagePercent = Math.min(100, Math.round((totalBytes / MAX_STORAGE_BYTES) * 1000) / 10);

    // Support simulation for testing alert button
    const simulate = req.query.simulate as string;
    if (simulate === 'full') {
      usagePercent = 94.2;
    } else if (simulate === 'warning') {
      usagePercent = 78.5;
    }

    const isFull = usagePercent >= FULL_PERCENT;
    const isWarning = usagePercent >= WARNING_PERCENT && !isFull;
    const status = isFull ? 'critical' : (isWarning ? 'warning' : 'healthy');

    const formatBytes = (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    res.json({
      status,
      isFull,
      isWarning,
      usagePercent,
      totalBytes,
      totalFormatted: formatBytes(totalBytes),
      dbSizeBytes,
      dbSizeFormatted: formatBytes(dbSizeBytes),
      walSizeBytes,
      walSizeFormatted: formatBytes(walSizeBytes),
      maxStorageBytes: MAX_STORAGE_BYTES,
      maxStorageFormatted: formatBytes(MAX_STORAGE_BYTES),
      pageCount,
      pageSize,
      freelistCount,
      freeableBytes: freelistCount * pageSize,
      freeableFormatted: formatBytes(freelistCount * pageSize),
      tables: {
        products: productCount,
        productImages: imageCount,
        retailOrders: retailCount,
        bulkEnquiries: enquiryCount,
        quotations: quoteCount,
        wholesaleOrders: wholesaleCount,
        users: userCount,
        auditLogs: auditCount,
      },
      message: isFull
        ? 'CRITICAL ALERT: Database storage is near full capacity! Free up space or optimize immediately.'
        : isWarning
        ? 'WARNING: Database storage usage is elevated (>75%). Consider running optimization.'
        : 'Database storage is healthy and well within safe operational limits.'
    });
  } catch (err: any) {
    console.error('Failed to get database status:', err);
    res.status(500).json({ error: 'Failed to retrieve database status: ' + err.message });
  }
});

// Run VACUUM & Optimize
app.post('/api/admin/database/vacuum', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const dataDir = path.resolve(process.cwd(), 'data');
    const dbFilePath = path.join(dataDir, 'jucicool.db');
    const beforeSize = fs.existsSync(dbFilePath) ? fs.statSync(dbFilePath).size : 0;

    // Execute VACUUM
    db.exec('VACUUM');
    db.exec('PRAGMA optimize');

    const afterSize = fs.existsSync(dbFilePath) ? fs.statSync(dbFilePath).size : 0;
    const freedBytes = Math.max(0, beforeSize - afterSize);

    logAction('DATABASE_VACUUM', req.user!.fullName, `Optimized database via VACUUM. Freed ${freedBytes} bytes.`);

    res.json({
      message: 'Database optimized successfully',
      freedBytes,
      freedFormatted: freedBytes > 1024 ? `${(freedBytes / 1024).toFixed(1)} KB` : `${freedBytes} B`,
      newSize: afterSize,
      newSizeFormatted: `${(afterSize / (1024 * 1024)).toFixed(2)} MB`
    });
  } catch (err: any) {
    console.error('Database vacuum failed:', err);
    res.status(500).json({ error: 'Database optimization failed: ' + err.message });
  }
});

// Clear Old Audit Logs
app.post('/api/admin/database/clear-logs', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const countBefore = (db.prepare('SELECT COUNT(*) as c FROM audit_logs').get() as any)?.c || 0;
    // Keep the most recent 100 audit logs, delete older ones
    db.prepare(`
      DELETE FROM audit_logs
      WHERE id NOT IN (
        SELECT id FROM audit_logs ORDER BY id DESC LIMIT 100
      )
    `).run();
    const countAfter = (db.prepare('SELECT COUNT(*) as c FROM audit_logs').get() as any)?.c || 0;
    const deletedCount = countBefore - countAfter;

    db.exec('VACUUM');

    logAction('CLEAR_LOGS', req.user!.fullName, `Purged ${deletedCount} older audit log records.`);

    res.json({
      message: `Successfully purged ${deletedCount} old audit log entries and optimized storage.`,
      deletedCount
    });
  } catch (err: any) {
    console.error('Failed to clear logs:', err);
    res.status(500).json({ error: 'Failed to clear logs: ' + err.message });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Juci Cool API server running on http://localhost:${PORT}`);
});
