import React from 'react';
import { Award, ShieldCheck, Factory, HeartHandshake, MapPin, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about-section" className="py-20 bg-gradient-to-b from-[#FFFEF7] via-[#F4F8F0] to-[#FFFEF7] border-t border-[#E6EBDD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Image / Visual Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden bg-white p-3 shadow-card border border-[#E6EBDD]">
              <div className="rounded-2xl overflow-hidden bg-[#F9FAF6] p-4 flex items-center justify-center">
                <img
                  src="/images/products/mango-bottle.png"
                  alt="JDM Fruit Products Bottling"
                  className="max-h-96 w-auto object-contain rounded-xl"
                />
              </div>

              {/* Verified Hyderabad Plant Badge */}
              <div className="mt-4 p-4 rounded-2xl bg-[#FFFEF7] border border-[#E6EBDD] flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#138443] text-white">
                  <MapPin className="w-5 h-5 text-[#8CC63E]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#183D2B]">JDM Fruit Products Pvt. Ltd.</div>
                  <div className="text-[11px] text-[#68756B]">Hyderabad, Telangana, India</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Company Story & Values */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#138443]/10 text-[#138443] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> About Juci Cool
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#183D2B] font-poppins leading-tight">
              Refreshing Taste. <br />
              <span className="text-[#138443]">Trusted Supply.</span>
            </h2>

            <p className="text-base text-[#183D2B] font-medium leading-relaxed">
              Juci Cool brings refreshing fruit drinks and delicious treats to customers and businesses. Explore our products for everyday enjoyment or contact our team for bulk supply and wholesale quotations.
            </p>

            <p className="text-sm text-[#68756B] leading-relaxed">
              Manufactured with pride by <strong>JDM Fruit Products Pvt. Ltd.</strong> in Hyderabad, our drinks celebrate authentic regional orchard flavors. From sun-ripened Alphonso and Totapuri mango nectar and aromatic pink guavas to tropical pineapple blends, our automated processing and bottling lines guarantee unmatched taste, hygiene, and freshness in every sip.
            </p>

            {/* 4 Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-[#E6EBDD] shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#8CC63E]/20 text-[#138443] flex-shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#183D2B]">Authentic Fruit Pulp</h4>
                  <p className="text-[11px] text-[#68756B] mt-0.5">Real fruit essence without harsh artificial aftertastes.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E6EBDD] shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#FFC928]/20 text-[#F7941D] flex-shrink-0">
                  <Factory className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#183D2B]">Modern Hyderabad Plant</h4>
                  <p className="text-[11px] text-[#68756B] mt-0.5">Automated filling, sterilization, and tamper-evident sealing.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E6EBDD] shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#138443]/15 text-[#138443] flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#183D2B]">Strict Quality Testing</h4>
                  <p className="text-[11px] text-[#68756B] mt-0.5">Batch-tested for microbiological purity and shelf life.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E6EBDD] shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#F7941D]/15 text-[#F7941D] flex-shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#183D2B]">Reliable Wholesale Partner</h4>
                  <p className="text-[11px] text-[#68756B] mt-0.5">Dedicated dealer margins and consistent weekly dispatch.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
