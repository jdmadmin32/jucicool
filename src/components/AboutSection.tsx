import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  Factory,
  HeartHandshake,
  MapPin,
  Sparkles,
  Sun,
  Zap,
  Droplets,
  Building2,
  TrendingUp,
  FlaskConical,
  Gauge,
  ArrowRight,
  UserCheck,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface AboutSectionProps {
  onOpenChairmanProfile?: () => void;
  onOpenBulkModal?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onOpenChairmanProfile,
  onOpenBulkModal,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'infrastructure' | 'capabilities' | 'quality'>('profile');

  // Indicative Production Configurations Table
  const productionLines = [
    { format: 'PET & cup', size: '200 ml', bpm: '140 BPM', casesPerHour: '315', casesPerDay: '6,300' },
    { format: 'PET', size: '250 ml', bpm: '115 BPM', casesPerHour: '259', casesPerDay: '5,175' },
    { format: 'PET', size: '500 ml', bpm: '57 BPM', casesPerHour: '128', casesPerDay: '2,565' },
    { format: 'PET', size: '1,000 ml', bpm: '28 BPM', casesPerHour: '126', casesPerDay: '2,520' },
    { format: 'PET', size: '1,250 ml', bpm: '23 BPM', casesPerHour: '138', casesPerDay: '2,760' },
  ];

  return (
    <section id="about-section" className="py-12 sm:py-24 bg-gradient-to-b from-[#FFFEF7] via-[#F4F8F0] to-[#FFFEF7] border-t border-[#E6EBDD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#138443]/10 text-[#138443] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Company Profile • About JDM & Juci Cool
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#183D2B] font-poppins leading-tight">
            Built on Manufacturing Experience. <br />
            <span className="text-[#138443]">Driven by Quality.</span>
          </h2>
          <p className="text-xs sm:text-base text-[#68756B] leading-relaxed">
            <strong>JDM Fruit Products Pvt. Ltd.</strong> (Est. 2012) is a premier beverage manufacturing company based at Sri Siddi Vinayaka Eco Industrial Park, Ravakole Village, Medchal, Telangana.
          </p>
        </div>

        {/* Executive Chairman Spotlight Banner */}
        <div className="bg-gradient-to-r from-[#183D2B] via-[#0d6131] to-[#138443] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#8CC63E]/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            <div className="md:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFC928] text-[#183D2B] text-[10px] sm:text-xs font-black uppercase tracking-wider">
                <UserCheck className="w-3.5 h-3.5" /> Leadership & Vision
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-poppins">
                Mr. A. Chandra Sheker Reddy
              </h3>
              <p className="text-xs font-semibold text-[#8CC63E] uppercase tracking-wide">
                Founder & Managing Director • JDM Fruit Products Pvt. Ltd.
              </p>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-2xl">
                The entrepreneurial force behind JDM’s establishment and development. Under his leadership, JDM developed dedicated PET bottle and cup-filling production lines, manufacturing for Tata Consumer Products (2014–2024) and commencing commercial production for Reliance on 30 December 2025.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col justify-center gap-2.5">
              {onOpenChairmanProfile && (
                <button
                  onClick={onOpenChairmanProfile}
                  className="px-5 py-3 rounded-2xl bg-white hover:bg-[#FFC928] text-[#183D2B] font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Read Chairman Profile</span>
                  <ArrowRight className="w-4 h-4 text-[#138443] group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              {onOpenBulkModal && (
                <button
                  onClick={onOpenBulkModal}
                  className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-xs transition-all text-center"
                >
                  Request Plant Tour & Quotes
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Feature Tabs */}
        <div className="space-y-8">
          <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'profile', label: 'Overview & Heritage', icon: Award },
              { id: 'infrastructure', label: 'Plant & Infrastructure', icon: Factory },
              { id: 'capabilities', label: 'Production Capacities', icon: Gauge },
              { id: 'quality', label: 'QA & Laboratory R&D', icon: FlaskConical },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#138443] text-white shadow-md'
                      : 'bg-white border border-[#E6EBDD] text-[#68756B] hover:text-[#183D2B] hover:border-[#138443]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#8CC63E]' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: Profile & Heritage */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center animate-in fade-in duration-300">
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-xl sm:text-3xl font-extrabold text-[#183D2B] font-poppins">
                  A Decade of Beverage Craftsmanship
                </h3>
                <p className="text-xs sm:text-sm text-[#183D2B]/90 leading-relaxed">
                  With a dedicated focus on fruit-based beverages, packaging versatility, and dependable manufacturing operations, <strong>JDM Fruit Products Pvt. Ltd.</strong> has developed state-of-the-art production capabilities serving beverage requirements across South India and wider markets.
                </p>
                <p className="text-xs sm:text-sm text-[#68756B] leading-relaxed">
                  The company’s manufacturing experience includes hot-fill fruit beverages in PET bottles and standee pouches since 2012. Its facility is equipped with dedicated PET bottle and cup-filling lines, each with an installed capacity of <strong>2,000 litres per hour</strong>, supporting diverse pack sizes and formats.
                </p>

                {/* Major Corporate Milestones */}
                <div className="p-4 rounded-2xl bg-white border border-[#E6EBDD] shadow-xs space-y-3">
                  <span className="text-xs font-bold text-[#183D2B] block uppercase tracking-wider">
                    Manufacturing Milestones
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#138443] shrink-0 mt-0.5" />
                      <span><strong>2014 – 2024:</strong> Co-manufacturing production experience for <strong>Tata Consumer Products</strong>.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#138443] shrink-0 mt-0.5" />
                      <span><strong>30 Dec 2025:</strong> Commercial beverage production commenced for <strong>Reliance</strong>.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#138443] shrink-0 mt-0.5" />
                      <span><strong>2012 – Present:</strong> Proprietary fruit brand <strong>Juci Cool</strong> in Alphonso Mango, Guava, Pineapple, Candy, and Mineral Water.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strategic Location & Connectivity */}
              <div className="lg:col-span-6 bg-white p-5 sm:p-7 rounded-3xl border border-[#E6EBDD] shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-[#138443] font-bold text-xs uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-[#138443]" /> Manufacturing Location & Connectivity
                </div>
                <h4 className="text-lg font-bold text-[#183D2B] font-poppins">
                  Medchal Industrial Hub, Hyderabad
                </h4>
                <p className="text-xs sm:text-sm text-[#68756B] leading-relaxed">
                  The facility is located in Medchal near Hyderabad and Secunderabad at <strong>Sri Siddi Vinayaka Eco Industrial Park, Ravakole Village</strong>.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#F4F8F0] border border-[#E6EBDD]">
                    <span className="font-bold text-[#183D2B] block">Highway Arteries</span>
                    <span className="text-[#68756B] text-[11px] mt-0.5 block">Direct access to NH 44, Karimnagar Highway & Outer Ring Road (ORR).</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F4F8F0] border border-[#E6EBDD]">
                    <span className="font-bold text-[#183D2B] block">Logistics Proximity</span>
                    <span className="text-[#68756B] text-[11px] mt-0.5 block">Close to Medchal Railway Station and Medchal Bus Depot for efficient freight dispatch.</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px]">
                  <strong>Operational Advantage:</strong> Seamless access to distributors, raw fruit pulp suppliers, skilled village workforce, and regional inter-state corridors.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Plant & Infrastructure */}
          {activeTab === 'infrastructure' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-white rounded-3xl border border-[#E6EBDD] shadow-xs space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#138443]/10 text-[#138443] flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#183D2B]">4.5 Acres Industrial Campus</h4>
                  <p className="text-xs text-[#68756B] leading-relaxed">
                    JDM owns 4.5 acres of land, with ~2 acres in active continuous production, 14,000 sq. ft. of sterile production space, and 32,000 sq. ft. of raw material/packaging warehouse.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-3xl border border-[#E6EBDD] shadow-xs space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFC928]/20 text-[#F7941D] flex items-center justify-center font-bold">
                    <Sun className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#183D2B]">300 kW Solar Energy</h4>
                  <p className="text-xs text-[#68756B] leading-relaxed">
                    24-hour uninterrupted industrial power availability backed by an installed 300 kW on-site rooftop solar power system for sustainable, low-carbon beverage bottling.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-3xl border border-[#E6EBDD] shadow-xs space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#8CC63E]/20 text-[#138443] flex items-center justify-center font-bold">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#183D2B]">Natural Pure Water (TDS 200–250)</h4>
                  <p className="text-xs text-[#68756B] leading-relaxed">
                    Dedicated groundwater sources with natural TDS of 200–250, treated through multi-barrier RO and UV sterilization systems for crystal-pure beverage hydration.
                  </p>
                </div>
              </div>

              {/* Modern Expansion Building Notice */}
              <div className="p-5 sm:p-6 bg-emerald-50/80 rounded-3xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold uppercase tracking-wider">
                    Expansion Facility
                  </div>
                  <h4 className="text-base font-bold text-[#183D2B]">105,000 Sq. Ft. New Factory Building</h4>
                  <p className="text-xs text-[#68756B] max-w-2xl">
                    High-volume automated bottling plant designed to scale production capacity for national beverage brands, regional wholesale distributors, and international contracts.
                  </p>
                </div>
                <div className="text-xs text-[#138443] font-bold bg-white px-4 py-2 rounded-xl border border-emerald-300 shrink-0 shadow-xs">
                  On-Site Workforce Accommodation
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Production Capacities */}
          {activeTab === 'capabilities' && (
            <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#E6EBDD] shadow-sm space-y-5 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-[#E6EBDD]">
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-[#183D2B] font-poppins">
                    Installed Line Capacities: 2,000 Litres / Hour Each
                  </h3>
                  <p className="text-xs text-[#68756B]">
                    Dedicated PET bottle and cup-filling lines supporting diverse pack configurations and high line speeds.
                  </p>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full shrink-0">
                  20-Hour Operational Day Output
                </span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F9FAF6] text-[#183D2B] font-bold border-b border-[#E6EBDD]">
                      <th className="py-3 px-3">Pack Format</th>
                      <th className="py-3 px-3">Pack Size</th>
                      <th className="py-3 px-3">Line Speed</th>
                      <th className="py-3 px-3">Cases / Hour</th>
                      <th className="py-3 px-3 text-right">Cases / Day (20h)*</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6EBDD]/60 text-[#68756B]">
                    {productionLines.map((line, idx) => (
                      <tr key={idx} className="hover:bg-[#F4F8F0]/60 transition-colors">
                        <td className="py-3 px-3 font-semibold text-[#183D2B]">{line.format}</td>
                        <td className="py-3 px-3 font-bold text-[#138443]">{line.size}</td>
                        <td className="py-3 px-3 font-mono">{line.bpm}</td>
                        <td className="py-3 px-3">{line.casesPerHour} cases</td>
                        <td className="py-3 px-3 text-right font-black text-[#183D2B]">{line.casesPerDay} cases</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-[#68756B] italic leading-relaxed pt-2 border-t border-[#E6EBDD]/50">
                *Daily case output is as documented in official engineering presentations based on a standard 20-hour production cycle. Actual output depends on specific beverage formulation, pack configuration, changeovers, and laboratory quality release.
              </p>
            </div>
          )}

          {/* TAB 4: QA & Laboratory R&D */}
          {activeTab === 'quality' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 animate-in fade-in duration-300">
              <div className="p-5 sm:p-6 bg-white rounded-3xl border border-[#E6EBDD] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#138443]/10 text-[#138443] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-[#183D2B]">In-House Physical & Microbiological Lab</h4>
                <p className="text-xs sm:text-sm text-[#68756B] leading-relaxed">
                  Equipped with modern instrumentation for physical, chemical, and microbiological testing of raw fruit pulp, purified water, packaging materials, and finished bottled beverages to ensure complete zero-contamination compliance.
                </p>
                <ul className="text-xs text-[#183D2B] space-y-1.5 pt-2">
                  <li className="flex items-center gap-2">✓ Comprehensive Brix, pH & Acidity testing</li>
                  <li className="flex items-center gap-2">✓ Automated microbiological culture incubation</li>
                  <li className="flex items-center gap-2">✓ Raw material & packaging torque testing</li>
                </ul>
              </div>

              <div className="p-5 sm:p-6 bg-white rounded-3xl border border-[#E6EBDD] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#8CC63E]/20 text-[#138443] flex items-center justify-center font-bold">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-[#183D2B]">Biotechnology R&D Unit & Engineers</h4>
                <p className="text-xs sm:text-sm text-[#68756B] leading-relaxed">
                  Staffed by qualified biotechnology specialists and experienced production engineers focusing on product formulation, authentic flavour optimisation, shelf-life enhancement, and continuous line efficiency control.
                </p>
                <ul className="text-xs text-[#183D2B] space-y-1.5 pt-2">
                  <li className="flex items-center gap-2">✓ Flavour profiling & natural pulp suspension</li>
                  <li className="flex items-center gap-2">✓ Production engineers overseeing line hygiene</li>
                  <li className="flex items-center gap-2">✓ Controlled hot-fill thermal stabilization</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
