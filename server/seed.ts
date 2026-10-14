import bcrypt from 'bcryptjs';
import { db, initDatabase } from './db';

export function seedData() {
  initDatabase();

  // Always ensure Admin and sample accounts are synced with latest credentials
  const salt = bcrypt.genSaltSync(10);
  const adminHash = bcrypt.hashSync('juci@cool123', salt);
  const clientHash = bcrypt.hashSync('password123', salt);
  const dealerHash = bcrypt.hashSync('dealer123', salt);

  const upsertUser = db.prepare(`
    INSERT INTO users (email, password_hash, full_name, phone, role, business_name, customer_type, city, state)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(email) DO UPDATE SET
      password_hash = excluded.password_hash,
      full_name = excluded.full_name,
      role = excluded.role,
      customer_type = excluded.customer_type
  `);

  upsertUser.run('jucicooladmin', adminHash, 'Juci Cool Admin Officer', '+91 98490 12345', 'admin', 'JDM Fruit Products Pvt. Ltd.', 'Manufacturer', 'Hyderabad', 'Telangana');
  upsertUser.run('admin@jucicool.com', adminHash, 'JDM Admin Officer', '+91 98490 12345', 'admin', 'JDM Fruit Products Pvt. Ltd.', 'Manufacturer', 'Hyderabad', 'Telangana');
  upsertUser.run('dealer@jucicool.com', dealerHash, 'Suresh Reddy (Dealer)', '+91 94401 56789', 'customer', 'Reddy Supermart', 'Retailer', 'Secunderabad', 'Telangana');
  upsertUser.run('customer@jucicool.com', clientHash, 'Priya Kulkarni (Customer)', '+91 98850 43210', 'customer', null, 'Individual', 'Hyderabad', 'Telangana');

  // Check if products already seeded
  const prodCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (prodCount.count > 0) {
    // Ensure existing products have reasonable wholesale prices configured
    db.prepare(`
      UPDATE products
      SET wholesale_price = CASE
        WHEN retail_price = 10 THEN 7.00
        WHEN retail_price = 20 THEN 14.00
        WHEN retail_price = 25 THEN 17.50
        WHEN retail_price = 35 THEN 24.50
        WHEN retail_price = 15 THEN 10.50
        ELSE ROUND(retail_price * 0.7, 2)
      END
      WHERE wholesale_price IS NULL OR wholesale_price = 0
    `).run();
    console.log('Database already populated with', prodCount.count, 'products. Wholesale prices synced.');
    return;
  }

  console.log('Seeding Juci Cool database with initial verified products and accounts...');

  // 1. Categories
  const insertCat = db.prepare(`
    INSERT INTO product_categories (name, slug, description, image_url, display_order)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertCat.run('Fruit Drinks', 'fruit-drinks', 'Refreshing fruit goodness in every sip with authentic fruit pulp.', '/images/products/mango-pouch.png', 1);
  insertCat.run('Mango Drinks', 'mango-drinks', 'Rich taste. Pure mango. King of fruits in delicious bottles and pouches.', '/images/products/mango-bottle.png', 2);
  insertCat.run('Flavored Candy', 'candy', 'Fun flavors and happy moments with intense mango and guava candies.', '/images/products/flavored-candy.png', 3);
  insertCat.run('Fruit Jelly', 'jelly', 'Fruity bites of happiness with luscious assorted real fruit jellies.', '/images/products/fruit-jelly.png', 4);
  insertCat.run('Natural Mineral Water', 'mineral-water', 'Pure, fresh, natural Himalayan-quality hydration.', '/images/products/mineral-water.png', 5);

  // 2. Verified Products
  const insertProd = db.prepare(`
    INSERT INTO products (
      name, flavor, category_id, pack_size, packaging_type, description,
      retail_price, wholesale_price, stock_quantity, min_wholesale_qty, image_url, shot_image_url, is_active, featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Product 1: Mango Pouch (Fruit Drinks)
  insertProd.run(
    'Juci Cool Mango Drink (Pouch)',
    'Alphonso Mango',
    1,
    '160 ml Spout Pouch',
    'Stand-up Spout Pouch with Resealable Cap',
    'Refreshing fruit goodness in every sip. Crafted with sweet, sun-ripened mango pulp in an easy-to-carry, spill-proof spout pouch popular among kids and adults alike.',
    10.00,
    500,
    200, // 5 cartons (40 pouches/carton)
    '/images/products/mango-pouch.png',
    '/images/products/shot-mango-pouch.png',
    1,
    1
  );

  // Product 2: Mango Bottle (Mango Drinks)
  insertProd.run(
    'Juci Cool Mango Juice (Bottle)',
    'Rich Alphonso & Totapuri',
    2,
    '250 ml Bottle',
    'Ergonomic PET Bottle',
    'Rich taste. Pure mango. Our signature mango drink made from carefully selected orchard mangoes, delivering an authentic and thick pulpy taste that beats the heat.',
    20.00,
    450,
    120, // 5 cartons (24 bottles/carton)
    '/images/products/mango-bottle.png',
    '/images/products/shot-mango-bottle.png',
    1,
    1
  );

  // Product 3: Flavored Candy (Flavored Candy)
  insertProd.run(
    'Juci Cool Mango & Guava Candy Pack',
    'Mango & Pink Guava',
    3,
    '150 g Pouch (Approx. 50 Candies)',
    'Resealable Pillow Pouch',
    'Fun flavors. Happy moments. Enjoy the burst of tropical fruit in every candy. Contains individually wrapped real fruit-infused hard boiled candies with tangy fruit centers.',
    25.00,
    350,
    50,
    '/images/products/flavored-candy.png',
    '/images/products/shot-flavored-candy.png',
    1,
    1
  );

  // Product 4: Fruit Jelly (Fruit Jelly)
  insertProd.run(
    'Juci Cool Mixed Fruit Jelly Tub',
    'Assorted Berry, Strawberry & Mango',
    4,
    '200 g Tub with Sealed Lid',
    'Airtight Dessert Tub',
    'Fruity bites of happiness. Soft, chewy fruit jellies packed with vibrant fruit flavors. Comes in a sturdy, reusable tub with an airtight lid for maximum freshness.',
    35.00,
    280,
    40,
    '/images/products/fruit-jelly.png',
    '/images/products/shot-fruit-jelly.png',
    1,
    1
  );

  // Product 5: Guava Juice (Fruit Drinks)
  insertProd.run(
    'Juci Cool Guava Drink',
    'Pink Guava with Mild Spice',
    1,
    '250 ml Bottle',
    'Contoured PET Bottle',
    'Naturally refreshing. Naturally good. Made with aromatic pink guava pulp and a touch of salt and spice that captures the nostalgic taste of ripe street-side guavas.',
    20.00,
    380,
    120,
    '/images/products/guava-bottle.png',
    '/images/products/shot-guava-bottle.png',
    1,
    1
  );

  // Product 6: Pineapple Juice (Fruit Drinks)
  insertProd.run(
    'Juci Cool Pineapple Juice',
    'Tropical Pineapple',
    1,
    '250 ml Bottle',
    'Ribbed PET Bottle',
    'Tropical taste. Pure delight. Made from golden, sun-ripened pineapples. Vibrant, sweet, and tangy taste that provides instant hydration and energy.',
    25.00,
    320,
    120,
    '/images/products/pineapple-bottle.png',
    '/images/products/shot-pineapple-bottle.png',
    1,
    1
  );

  // Product 7: Natural Mineral Water
  insertProd.run(
    'Juci Cool Natural Mineral Water',
    'Natural Spring Minerals',
    5,
    '500 ml Bottle',
    'Crystal PET Bottle',
    'Pure. Fresh. Natural. Multi-barrier RO purification, UV sterilization, and mineral fortification with essential electrolytes for crisp, clean refreshment.',
    10.00,
    600,
    240, // 10 cartons (24 bottles/carton)
    '/images/products/mineral-water.png',
    '/images/products/shot-mineral-water.png',
    1,
    0
  );

  // Product 8: Aloe Vera & Pineapple Drink (New Launch)
  insertProd.run(
    'Juci Cool Aloe Vera & Pineapple Drink',
    'Aloe Vera Gel & Golden Pineapple',
    1,
    '250 ml Bottle',
    'Sleek PET Bottle',
    'Exciting new flavors. More to enjoy. Infused with natural aloe vera pulp bits suspended in refreshing pineapple beverage. A wholesome, revitalizing drink.',
    30.00,
    240,
    100,
    '/images/products/aloe-pineapple.png',
    '/images/products/shot-aloe-pineapple.png',
    1,
    1
  );

  // Product 9: Mango Bottle Large 500ml
  insertProd.run(
    'Juci Cool Mango Juice (Family Pack)',
    'Alphonso Mango',
    2,
    '500 ml Bottle',
    'PET Bottle',
    'Double the mango goodness for sharing with family and friends. Thick, velvety mango nectar ready to serve chilled.',
    40.00,
    190,
    60,
    '/images/products/mango-bottle.png',
    '/images/products/shot-mango-bottle.png',
    1,
    0
  );

  // 4. Sample Retail Orders
  const insertOrder = db.prepare(`
    INSERT INTO retail_orders (
      order_number, customer_name, customer_phone, customer_email,
      delivery_address, city, state, pincode, subtotal, delivery_fee, total_amount,
      payment_method, payment_status, order_status, notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-2 days'))
  `);

  const insertOrderItem = db.prepare(`
    INSERT INTO retail_order_items (order_id, product_id, product_name, pack_size, unit_price, quantity, total_price)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const order1 = insertOrder.run(
    'JC-RET-1001',
    'Priya Kulkarni',
    '+91 98850 43210',
    'priya.k@gmail.com',
    'Flat 402, Green Meadows, Jubilee Hills',
    'Hyderabad',
    'Telangana',
    '500033',
    130.00,
    0.00,
    130.00,
    'UPI',
    'Paid',
    'Delivered',
    'Please leave with security if unavailable'
  );

  insertOrderItem.run(order1.lastInsertRowid, 1, 'Juci Cool Mango Drink (Pouch)', '160 ml Spout Pouch', 10.00, 5, 50.00);
  insertOrderItem.run(order1.lastInsertRowid, 2, 'Juci Cool Mango Juice (Bottle)', '250 ml Bottle', 20.00, 2, 40.00);
  insertOrderItem.run(order1.lastInsertRowid, 5, 'Juci Cool Guava Drink', '250 ml Bottle', 20.00, 2, 40.00);

  const order2 = insertOrder.run(
    'JC-RET-1002',
    'Karthik Verma',
    '+91 99663 87654',
    'karthik.v@outlook.com',
    'Plot 88, Road No. 12, Banjara Hills',
    'Hyderabad',
    'Telangana',
    '500034',
    95.00,
    20.00,
    115.00,
    'COD',
    'Pending',
    'Packed',
    'Call before delivery'
  );

  insertOrderItem.run(order2.lastInsertRowid, 3, 'Juci Cool Mango & Guava Candy Pack', '150 g Pouch', 25.00, 1, 25.00);
  insertOrderItem.run(order2.lastInsertRowid, 4, 'Juci Cool Mixed Fruit Jelly Tub', '200 g Tub', 35.00, 2, 70.00);

  // 5. Sample Bulk Enquiries ("Get Best Price")
  const insertEnquiry = db.prepare(`
    INSERT INTO bulk_enquiries (
      enquiry_number, customer_name, phone_number, email, business_name,
      customer_type, city, state, preferred_contact_method, gstin, delivery_location,
      additional_notes, status, assigned_to, internal_notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-3 days'))
  `);

  const insertEnquiryItem = db.prepare(`
    INSERT INTO bulk_enquiry_items (enquiry_id, product_id, product_name, pack_size, requested_quantity, unit_label)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Enquiry 1: Converted to Order
  const enq1 = insertEnquiry.run(
    'JC-BLK-8901',
    'Suresh Reddy',
    '+91 94401 56789',
    'suresh.mart@gmail.com',
    'Reddy Supermart & Grocery Chain',
    'Supermarket',
    'Secunderabad',
    'Telangana',
    'Phone',
    '36AABCU9603R1ZM',
    'Main Warehouse, Trimulgherry, Secunderabad',
    'Looking for weekly recurring delivery. Need distributor rates for 200 cartons.',
    'Converted to Order',
    'JDM Admin Officer',
    'Regular payment client. 50% advance received, balance on delivery.'
  );

  insertEnquiryItem.run(enq1.lastInsertRowid, 1, 'Juci Cool Mango Drink (Pouch)', '160 ml Spout Pouch', 2000, 'Units (50 Cartons)');
  insertEnquiryItem.run(enq1.lastInsertRowid, 2, 'Juci Cool Mango Juice (Bottle)', '250 ml Bottle', 1200, 'Units (50 Cartons)');
  insertEnquiryItem.run(enq1.lastInsertRowid, 5, 'Juci Cool Guava Drink', '250 ml Bottle', 960, 'Units (40 Cartons)');

  // Quotation for Enquiry 1
  const insertQuotation = db.prepare(`
    INSERT INTO quotations (
      quotation_number, enquiry_id, customer_name, business_name, phone_number, email,
      subtotal, discount_percent, discount_amount, tax_percent, tax_amount, delivery_charges,
      grand_total, validity_date, payment_terms, notes_conditions, status, created_by, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-2 days'))
  `);

  const insertQuoteItem = db.prepare(`
    INSERT INTO quotation_items (quotation_id, product_id, product_name, pack_size, requested_quantity, approved_unit_price, total_price)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const quote1 = insertQuotation.run(
    'JC-QT-501',
    enq1.lastInsertRowid,
    'Suresh Reddy',
    'Reddy Supermart & Grocery Chain',
    '+91 94401 56789',
    'suresh.mart@gmail.com',
    51200.00,
    5.0, // 5% bulk discount
    2560.00,
    12.0, // 12% GST
    5836.80,
    1200.00,
    55676.80,
    '2026-11-15',
    '50% Advance via RTGS, 50% upon door delivery at Secunderabad hub',
    'Wholesale carton pricing strictly for verified dealer. Valid for 30 days. Includes freight.',
    'Converted',
    'JDM Admin Officer'
  );

  insertQuoteItem.run(quote1.lastInsertRowid, 1, 'Juci Cool Mango Drink (Pouch)', '160 ml Spout Pouch', 2000, 7.50, 15000.00); // wholesale unit ₹7.50 vs retail ₹10
  insertQuoteItem.run(quote1.lastInsertRowid, 2, 'Juci Cool Mango Juice (Bottle)', '250 ml Bottle', 1200, 16.00, 19200.00); // wholesale unit ₹16 vs retail ₹20
  insertQuoteItem.run(quote1.lastInsertRowid, 5, 'Juci Cool Guava Drink', '250 ml Bottle', 960, 17.70, 17000.00);

  // Wholesale Order for Quotation 1
  const insertWholesaleOrder = db.prepare(`
    INSERT INTO wholesale_orders (
      order_number, quotation_id, enquiry_id, business_name, contact_person, phone_number, email,
      delivery_address, city, state, agreed_total, advance_paid, payment_status,
      fulfillment_status, order_date, expected_delivery_date, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-1 day'), '2026-10-15', ?)
  `);

  const insertWholesaleItem = db.prepare(`
    INSERT INTO wholesale_order_items (wholesale_order_id, product_id, product_name, pack_size, quantity, unit_price, total_price)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const wsOrder1 = insertWholesaleOrder.run(
    'JC-WHOLESALE-201',
    quote1.lastInsertRowid,
    enq1.lastInsertRowid,
    'Reddy Supermart & Grocery Chain',
    'Suresh Reddy',
    '+91 94401 56789',
    'suresh.mart@gmail.com',
    'Main Warehouse, Trimulgherry, Secunderabad, 500015',
    'Secunderabad',
    'Telangana',
    55676.80,
    27838.40, // 50% advance
    'Partial Advance',
    'Processing',
    'Dispatch scheduled via factory logistics truck #2.'
  );

  insertWholesaleItem.run(wsOrder1.lastInsertRowid, 1, 'Juci Cool Mango Drink (Pouch)', '160 ml Spout Pouch', 2000, 7.50, 15000.00);
  insertWholesaleItem.run(wsOrder1.lastInsertRowid, 2, 'Juci Cool Mango Juice (Bottle)', '250 ml Bottle', 1200, 16.00, 19200.00);
  insertWholesaleItem.run(wsOrder1.lastInsertRowid, 5, 'Juci Cool Guava Drink', '250 ml Bottle', 960, 17.70, 17000.00);

  // Enquiry 2: New enquiry awaiting quotation
  const enq2 = insertEnquiry.run(
    'JC-BLK-8902',
    'Mohammed Rafi',
    '+91 98480 77112',
    'rafi.distributors@gmail.com',
    'Deccan Beverage Distributors',
    'Distributor',
    'Warangal',
    'Telangana',
    'WhatsApp',
    '36BBPPR8812M1Z0',
    'Subedari Industrial Estate, Warangal',
    'Interested in taking dealership for Warangal district. Want price quotes for 500 cartons across all flavours including Aloe Vera and Pineapples.',
    'New',
    null,
    'High potential distributor inquiry. Needs immediate follow-up call.'
  );

  insertEnquiryItem.run(enq2.lastInsertRowid, 1, 'Juci Cool Mango Drink (Pouch)', '160 ml Spout Pouch', 4000, 'Units (100 Cartons)');
  insertEnquiryItem.run(enq2.lastInsertRowid, 2, 'Juci Cool Mango Juice (Bottle)', '250 ml Bottle', 2400, 'Units (100 Cartons)');
  insertEnquiryItem.run(enq2.lastInsertRowid, 6, 'Juci Cool Pineapple Juice', '250 ml Bottle', 2400, 'Units (100 Cartons)');
  insertEnquiryItem.run(enq2.lastInsertRowid, 8, 'Juci Cool Aloe Vera & Pineapple Drink', '250 ml Bottle', 1200, 'Units (50 Cartons)');

  // Enquiry 3: Quotation Prepared
  const enq3 = insertEnquiry.run(
    'JC-BLK-8903',
    'Anand Kumar',
    '+91 97010 33445',
    'anand.kirana@yahoo.com',
    'Sri Venkateshwara Retail Stores',
    'Retailer',
    'Khammam',
    'Telangana',
    'Phone',
    null,
    'Wyra Road, Khammam',
    'Initial trial order for retail counter display. Requesting best price for 20 cartons.',
    'Quotation Prepared',
    'JDM Admin Officer',
    'Quotation prepared with standard retail merchant margin.'
  );

  insertEnquiryItem.run(enq3.lastInsertRowid, 1, 'Juci Cool Mango Drink (Pouch)', '160 ml Spout Pouch', 800, 'Units (20 Cartons)');
  insertEnquiryItem.run(enq3.lastInsertRowid, 3, 'Juci Cool Mango & Guava Candy Pack', '150 g Pouch', 100, 'Units');

  // Quotation for Enquiry 3
  const quote3 = insertQuotation.run(
    'JC-QT-502',
    enq3.lastInsertRowid,
    'Anand Kumar',
    'Sri Venkateshwara Retail Stores',
    '+91 97010 33445',
    'anand.kirana@yahoo.com',
    8400.00,
    3.0,
    252.00,
    12.0,
    977.76,
    450.00,
    9575.76,
    '2026-10-31',
    '100% advance on invoice before dispatch',
    'Trial dealer pricing. Valid till 31 Oct 2026.',
    'Sent',
    'JDM Admin Officer'
  );

  insertQuoteItem.run(quote3.lastInsertRowid, 1, 'Juci Cool Mango Drink (Pouch)', '160 ml Spout Pouch', 800, 8.00, 6400.00);
  insertQuoteItem.run(quote3.lastInsertRowid, 3, 'Juci Cool Mango & Guava Candy Pack', '150 g Pouch', 100, 20.00, 2000.00);

  // Status histories
  const insertHistory = db.prepare(`
    INSERT INTO status_history (entity_type, entity_id, previous_status, new_status, changed_by, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertHistory.run('bulk_enquiry', enq1.lastInsertRowid, 'New', 'Contacted', 'Admin', 'Called Suresh Reddy and confirmed warehouse location.');
  insertHistory.run('bulk_enquiry', enq1.lastInsertRowid, 'Contacted', 'Quotation Sent', 'Admin', 'Sent quotation JC-QT-501 via WhatsApp and email.');
  insertHistory.run('bulk_enquiry', enq1.lastInsertRowid, 'Quotation Sent', 'Accepted', 'Admin', 'Customer accepted terms and transferred 50% advance.');
  insertHistory.run('bulk_enquiry', enq1.lastInsertRowid, 'Accepted', 'Converted to Order', 'Admin', 'Converted to wholesale order JC-WHOLESALE-201.');

  // Audit log
  db.prepare(`
    INSERT INTO audit_logs (action, performed_by, details)
    VALUES (?, ?, ?)
  `).run('SYSTEM_SEED', 'System', 'Initial seed data populated with verified products, sample orders, and quotations.');

  console.log('Seeding completed successfully!');
}

seedData();
