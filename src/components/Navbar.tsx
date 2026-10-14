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
  MapPin
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
    user,
    customerUser,
    isCustomerAuthenticated,
    isDealerRetailer,
    customerLogout,
    openLoginModal
  } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      {/* Top Banner Notice - Hidden or Compact on Mobile */}
      <div className="bg-[#138443] text-white text-[11px] sm:text-xs font-medium py-1 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-1.5 truncate">
            <span className="inline-flex items-center justify-center bg-[#8CC63E] text-[#183D2B] text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider shrink-0">
              Direct Supply
            </span>
            <span className="truncate">JDM Fruit Products, Hyderabad</span>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1 text-[#FFC928]">
              <Sparkles className="w-3.5 h-3.5" /> Free Retail Delivery on ₹100+
            </span>
            <button
              onClick={onOpenTrackingModal}
              className="hover:underline flex items-center gap-1 text-white/90 hover:text-white text-[11px]"
            >
              <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFC928]" />
              <span className="hidden xs:inline">Track Order</span>
            </button>
            <a
              href="tel:+919849012345"
              className="hidden md:flex items-center gap-1 text-white/90 hover:text-white"
            >
              <PhoneCall className="w-3.5 h-3.5" /> +91 98490 12345
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20 gap-2 sm:gap-4">
          {/* Logo & Location Tag */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => { onSelectCategory('all'); scrollToSection('hero'); }}
              className="flex items-center gap-2 group text-left"
            >
              <img
                src="/images/juci-cool-logo.png"
                alt="Juci Cool Logo"
                className="h-10 sm:h-16 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </button>

            {/* Mobile Location Badge (E-commerce app style) */}
            <div className="hidden xs:flex md:hidden items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[10px] text-[#138443] font-semibold">
              <MapPin className="w-3 h-3 text-[#138443]" />
              <span className="truncate max-w-[90px]">Hyderabad Factory</span>
            </div>
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Search Input */}
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

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:p-2.5 bg-white border border-[#E6EBDD] hover:border-[#138443] text-[#183D2B] rounded-full shadow-sm hover:shadow-md transition-all flex items-center justify-center group active:scale-95"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#138443] group-hover:scale-110 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F7941D] text-white text-[10px] sm:text-[11px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Customer / Dealer Login & Profile Button */}
            {isCustomerAuthenticated && customerUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className={`flex items-center gap-1.5 py-1 sm:py-1.5 px-2.5 sm:px-3 rounded-full border text-[11px] sm:text-xs font-bold transition-all shadow-sm ${
                    isDealerRetailer
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : customerUser.role === 'admin'
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                      : 'bg-amber-50 border-amber-300 text-amber-800'
                  }`}
                >
                  {customerUser.role === 'admin' ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#138443]" />
                  ) : isDealerRetailer ? (
                    <Store className="w-3.5 h-3.5 text-[#138443]" />
                  ) : (
                    <UserIcon className="w-3.5 h-3.5 text-[#F7941D]" />
                  )}
                  <span className="max-w-[70px] sm:max-w-[120px] truncate">
                    {customerUser.fullName.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
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
                className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full font-bold text-[11px] sm:text-xs transition-all border border-[#138443]/30 bg-white hover:bg-emerald-50 text-[#138443] shadow-sm active:scale-95"
                title="Login with your account"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#138443]" />
                <span>Login</span>
              </button>
            )}

            {/* Wholesale / Bulk Enquiry Button (Desktop) */}
            <button
              onClick={onOpenBulkModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-xs tracking-wide uppercase transition-all shadow-md bg-gradient-to-r from-[#138443] to-[#0d6131] hover:from-[#0d6131] hover:to-[#138443] text-white border border-[#FFC928]/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Building2 className="w-4 h-4 text-[#FFC928]" />
              <span>Get Bulk Prices</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-[#183D2B] hover:bg-[#E6EBDD]/50 rounded-lg active:scale-95"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* E-Commerce App Native Search Bar on Mobile */}
        <div className="md:hidden pb-2.5 pt-0.5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search mango drinks, candies, jellies..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-[#E6EBDD] bg-white text-[#183D2B] placeholder-[#68756B] shadow-inner focus:outline-none focus:border-[#138443] focus:ring-1 focus:ring-[#138443] transition-all"
            />
            <Search className="w-4 h-4 text-[#138443] absolute left-3 top-1/2 -translate-y-1/2" />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#68756B] hover:text-[#183D2B]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E6EBDD] bg-[#FFFEF7] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          <div className="flex flex-col space-y-1 font-medium text-xs text-[#183D2B]">
            <button
              onClick={() => { onSelectCategory('all'); scrollToSection('hero'); }}
              className="text-left px-3 py-2 rounded-xl hover:bg-[#E6EBDD]/60 font-bold"
            >
              🏠 Home
            </button>
            <button
              onClick={() => handleNavClick()}
              className="text-left px-3 py-2 rounded-xl hover:bg-[#E6EBDD]/60 font-semibold"
            >
              🛍️ All Products Catalog
            </button>
            <button
              onClick={() => handleNavClick('mango-drinks')}
              className="text-left px-3 py-2 rounded-xl hover:bg-[#E6EBDD]/60 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#FFC928]"></span> Mango Drinks & Juices
            </button>
            <button
              onClick={() => handleNavClick('fruit-drinks')}
              className="text-left px-3 py-2 rounded-xl hover:bg-[#E6EBDD]/60 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#8CC63E]"></span> Fruit Drinks & Pulps
            </button>
            <button
              onClick={() => handleNavClick('candy')}
              className="text-left px-3 py-2 rounded-xl hover:bg-[#E6EBDD]/60 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#F7941D]"></span> Candies & Fruit Jellies
            </button>
            <button
              onClick={() => scrollToSection('about-section')}
              className="text-left px-3 py-2 rounded-xl hover:bg-[#E6EBDD]/60"
            >
              ℹ️ About JDM Fruit Products
            </button>
            <button
              onClick={() => scrollToSection('contact-section')}
              className="text-left px-3 py-2 rounded-xl hover:bg-[#E6EBDD]/60"
            >
              📞 Contact Hyderabad Office
            </button>
          </div>

          <div className="pt-2 border-t border-[#E6EBDD] flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenBulkModal(); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#138443] text-white shadow-md"
            >
              <Building2 className="w-4 h-4 text-[#FFC928]" />
              <span>Wholesale Bulk Quotation Request</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenTrackingModal(); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs border border-[#E6EBDD] bg-white text-[#183D2B] font-semibold"
            >
              <Truck className="w-4 h-4 text-[#138443]" />
              <span>Track Order / Enquiry Status</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
