-- =====================================================
-- SEED DATA: Retail Orders, Bulk Enquiries, Quotations, Wholesale Orders
-- Target DB: Supabase (PostgreSQL)
-- =====================================================

-- -----------------------------------------------------
-- 1. Retail Orders & Line Items
-- -----------------------------------------------------
INSERT INTO public.retail_orders (
  id, order_number, customer_name, customer_phone, customer_email,
  delivery_address, city, state, pincode, subtotal, delivery_fee, total_amount,
  payment_method, payment_status, order_status, notes, created_at
)
OVERRIDING SYSTEM VALUE
VALUES
  (
    1,
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
    'Please leave with security if unavailable',
    NOW() - INTERVAL '2 days'
  ),
  (
    2,
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
    'Call before delivery',
    NOW() - INTERVAL '1 day'
  )
ON CONFLICT (order_number) DO NOTHING;

INSERT INTO public.retail_order_items (
  id, order_id, product_id, product_name, pack_size, unit_price, quantity, total_price
)
OVERRIDING SYSTEM VALUE
VALUES
  (1, 1, 1, 'Juci Cool Mango Drink (Pouch)', '160 ml Spout Pouch', 10.00, 5, 50.00),
  (2, 1, 2, 'Juci Cool Mango Juice (Bottle)', '250 ml Bottle', 20.00, 2, 40.00),
  (3, 1, 5, 'Juci Cool Guava Drink', '250 ml Bottle', 20.00, 2, 40.00),
  (4, 2, 3, 'Juci Cool Mango & Guava Candy Pack', '150 g Pouch', 25.00, 1, 25.00),
  (5, 2, 4, 'Juci Cool Mixed Fruit Jelly Tub', '200 g Tub', 35.00, 2, 70.00)
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('public.retail_orders', 'id'), COALESCE(MAX(id), 1)) FROM public.retail_orders;
SELECT setval(pg_get_serial_sequence('public.retail_order_items', 'id'), COALESCE(MAX(id), 1)) FROM public.retail_order_items;

-- -----------------------------------------------------
-- 2. Bulk Enquiries & Items
-- -----------------------------------------------------
INSERT INTO public.bulk_enquiries (
  id, enquiry_number, customer_name, phone_number, email, business_name,
  customer_type, city, state, preferred_contact_method, gstin, delivery_location,
  additional_notes, status, assigned_to, internal_notes, created_at
)
OVERRIDING SYSTEM VALUE
VALUES
  (
    1,
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
    'Regular payment client. 50% advance received, balance on delivery.',
    NOW() - INTERVAL '3 days'
  ),
  (
    2,
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
    NULL,
    'High potential distributor inquiry. Needs immediate follow-up call.',
    NOW() - INTERVAL '2 days'
  ),
  (
    3,
    'JC-BLK-8903',
    'Anand Kumar',
    '+91 97010 33445',
    'anand.kirana@yahoo.com',
    'Sri Venkateshwara Retail Stores',
    'Retailer',
    'Khammam',
    'Telangana',
    'Phone',
    NULL,
    'Wyra Road, Khammam',
    'Initial trial order for retail counter display. Requesting best price for 20 cartons.',
    'Quotation Prepared',
    'JDM Admin Officer',
    'Quotation prepared with standard retail merchant margin.',
    NOW() - INTERVAL '1 day'
  )
ON CONFLICT (enquiry_number) DO NOTHING;

INSERT INTO public.bulk_enquiry_items (
  id, enquiry_id, product_id, product_name, pack_size, requested_quantity, unit_label
)
OVERRIDING SYSTEM VALUE
VALUES
  (1, 1, 1, 'Juci Cool Mango Drink (Pouch)', '160 ml Spout Pouch', 2000, 'Units (50 Cartons)'),
  (2, 1, 2, 'Juci Cool Mango Juice (Bottle)', '250 ml Bottle', 1200, 'Units (50 Cartons)'),
  (3, 1, 5, 'Juci Cool Guava Drink', '250 ml Bottle', 960, 'Units (40 Cartons)'),
  (4, 2, 1, 'Juci Cool Mango Drink (Pouch)', '160 ml Spout Pouch', 4000, 'Units (100 Cartons)'),
  (5, 2, 2, 'Juci Cool Mango Juice (Bottle)', '250 ml Bottle', 2400, 'Units (100 Cartons)'),
  (6, 2, 6, 'Juci Cool Pineapple Juice', '250 ml Bottle', 2400, 'Units (100 Cartons)'),
  (7, 2, 8, 'Juci Cool Aloe Vera & Pineapple Drink', '250 ml Bottle', 1200, 'Units (50 Cartons)'),
  (8, 3, 1, 'Juci Cool Mango Drink (Pouch)', '160 ml Spout Pouch', 800, 'Units (20 Cartons)'),
  (9, 3, 3, 'Juci Cool Mango & Guava Candy Pack', '150 g Pouch', 100, 'Units')
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('public.bulk_enquiries', 'id'), COALESCE(MAX(id), 1)) FROM public.bulk_enquiries;
SELECT setval(pg_get_serial_sequence('public.bulk_enquiry_items', 'id'), COALESCE(MAX(id), 1)) FROM public.bulk_enquiry_items;

