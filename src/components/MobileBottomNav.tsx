import React from 'react';
import { Home, Sparkles, Building2, Truck, ShoppingBag, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface MobileBottomNavProps {
  onHomeClick: () => void;
  onShopClick: () => void;
  onBulkClick: () => void;
  onTrackingClick: () => void;
  currentView?: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onHomeClick,
  onShopClick,
  onBulkClick,
  onTrackingClick,
}) => {
  const { itemCount, total, setIsCartOpen } = useCart();
  const { isDealerRetailer } = useAuth();

  return (
    <>
      {/* Floating Mini Cart Notification Bar on Mobile (Appears when items are in cart) */}
      {itemCount > 0 && (
        <div className="md:hidden fixed bottom-[68px] left-3 right-3 z-40 animate-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-gradient-to-r from-[#138443] to-[#0d6131] text-white p-3 rounded-2xl shadow-xl flex items-center justify-between border border-[#8CC63E]/40 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold text-xs backdrop-blur-sm">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                  <span>{itemCount} {itemCount === 1 ? 'item' : 'items'} added</span>
                  {isDealerRetailer && (
                    <span className="text-[9px] bg-[#FFC928] text-[#183D2B] font-black px-1.5 py-0.2 rounded-full uppercase">
                      Dealer Rate
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-white/80 font-medium">
                  Total: <strong className="text-[#FFC928]">₹{total.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold bg-white text-[#138443] px-3 py-1.5 rounded-xl shadow-sm">
              <span>View Cart</span>
              <span className="text-sm">→</span>
            </div>
          </button>
        </div>
      )}

      {/* Main Native App-Style Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E6EBDD] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {/* 1. Home */}
          <button
            onClick={onHomeClick}
            className="flex flex-col items-center justify-center h-full text-[#68756B] active:text-[#138443] hover:text-[#138443] transition-colors"
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-semibold tracking-tight">Home</span>
          </button>

          {/* 2. Shop Catalog */}
          <button
            onClick={onShopClick}
            className="flex flex-col items-center justify-center h-full text-[#68756B] active:text-[#138443] hover:text-[#138443] transition-colors"
          >
            <Sparkles className="w-5 h-5 mb-0.5 text-[#138443]" />
            <span className="text-[10px] font-bold text-[#138443] tracking-tight">Shop</span>
          </button>

          {/* 3. Wholesale B2B (Special Center Icon) */}
          <button
            onClick={onBulkClick}
            className="flex flex-col items-center justify-center h-full -mt-2 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#138443] to-[#8CC63E] text-white flex items-center justify-center shadow-md shadow-[#138443]/30 border-2 border-white group-active:scale-95 transition-transform">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-bold text-[#138443] tracking-tight mt-0.5">Wholesale</span>
          </button>

          {/* 4. Track Order */}
          <button
            onClick={onTrackingClick}
            className="flex flex-col items-center justify-center h-full text-[#68756B] active:text-[#138443] hover:text-[#138443] transition-colors"
          >
            <Truck className="w-5 h-5 mb-0.5 text-[#68756B]" />
            <span className="text-[10px] font-semibold tracking-tight">Track</span>
          </button>

          {/* 5. Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center justify-center h-full text-[#68756B] active:text-[#138443] hover:text-[#138443] transition-colors relative"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 mb-0.5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#F7941D] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold tracking-tight">Cart</span>
          </button>
        </div>
      </nav>
    </>
  );
};
