import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  PhoneCall,
  Mail,
  UserCheck,
  Building2,
  ShoppingBag,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { CustomerRecord } from '../../types';
import { fetchAdminCustomers } from '../../services/api';

export const CustomerDirectoryTab: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminCustomers();
      setCustomers(data);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filtered = customers.filter(c => {
    const matchesSearch =
      (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone || '').includes(searchTerm) ||
      (c.business_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.city || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'All' || c.customer_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const exportCSV = () => {
    if (!customers.length) return;
    const headers = ['Name,Phone,Email,Business Name,Customer Type,City,Retail Orders,Retail Spend,Bulk Enquiries,Wholesale Orders,Wholesale Spend,First Contact'];
    const rows = customers.map(c =>
      `"${c.name}","${c.phone}","${c.email || ''}","${c.business_name || ''}","${c.customer_type}","${c.city}",${c.retail_orders},${c.retail_spend},${c.bulk_enquiries},${c.wholesale_orders},${c.wholesale_spend},"${c.first_contact}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jucicool_customer_directory_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-[#E6EBDD] shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by name, phone, business, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
            />
            <Search className="w-4 h-4 text-[#68756B] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-4 h-4 text-[#68756B]" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#E6EBDD] bg-white text-[#183D2B] font-semibold focus:outline-none focus:border-[#138443]"
            >
              <option value="All">All Customer Profiles</option>
              <option value="Individual">Individual (Retail Shoppers)</option>
              <option value="Retailer">Retail Shops / Kiranas</option>
              <option value="Dealer">Dealers</option>
              <option value="Distributor">Distributors</option>
              <option value="Supermarket">Supermarkets</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-[#E6EBDD] text-[#183D2B] hover:bg-slate-50 flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4 text-[#138443]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={loadCustomers}
            className="p-2 text-[#68756B] hover:text-[#138443] rounded-xl hover:bg-slate-100"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-3xl border border-[#E6EBDD] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F4F8F0] text-[#183D2B] font-bold border-b border-[#E6EBDD]">
              <tr>
                <th className="py-3.5 px-4">Customer Contact</th>
                <th className="py-3.5 px-4">Business / Profile</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4 text-center">Retail Orders</th>
                <th className="py-3.5 px-4 text-center">Bulk Enquiries</th>
                <th className="py-3.5 px-4 text-right">Wholesale Spend</th>
                <th className="py-3.5 px-4 text-center">First Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6EBDD]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#68756B]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#138443]" />
                    <span>Loading centralized customer directory...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#68756B]">
                    No customer records found.
                  </td>
                </tr>
              ) : (
                filtered.map((c, idx) => (
                  <tr key={idx} className="hover:bg-[#FFFEF7] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#183D2B]">{c.name}</div>
                      <a href={`tel:${c.phone}`} className="text-[11px] text-[#68756B] hover:text-[#138443] flex items-center gap-1">
                        <PhoneCall className="w-3 h-3 text-[#138443]" /> {c.phone}
                      </a>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#183D2B]">{c.business_name || 'Individual Customer'}</div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        {c.customer_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#183D2B]">{c.city}</div>
                      <div className="text-[10px] text-[#68756B]">{c.state}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="font-bold text-[#183D2B]">{c.retail_orders} orders</div>
                      <div className="text-[10px] text-[#68756B]">₹{c.retail_spend.toFixed(0)}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-[#F7941D]">{c.bulk_enquiries} enquiries</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-black text-[#138443] text-sm">
                        ₹{c.wholesale_spend.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500">{c.wholesale_orders} confirmed orders</div>
                    </td>
                    <td className="py-3.5 px-4 text-center text-[#68756B]">
                      {c.first_contact ? new Date(c.first_contact).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