-- -----------------------------------------------------
-- 3. Quotations & Items
-- -----------------------------------------------------
INSERT INTO public.quotations (
  id, quotation_number, enquiry_id, customer_name, business_name, phone_number, email,
  subtotal, discount_percent, discount_amount, tax_percent, tax_amount, delivery_charges,
  grand_total, validity_date, payment_terms, notes_conditions, status, created_by, created_at
)
OVERRIDING SYSTEM VALUE
VALUES
  (
    1,
    'JC-QT-501',
    1,
    'Suresh Reddy',
    'Reddy Supermart & Grocery Chain',
    '+91 94401 56789',
    'suresh.mart@gmail.com',
    51200.00,
    5.0,
    2560.00,
    12.0,
    5836.80,
    1200.00,
    55676.80,
    '2026-11-15',
    '50% Advance via RTGS, 50% upon door delivery at Secunderabad hub',
    'Wholesale carton pricing strictly for verified dealer. Valid for 30 days. Includes freight.',
    'Converted',
    'JDM Admin Officer',
    NOW() - INTERVAL '2 days'
  ),
  (
    2,
    'JC-QT-502',
    3,
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
    'JDM Admin Officer',
    NOW() - INTERVAL '1 day'
  )
ON CONFLICT (quotation_number) DO NOTHING;

INSERT INTO public.quotation_items (
  id, quotation_id, product_id, product_name, pack_size, requested_quantity, approved_unit_price, total_price
)
OVERRIDING SYSTEM VALUE
VALUES
  (1, 1, 1, 'Juci Cool Mango Drink (Pouch)', '160 ml Spout Pouch', 2000, 7.50, 15000.00),
  (2, 1, 2, 'Juci Cool Mango Juice (Bottle)', '250 ml Bottle', 1200, 16.00, 19200.00),
  (3, 1, 5, 'Juci Cool Guava Drink', '250 ml Bottle', 960, 17.70, 17000.00),
  (4, 2, 1, 'Juci Cool Mango Drink (Pouch)', '160 ml Spout Pouch', 800, 8.00, 6400.00),
  (5, 2, 3, 'Juci Cool Mango & Guava Candy Pack', '150 g Pouch', 100, 20.00, 2000.00)
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('public.quotations', 'id'), COALESCE(MAX(id), 1)) FROM public.quotations;
SELECT setval(pg_get_serial_sequence('public.quotation_items', 'id'), COALESCE(MAX(id), 1)) FROM public.quotation_items;

-- -----------------------------------------------------
-- 4. Wholesale Orders & Items
-- -----------------------------------------------------
INSERT INTO public.wholesale_orders (
  id, order_number, quotation_id, enquiry_id, business_name, contact_person, phone_number, email,
  delivery_address, city, state, agreed_total, advance_paid, payment_status,
  fulfillment_status, order_date, expected_delivery_date, notes
)
OVERRIDING SYSTEM VALUE
VALUES
  (
    1,
    'JC-WHOLESALE-201',
    1,
    1,
    'Reddy Supermart & Grocery Chain',
    'Suresh Reddy',
    '+91 94401 56789',
    'suresh.mart@gmail.com',
    'Main Warehouse, Trimulgherry, Secunderabad, 500015',
    'Secunderabad',
    'Telangana',
    55676.80,
    27838.40,
    'Partial Advance',
    'Processing',
    NOW() - INTERVAL '1 day',
    '2026-10-15',
    'Dispatch scheduled via factory logistics truck #2.'
  )
ON CONFLICT (order_number) DO NOTHING;

INSERT INTO public.wholesale_order_items (
  id, wholesale_order_id, product_id, product_name, pack_size, quantity, unit_price, total_price
)
OVERRIDING SYSTEM VALUE
VALUES
  (1, 1, 1, 'Juci Cool Mango Drink (Pouch)', '160 ml Spout Pouch', 2000, 7.50, 15000.00),
  (2, 1, 2, 'Juci Cool Mango Juice (Bottle)', '250 ml Bottle', 1200, 16.00, 19200.00),
  (3, 1, 5, 'Juci Cool Guava Drink', '250 ml Bottle', 960, 17.70, 17000.00)
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('public.wholesale_orders', 'id'), COALESCE(MAX(id), 1)) FROM public.wholesale_orders;
SELECT setval(pg_get_serial_sequence('public.wholesale_order_items', 'id'), COALESCE(MAX(id), 1)) FROM public.wholesale_order_items;

-- -----------------------------------------------------
-- 5. Status History & Audit Logs
-- -----------------------------------------------------
INSERT INTO public.status_history (entity_type, entity_id, previous_status, new_status, changed_by, notes)
VALUES
  ('bulk_enquiry', 1, 'New', 'Contacted', 'Admin', 'Called Suresh Reddy and confirmed warehouse location.'),
  ('bulk_enquiry', 1, 'Contacted', 'Quotation Sent', 'Admin', 'Sent quotation JC-QT-501 via WhatsApp and email.'),
  ('bulk_enquiry', 1, 'Quotation Sent', 'Accepted', 'Admin', 'Customer accepted terms and transferred 50% advance.'),
  ('bulk_enquiry', 1, 'Accepted', 'Converted to Order', 'Admin', 'Converted to wholesale order JC-WHOLESALE-201.');

INSERT INTO public.audit_logs (action, performed_by, details)
VALUES
  ('SYSTEM_SEED', 'System', 'Initial Supabase seed data populated with verified products, sample orders, and quotations.');
