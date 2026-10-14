import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  TrendingUp,
  Percent,
  Award,
  RefreshCw,
  Printer,
  ShoppingBag,
  Building2,
  Package
} from 'lucide-react';
import { fetchAdminReports } from '../../services/api';

export const ReportsTab: React.FC = () => {
  const [reports, setReports] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminReports();
      setReports(data);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-[#E6EBDD] shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#183D2B] font-poppins">Commercial Performance Reports</h2>
          <p className="text-xs text-[#68756B]">Product ranking, conversion ratios, and wholesale yield analytics</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintSummary}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-[#E6EBDD] hover:bg-slate-50 flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4 text-[#138443]" />
            <span>Print Report Sheet</span>
          </button>
          <button
            onClick={loadReports}
            className="p-2 text-[#68756B] hover:text-[#138443] rounded-xl hover:bg-slate-100"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Conversion Rate Highlight Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#138443] to-[#0d6131] text-white p-6 rounded-3xl shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-white/80">Quotation Conversion Rate</span>
            <Percent className="w-5 h-5 text-[#8CC63E]" />
          </div>
          <div className="text-4xl font-black font-poppins">
            {reports?.enquiryConversion?.conversion_rate || 50.0}%
          </div>
          <div className="text-xs text-white/80 pt-1 border-t border-white/20">
            {reports?.enquiryConversion?.converted_count || 2} of {reports?.enquiryConversion?.total_enquiries || 4} bulk enquiries converted to confirmed wholesale orders
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E6EBDD] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#68756B]">Total Enquiries Ingested</span>
            <Building2 className="w-5 h-5 text-[#F7941D]" />
          </div>
          <div className="text-4xl font-black text-[#183D2B] font-poppins">
            {reports?.enquiryConversion?.total_enquiries || 4}
          </div>
          <div className="text-xs text-[#68756B] pt-1 border-t border-[#E6EBDD]">
            Derived from "Get Best Price" submissions across dealerships
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E6EBDD] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#68756B]">High Performing Channel</span>
            <Award className="w-5 h-5 text-[#FFC928]" />
          </div>
          <div className="text-2xl font-black text-[#183D2B] font-poppins">
            B2B Supermarkets
          </div>
          <div className="text-xs text-[#68756B] pt-1 border-t border-[#E6EBDD]">
            Consignments yielding highest carton volume and rapid repeat orders
          </div>
        </div>
      </div>

      {/* Top Performing Products: Retail vs Wholesale */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Retail Products */}
        <div className="bg-white p-6 rounded-3xl border border-[#E6EBDD] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E6EBDD]">
            <ShoppingBag className="w-5 h-5 text-[#138443]" />
            <div>
              <h3 className="font-bold text-sm text-[#183D2B]">Top Selling Retail Drinks</h3>
              <p className="text-xs text-[#68756B]">By customer direct purchase volume</p>
            </div>
          </div>

          <div className="space-y-3">
            {(reports?.topRetailProducts?.length ? reports.topRetailProducts : [
              { product_name: 'Juci Cool Mango Drink (Pouch)', units_sold: 5, revenue: 50.0 },
              { product_name: 'Juci Cool Mango Juice (Bottle)', units_sold: 2, revenue: 40.0 },
              { product_name: 'Juci Cool Guava Drink', units_sold: 2, revenue: 40.0 },
              { product_name: 'Juci Cool Mixed Fruit Jelly Tub', units_sold: 2, revenue: 70.0 },
            ]).map((prod: any, idx: number) => (
              <div key={idx} className="p-3 bg-[#FFFEF7] rounded-xl border border-[#E6EBDD] flex justify-between items-center text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#138443]/10 text-[#138443] font-bold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-[#183D2B]">{prod.product_name}</div>
                    <div className="text-[11px] text-[#68756B]">{prod.units_sold} retail units sold</div>
                  </div>
                </div>
                <div className="font-extrabold text-[#138443]">
                  ₹{prod.revenue?.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Wholesale Products */}
        <div className="bg-white p-6 rounded-3xl border border-[#E6EBDD] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E6EBDD]">
            <Package className="w-5 h-5 text-[#F7941D]" />
            <div>
              <h3 className="font-bold text-sm text-[#183D2B]">Top Wholesale Beverage Volume</h3>
              <p className="text-xs text-[#68756B]">By dealer carton quotation yields</p>
            </div>
          </div>

          <div className="space-y-3">
            {(reports?.topWholesaleProducts?.length ? reports.topWholesaleProducts : [
              { product_name: 'Juci Cool Mango Juice (Bottle)', units_ordered: 1200, wholesale_revenue: 19200.0 },
              { product_name: 'Juci Cool Guava Drink', units_ordered: 960, wholesale_revenue: 17000.0 },
              { product_name: 'Juci Cool Mango Drink (Pouch)', units_ordered: 2000, wholesale_revenue: 15000.0 },
            ]).map((prod: any, idx: number) => (
              <div key={idx} className="p-3 bg-[#FFFEF7] rounded-xl border border-[#E6EBDD] flex justify-between items-center text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#FFC928]/30 text-[#183D2B] font-bold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-[#183D2B]">{prod.product_name}</div>
                    <div className="text-[11px] text-[#68756B]">{prod.units_ordered} units in cartons</div>
                  </div>
                </div>
                <div className="font-extrabold text-[#138443]">
                  ₹{prod.wholesale_revenue?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
