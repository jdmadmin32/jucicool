import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Building2,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  DollarSign,
  ArrowUpRight,
  PackageCheck,
  RefreshCw
} from 'lucide-react';
import { fetchAdminDashboard } from '../../services/api';
import { AdminDashboardData } from '../../types';

interface DashboardOverviewProps {
  onNavigateTab: (tabId: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigateTab }) => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [dateRange, setDateRange] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const loadDashboard = async (range: string) => {
    setLoading(true);
    try {
      const res = await fetchAdminDashboard(range);
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard(dateRange);
  }, [dateRange]);

  if (loading && !data) {
    return (
      <div className="py-24 text-center text-[#68756B] flex flex-col items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-[#138443] mb-3" />
        <span className="text-sm font-semibold">Loading live business metrics...</span>
      </div>
    );
  }

  const metrics = data?.metrics;

  return (
    <div className="space-y-6">
      {/* Header & Date Range Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-[#E6EBDD] shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#183D2B] font-poppins">Business Intelligence Overview</h2>
          <p className="text-xs text-[#68756B]">Deriving real-time retail and wholesale statistics from database</p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#68756B]" />
          <div className="flex bg-[#F4F8F0] p-1 rounded-xl border border-[#E6EBDD] text-xs font-semibold">
            {[
              { id: 'today', label: 'Today' },
              { id: '7days', label: '7 Days' },
              { id: '30days', label: '30 Days' },
              { id: 'all', label: 'All Time' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setDateRange(btn.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  dateRange === btn.id
                    ? 'bg-white text-[#138443] shadow-sm font-bold'
                    : 'text-[#68756B] hover:text-[#183D2B]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => loadDashboard(dateRange)}
            className="p-2 text-[#68756B] hover:text-[#138443] rounded-xl hover:bg-slate-100"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Retail Orders */}
        <div
          onClick={() => onNavigateTab('retail-orders')}
          className="bg-white p-5 rounded-3xl border border-[#E6EBDD] shadow-sm hover:shadow-card cursor-pointer transition-all hover:border-[#138443]"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-[#68756B] uppercase tracking-wider">Retail Orders</span>
            <div className="p-2 bg-[#138443]/10 text-[#138443] rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#183D2B] mt-2 font-poppins">
            {metrics?.totalRetailOrders || 0}
          </div>
          <div className="flex justify-between items-center text-xs text-[#68756B] mt-2 pt-2 border-t border-[#E6EBDD]/60">
            <span>New Pending: <strong className="text-[#138443]">{metrics?.newRetailOrders || 0}</strong></span>
            <span className="text-[#138443] flex items-center font-bold">
              ₹{(metrics?.retailRevenue || 0).toFixed(0)} <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Bulk Wholesale Enquiries */}
        <div
          onClick={() => onNavigateTab('bulk-enquiries')}
          className="bg-white p-5 rounded-3xl border border-[#E6EBDD] shadow-sm hover:shadow-card cursor-pointer transition-all hover:border-[#F7941D]"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-[#68756B] uppercase tracking-wider">Bulk Enquiries</span>
            <div className="p-2 bg-[#FFC928]/20 text-[#F7941D] rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#183D2B] mt-2 font-poppins">
            {metrics?.totalBulkEnquiries || 0}
          </div>
          <div className="flex justify-between items-center text-xs text-[#68756B] mt-2 pt-2 border-t border-[#E6EBDD]/60">
            <span>New Enquiries: <strong className="text-[#F7941D]">{metrics?.newBulkEnquiries || 0}</strong></span>
            <span className="text-amber-700 font-medium">Awaiting: {metrics?.quotationsAwaitingResponse || 0}</span>
          </div>
        </div>

        {/* Wholesale Orders & Revenue */}
        <div
          onClick={() => onNavigateTab('wholesale-orders')}
          className="bg-white p-5 rounded-3xl border border-[#E6EBDD] shadow-sm hover:shadow-card cursor-pointer transition-all hover:border-emerald-600"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-[#68756B] uppercase tracking-wider">Wholesale Revenue</span>
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#138443] mt-2 font-poppins">
            ₹{(metrics?.wholesaleRevenue || 0).toLocaleString()}
          </div>
          <div className="flex justify-between items-center text-xs text-[#68756B] mt-2 pt-2 border-t border-[#E6EBDD]/60">
            <span>Confirmed Orders: <strong className="text-[#183D2B]">{metrics?.wholesaleOrdersCount || 0}</strong></span>
            <span className="text-emerald-700 font-semibold">{metrics?.acceptedQuotations || 0} Accepted</span>
          </div>
        </div>

        {/* Inventory Status */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="bg-white p-5 rounded-3xl border border-[#E6EBDD] shadow-sm hover:shadow-card cursor-pointer transition-all hover:border-amber-500"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-[#68756B] uppercase tracking-wider">Active Products</span>
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#183D2B] mt-2 font-poppins">
            {metrics?.totalProducts || 0}
          </div>
          <div className="flex justify-between items-center text-xs text-[#68756B] mt-2 pt-2 border-t border-[#E6EBDD]/60">
            <span>Low Stock Warning:</span>
            <span className={`font-bold ${metrics?.lowStockProducts ? 'text-amber-600' : 'text-[#138443]'}`}>
              {metrics?.lowStockProducts || 0} items &lt; 50
            </span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Activity Timeline */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-[#E6EBDD] shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-[#183D2B] font-poppins">Retail Sales Activity Trends</h3>
              <p className="text-xs text-[#68756B]">Daily orders and revenue generated</p>
            </div>
            <span className="text-xs font-bold text-[#138443] bg-[#138443]/10 px-2.5 py-1 rounded-full">
              Live DB Aggregation
            </span>
          </div>

          <div className="h-48 flex items-end gap-2 pt-6 pb-2 px-2 border-b border-[#E6EBDD]">
            {(data?.salesTrends?.length ? data.salesTrends : [{ order_date: 'Today', order_count: 2, daily_revenue: 245 }]).map((trend: any, idx: number) => {
              const maxRev = Math.max(...(data?.salesTrends?.map((t: any) => t.daily_revenue) || [500]), 500);
              const heightPct = Math.min(100, Math.max(15, (trend.daily_revenue / maxRev) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#183D2B] text-white text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap shadow-lg z-20">
                    ₹{trend.daily_revenue} ({trend.order_count} orders)
                  </div>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full max-w-[40px] bg-gradient-to-t from-[#138443] to-[#8CC63E] rounded-t-lg transition-all group-hover:brightness-110"
                  ></div>
                  <span className="text-[10px] text-[#68756B] truncate max-w-[50px]">
                    {trend.order_date.slice(-5)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-xs text-[#68756B] pt-1">
            <span>Minimum threshold: ₹0</span>
            <span>Automated daily reconciliation</span>
          </div>
        </div>

        {/* Bulk Enquiry Status Breakdown */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-[#E6EBDD] shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-[#183D2B] font-poppins">Bulk Enquiry Pipeline</h3>
              <p className="text-xs text-[#68756B]">Conversion journey of wholesale dealers</p>
            </div>
            <button
              onClick={() => onNavigateTab('bulk-enquiries')}
              className="text-xs text-[#138443] font-bold hover:underline"
            >
              View Pipeline
            </button>
          </div>

          <div className="space-y-2.5 pt-2">
            {(data?.enquiryStatusBreakdown || [
              { status: 'New', count: 1 },
              { status: 'Quotation Prepared', count: 1 },
              { status: 'Quotation Sent', count: 1 },
              { status: 'Converted to Order', count: 1 },
            ]).map((st: any) => {
              const total = data?.metrics?.totalBulkEnquiries || 4;
              const pct = Math.round((st.count / total) * 100);

              const colorMap: Record<string, string> = {
                'New': 'bg-blue-500',
                'Quotation Prepared': 'bg-amber-500',
                'Quotation Sent': 'bg-purple-500',
                'Accepted': 'bg-emerald-500',
                'Converted to Order': 'bg-[#138443]',
              };

              return (
                <div key={st.status} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#183D2B]">{st.status}</span>
                    <span className="font-bold text-[#68756B]">{st.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full ${colorMap[st.status] || 'bg-slate-400'} rounded-full`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Tables: Recent Retail Orders & Recent Bulk Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Retail Orders */}
        <div className="bg-white p-5 rounded-3xl border border-[#E6EBDD] shadow-sm space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-[#E6EBDD]">
            <h3 className="text-sm font-bold text-[#183D2B]">Recent Retail Orders</h3>
            <button
              onClick={() => onNavigateTab('retail-orders')}
              className="text-xs text-[#138443] font-bold hover:underline"
            >
              See All Retail Orders
            </button>
          </div>

          <div className="divide-y divide-[#E6EBDD] text-xs">
            {data?.recentRetail?.map((o: any) => (
              <div key={o.id} className="py-2.5 flex justify-between items-center">
                <div>
                  <div className="font-bold text-[#183D2B]">{o.customer_name}</div>
                  <div className="text-[11px] text-[#68756B]">{o.order_number} • {o.customer_phone}</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-[#138443]">₹{o.total_amount?.toFixed(2)}</div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-[#183D2B]">
                    {o.order_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bulk Enquiries */}
        <div className="bg-white p-5 rounded-3xl border border-[#E6EBDD] shadow-sm space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-[#E6EBDD]">
            <h3 className="text-sm font-bold text-[#183D2B]">Recent Bulk Enquiries ("Get Best Price")</h3>
            <button
              onClick={() => onNavigateTab('bulk-enquiries')}
              className="text-xs text-[#F7941D] font-bold hover:underline"
            >
              See All Enquiries
            </button>
          </div>

          <div className="divide-y divide-[#E6EBDD] text-xs">
            {data?.recentEnquiries?.map((e: any) => (
              <div key={e.id} className="py-2.5 flex justify-between items-center">
                <div>
                  <div className="font-bold text-[#183D2B]">{e.business_name}</div>
                  <div className="text-[11px] text-[#68756B]">{e.customer_name} • {e.city} • {e.phone_number}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFC928]/20 text-[#183D2B] border border-[#FFC928]/40">
                    {e.status}
                  </span>
                  <div className="text-[10px] text-[#68756B] mt-0.5">{e.enquiry_number}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
