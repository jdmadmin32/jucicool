import React, { useState, useEffect } from 'react';
import {
  fetchProducts,
  fetchCategories
} from './services/api';
import { Product, ProductCategory } from './types';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { Product3DModal } from './components/Product3DModal';
import { CartDrawer } from './components/CartDrawer';
import { RetailCheckoutModal } from './components/RetailCheckoutModal';
import { BulkEnquiryModal } from './components/BulkEnquiryModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { WholesaleSection } from './components/WholesaleSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminPortal } from './components/Admin/AdminPortal';
import { LoginModal } from './components/LoginModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import {
  Sparkles,
  Building2,
  RefreshCw,
  ShoppingBag,
  SlidersHorizontal
} from 'lucide-react';

export const MainApp: React.FC = () => {
  const [activeView, setActiveView] = useState<'storefront' | 'admin'>('storefront');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkProductPreselect, setBulkProductPreselect] = useState<Product | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);
  const [product3D, setProduct3D] = useState<Product | null>(null);
  const [trackingQuery, setTrackingQuery] = useState('');

  // Load products and categories from DB API
  const loadCatalog = async () => {
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([
        fetchCategories(),
        fetchProducts({
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          search: searchTerm ? searchTerm : undefined,
        }),
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch (err) {
      console.error('Failed to load catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, [selectedCategory, searchTerm]);

  // Handlers
  const handleOpenBulkForProduct = (prod: Product) => {
    setBulkProductPreselect(prod);
    setIsBulkModalOpen(true);
  };

  const handleOpenGeneralBulk = () => {
    setBulkProductPreselect(null);
    setIsBulkModalOpen(true);
  };

  const handleOrderSuccess = (orderNumber: string) => {
    setTrackingQuery(orderNumber);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('product-catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activeView === 'admin') {
    return <AdminPortal onBackToStore={() => setActiveView('storefront')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEF7] pb-20 md:pb-0">
      {/* Navbar */}
      <Navbar
        onOpenBulkModal={handleOpenGeneralBulk}
        onOpenTrackingModal={() => setIsTrackingModalOpen(true)}
        onOpenAdminPortal={() => setActiveView('admin')}
        onSelectCategory={(slug) => setSelectedCategory(slug)}
        onSearchChange={(query) => setSearchTerm(query)}
        searchTerm={searchTerm}
      />

      {/* Hero Section */}
      <Hero
        onShopClick={scrollToCatalog}
        onBulkClick={handleOpenGeneralBulk}
      />

      {/* Main Product Catalog Section */}
      <section id="product-catalog" className="py-8 sm:py-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-10 pb-4 sm:pb-6 border-b border-[#E6EBDD]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8CC63E]/20 text-[#138443] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1.5 sm:mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#138443]" /> Beverage & Sweets Catalog
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#183D2B] font-poppins">
              Refreshing Fruit Drinks & Sweets
            </h2>
            <p className="text-xs sm:text-sm text-[#68756B] mt-1 max-w-2xl">
              Authentic Indian orchard flavors in bottles, pouches, and tubs. Single units for retail; cartons for wholesale quotes.
            </p>
          </div>

          {/* Wholesale Distinction Banner */}
          <div className="bg-[#FFF8E7] border border-[#FFC928]/60 p-3 rounded-xl sm:rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 sm:p-2 bg-[#FFC928] text-[#183D2B] rounded-lg sm:rounded-xl flex-shrink-0">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-[#183D2B] block">Supermarket or Retailer?</span>
                <button
                  onClick={handleOpenGeneralBulk}
                  className="text-[#138443] font-bold hover:underline"
                >
                  Request custom bulk quotation &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Swipeable Category Pills (E-Commerce App Style) */}
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center justify-between gap-2 mb-2 sm:hidden px-1">
            <span className="text-[11px] font-bold text-[#183D2B] flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-[#138443]" /> Categories
            </span>
            <span className="text-[10px] text-[#68756B]">
              Swipe horizontally →
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all shrink-0 active:scale-95 ${
                selectedCategory === 'all'
                  ? 'bg-[#138443] text-white shadow-md'
                  : 'bg-white border border-[#E6EBDD] text-[#68756B] hover:text-[#183D2B] hover:border-[#138443]'
              }`}
            >
              All Products ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all shrink-0 active:scale-95 ${
                  selectedCategory === cat.slug
                    ? 'bg-[#138443] text-white shadow-md'
                    : 'bg-white border border-[#E6EBDD] text-[#68756B] hover:text-[#183D2B] hover:border-[#138443]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid: 2 Columns on Mobile, 3-4 on Tablet/Desktop */}
        {loading ? (
          <div className="py-20 text-center text-[#68756B] flex flex-col items-center justify-center">
            <RefreshCw className="w-7 h-7 animate-spin text-[#138443] mb-2" />
            <span className="text-xs sm:text-sm font-semibold">Loading refreshing drinks...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-[#E6EBDD] p-6 max-w-md mx-auto">
            <ShoppingBag className="w-10 h-10 text-[#68756B] mx-auto mb-2 opacity-40" />
            <h3 className="font-bold text-sm sm:text-base text-[#183D2B]">No products found</h3>
            <p className="text-xs text-[#68756B] mt-1">Try resetting the category filter or searching a different flavor.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}
              className="mt-3 px-4 py-2 text-xs font-bold rounded-xl bg-[#138443] text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {products.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onViewDetails={(p) => setDetailsProduct(p)}
                onEnquireBulk={(p) => handleOpenBulkForProduct(p)}
                onView3D={(p) => setProduct3D(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Dedicated Wholesale & B2B Section */}
      <WholesaleSection onOpenBulkModal={handleOpenGeneralBulk} />

      {/* About Section */}
      <AboutSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer
        onShopClick={scrollToCatalog}
        onBulkClick={handleOpenGeneralBulk}
        onTrackingClick={() => setIsTrackingModalOpen(true)}
        onCategoryClick={(catSlug) => {
          setSelectedCategory(catSlug);
          scrollToCatalog();
        }}
      />

      {/* Mobile Native App Bottom Navigation Bar */}
      <MobileBottomNav
        onHomeClick={scrollToTop}
        onShopClick={scrollToCatalog}
        onBulkClick={handleOpenGeneralBulk}
        onTrackingClick={() => setIsTrackingModalOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        onProceedCheckout={() => setIsCheckoutModalOpen(true)}
        onTransferToBulk={handleOpenGeneralBulk}
      />

      {/* Retail Checkout Modal */}
      <RetailCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onOrderSuccess={(orderNum) => handleOrderSuccess(orderNum)}
      />

      {/* Bulk Wholesale Enquiry Modal */}
      <BulkEnquiryModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        availableProducts={products}
        initialProduct={bulkProductPreselect}
      />

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={detailsProduct}
        onClose={() => setDetailsProduct(null)}
        onEnquireBulk={(p) => handleOpenBulkForProduct(p)}
        onOpen3DModal={(p) => {
          setDetailsProduct(null);
          setProduct3D(p);
        }}
      />

      {/* Interactive 3D Product Experience Modal */}
      <Product3DModal
        product={product3D}
        isOpen={Boolean(product3D)}
        onClose={() => setProduct3D(null)}
        onEnquireBulk={(p) => handleOpenBulkForProduct(p)}
      />

      {/* Live Order / Enquiry Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        defaultQuery={trackingQuery}
      />

      {/* Customer & Dealer Login / Register Modal */}
      <LoginModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
