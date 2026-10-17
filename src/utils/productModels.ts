import { Product } from '../types';

export function getProductModelUrl(product?: Partial<Product> | null): string {
  if (!product) return '/models/beverage-default.glb';

  if (product.model_url && product.model_url.trim().length > 0) {
    return product.model_url;
  }

  const name = (product.name || '').toLowerCase();
  const pkg = (product.packaging_type || '').toLowerCase();
  const flavor = (product.flavor || '').toLowerCase();
  const slug = (product.category_slug || '').toLowerCase();

  // 1. Stand-up pouch
  if (name.includes('pouch') || pkg.includes('pouch')) {
    return '/models/mango-pouch.glb';
  }

  // 2. Candy
  if (name.includes('candy') || slug.includes('candy') || flavor.includes('candy')) {
    return '/models/candy-pack.glb';
  }

  // 3. Jelly tub
  if (name.includes('jelly') || slug.includes('jelly') || pkg.includes('tub')) {
    return '/models/fruit-jelly.glb';
  }

  // 4. Guava drink
  if (name.includes('guava') || flavor.includes('guava')) {
    return '/models/guava-bottle.glb';
  }

  // 5. Aloe Vera
  if (name.includes('aloe') || flavor.includes('aloe')) {
    return '/models/aloe-pineapple.glb';
  }

  // 6. Pineapple
  if (name.includes('pineapple') || flavor.includes('pineapple')) {
    return '/models/pineapple-bottle.glb';
  }

  // 7. Mineral water
  if (name.includes('water') || slug.includes('water') || name.includes('mineral')) {
    return '/models/mineral-water.glb';
  }

  // 8. Mango drink / bottle
  if (name.includes('mango') || flavor.includes('mango') || slug.includes('mango')) {
    return '/models/mango-bottle.glb';
  }

  // 9. Default fallback bottle
  return '/models/beverage-default.glb';
}
