import React from 'react';
import { Building2, TrendingUp, Truck, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

interface WholesaleSectionProps {
  onOpenBulkModal: () => void;
}

export const WholesaleSection: React.FC<WholesaleSectionProps> = ({ onOpenBulkModal }) => {
  return (
    <section className="py-10 sm:py-20 bg-[#138443] text-white relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 right-0 w-60 sm:w-96 h-60 sm:h-96 bg-[#8CC63E]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-60 sm:w-96 h-60 sm:h-96 bg-[#FFC928]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12 items-center">
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#FFC928] text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-white/20">
              <Building2 className="w-3.5 h-3.5" /> B2B Wholesale & Dealerships
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-poppins leading-tight">
              Grow Your Beverage Sales with <br />
              <span className="text-[#FFC928]">Factory-Direct Wholesale Supply</span>
            </h2>

            <p className="text-white/90 text-xs sm:text-base max-w-xl leading-relaxed">
              Supermarket, kirana store, canteen, or dealer? Get competitive carton wholesale rates and direct logistics dispatch from our Hyderabad manufacturing hub.
            </p>

            {/* Wholesale Features List */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-4 pt-1 sm:pt-2">
              <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 bg-white/10 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-white/10">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#8CC63E] shrink-0" />
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-white">High Margins</h4>
                  <p className="text-[10px] sm:text-[11px] text-white/80 mt-0.5 line-clamp-2">Strong reseller carton margins.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 bg-white/10 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-white/10">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFC928] shrink-0" />
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-white">Direct Dispatch</h4>
                  <p className="text-[10px] sm:text-[11px] text-white/80 mt-0.5 line-clamp-2">Regular logistics delivery across AP & TS.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 bg-white/10 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-white/10">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#8CC63E] shrink-0" />
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-white">GST Invoicing</h4>
                  <p className="text-[10px] sm:text-[11px] text-white/80 mt-0.5 line-clamp-2">Full input tax credit compliant.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 bg-white/10 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-white/10">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFC928] shrink-0" />
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-white">Custom Tiers</h4>
                  <p className="text-[10px] sm:text-[11px] text-white/80 mt-0.5 line-clamp-2">Personalized based on volume.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <button
                onClick={onOpenBulkModal}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide text-[#183D2B] bg-[#FFC928] hover:bg-[#ffbe0b] shadow-xl transition-all flex items-center justify-center gap-2 group active:scale-98"
              >
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#183D2B]" />
                <span>Request Custom Bulk Quotation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <span className="text-[11px] sm:text-xs text-white/80 text-center sm:text-left">
                Wholesale quotes provided via WhatsApp/Phone within 24 hours.
              </span>
            </div>
          </div>

          {/* Right Column: Packaging Card Highlight */}
          <div className="lg:col-span-5 mt-4 lg:mt-0">
            <div className="bg-white text-[#183D2B] p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#E6EBDD]">
                <div>
                  <h3 className="font-bold text-sm sm:text-base font-poppins">Standard Carton Packaging</h3>
                  <p className="text-[10px] sm:text-xs text-[#68756B]">Factory box configurations for retail shelves</p>
                </div>
                <span className="text-[10px] sm:text-xs font-bold bg-[#138443]/10 text-[#138443] px-2 py-0.5 rounded-full">
                  Wholesale MOQ
                </span>
              </div>

              <div className="space-y-2 sm:space-y-3 text-xs">
                <div className="flex justify-between p-2 sm:p-2.5 rounded-xl bg-[#F4F8F0]">
                  <div>
                    <span className="font-bold text-[#183D2B] text-xs">Mango 160ml Spout Pouch:</span>
                    <div className="text-[10px] text-[#68756B]">Child-safe resealable pouch</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#138443] text-xs">40 / Carton</span>
                    <div className="text-[10px] text-[#68756B]">MOQ: 5 Cartons (200 Units)</div>
                  </div>
                </div>

                <div className="flex justify-between p-2 sm:p-2.5 rounded-xl bg-[#F4F8F0]">
                  <div>
                    <span className="font-bold text-[#183D2B] text-xs">250ml PET Bottles:</span>
                    <div className="text-[10px] text-[#68756B]">Mango, Guava, Pineapple, Aloe</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#138443] text-xs">24 / Carton</span>
                    <div className="text-[10px] text-[#68756B]">MOQ: 5 Cartons (120 Units)</div>
                  </div>
                </div>

                <div className="flex justify-between p-2 sm:p-2.5 rounded-xl bg-[#F4F8F0]">
                  <div>
                    <span className="font-bold text-[#183D2B] text-xs">Candies & Jellies:</span>
                    <div className="text-[10px] text-[#68756B]">Mango & Guava Candies / Jelly Tubs</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#138443] text-xs">Shipper Case</span>
                    <div className="text-[10px] text-[#68756B]">MOQ: 40 - 50 Pouches</div>
                  </div>
                </div>
              </div>

              <div className="pt-1 text-center">
                <button
                  onClick={onOpenBulkModal}
                  className="w-full py-2.5 sm:py-3 rounded-xl font-bold text-xs bg-[#138443] hover:bg-[#0d6131] text-white transition-colors active:scale-98"
                >
                  Click Here to Select Cartons & Enquire
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
