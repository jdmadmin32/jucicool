import React from 'react';
import {
  ArrowLeft,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  Factory,
  Globe2,
  HeartHandshake,
  MapPin,
  PhoneCall,
  Quote,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck
} from 'lucide-react';

interface ChairmanProfilePageProps {
  onBackToStore: () => void;
  onOpenBulkModal: () => void;
}

export const ChairmanProfilePage: React.FC<ChairmanProfilePageProps> = ({
  onBackToStore,
  onOpenBulkModal,
}) => {
  return (
    <div className="min-h-screen bg-[#FFFEF7] text-[#183D2B]">
      {/* Top Breadcrumb & Return Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E6EBDD] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-[#E6EBDD] hover:bg-[#F4F8F0] text-[#183D2B] font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-[#138443]" />
              <span>Back to Storefront</span>
            </button>
            <div className="hidden sm:block border-l border-[#E6EBDD] pl-3">
              <span className="text-xs font-bold text-[#183D2B]">Leadership & Founder Profile</span>
              <span className="text-[10px] text-[#68756B] block">JDM Fruit Products Pvt. Ltd.</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBulkModal}
              className="px-3 sm:px-4 py-1.5 bg-[#138443] hover:bg-[#0d6131] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Commercial Enquiry &rarr;
            </button>
          </div>
        </div>
      </header>

      {/* Hero Header Section */}
      <section className="relative bg-gradient-to-br from-[#183D2B] via-[#0d6131] to-[#138443] text-white py-12 sm:py-20 overflow-hidden">
        {/* Subtle background ornamentation */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8CC63E_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#8CC63E]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            {/* Portrait & Profile Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="relative rounded-3xl overflow-hidden bg-white/10 p-2 border border-white/20 shadow-2xl backdrop-blur-md">
                  <div className="rounded-2xl overflow-hidden bg-gradient-to-b from-[#183D2B]/80 to-[#138443]/90 aspect-[4/5] flex flex-col items-center justify-center p-6 text-center relative">
                    {/* Executive Portrait Photo */}
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-[#FFC928] via-white to-[#8CC63E] p-1.5 shadow-2xl mb-4 overflow-hidden">
                      <img
                        src="/images/chairman.jpg"
                        alt="Mr. A. Chandra Sheker Reddy - Chairman & Managing Director"
                        className="w-full h-full object-cover object-top rounded-full bg-[#183D2B]"
                      />
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white font-poppins tracking-tight">
                      Mr. A. Chandra Sheker Reddy
                    </h3>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFC928] text-[#183D2B] text-xs font-black uppercase tracking-wider mt-2 shadow-sm">
                      <UserCheck className="w-3.5 h-3.5" /> Founder & Managing Director
                    </div>
                    <p className="text-xs text-white/80 mt-2 font-medium">
                      JDM Fruit Products Pvt. Ltd.
                    </p>

                    <div className="mt-4 pt-3 border-t border-white/15 w-full flex justify-around text-center text-white/90">
                      <div>
                        <div className="text-xs text-white/60 uppercase text-[10px] font-bold">Founded</div>
                        <div className="font-extrabold text-sm text-[#FFC928]">2012</div>
                      </div>
                      <div className="border-r border-white/15" />
                      <div>
                        <div className="text-xs text-white/60 uppercase text-[10px] font-bold">Base</div>
                        <div className="font-extrabold text-sm">Medchal, TS</div>
                      </div>
                      <div className="border-r border-white/15" />
                      <div>
                        <div className="text-xs text-white/60 uppercase text-[10px] font-bold">Focus</div>
                        <div className="font-extrabold text-sm text-[#8CC63E]">Beverages</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Official Plant Badge */}
                <div className="absolute -bottom-4 -right-2 bg-white text-[#183D2B] px-3.5 py-2 rounded-2xl shadow-xl border border-[#E6EBDD] flex items-center gap-2 text-xs font-bold">
                  <Factory className="w-4 h-4 text-[#138443]" />
                  <span>Ravakole Eco Park</span>
                </div>
              </div>
            </div>

            {/* Intro Content */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-[#FFC928]" /> Executive Leadership Profile
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-poppins leading-tight">
                Built on Manufacturing Experience. <br />
                <span className="text-[#FFC928]">Driven by Quality.</span>
              </h1>

              <p className="text-sm sm:text-lg text-white/90 leading-relaxed font-normal">
                <strong>Mr. A. Chandra Sheker Reddy</strong> is the entrepreneur behind the establishment and development of <strong>JDM Fruit Products Pvt. Ltd.</strong> Under his stewardship, the enterprise has grown into a technologically advanced beverage manufacturing powerhouse based at Sri Siddi Vinayaka Eco Industrial Park, Medchal, Telangana.
              </p>

              <div className="bg-white/10 rounded-2xl p-4 sm:p-5 border border-white/15 backdrop-blur-sm space-y-2">
                <div className="flex items-start gap-2.5">
                  <Quote className="w-6 h-6 text-[#8CC63E] shrink-0 mt-0.5 opacity-80" />
                  <p className="text-xs sm:text-sm text-white/95 italic leading-relaxed">
                    "Our focus from day one has been combining robust manufacturing infrastructure, strict quality testing, high operational readiness, and transparent customer relationships to deliver authentic fruit drinks across South India."
                  </p>
                </div>
                <div className="text-right text-[11px] text-[#FFC928] font-bold">
                  — Mr. A. Chandra Sheker Reddy, Managing Director
                </div>
              </div>

              {/* Highlights Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                  <span className="text-[10px] text-white/70 block uppercase font-bold">Experience</span>
                  <span className="text-xs font-extrabold text-white">Since 2012 (14+ Yrs)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                  <span className="text-[10px] text-white/70 block uppercase font-bold">Key Partners</span>
                  <span className="text-xs font-extrabold text-[#FFC928]">Tata & Reliance</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-white/70 block uppercase font-bold">Facility Area</span>
                  <span className="text-xs font-extrabold text-[#8CC63E]">4.5 Acres Industrial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Biography & Detailed Story */}
      <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
          {/* Left Column: Detailed Narrative */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl sm:text-3xl font-extrabold text-[#183D2B] font-poppins">
                Founder's Vision & Industrial Legacy
              </h2>
              <div className="w-16 h-1 bg-[#138443] rounded-full" />
              <p className="text-xs sm:text-base text-[#183D2B]/90 leading-relaxed">
                Mr. A. Chandra Sheker Reddy is identified in the company presentation as the Managing Director of JDM Fruit Products Pvt. Ltd. He is the entrepreneur behind the establishment and development of the company’s beverage manufacturing operations.
              </p>
              <p className="text-xs sm:text-base text-[#68756B] leading-relaxed">
                Under his leadership, JDM has built a comprehensive manufacturing base in Medchal, Telangana, and developed dedicated production capabilities for PET bottle and cup-filling formats. The company’s presentation highlights a steadfast focus on plant infrastructure, production readiness, in-house quality testing facilities, and seamless connectivity to key commercial markets in South India.
              </p>
            </div>

            {/* Strategic Manufacturing Milestones */}
            <div className="bg-[#F9FAF6] border border-[#E6EBDD] p-5 sm:p-7 rounded-3xl space-y-5">
              <h3 className="text-base sm:text-xl font-bold text-[#183D2B] font-poppins flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#138443]" /> Key Milestones & Corporate Alliances
              </h3>
              <p className="text-xs sm:text-sm text-[#68756B] leading-relaxed">
                Under Mr. Reddy’s direction, JDM’s manufacturing excellence has attracted long-term partnerships with leading Indian conglomerates:
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-white rounded-2xl border border-[#E6EBDD] shadow-xs flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-[#138443] shrink-0 font-bold text-xs">
                    2014–2024
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#183D2B]">Tata Consumer Products Alliance</h4>
                    <p className="text-xs text-[#68756B] mt-0.5 leading-relaxed">
                      The company presentation records a decade-long production association for Tata Consumer Products from 2014 to 2024, demonstrating consistent conformity with the nation’s strictest quality benchmarks.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#E6EBDD] shadow-xs flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#FFC928]/30 text-[#183D2B] shrink-0 font-bold text-xs">
                    Dec 2025
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#183D2B]">Reliance Commercial Production</h4>
                    <p className="text-xs text-[#68756B] mt-0.5 leading-relaxed">
                      Commercial beverage production for Reliance commenced on 30 December 2025, marking an expansive new phase in co-manufacturing and packaging versatility.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#E6EBDD] shadow-xs flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#8CC63E]/30 text-[#183D2B] shrink-0 font-bold text-xs">
                    2012–Present
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#183D2B]">Proprietary Brand: Juci Cool</h4>
                    <p className="text-xs text-[#68756B] mt-0.5 leading-relaxed">
                      Hot-fill fruit beverages in PET bottles and standee pouches, bringing authentic Alphonso mango, pink guava, pineapple, jelly tubs, and mineral water to retail and wholesale markets.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Leadership Priorities */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-xl font-bold text-[#183D2B] font-poppins">
                Executive Leadership Priorities
              </h3>
              <p className="text-xs sm:text-sm text-[#68756B] leading-relaxed">
                As Managing Director, Mr. Reddy’s role is associated with the company’s ongoing manufacturing operations, engineering enhancements, and strategic business development:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-white border border-[#E6EBDD] shadow-xs space-y-1">
                  <div className="flex items-center gap-2 text-[#138443] font-bold text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#138443]" /> Uncompromising Quality
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#68756B] leading-relaxed">
                    Personal oversight of automated testing, in-house laboratory controls, microbiological verification, and sensory testing.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E6EBDD] shadow-xs space-y-1">
                  <div className="flex items-center gap-2 text-[#138443] font-bold text-xs sm:text-sm">
                    <Factory className="w-4 h-4 text-[#138443]" /> Operational Efficiency
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#68756B] leading-relaxed">
                    High line speed optimization (up to 140 BPM per line) and 20-hour operational uptime planning to meet surge seasonal demands.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E6EBDD] shadow-xs space-y-1">
                  <div className="flex items-center gap-2 text-[#138443] font-bold text-xs sm:text-sm">
                    <HeartHandshake className="w-4 h-4 text-[#138443]" /> Partner & Customer Centricity
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#68756B] leading-relaxed">
                    Direct access for dealers, institutional buyers, and co-packing partners with flexible carton configurations.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E6EBDD] shadow-xs space-y-1">
                  <div className="flex items-center gap-2 text-[#138443] font-bold text-xs sm:text-sm">
                    <Building2 className="w-4 h-4 text-[#138443]" /> Sustainable Infrastructure
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#68756B] leading-relaxed">
                    Integration of 300 kW solar power, RO groundwater replenishment, and accommodation infrastructure for industrial personnel.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Corporate Plant Summary & Quick Facts */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E6EBDD] shadow-sm space-y-4">
              <h3 className="font-bold text-sm sm:text-base text-[#183D2B] font-poppins pb-3 border-b border-[#E6EBDD]">
                Corporate Profile Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#68756B] block text-[11px]">Managing Director</span>
                  <strong className="text-[#183D2B] text-sm">Mr. A. Chandra Sheker Reddy</strong>
                </div>

                <div>
                  <span className="text-[#68756B] block text-[11px]">Company Name</span>
                  <strong className="text-[#183D2B]">JDM Fruit Products Pvt. Ltd.</strong>
                </div>

                <div>
                  <span className="text-[#68756B] block text-[11px]">Established</span>
                  <strong className="text-[#183D2B]">2012 (14+ Years Operations)</strong>
                </div>

                <div>
                  <span className="text-[#68756B] block text-[11px]">Facility Location</span>
                  <span className="text-[#183D2B] leading-tight block">
                    Sri Siddi Vinayaka Eco Industrial Park, Ravakole Village, Medchal Mandal, Telangana
                  </span>
                </div>

                <div>
                  <span className="text-[#68756B] block text-[11px]">Land & Built-up</span>
                  <strong className="text-[#183D2B]">4.5 Acres Land • 105,000 sq. ft. Expansion</strong>
                </div>

                <div>
                  <span className="text-[#68756B] block text-[11px]">Green Energy</span>
                  <strong className="text-[#138443]">300 kW Installed Solar System</strong>
                </div>

                <div>
                  <span className="text-[#68756B] block text-[11px]">Line Capacity</span>
                  <strong className="text-[#183D2B]">4,000 Litres/Hour (PET & Cup Lines)</strong>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E6EBDD]">
                <button
                  onClick={onOpenBulkModal}
                  className="w-full py-2.5 px-3 bg-[#138443] hover:bg-[#0d6131] text-white font-bold text-xs rounded-xl shadow-sm transition-all text-center block"
                >
                  Contact Managing Director's Office
                </button>
              </div>
            </div>

            {/* Location & Connectivity Callout */}
            <div className="p-5 rounded-3xl bg-[#F4F8F0] border border-[#E6EBDD] space-y-3">
              <div className="flex items-center gap-2 text-[#138443] font-bold text-xs uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#138443]" /> Strategic Plant Connectivity
              </div>
              <p className="text-xs text-[#68756B] leading-relaxed">
                The Medchal facility features direct access to <strong>NH 44, the Karimnagar Highway, and the Outer Ring Road (ORR)</strong>, with immediate proximity to Medchal railway station and bus depot for workforce and freight dispatch across South India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Callout Banner */}
      <section className="bg-gradient-to-r from-[#183D2B] to-[#138443] text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h2 className="text-xl sm:text-3xl font-extrabold font-poppins">
            Explore Juci Cool’s Product Range & Dealerships
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-2xl mx-auto leading-relaxed">
            From single retail packs to wholesale truckloads, discover authentic Indian fruit drinks manufactured with certified precision.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onBackToStore}
              className="px-5 py-2.5 bg-white text-[#183D2B] font-extrabold text-xs rounded-xl shadow-md hover:bg-[#FFC928] transition-all"
            >
              Browse Juci Cool Products &rarr;
            </button>
            <button
              onClick={onOpenBulkModal}
              className="px-5 py-2.5 bg-[#FFC928] text-[#183D2B] font-extrabold text-xs rounded-xl shadow-md hover:bg-yellow-400 transition-all"
            >
              Request Wholesale Price Quote
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
