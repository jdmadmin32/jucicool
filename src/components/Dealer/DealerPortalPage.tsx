import React, { useState, useEffect } from 'react';
import {
  Store,
  Building2,
  PackageCheck,
  TrendingUp,
  Percent,
  Truck,
  MessageCircle,
  PhoneCall,
  Search,
  LogOut,
  ArrowLeft,
  ShoppingCart,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Plus,
  Minus,
  ExternalLink,
  ShieldCheck,
  Boxes
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { fetchProducts, fetchCategories } from '../../services/api';
import { Product, ProductCategory } from '../../types';

interface DealerPortalPageProps {
  onBackToStore: () => void;
  onOpenCart?: () => void;
}

interface BulkOrderItem {
  product: Product;
  cartons: number;
}

export const DealerPortalPage: React.FC<DealerPortalPageProps> = ({ onBackToStore }) => {
  const { customerUser, customerLogout } = useAuth();
  const { addToCart, setIsCartOpen } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Bulk quantities per product (productId -> cartons count)
  const [cartonQuantities, setCartonQuantities] = useState<Record<number, number>>({});
  const [orderItems, setOrderItems] = useState<BulkOrderItem[]>([]);
  const [orderSentSuccess, setOrderSentSuccess] = useState(false);

  useEffect(() => {
    const loadWholesaleCatalog = async () => {
      setLoading(true);
      try {
        const [cats, prods] = await Promise.all([
          fetchCategories(),
          fetchProducts({
            category: selectedCategory === 'all' ? undefined : selectedCategory,
            search: searchTerm || undefined
          })
        ]);
        setCategories(cats);
        setProducts(prods);

        // Initialize default carton quantities to MOQ or 50
        const initialQty: Record<number, number> = {};
        prods.forEach(p => {
          initialQty[p.id] = p.min_wholesale_qty || 50;
        });
        setCartonQuantities(prev => ({ ...initialQty, ...prev }));
      } catch (err) {
        console.error('Failed to load dealer catalog:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWholesaleCatalog();
  }, [selectedCategory, searchTerm]);

  const updateQuantity = (productId: number, delta: number, minMoq: number) => {
    setCartonQuantities(prev => {
      const current = prev[productId] || minMoq;
      const next = Math.max(minMoq, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleSetCustomQuantity = (productId: number, val: number, minMoq: number) => {
    setCartonQuantities(prev => ({
      ...prev,
      [productId]: Math.max(minMoq, val || minMoq)
    }));
  };

  const handleAddWholesaleItem = (product: Product) => {
    const qty = cartonQuantities[product.id] || product.min_wholesale_qty || 50;
    
    // Add to local dealer wholesale order
    setOrderItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, cartons: item.cartons + qty } : item);
      }
      return [...prev, { product, cartons: qty }];
    });

    // Also add to global cart with wholesale price
    addToCart(product, qty);
  };

  const handleRemoveOrderItem = (productId: number) => {
    setOrderItems(prev => prev.filter(item => item.product.id !== productId));
  };

  // Calculations
  const unitsPerCarton = 24; // Standard industry beverage packaging (24 bottles/pouches per carton)

  const calculateWholesaleUnitRate = (product: Product) => {
    if (product.wholesale_price && product.wholesale_price > 0) {
      return product.wholesale_price;
    }
    // Default wholesale discount: 30% off retail price for verified dealers
    return Math.round(product.retail_price * 0.70 * 10) / 10;
  };

  const calculateCartonRate = (product: Product) => {
    const unitRate = calculateWholesaleUnitRate(product);
    return Math.round(unitRate * unitsPerCarton);
  };

  const calculateRetailCartonValue = (product: Product) => {
    return Math.round(product.retail_price * unitsPerCarton);
  };

  const calculateProfitMarginPercent = (product: Product) => {
    const unitRate = calculateWholesaleUnitRate(product);
    return Math.round(((product.retail_price - unitRate) / product.retail_price) * 100);
  };

  const totalOrderWholesaleValue = orderItems.reduce((acc, item) => {
    return acc + calculateCartonRate(item.product) * item.cartons;
  }, 0);

  const totalOrderRetailValue = orderItems.reduce((acc, item) => {
    return acc + calculateRetailCartonValue(item.product) * item.cartons;
  }, 0);

  const totalDealerSavings = totalOrderRetailValue - totalOrderWholesaleValue;

  const handleSendWhatsAppWholesaleOrder = () => {
    if (orderItems.length === 0) return;

    const dealerStore = customerUser?.businessName || customerUser?.fullName || 'Authorized Dealer';
    const dealerContact = customerUser?.phone || customerUser?.email || 'Registered Contact';

    const messageLines = [
      '📦 *OFFICIAL WHOLESALE DEALER ORDER — JUCI COOL* 📦',
      '━━━━━━━━━━━━━━━━━━━━━',
      `🏬 *Dealer Store:* ${dealerStore}`,
      `👤 *Contact:* ${dealerContact}`,
      `📍 *Account:* ${customerUser?.email || ''}`,
      '',
      '🛒 *WHOLESALE BULK ITEMS ORDERED:*',
      ...orderItems.map((item, idx) => {
        const cartonPrice = calculateCartonRate(item.product);
        const itemTotal = cartonPrice * item.cartons;
        return `${idx + 1}. *${item.product.name}* (${item.product.pack_size})\n   • Required: ${item.cartons} Cartons (${item.cartons * unitsPerCarton} Units)\n   • Wholesale Rate: ₹${cartonPrice}/Carton\n   • Subtotal: ₹${itemTotal.toLocaleString('en-IN')}`;
      }),
      '',
      '━━━━━━━━━━━━━━━━━━━━━',
      `💰 *Total Wholesale Invoice:* ₹${totalOrderWholesaleValue.toLocaleString('en-IN')}`,
      `📈 *Estimated Retail Sales Value:* ₹${totalOrderRetailValue.toLocaleString('en-IN')}`,
      `⚡ *Dealer Gross Margin:* ₹${totalDealerSavings.toLocaleString('en-IN')}`,
      '',
      'Please confirm factory dispatch timeline and warehouse freight details. Thank you!',
    ].join('\n');

    const whatsappUrl = `https://api.whatsapp.com/send?phone=919393122122&text=${encodeURIComponent(messageLines)}`;
    window.open(whatsappUrl, '_blank');
    setOrderSentSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5] flex flex-col text-[#183D2B]">
      {/* Top Dealer Header */}
      <header className="sticky top-0 z-40 bg-[#183D2B] text-white shadow-xl border-b border-[#138443]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo & Store details */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Return to Public Storefront"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Store</span>
            </button>

            <div className="h-6 w-px bg-white/20 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FFC928] to-[#F7941D] text-[#183D2B] flex items-center justify-center font-black shadow-md shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-extrabold tracking-tight font-poppins text-white">
                    {customerUser?.businessName || customerUser?.fullName || 'Authorized Dealer'}
                  </h1>
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-[#8CC63E] text-[#183D2B] uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3" /> Wholesale Rates Active
                  </span>
                </div>
                <p className="text-[11px] text-white/70">
                  Dealer Portal ID: <strong className="text-white">{customerUser?.email}</strong> • Direct Factory Supply
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://api.whatsapp.com/send?phone=919393122122&text=Hello%20Juci%20Cool%20Commercial%20Desk,%20this%20is%20authorized%20dealer%20calling%20regarding%20wholesale%20supply."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/50 text-[#8CC63E] text-xs font-bold hover:bg-[#25D366]/30 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Direct WhatsApp: +91 9393122122</span>
            </a>

            <button
              onClick={() => {
                customerLogout();
                onBackToStore();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-900/40 border border-rose-500/30 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dealer Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full space-y-6">
        {/* Dealer Privilege Overview Banner */}
        <div className="bg-gradient-to-r from-[#138443] via-[#0d6131] to-[#183D2B] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#FFC928]/20 border border-[#FFC928]/40 px-3 py-1 rounded-full text-xs font-bold text-[#FFC928]">
              <Sparkles className="w-3.5 h-3.5" /> Exclusive Wholesale Pricing Unlocked
            </div>
            
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-black font-poppins text-white leading-tight">
                Factory Wholesale Price Catalog & Bulk Order Desk
              </h2>
              <p className="text-xs sm:text-sm text-white/80 mt-1.5 leading-relaxed">
                As an authorized dealer, you receive direct manufacturer rates on cartons, minimum order quantity (MOQ) privileges, and direct dispatch priority from our Hyderabad facility.
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <div className="text-[11px] text-white/70">Average Margin</div>
                <div className="text-xl font-black text-[#FFC928]">30% – 40%</div>
                <div className="text-[10px] text-emerald-300">Retail Markup Profit</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <div className="text-[11px] text-white/70">Standard Packing</div>
                <div className="text-xl font-black text-white">24 Units / Box</div>
                <div className="text-[10px] text-white/70">Corrugated Cartons</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <div className="text-[11px] text-white/70">Dispatch Timeline</div>
                <div className="text-xl font-black text-[#8CC63E]">Within 24 Hours</div>
                <div className="text-[10px] text-emerald-300">Direct Road Freight</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <div className="text-[11px] text-white/70">Wholesale Desk</div>
                <div className="text-xl font-black text-white">9393122122</div>
                <div className="text-[10px] text-emerald-300">Priority WhatsApp Line</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E6EBDD] shadow-sm">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#138443] text-white shadow-sm'
                  : 'bg-[#F4F8F0] text-[#68756B] hover:text-[#183D2B]'
              }`}
            >
              All Wholesale Products
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === c.slug
                    ? 'bg-[#138443] text-white shadow-sm'
                    : 'bg-[#F4F8F0] text-[#68756B] hover:text-[#183D2B]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <input
              type="text"
              placeholder="Search wholesale drinks, bottles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Wholesale Order Desk / Active Items Drawer */}
        {orderItems.length > 0 && (
          <div className="bg-[#FFFEF7] border-2 border-[#138443] rounded-3xl p-5 shadow-lg space-y-4 animate-in fade-in slide-in-from-top-3">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E6EBDD]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#138443] text-white rounded-xl">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#183D2B]">
                    Active Bulk Wholesale Order ({orderItems.length} Products)
                  </h3>
                  <p className="text-[11px] text-[#68756B]">
                    Review selected cartons and send directly to Juci Cool Dispatch Desk on WhatsApp
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-[#68756B]">Total Wholesale Invoice:</div>
                  <div className="text-lg font-black text-[#138443]">
                    ₹{totalOrderWholesaleValue.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={handleSendWhatsAppWholesaleOrder}
                  className="px-5 py-2.5 rounded-2xl font-bold text-xs bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-[#25D366]/30 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                  <span>Send Order to WhatsApp (9393122122)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Selected Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {orderItems.map((item) => {
                const cartonPrice = calculateCartonRate(item.product);
                const subtotal = cartonPrice * item.cartons;
                return (
                  <div
                    key={item.product.id}
                    className="p-3 bg-white rounded-2xl border border-[#E6EBDD] flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.product.shot_image_url || item.product.image_url}
                        alt={item.product.name}
                        className="w-12 h-12 object-contain bg-[#F8FAF5] rounded-xl p-1 border border-[#E6EBDD] shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#183D2B] truncate">{item.product.name}</h4>
                        <div className="text-[11px] text-[#68756B]">
                          {item.cartons} Cartons ({item.cartons * unitsPerCarton} units)
                        </div>
                        <div className="text-xs font-extrabold text-[#138443]">
                          ₹{subtotal.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveOrderItem(item.product.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove from bulk order"
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Wholesale Products Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#183D2B] flex items-center gap-2">
              <Boxes className="w-5 h-5 text-[#138443]" />
              <span>Wholesale Products & Bulk Carton Rates</span>
            </h3>
            <span className="text-xs text-[#68756B] font-medium">
              Showing {products.length} Products
            </span>
          </div>

          {loading ? (
            <div className="p-16 text-center text-[#68756B]">
              <Sparkles className="w-8 h-8 animate-spin mx-auto text-[#138443] mb-3" />
              <p className="text-xs font-semibold">Loading wholesale catalog prices...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((p) => {
                const wholesaleUnit = calculateWholesaleUnitRate(p);
                const cartonPrice = calculateCartonRate(p);
                const retailCarton = calculateRetailCartonValue(p);
                const marginPercent = calculateProfitMarginPercent(p);
                const moq = p.min_wholesale_qty || 50;
                const selectedCartons = cartonQuantities[p.id] || moq;
                const totalItemWholesale = cartonPrice * selectedCartons;

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-3xl border border-[#E6EBDD] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 relative overflow-hidden group"
                  >
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-[#138443] border border-emerald-200">
                        {p.flavor}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                        ⚡ {marginPercent}% Margin
                      </span>
                    </div>

                    {/* Product Presentation */}
                    <div className="flex items-center gap-4 py-2">
                      <div className="w-24 h-28 bg-[#F4F8F0] rounded-2xl p-2 border border-[#E6EBDD] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <img
                          src={p.shot_image_url || p.image_url}
                          alt={p.name}
                          className="w-full h-full object-contain drop-shadow-md"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-sm font-bold text-[#183D2B] leading-tight">
                          {p.name}
                        </h4>
                        <div className="text-[11px] text-[#68756B]">
                          Pack: <strong>{p.pack_size}</strong> ({p.packaging_type})
                        </div>
                        <div className="text-[11px] text-[#68756B]">
                          Box Packing: <strong>{unitsPerCarton} units / Carton</strong>
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-700">
                          Min Order (MOQ): <strong>{moq} Cartons</strong>
                        </div>
                      </div>
                    </div>

                    {/* Wholesale Pricing Table */}
                    <div className="p-3 bg-[#F8FAF5] rounded-2xl border border-[#E6EBDD] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#68756B]">Wholesale Rate / Carton:</span>
                        <div className="text-right">
                          <span className="text-base font-black text-[#138443]">
                            ₹{cartonPrice}
                          </span>
                          <span className="text-[10px] text-slate-400 line-through ml-1.5">
                            ₹{retailCarton}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#E6EBDD]/60">
                        <span className="text-[#68756B]">Per Unit Cost:</span>
                        <span className="font-bold text-[#183D2B]">
                          ₹{wholesaleUnit} <span className="text-[10px] text-slate-400 font-normal">(MRP ₹{p.retail_price})</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-emerald-800 font-bold bg-emerald-50/80 px-2 py-1 rounded-lg">
                        <span>Your Gross Profit / Carton:</span>
                        <span>₹{retailCarton - cartonPrice}</span>
                      </div>
                    </div>

                    {/* Carton Quantity Selector & Add Button */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between gap-2">
                        <label className="text-[11px] font-bold text-[#183D2B]">
                          Order Cartons:
                        </label>
                        <div className="flex items-center gap-1 border border-[#E6EBDD] rounded-xl p-1 bg-white">
                          <button
                            onClick={() => updateQuantity(p.id, -10, moq)}
                            className="p-1 hover:bg-slate-100 rounded-lg text-slate-600"
                            title="Decrease cartons"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            min={moq}
                            value={selectedCartons}
                            onChange={(e) => handleSetCustomQuantity(p.id, parseInt(e.target.value) || moq, moq)}
                            className="w-16 text-center font-bold text-xs text-[#183D2B] focus:outline-none"
                          />
                          <button
                            onClick={() => updateQuantity(p.id, 10, moq)}
                            className="p-1 hover:bg-slate-100 rounded-lg text-slate-600"
                            title="Increase cartons"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-[10px] text-right text-[#68756B]">
                        Subtotal ({selectedCartons} Cartons = {selectedCartons * unitsPerCarton} units):{' '}
                        <strong className="text-[#138443]">₹{totalItemWholesale.toLocaleString('en-IN')}</strong>
                      </div>

                      <button
                        onClick={() => handleAddWholesaleItem(p)}
                        className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-[#138443] hover:bg-[#0d6131] text-white shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add {selectedCartons} Cartons to Bulk Order</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DealerPortalPage;
