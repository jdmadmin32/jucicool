import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  PackageCheck,
  PhoneCall,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  X,
  Building2
} from 'lucide-react';
import { WholesaleOrder } from '../../types';
import { fetchAdminWholesaleOrders, updateWholesaleOrderStatus } from '../../services/api';

export const WholesaleOrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<WholesaleOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected for status update
  const [selectedOrder, setSelectedOrder] = useState<WholesaleOrder | null>(null);
  const [fulfillmentDraft, setFulfillmentDraft] = useState('');
  const [paymentDraft, setPaymentDraft] = useState('');
  const [advanceDraft, setAdvanceDraft] = useState<number>(0);
  const [notesDraft, setNotesDraft] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadWholesaleOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminWholesaleOrders(statusFilter, searchTerm);
      setOrders(data);
    } catch (err) {
      console.error('Failed to load wholesale orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWholesaleOrders();
  }, [statusFilter, searchTerm]);

  const handleOpenEdit = (o: WholesaleOrder) => {
    setSelectedOrder(o);
    setFulfillmentDraft(o.fulfillment_status);
    setPaymentDraft(o.payment_status);
    setAdvanceDraft(o.advance_paid || 0);
    setNotesDraft(o.notes || '');
  };

  const handleSave = async () => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      await updateWholesaleOrderStatus(selectedOrder.id, {
        fulfillmentStatus: fulfillmentDraft,
        paymentStatus: paymentDraft,
        advancePaid: advanceDraft,
        notes: notesDraft,
      });
      await loadWholesaleOrders();
      setSelectedOrder(null);
    } catch (err: any) {
      alert('Failed to update wholesale order: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const exportToCSV = () => {
    if (!orders.length) return;
    const headers = ['Order Number,Business Name,Contact,Phone,City,Total Value,Advance Paid,Payment Status,Fulfillment Status,Date'];
    const rows = orders.map(o =>
      `"${o.order_number}","${o.business_name}","${o.contact_person}","${o.phone_number}","${o.city}",${o.agreed_total},${o.advance_paid},"${o.payment_status}","${o.fulfillment_status}","${o.order_date}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jucicool_wholesale_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-[#E6EBDD] shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search wholesale orders by order ID, business, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
            />
            <Search className="w-4 h-4 text-[#68756B] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-4 h-4 text-[#68756B]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#E6EBDD] bg-white text-[#183D2B] font-semibold focus:outline-none focus:border-[#138443]"
            >
              <option value="All">All Wholesale Statuses</option>
              <option value="Order Placed">Order Placed</option>
              <option value="Processing">Processing</option>
              <option value="Packed">Packed</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-[#E6EBDD] text-[#183D2B] hover:bg-slate-50 flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4 text-[#138443]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={loadWholesaleOrders}
            className="p-2 text-[#68756B] hover:text-[#138443] rounded-xl hover:bg-slate-100"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#E6EBDD] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F4F8F0] text-[#183D2B] font-bold border-b border-[#E6EBDD]">
              <tr>
                <th className="py-3.5 px-4">Wholesale Order ID</th>
                <th className="py-3.5 px-4">Business / Dealer</th>
                <th className="py-3.5 px-4">Contact Person</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4 text-right">Agreed Total</th>
                <th className="py-3.5 px-4 text-center">Payment Status</th>
                <th className="py-3.5 px-4 text-center">Fulfillment</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6EBDD]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#68756B]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#138443]" />
                    <span>Loading wholesale orders...</span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#68756B]">
                    No wholesale orders found. Enquiries converted from accepted quotations appear here.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FFFEF7] transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#138443] font-mono">{o.order_number}</span>
                      <div className="text-[10px] text-[#68756B] mt-0.5">{new Date(o.order_date).toLocaleDateString()}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#183D2B]">{o.business_name}</div>
                      <div className="text-[10px] text-slate-500">{o.items?.length || 1} drink categories</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#183D2B]">{o.contact_person}</div>
                      <a href={`tel:${o.phone_number}`} className="text-[11px] text-[#68756B] hover:text-[#138443] flex items-center gap-1">
                        <PhoneCall className="w-3 h-3 text-[#138443]" /> {o.phone_number}
                      </a>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#183D2B]">{o.city}</div>
                      <div className="text-[10px] text-[#68756B]">{o.state}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-black text-[#138443] text-sm">₹{o.agreed_total.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500">
                        Adv: ₹{(o.advance_paid || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          o.payment_status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.payment_status === 'Partial Advance'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {o.payment_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          o.fulfillment_status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.fulfillment_status === 'Dispatched'
                            ? 'bg-[#138443] text-white'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {o.fulfillment_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleOpenEdit(o)}
                        className="px-3 py-1.5 rounded-xl border border-[#E6EBDD] text-[#138443] hover:bg-[#F4F8F0] font-bold shadow-sm"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Wholesale Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#E6EBDD] p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-[#E6EBDD]">
              <div>
                <span className="text-xs text-[#68756B]">Update Wholesale Consignment</span>
                <h3 className="text-lg font-bold text-[#183D2B] font-mono">{selectedOrder.order_number}</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1.5 text-slate-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-[#F9FAF6] rounded-xl border border-[#E6EBDD] text-xs space-y-1">
              <div><strong className="text-[#183D2B]">Business:</strong> {selectedOrder.business_name} ({selectedOrder.contact_person})</div>
              <div><strong className="text-[#183D2B]">Agreed Wholesale Total:</strong> ₹{selectedOrder.agreed_total.toLocaleString()}</div>
              <div><strong className="text-[#183D2B]">Delivery Destination:</strong> {selectedOrder.delivery_address}</div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#183D2B] mb-1">Fulfillment Status</label>
                <select
                  value={fulfillmentDraft}
                  onChange={(e) => setFulfillmentDraft(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD] bg-white font-bold"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Processing">Processing & Bottling</option>
                  <option value="Packed">Packed in Cartons</option>
                  <option value="Dispatched">Dispatched via Freight</option>
                  <option value="Delivered">Delivered & Signed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#183D2B] mb-1">Payment Status</label>
                <select
                  value={paymentDraft}
                  onChange={(e) => setPaymentDraft(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD] bg-white font-bold"
                >
                  <option value="Pending">Pending</option>
                  <option value="Partial Advance">Partial Advance Received</option>
                  <option value="Paid">Fully Paid</option>
                  <option value="Credit">Credit Terms (15/30 Days)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#183D2B] mb-1">Advance Amount Received (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={advanceDraft}
                  onChange={(e) => setAdvanceDraft(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#183D2B] mb-1">Dispatch / Logistics Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Factory vehicle truck #4 driver phone..."
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#E6EBDD] flex justify-end gap-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#E6EBDD]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#138443] text-white hover:bg-[#0d6131] flex items-center gap-1.5 shadow"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Save Consignment Status</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
