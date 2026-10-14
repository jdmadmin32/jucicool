-- =====================================================
-- SEED DATA: Categories & Products
-- Target DB: Supabase (PostgreSQL)
-- =====================================================

-- 1. Insert Categories
INSERT INTO public.product_categories (id, name, slug, description, image_url, display_order)
OVERRIDING SYSTEM VALUE
VALUES
  (1, 'Fruit Drinks', 'fruit-drinks', 'Refreshing fruit goodness in every sip with authentic fruit pulp.', '/images/products/mango-pouch.png', 1),
  (2, 'Mango Drinks', 'mango-drinks', 'Rich taste. Pure mango. King of fruits in delicious bottles and pouches.', '/images/products/mango-bottle.png', 2),
  (3, 'Flavored Candy', 'candy', 'Fun flavors and happy moments with intense mango and guava candies.', '/images/products/flavored-candy.png', 3),
  (4, 'Fruit Jelly', 'jelly', 'Fruity bites of happiness with luscious assorted real fruit jellies.', '/images/products/fruit-jelly.png', 4),
  (5, 'Natural Mineral Water', 'mineral-water', 'Pure, fresh, natural Himalayan-quality hydration.', '/images/products/mineral-water.png', 5)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  display_order = EXCLUDED.display_order;

-- Sync Category Sequence
SELECT setval(pg_get_serial_sequence('public.product_categories', 'id'), COALESCE(MAX(id), 1)) FROM public.product_categories;

-- 2. Insert Products
INSERT INTO public.products (
  id, name, flavor, category_id, pack_size, packaging_type, description,
  retail_price, wholesale_price, stock_quantity, min_wholesale_qty, image_url, shot_image_url, is_active, featured
)
OVERRIDING SYSTEM VALUE
VALUES
  (
    1,
    'Juci Cool Mango Drink (Pouch)',
    'Alphonso Mango',
    1,
    '160 ml Spout Pouch',
    'Stand-up Spout Pouch with Resealable Cap',
    'Refreshing fruit goodness in every sip. Crafted with sweet, sun-ripened mango pulp in an easy-to-carry, spill-proof spout pouch popular among kids and adults alike.',
    10.00,
    7.00,
    500,
    200,
    '/images/products/mango-pouch.png',
    '/images/products/shot-mango-pouch.png',
    1,
    1
  ),
  (
    2,
    'Juci Cool Mango Juice (Bottle)',
    'Rich Alphonso & Totapuri',
    2,
    '250 ml Bottle',
    'Ergonomic PET Bottle',
    'Rich taste. Pure mango. Our signature mango drink made from carefully selected orchard mangoes, delivering an authentic and thick pulpy taste that beats the heat.',
    20.00,
    14.00,
    450,
    120,
    '/images/products/mango-bottle.png',
    '/images/products/shot-mango-bottle.png',
    1,
    1
  ),
  (
    3,
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
  ),
  (
    4,
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
  ),
  (
    5,
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
  ),
  (
    6,
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
  ),
  (
    7,
    'Juci Cool Natural Mineral Water',
    'Natural Spring Minerals',
    5,
    '500 ml Bottle',
    'Crystal PET Bottle',
    'Pure. Fresh. Natural. Multi-barrier RO purification, UV sterilization, and mineral fortification with essential electrolytes for crisp, clean refreshment.',
    10.00,
    7.00,
    600,
    240,
    '/images/products/mineral-water.png',
    '/images/products/shot-mineral-water.png',
    1,
    0
  ),
  (
    8,
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
  ),
  (
    9,
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
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  flavor = EXCLUDED.flavor,
  category_id = EXCLUDED.category_id,
  pack_size = EXCLUDED.pack_size,
  packaging_type = EXCLUDED.packaging_type,
  description = EXCLUDED.description,
  retail_price = EXCLUDED.retail_price,
  wholesale_price = EXCLUDED.wholesale_price,
  stock_quantity = EXCLUDED.stock_quantity,
  min_wholesale_qty = EXCLUDED.min_wholesale_qty,
  image_url = EXCLUDED.image_url,
  shot_image_url = EXCLUDED.shot_image_url,
  is_active = EXCLUDED.is_active,
  featured = EXCLUDED.featured;

-- Sync Product Sequence
SELECT setval(pg_get_serial_sequence('public.products', 'id'), COALESCE(MAX(id), 1)) FROM public.products;
