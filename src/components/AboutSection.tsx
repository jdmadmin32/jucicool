import React from 'react';
import { Award, ShieldCheck, Factory, HeartHandshake, MapPin, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about-section" className="py-10 sm:py-20 bg-gradient-to-b from-[#FFFEF7] via-[#F4F8F0] to-[#FFFEF7] border-t border-[#E6EBDD]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12 items-center">
          {/* Left Column: Image / Visual Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white p-2.5 sm:p-3 shadow-card border border-[#E6EBDD]">
              <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-[#F9FAF6] p-3 sm:p-4 flex items-center justify-center">
                <img
                  src="/images/products/mango-bottle.png"
                  alt="JDM Fruit Products Bottling"
                  className="max-h-60 sm:max-h-96 w-auto object-contain rounded-lg sm:rounded-xl"
                />
              </div>

              {/* Verified Hyderabad Plant Badge */}
              <div className="mt-2.5 sm:mt-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FFFEF7] border border-[#E6EBDD] flex items-center gap-2.5 sm:gap-3">
                <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-[#138443] text-white shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#8CC63E]" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-[#183D2B]">JDM Fruit Products Pvt. Ltd.</div>
                  <div className="text-[10px] sm:text-[11px] text-[#68756B]">Hyderabad, Telangana, India</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Company Story & Values */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#138443]/10 text-[#138443] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> About Juci Cool
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#183D2B] font-poppins leading-tight">
              Refreshing Taste. <br />
              <span className="text-[#138443]">Trusted Supply.</span>
            </h2>

            <p className="text-xs sm:text-base text-[#183D2B] font-medium leading-relaxed">
              Juci Cool brings refreshing fruit drinks and delicious treats to retail customers and wholesale dealers across South India.
            </p>

            <p className="text-xs sm:text-sm text-[#68756B] leading-relaxed">
              Manufactured with pride by <strong>JDM Fruit Products Pvt. Ltd.</strong> in Hyderabad, our drinks celebrate authentic regional orchard flavors—from Alphonso mango nectar to pink guava and pineapple blends with strict automated sterilization.
            </p>

            {/* 4 Core Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-4 pt-1 sm:pt-2">
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-[#E6EBDD] shadow-sm flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#8CC63E]/20 text-[#138443] shrink-0">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#183D2B]">Real Fruit Pulp</h4>
                  <p className="text-[10px] sm:text-[11px] text-[#68756B] mt-0.5 line-clamp-2">Authentic fruit essence without harsh aftertastes.</p>
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-[#E6EBDD] shadow-sm flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#FFC928]/20 text-[#F7941D] shrink-0">
                  <Factory className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#183D2B]">Hyderabad Plant</h4>
                  <p className="text-[10px] sm:text-[11px] text-[#68756B] mt-0.5 line-clamp-2">Automated sterile bottling and sealing lines.</p>
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-[#E6EBDD] shadow-sm flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#138443]/15 text-[#138443] shrink-0">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#183D2B]">Quality Tested</h4>
                  <p className="text-[10px] sm:text-[11px] text-[#68756B] mt-0.5 line-clamp-2">Rigorous laboratory batch hygiene tests.</p>
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-[#E6EBDD] shadow-sm flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#F7941D]/15 text-[#F7941D] shrink-0">
                  <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#183D2B]">Wholesale Partner</h4>
                  <p className="text-[10px] sm:text-[11px] text-[#68756B] mt-0.5 line-clamp-2">Reliable dealer margins & scheduled delivery.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
