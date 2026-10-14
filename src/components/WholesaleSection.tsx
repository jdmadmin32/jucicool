import React from 'react';
import { Building2, TrendingUp, Truck, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

interface WholesaleSectionProps {
  onOpenBulkModal: () => void;
}

export const WholesaleSection: React.FC<WholesaleSectionProps> = ({ onOpenBulkModal }) => {
  return (
    <section className="py-20 bg-[#138443] text-white relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#8CC63E]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFC928]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FFC928] text-xs font-bold uppercase tracking-wider border border-white/20">
              <Building2 className="w-3.5 h-3.5" /> B2B Wholesale & Dealerships
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-poppins leading-tight">
              Grow Your Beverage Sales with <br />
              <span className="text-[#FFC928]">Factory-Direct Wholesale Supply</span>
            </h2>

            <p className="text-white/90 text-base max-w-xl leading-relaxed">
              Are you a grocery supermarket, retail shop owner, distributor, or school canteen contractor?
              Get exclusive trade pricing, marketing support, and priority warehouse dispatch directly from our Hyderabad plant.
            </p>

            {/* Wholesale Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm border border-white/10">
                <TrendingUp className="w-5 h-5 text-[#8CC63E] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">High Retail Margins</h4>
                  <p className="text-[11px] text-white/80 mt-0.5">Competitive carton wholesale pricing designed for strong reseller profitability.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm border border-white/10">
                <Truck className="w-5 h-5 text-[#FFC928] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Scheduled Logistics</h4>
                  <p className="text-[11px] text-white/80 mt-0.5">Prompt factory-to-door shipping across Twin Cities and regional Telangana districts.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm border border-white/10">
                <FileText className="w-5 h-5 text-[#8CC63E] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">GST Invoicing</h4>
                  <p className="text-[11px] text-white/80 mt-0.5">100% tax compliant input credit with formalized formal quotes.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-[#FFC928] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Custom Tier Quotations</h4>
                  <p className="text-[11px] text-white/80 mt-0.5">Quotes personalized to your carton requirements and order frequency.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <button
                onClick={onOpenBulkModal}
                className="px-8 py-4 rounded-xl font-bold text-sm tracking-wide text-[#183D2B] bg-[#FFC928] hover:bg-[#ffbe0b] shadow-xl transition-all flex items-center gap-2 group"
              >
                <Building2 className="w-5 h-5 text-[#183D2B]" />
                <span>Request Custom Bulk Quotation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <span className="text-xs text-white/80">
                Wholesale prices remain private. Quotes sent via Phone/WhatsApp within 24 hours.
              </span>
            </div>
          </div>

          {/* Right Column: Packaging Card Highlight */}
          <div className="lg:col-span-5">
            <div className="bg-white text-[#183D2B] p-6 rounded-3xl shadow-2xl border border-white/20 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6EBDD]">
                <div>
                  <h3 className="font-bold text-base font-poppins">Standard Carton Packaging</h3>
                  <p className="text-xs text-[#68756B]">Factory box configurations for retail shelves</p>
                </div>
                <span className="text-xs font-bold bg-[#138443]/10 text-[#138443] px-2.5 py-1 rounded-full">
                  Wholesale MOQ
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between p-2.5 rounded-xl bg-[#F4F8F0]">
                  <div>
                    <span className="font-bold text-[#183D2B]">Mango 160ml Spout Pouch:</span>
                    <div className="text-[11px] text-[#68756B]">Child-safe spout pouches</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#138443]">40 Pouches / Carton</span>
                    <div className="text-[11px] text-[#68756B]">MOQ: 5 Cartons (200 Units)</div>
                  </div>
                </div>

                <div className="flex justify-between p-2.5 rounded-xl bg-[#F4F8F0]">
                  <div>
                    <span className="font-bold text-[#183D2B]">250ml PET Bottles (All Flavors):</span>
                    <div className="text-[11px] text-[#68756B]">Mango, Guava, Pineapple, Aloe</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#138443]">24 Bottles / Carton</span>
                    <div className="text-[11px] text-[#68756B]">MOQ: 5 Cartons (120 Units)</div>
                  </div>
                </div>

                <div className="flex justify-between p-2.5 rounded-xl bg-[#F4F8F0]">
                  <div>
                    <span className="font-bold text-[#183D2B]">Flavored Candies & Jellies:</span>
                    <div className="text-[11px] text-[#68756B]">Mango & Guava Candies / Jelly Tubs</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#138443]">Assorted Shipper Case</span>
                    <div className="text-[11px] text-[#68756B]">MOQ: 40 - 50 Pouches</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={onOpenBulkModal}
                  className="w-full py-3 rounded-xl font-bold text-xs bg-[#138443] hover:bg-[#0d6131] text-white transition-colors"
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
