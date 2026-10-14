import React, { useState } from 'react';
import {
  ShoppingBag,
  Menu,
  X,
  Search,
  Truck,
  ShieldCheck,
  PhoneCall,
  Sparkles,
  Building2,
  User as UserIcon,
  Store,
  LogOut,
  ChevronDown,
  BadgePercent
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenBulkModal: () => void;
  onOpenTrackingModal: () => void;
  onOpenAdminPortal: () => void;
  onSelectCategory: (category: string) => void;
  onSearchChange: (search: string) => void;
  searchTerm: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBulkModal,
  onOpenTrackingModal,
  onOpenAdminPortal,
  onSelectCategory,
  onSearchChange,
  searchTerm,
}) => {
  const { itemCount, setIsCartOpen } = useCart();
  const {
    isAuthenticated,
    user,
    customerUser,
    isCustomerAuthenticated,
    isDealerRetailer,
    customerLogout,
    openLoginModal
  } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleNavClick = (catSlug?: string) => {
    if (catSlug) {
      onSelectCategory(catSlug);
    } else {
      onSelectCategory('all');
    }
    setMobileMenuOpen(false);
    const catalogEl = document.getElementById('product-catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFEF7]/95 backdrop-blur-md border-b border-[#E6EBDD] transition-all">
      {/* Top Banner Notice */}
      <div className="bg-[#138443] text-white text-xs font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center bg-[#8CC63E] text-[#183D2B] text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
              Direct Supply
            </span>
            <span>Real Fruit Beverages by JDM Fruit Products Pvt. Ltd., Hyderabad</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1 text-[#FFC928]">
              <Sparkles className="w-3.5 h-3.5" /> Free Retail Delivery on ₹100+
            </span>
            <button
              onClick={onOpenTrackingModal}
              className="hover:underline flex items-center gap-1 text-white/90 hover:text-white"
            >
              <Truck className="w-3.5 h-3.5" /> Track Order
            </button>
            <a href="tel:+919849012345" className="hidden md:flex items-center gap-1 text-white/90 hover:text-white">
              <PhoneCall className="w-3.5 h-3.5" /> +91 98490 12345
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <img
                src="/images/juci-cool-logo.png"
                alt="Juci Cool Logo"
                className="h-14 sm:h-16 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </a>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#183D2B]">
            <button
              onClick={() => { onSelectCategory('all'); scrollToSection('hero'); }}
              className="hover:text-[#138443] transition-colors font-semibold"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick()}
              className="hover:text-[#138443] transition-colors"
            >
              Shop Products
            </button>
            <button
              onClick={() => handleNavClick('mango-drinks')}
              className="hover:text-[#138443] transition-colors flex items-center gap-1"
            >
              <span className="w-2 h-2 rounded-full bg-[#FFC928]"></span> Mango Drinks
            </button>
            <button
              onClick={() => handleNavClick('fruit-drinks')}
              className="hover:text-[#138443] transition-colors flex items-center gap-1"
            >
              <span className="w-2 h-2 rounded-full bg-[#8CC63E]"></span> Fruit Drinks
            </button>
            <button
              onClick={() => handleNavClick('candy')}
              className="hover:text-[#138443] transition-colors flex items-center gap-1"
            >
              <span className="w-2 h-2 rounded-full bg-[#F7941D]"></span> Candy & Jelly
            </button>
            <button
              onClick={() => scrollToSection('about-section')}
              className="hover:text-[#138443] transition-colors"
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection('contact-section')}
              className="hover:text-[#138443] transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Actions & Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Search Input on Desktop */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search mango, candy, guava..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-48 xl:w-60 pl-8 pr-3 py-1.5 text-xs rounded-full border border-[#E6EBDD] bg-white focus:outline-none focus:border-[#138443] focus:ring-1 focus:ring-[#138443] transition-all"
              />
              <Search className="w-4 h-4 text-[#68756B] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden p-2 text-[#183D2B] hover:text-[#138443] hover:bg-[#E6EBDD]/50 rounded-full"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-white border border-[#E6EBDD] hover:border-[#138443] text-[#183D2B] rounded-full shadow-sm hover:shadow-md transition-all flex items-center justify-center group"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#138443] group-hover:scale-110 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F7941D] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Customer / Dealer Login & Profile Button */}
            {isCustomerAuthenticated && customerUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className={`flex items-center gap-2 py-1.5 px-3 rounded-full border text-xs font-bold transition-all shadow-sm ${
                    isDealerRetailer
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                      : customerUser.role === 'admin'
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-900 hover:bg-emerald-200'
                      : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  {customerUser.role === 'admin' ? (
                    <ShieldCheck className="w-4 h-4 text-[#138443]" />
                  ) : isDealerRetailer ? (
                    <Store className="w-4 h-4 text-[#138443]" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-[#F7941D]" />
                  )}
                  <span className="max-w-[120px] truncate">
                    {customerUser.fullName.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E6EBDD] py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-[#E6EBDD]">
                      <div className="text-xs font-bold text-[#183D2B]">{customerUser.fullName}</div>
                      <div className="text-[11px] text-[#68756B] truncate">{customerUser.email}</div>
                      {customerUser.businessName && (
                        <div className="text-[11px] font-semibold text-[#138443] mt-0.5">
                          {customerUser.businessName}
                        </div>
                      )}
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                        {customerUser.role === 'admin'
                          ? 'Admin Officer'
                          : isDealerRetailer
                          ? 'Dealer Account (Bulk Rates)'
                          : 'General Customer'}
                      </div>
                    </div>

                    {isDealerRetailer && (
                      <div className="px-4 py-2 bg-emerald-50/70 text-[11px] text-emerald-900 border-b border-emerald-100">
                        ⚡ Wholesale bulk pricing is active on your dealer account.
                      </div>
                    )}

                    {(customerUser.role === 'admin' || user?.role === 'admin') && (
                      <div className="p-1 border-b border-[#E6EBDD]">
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            onOpenAdminPortal();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#138443] hover:bg-emerald-50 rounded-xl transition-colors text-left"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#138443]" />
                          <span>Open Admin Console</span>
                        </button>
                      </div>
                    )}

                    <div className="p-1">
                      <button
                        onClick={() => {
                          customerLogout();
                          setShowUserDropdown(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openLoginModal('dealer')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-bold text-xs transition-all border border-[#138443]/30 bg-white hover:bg-emerald-50 text-[#138443] shadow-sm hover:shadow"
                title="Login with your account"
              >
                <UserIcon className="w-4 h-4 text-[#138443]" />
                <span>Login</span>
              </button>
            )}

            {/* Wholesale / Bulk Enquiry Button (HIGHLIGHTED) */}
            <button
              onClick={onOpenBulkModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-xs tracking-wide uppercase transition-all shadow-md bg-gradient-to-r from-[#138443] to-[#0d6131] hover:from-[#0d6131] hover:to-[#138443] text-white border border-[#FFC928]/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Building2 className="w-4 h-4 text-[#FFC928]" />
              <span>Get Bulk Prices</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#183D2B] hover:bg-[#E6EBDD]/50 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {showSearch && (
          <div className="md:hidden py-2 px-1 border-t border-[#E6EBDD]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search flavors, drinks, candy..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-[#E6EBDD] bg-white focus:outline-none focus:border-[#138443]"
                autoFocus
              />
              <Search className="w-4 h-4 text-[#68756B] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E6EBDD] bg-[#FFFEF7] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2 font-medium text-sm text-[#183D2B]">
            <button
              onClick={() => { onSelectCategory('all'); scrollToSection('hero'); }}
              className="text-left px-3 py-2 rounded-md hover:bg-[#E6EBDD]/60"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick()}
              className="text-left px-3 py-2 rounded-md hover:bg-[#E6EBDD]/60"
            >
              All Products
            </button>
            <button
              onClick={() => handleNavClick('mango-drinks')}
              className="text-left px-3 py-2 rounded-md hover:bg-[#E6EBDD]/60 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#FFC928]"></span> Mango Drinks
            </button>
            <button
              onClick={() => handleNavClick('fruit-drinks')}
              className="text-left px-3 py-2 rounded-md hover:bg-[#E6EBDD]/60 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#8CC63E]"></span> Fruit Drinks & Pulps
            </button>
            <button
              onClick={() => handleNavClick('candy')}
              className="text-left px-3 py-2 rounded-md hover:bg-[#E6EBDD]/60 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#F7941D]"></span> Candy & Fruit Jellies
            </button>
            <button
              onClick={() => scrollToSection('about-section')}
              className="text-left px-3 py-2 rounded-md hover:bg-[#E6EBDD]/60"
            >
              About JDM Fruit Products
            </button>
            <button
              onClick={() => scrollToSection('contact-section')}
              className="text-left px-3 py-2 rounded-md hover:bg-[#E6EBDD]/60"
            >
              Contact Hyderabad Office
            </button>
          </div>

          <div className="pt-3 border-t border-[#E6EBDD] flex flex-col gap-2">
            {isCustomerAuthenticated && customerUser ? (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#183D2B]">{customerUser.fullName}</div>
                  <div className="text-[10px] text-emerald-800 font-bold uppercase">
                    {customerUser.role === 'admin'
                      ? 'Administrator'
                      : isDealerRetailer
                      ? 'Dealer Account (Bulk Rates)'
                      : 'General Customer'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    customerLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-white border border-red-200 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openLoginModal('dealer');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-emerald-50 border border-emerald-300 text-[#138443]"
              >
                <UserIcon className="w-4 h-4 text-[#138443]" />
                <span>Login / Account</span>
              </button>
            )}

            {(customerUser?.role === 'admin' || user?.role === 'admin') && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminPortal();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-emerald-100 text-[#138443] border border-emerald-300"
              >
                <ShieldCheck className="w-4 h-4 text-[#138443]" />
                <span>Open Admin Console</span>
              </button>
            )}

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenBulkModal(); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-[#138443] text-white shadow"
            >
              <Building2 className="w-4 h-4 text-[#FFC928]" />
              <span>Wholesale / Bulk Orders</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenTrackingModal(); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm border border-[#E6EBDD] bg-white text-[#183D2B]"
            >
              <Truck className="w-4 h-4 text-[#138443]" />
              <span>Track Order Status</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
