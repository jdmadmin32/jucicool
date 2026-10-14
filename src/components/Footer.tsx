import React, { useState } from 'react';
import { Building2, ShoppingBag, Truck, ShieldCheck, Heart, Sparkles, X } from 'lucide-react';

interface FooterProps {
  onShopClick: () => void;
  onBulkClick: () => void;
  onTrackingClick: () => void;
  onCategoryClick: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onShopClick,
  onBulkClick,
  onTrackingClick,
  onCategoryClick,
}) => {
  const [activePolicy, setActivePolicy] = useState<string | null>(null);

  const policies: Record<string, { title: string; content: string }> = {
    privacy: {
      title: 'Privacy Policy',
      content: `At Juci Cool (JDM Fruit Products Pvt. Ltd.), we prioritize your privacy. Customer names, mobile numbers, delivery addresses, and business information collected during retail checkout or wholesale price enquiries are strictly protected and used exclusively to process orders, fulfill shipments, and provide requested price quotations. We do not sell or trade customer information with third parties.`,
    },
    terms: {
      title: 'Terms & Conditions',
      content: `1. Retail Prices: Regular customer prices are set per individual pack size as approved by management.
2. Wholesale Enquiries: Wholesale quotations are tailored based on requested carton volumes, verified trade credentials, and dispatch hubs. Quotations remain confidential between JDM Fruit Products Pvt. Ltd. and the verified dealer.
3. Inventory: Deliveries are subject to stock availability at the Hyderabad bottling facility.`,
    },
    returns: {
      title: 'Returns & Refunds Policy',
      content: `Beverages and confectionery products are perishable food items. In the unlikely event of receiving damaged bottles, leakages, or packaging defects, customers must notify our customer care within 24 hours of delivery with photographic proof for an immediate replacement or full refund.`,
    },
    shipping: {
      title: 'Shipping Policy',
      content: `Retail orders within the Twin Cities (Hyderabad & Secunderabad) are fulfilled within 24–48 hours. Regional orders across Telangana and Andhra Pradesh are dispatched within 2–4 business days via verified logistics partners. Bulk wholesale consignments are dispatched directly from our Hyderabad factory via freight trucks upon advance receipt.`,
    },
  };

  return (
    <footer className="bg-[#183D2B] text-white pt-16 pb-12 border-t border-[#E6EBDD]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/images/juci-cool-logo.png"
                alt="Juci Cool Logo"
                className="h-16 w-auto object-contain bg-white/95 p-1.5 rounded-xl shadow-md"
              />
            </div>
            <p className="text-xs text-white/80 leading-relaxed max-w-sm">
              <strong>Juci Cool</strong> is a trademark fruit beverage brand manufactured by <strong>JDM Fruit Products Pvt. Ltd.</strong>, Hyderabad. Bringing the joy of real fruit drinks and candies to families and businesses across India.
            </p>
            <div className="text-xs text-white/70 space-y-1">
              <div>Hyderabad, Telangana, India</div>
              <div>Customer Care: +91 98490 12345</div>
              <div>Email: info@jucicool.com</div>
            </div>
          </div>

          {/* Product Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold font-poppins text-[#FFC928] uppercase tracking-wider">
              Product Categories
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <button onClick={() => onCategoryClick('fruit-drinks')} className="hover:text-[#8CC63E] transition-colors">
                  Fruit Drinks (Spout Pouches & Bottles)
                </button>
              </li>
              <li>
                <button onClick={() => onCategoryClick('mango-drinks')} className="hover:text-[#8CC63E] transition-colors">
                  Mango Drinks & Pure Pulps
                </button>
              </li>
              <li>
                <button onClick={() => onCategoryClick('fruit-drinks')} className="hover:text-[#8CC63E] transition-colors">
                  Pink Guava & Tropical Pineapple
                </button>
              </li>
              <li>
                <button onClick={() => onCategoryClick('candy')} className="hover:text-[#8CC63E] transition-colors">
                  Flavored Candies (Mango & Guava)
                </button>
              </li>
              <li>
                <button onClick={() => onCategoryClick('jelly')} className="hover:text-[#8CC63E] transition-colors">
                  Mixed Fruit Jelly Tubs
                </button>
              </li>
              <li>
                <button onClick={() => onCategoryClick('mineral-water')} className="hover:text-[#8CC63E] transition-colors">
                  Natural Mineral Water
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Business Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold font-poppins text-[#8CC63E] uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <button onClick={onShopClick} className="hover:text-white transition-colors">
                  Shop Retail Drinks
                </button>
              </li>
              <li>
                <button onClick={onBulkClick} className="text-[#FFC928] font-bold hover:underline">
                  Get Bulk Wholesale Prices
                </button>
              </li>
              <li>
                <button onClick={onTrackingClick} className="hover:text-white transition-colors">
                  Track Order / Enquiry
                </button>
              </li>
              <li>
                <a href="#about-section" className="hover:text-white transition-colors">
                  About JDM Fruit Products
                </a>
              </li>
              <li>
                <a href="#contact-section" className="hover:text-white transition-colors">
                  Contact Office
                </a>
              </li>
            </ul>
          </div>

          {/* Policies & Assurances */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold font-poppins text-white uppercase tracking-wider">
              Policies & Support
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <button onClick={() => setActivePolicy('privacy')} className="hover:text-[#8CC63E] transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActivePolicy('terms')} className="hover:text-[#8CC63E] transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => setActivePolicy('returns')} className="hover:text-[#8CC63E] transition-colors">
                  Returns & Refunds Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActivePolicy('shipping')} className="hover:text-[#8CC63E] transition-colors">
                  Shipping & Delivery Logistics
                </button>
              </li>
            </ul>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8CC63E] bg-white/10 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-[#FFC928]" /> 100% Quality & Freshness Guarantee
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div>
            © {new Date().getFullYear()} Juci Cool — JDM Fruit Products Pvt. Ltd. All rights reserved. Hyderabad, Telangana.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Real Fruit. Real Taste. Always.
            </span>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {activePolicy && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-[#183D2B] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E6EBDD] animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6EBDD]">
              <h3 className="font-bold text-lg font-poppins text-[#183D2B]">
                {policies[activePolicy].title}
              </h3>
              <button
                onClick={() => setActivePolicy(null)}
                className="p-1.5 text-slate-400 hover:text-[#183D2B] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 text-xs text-[#68756B] leading-relaxed whitespace-pre-line">
              {policies[activePolicy].content}
            </div>
            <div className="pt-3 border-t border-[#E6EBDD] flex justify-end">
              <button
                onClick={() => setActivePolicy(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#138443] text-white hover:bg-[#0d6131]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
