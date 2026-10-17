import React, { useState } from 'react';
import { ShoppingBag, Building2, Sparkles, CheckCircle2, ArrowRight, Box, Image as ImageIcon } from 'lucide-react';
import ModelViewer from './ModelViewer';

interface HeroProps {
  onShopClick: () => void;
  onBulkClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onBulkClick }) => {
  const [show3D, setShow3D] = useState(false);
  return (
    <section id="hero" className="relative overflow-hidden pt-4 pb-10 sm:pt-6 sm:pb-16 lg:py-20 bg-gradient-to-b from-[#FFFEF7] via-[#F4F8F0] to-[#FFFEF7]">
      {/* Decorative Background Fruit Glows */}
      <div className="absolute top-5 left-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-[#8CC63E]/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute top-20 right-5 w-60 sm:w-96 h-60 sm:h-96 bg-[#FFC928]/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12 items-center">
          {/* Left Column: Headline and Call-to-Actions */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#138443]/10 border border-[#138443]/20 text-[#138443] text-[10px] sm:text-xs font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#138443] animate-ping"></span>
              FRESHNESS IN EVERY SIP
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl xl:text-6xl font-extrabold text-[#183D2B] leading-tight tracking-tight">
              Real Fruit.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#138443] via-[#8CC63E] to-[#F7941D]">
                Real Taste.
              </span>{' '}
              <br className="inline" />
              Juci Cool.
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-base text-[#68756B] max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Refreshing fruit drinks, mango juices, candies, and natural mineral water. Buy retail single packs or request wholesale distributor pricing directly from our Hyderabad plant.
            </p>

            {/* Key Quality Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 pt-1 text-[11px] sm:text-xs font-semibold text-[#183D2B]">
              <span className="flex items-center gap-1 bg-white/95 border border-[#E6EBDD] px-2.5 py-1 rounded-full shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#138443]" /> Real Fruit Pulp
              </span>
              <span className="flex items-center gap-1 bg-white/95 border border-[#E6EBDD] px-2.5 py-1 rounded-full shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8CC63E]" /> Hyderabad Plant
              </span>
              <span className="flex items-center gap-1 bg-white/95 border border-[#E6EBDD] px-2.5 py-1 rounded-full shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F7941D]" /> Direct Dispatch
              </span>
            </div>

            {/* Two Action CTAs (Retail vs Wholesale separation) */}
            <div className="pt-2 sm:pt-4 grid grid-cols-2 sm:flex sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-4">
              <button
                onClick={onShopClick}
                className="w-full sm:w-auto px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm tracking-wide text-white bg-[#138443] hover:bg-[#0d6131] shadow-lg shadow-[#138443]/20 transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#8CC63E]" />
                <span>Shop Retail</span>
                <ArrowRight className="hidden xs:inline w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />
              </button>

              <button
                onClick={onBulkClick}
                className="w-full sm:w-auto px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm tracking-wide text-[#183D2B] bg-[#FFC928] hover:bg-[#ffbe0b] border border-[#FFC928] shadow-md transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95"
              >
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#183D2B]" />
                <span className="truncate">Wholesale Rates</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative mt-2 sm:mt-0">
            <div className="relative mx-auto max-w-xs sm:max-w-md lg:max-w-none">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white p-2 sm:p-4 shadow-card border border-[#E6EBDD]">
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-tr from-[#FFF7DE] via-[#F4F8F0] to-[#E9F4E3] border border-[#E6EBDD]/60 p-2">
                  {/* Top Switcher & Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm border border-[#E6EBDD] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#F7941D]" />
                      <span className="text-[10px] sm:text-xs font-bold text-[#183D2B]">
                        {show3D ? 'Interactive 3D Model' : 'Verified Lineup'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShow3D(!show3D)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold border transition-all shadow-xs ${
                        show3D
                          ? 'bg-[#138443] text-white border-[#138443]'
                          : 'bg-white hover:bg-[#F2F8EC] text-[#183D2B] border-[#E6EBDD]'
                      }`}
                    >
                      <Box className={`w-3.5 h-3.5 ${show3D ? 'animate-spin' : 'text-[#138443]'}`} />
                      <span>{show3D ? 'Show 2D Banner' : 'View in 3D'}</span>
                    </button>
                  </div>

                  {show3D ? (
                    <div className="relative w-full h-[260px] sm:h-[310px] rounded-lg sm:rounded-xl overflow-hidden bg-white/40">
                      <ModelViewer
                        url="/models/mango-bottle.glb"
                        product={{ name: 'Juci Cool Mango Juice', flavor: 'Alphonso Mango', pack_size: '250 ml', packaging_type: 'PET Bottle' }}
                        width="100%"
                        height="100%"
                        environment="studio"
                        environmentIntensity={1.3}
                        exposure={1.05}
                        autoRotate={true}
                        autoRotateSpeed={0.6}
                        dragRotate={true}
                        turntable={false}
                        float={0.3}
                        shadow={true}
                        shadowOpacity={0.4}
                        fit={0.82}
                      />
                      <div className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold text-[#183D2B] border border-[#E6EBDD]">
                        3D Mango Bottle • Drag to rotate
                      </div>
                    </div>
                  ) : (
                    <img
                      src="/images/juci-cool-master.png"
                      alt="Juci Cool Product Range"
                      className="w-full h-auto object-cover rounded-lg sm:rounded-xl shadow-inner"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
