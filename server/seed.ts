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
    7.00,
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
    14.00,
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
    17.50,
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
    24.50,
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
    14.00,
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
    17.50,
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
    7.00,
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
    21.00,
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
    28.00,
    190,
    60,
    '/images/products/mango-bottle.png',
    '/images/products/shot-mango-bottle.png',
    1,
    0
  );

  // Audit log
  db.prepare(`
    INSERT INTO audit_logs (action, performed_by, details)
    VALUES (?, ?, ?)
  `).run('SYSTEM_SEED', 'System', 'Initial seed data populated with verified products and accounts.');

  console.log('Seeding completed successfully!');
}

seedData();
