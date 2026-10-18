import React, { useState } from 'react';
import {
  Home,
  Sparkles,
  Building2,
  Truck,
  ShoppingBag,
  User,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BottomNavBar, NavItem } from './ui/bottom-nav-bar';

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
  const { isDealerRetailer, customerUser, isCustomerAuthenticated, openLoginModal } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);

  const items: NavItem[] = [
    {
      label: "Home",
      icon: Home,
      onClick: () => {
        setActiveIndex(0);
        onHomeClick();
      },
    },
    {
      label: "Drinks",
      icon: Sparkles,
      onClick: () => {
        setActiveIndex(1);
        onShopClick();
      },
    },
    {
      label: "Wholesale",
      icon: Building2,
      onClick: () => {
        setActiveIndex(2);
        onBulkClick();
      },
    },
    {
      label: "Cart",
      icon: ShoppingBag,
      badge: itemCount > 0 ? itemCount : undefined,
      onClick: () => {
        setActiveIndex(3);
        setIsCartOpen(true);
      },
    },
    {
      label: "Track",
      icon: Truck,
      onClick: () => {
        setActiveIndex(4);
        onTrackingClick();
      },
    },
    {
      label: isCustomerAuthenticated && customerUser ? customerUser.fullName.split(' ')[0] : "Account",
      icon: User,
      onClick: () => {
        setActiveIndex(5);
        openLoginModal('dealer');
      },
    },
  ];

  return (
    <>
      {/* Floating Mini Cart Alert Pill (Appears when items are in cart) */}
      {itemCount > 0 && (
        <div className="md:hidden fixed bottom-[74px] inset-x-3 z-40 animate-in slide-in-from-bottom-3 duration-300">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-gradient-to-r from-[#138443] to-[#0d6131] text-white py-2.5 px-3.5 rounded-2xl shadow-xl flex items-center justify-between border border-[#8CC63E]/40 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-xs backdrop-blur-sm">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                  <span>{itemCount} {itemCount === 1 ? 'item' : 'items'} added</span>
                  {isDealerRetailer && (
                    <span className="text-[9px] bg-[#FFC928] text-[#183D2B] font-black px-1.5 py-0.2 rounded-full uppercase">
                      Dealer
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-white/80 font-medium">
                  Total: <strong className="text-[#FFC928]">₹{total.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold bg-white text-[#138443] px-3 py-1.5 rounded-xl shadow-sm">
              <span>View Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      )}

      {/* Floating Animated Bottom Nav Bar */}
      <div className="md:hidden fixed inset-x-0 bottom-2.5 mx-auto z-40 w-fit flex justify-center px-2 pointer-events-auto">
        <BottomNavBar
          items={items}
          activeIndex={activeIndex}
          onItemSelect={(idx) => setActiveIndex(idx)}
          className="bg-white/95 backdrop-blur-xl border border-[#E6EBDD] shadow-[0_8px_30px_rgb(0,0,0,0.12)] ring-1 ring-black/5"
        />
      </div>
    </>
  );
};

export default MobileBottomNav;
