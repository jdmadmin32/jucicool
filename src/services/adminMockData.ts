import {
  Product,
  RetailOrder,
  BulkEnquiry,
  WholesaleOrder,
  DealerRecord,
  CustomerRecord,
  AdminDashboardData
} from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Juci Cool Mango Drink (Pouch)',
    flavor: 'Alphonso Mango',
    category_id: 1,
    category_name: 'Fruit Drinks',
    category_slug: 'fruit-drinks',
    pack_size: '160 ml Spout Pouch',
    packaging_type: 'Stand-up Spout Pouch with Resealable Cap',
    description: 'Refreshing fruit goodness in every sip. Crafted with sweet, sun-ripened mango pulp in an easy-to-carry, spill-proof spout pouch.',
    retail_price: 10.00,
    wholesale_price: 7.50,
    stock_quantity: 500,
    min_wholesale_qty: 200,
    image_url: '/images/products/mango-pouch.png',
    shot_image_url: '/images/products/shot-mango-pouch.png',
    is_active: 1,
    featured: 1,
    extra_images: ['/images/products/mango-pouch.png']
  },
  {
    id: 2,
    name: 'Juci Cool Mango Juice (Bottle)',
    flavor: 'Rich Alphonso & Totapuri',
    category_id: 2,
    category_name: 'Mango Drinks',
    category_slug: 'mango-drinks',
    pack_size: '250 ml Bottle',
    packaging_type: 'Ergonomic PET Bottle',
    description: 'Rich taste. Pure mango. Our signature mango drink made from carefully selected orchard mangoes, delivering an authentic thick pulpy taste.',
    retail_price: 20.00,
    wholesale_price: 15.00,
    stock_quantity: 450,
    min_wholesale_qty: 120,
    image_url: '/images/products/mango-bottle.png',
    shot_image_url: '/images/products/shot-mango-bottle.png',
    is_active: 1,
    featured: 1,
    extra_images: ['/images/products/mango-bottle.png']
  },
  {
    id: 3,
    name: 'Juci Cool Mango & Guava Candy Pack',
    flavor: 'Mango & Pink Guava',
    category_id: 3,
    category_name: 'Flavored Candy',
    category_slug: 'candy',
    pack_size: '150 g Pouch (Approx. 50 Candies)',
    packaging_type: 'Resealable Pillow Pouch',
    description: 'Fun flavors. Happy moments. Enjoy the burst of tropical fruit in every candy with tangy real fruit center.',
    retail_price: 25.00,
    wholesale_price: 18.00,
    stock_quantity: 350,
    min_wholesale_qty: 50,
    image_url: '/images/products/flavored-candy.png',
    shot_image_url: '/images/products/shot-flavored-candy.png',
    is_active: 1,
    featured: 1,
    extra_images: ['/images/products/flavored-candy.png']
  },
  {
    id: 4,
    name: 'Juci Cool Mixed Fruit Jelly Tub',
    flavor: 'Assorted Berry, Strawberry & Mango',
    category_id: 4,
    category_name: 'Fruit Jelly',
    category_slug: 'jelly',
    pack_size: '200 g Tub with Sealed Lid',
    packaging_type: 'Airtight Dessert Tub',
    description: 'Fruity bites of happiness. Soft, chewy fruit jellies packed with vibrant fruit flavors in a reusable tub.',
    retail_price: 35.00,
    wholesale_price: 26.00,
    stock_quantity: 280,
    min_wholesale_qty: 40,
    image_url: '/images/products/fruit-jelly.png',
    shot_image_url: '/images/products/shot-fruit-jelly.png',
    is_active: 1,
    featured: 1,
    extra_images: ['/images/products/fruit-jelly.png']
  },
  {
    id: 5,
    name: 'Juci Cool Guava Drink',
    flavor: 'Pink Guava with Mild Spice',
    category_id: 1,
    category_name: 'Fruit Drinks',
    category_slug: 'fruit-drinks',
    pack_size: '250 ml Bottle',
    packaging_type: 'Contoured PET Bottle',
    description: 'Naturally refreshing. Made with aromatic pink guava pulp and a touch of salt and spice capturing street-side memories.',
    retail_price: 20.00,
    wholesale_price: 15.00,
    stock_quantity: 380,
    min_wholesale_qty: 120,
    image_url: '/images/products/guava-bottle.png',
    shot_image_url: '/images/products/shot-guava-bottle.png',
    is_active: 1,
    featured: 1,
    extra_images: ['/images/products/guava-bottle.png']
  },
  {
    id: 6,
    name: 'Juci Cool Pineapple Juice',
    flavor: 'Tropical Pineapple',
    category_id: 1,
    category_name: 'Fruit Drinks',
    category_slug: 'fruit-drinks',
    pack_size: '250 ml Bottle',
    packaging_type: 'Contoured PET Bottle',
    description: 'Golden sunshine in a bottle. Tangy and sweet tropical pineapple juice bursting with vitality.',
    retail_price: 20.00,
    wholesale_price: 15.00,
    stock_quantity: 320,
    min_wholesale_qty: 120,
    image_url: '/images/products/pineapple-bottle.png',
    shot_image_url: '/images/products/shot-pineapple-bottle.png',
    is_active: 1,
    featured: 0,
    extra_images: ['/images/products/pineapple-bottle.png']
  },
  {
    id: 7,
    name: 'Juci Cool Natural Mineral Water',
    flavor: 'Pure Mountain Freshness',
    category_id: 5,
    category_name: 'Natural Mineral Water',
    category_slug: 'mineral-water',
    pack_size: '500 ml Bottle',
    packaging_type: 'Eco-Ribbed PET Bottle',
    description: 'Purity you can trust. Multi-stage RO, UV and ozonated natural mineral water packed with essential minerals.',
    retail_price: 10.00,
    wholesale_price: 6.50,
    stock_quantity: 800,
    min_wholesale_qty: 240,
    image_url: '/images/products/mineral-water.png',
    shot_image_url: '/images/products/shot-mineral-water.png',
    is_active: 1,
    featured: 0,
    extra_images: ['/images/products/mineral-water.png']
  }
];

export const INITIAL_RETAIL_ORDERS: RetailOrder[] = [];


export const INITIAL_BULK_ENQUIRIES: BulkEnquiry[] = [];


export const INITIAL_WHOLESALE_ORDERS: WholesaleOrder[] = [];

export const INITIAL_DEALERS: DealerRecord[] = [];

