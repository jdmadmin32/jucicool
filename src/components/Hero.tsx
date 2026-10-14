import React from 'react';
import { ShoppingBag, Building2, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
  onBulkClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onBulkClick }) => {
  return (
    <section id="hero" className="relative overflow-hidden pt-6 pb-16 lg:py-20 bg-gradient-to-b from-[#FFFEF7] via-[#F4F8F0] to-[#FFFEF7]">
      {/* Decorative Background Fruit Glows */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#8CC63E]/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute top-32 right-10 w-96 h-96 bg-[#FFC928]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-[#F7941D]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline and Call-to-Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#138443]/10 border border-[#138443]/20 text-[#138443] text-xs font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#138443] animate-ping"></span>
              FRESHNESS IN EVERY SIP
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-[#183D2B] leading-tight tracking-tight">
              Real Fruit. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#138443] via-[#8CC63E] to-[#F7941D]">
                Real Taste.
              </span>{' '}
              <br className="hidden sm:inline" />
              Juci Cool.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#68756B] max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Discover refreshing fruit drinks and delicious treats for every moment.
              Shop for yourself at approved retail prices or request special custom wholesale quotations for supermarkets, retail shops, and distributors.
            </p>

            {/* Key Quality Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-medium text-[#183D2B]">
              <span className="flex items-center gap-1.5 bg-white/90 border border-[#E6EBDD] px-3 py-1.5 rounded-full shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[#138443]" /> 100% Real Fruit Pulp
              </span>
              <span className="flex items-center gap-1.5 bg-white/90 border border-[#E6EBDD] px-3 py-1.5 rounded-full shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[#8CC63E]" /> Hyderabad Bottling Plant
              </span>
              <span className="flex items-center gap-1.5 bg-white/90 border border-[#E6EBDD] px-3 py-1.5 rounded-full shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[#F7941D]" /> Direct Factory Dispatch
              </span>
            </div>

            {/* Two Action CTAs (Retail vs Wholesale separation) */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onShopClick}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm tracking-wide text-white bg-[#138443] hover:bg-[#0d6131] shadow-lg shadow-[#138443]/25 hover:shadow-xl hover:shadow-[#138443]/30 transition-all flex items-center justify-center gap-2 group"
              >
                <ShoppingBag className="w-5 h-5 text-[#8CC63E] group-hover:scale-110 transition-transform" />
                <span>Shop Retail Drinks</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onBulkClick}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm tracking-wide text-[#183D2B] bg-[#FFC928] hover:bg-[#ffbe0b] border border-[#FFC928] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                <Building2 className="w-5 h-5 text-[#183D2B] group-hover:scale-110 transition-transform" />
                <span>Get Bulk Wholesale Prices</span>
              </button>
            </div>

            {/* Micro-notice explaining the two channels */}
            <div className="text-xs text-[#68756B] flex items-center justify-center lg:justify-start gap-2 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#138443]"></span>
              <span>Retail checkout starts at ₹10. Bulk price quotes provided privately for cartons.</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Card Wrapper */}
              <div className="relative rounded-3xl overflow-hidden bg-white p-3 sm:p-4 shadow-card border border-[#E6EBDD] transition-transform duration-500 hover:scale-[1.01]">
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-tr from-[#FFF7DE] via-[#F4F8F0] to-[#E9F4E3] border border-[#E6EBDD]/60 p-2">
                  <img
                    src="/images/juci-cool-master.png"
                    alt="Juci Cool Product Range"
                    className="w-full h-auto object-cover rounded-xl shadow-inner"
                  />
                  {/* Overlay Banner Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-[#E6EBDD] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F7941D]" />
                    <span className="text-xs font-bold text-[#183D2B]">Verified Product Lineup</span>
                  </div>
                </div>

                {/* Floating Highlights beneath preview */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-[#E6EBDD] text-center text-xs">
                  <div className="p-2 rounded-lg bg-[#FFFEF7] border border-[#E6EBDD]/60">
                    <div className="font-bold text-[#138443] text-sm">₹10 - ₹40</div>
                    <div className="text-[11px] text-[#68756B]">Retail Prices</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#FFFEF7] border border-[#E6EBDD]/60">
                    <div className="font-bold text-[#F7941D] text-sm">Carton MOQ</div>
                    <div className="text-[11px] text-[#68756B]">Wholesale Enquiries</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#FFFEF7] border border-[#E6EBDD]/60">
                    <div className="font-bold text-[#8CC63E] text-sm">Hyderabad</div>
                    <div className="text-[11px] text-[#68756B]">Direct Shipping</div>
                  </div>
                </div>
              </div>

              {/* Floating Leaf / Pill Tag Top Right */}
              <div className="absolute -top-4 -right-4 hidden sm:flex items-center gap-2 bg-[#138443] text-white px-4 py-2 rounded-2xl shadow-lg border border-white animate-float">
                <span className="text-xs font-bold">Real Fruit Mango & Guava</span>
              </div>

              {/* Floating Pill Tag Bottom Left */}
              <div className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-2 bg-white text-[#183D2B] px-4 py-2 rounded-2xl shadow-lg border border-[#E6EBDD] animate-float-delayed">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFC928]"></span>
                <span className="text-xs font-semibold">Bulk Quotes in 24 Hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
