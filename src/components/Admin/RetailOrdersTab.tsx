import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  PhoneCall,
  Loader2,
  RefreshCw,
  X
} from 'lucide-react';
import { RetailOrder } from '../../types';
import { fetchAdminRetailOrders, fetchAdminRetailOrderById, updateRetailOrderStatus } from '../../services/api';

export const RetailOrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<RetailOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Order for Modal View
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusDraft, setStatusDraft] = useState('');
  const [paymentDraft, setPaymentDraft] = useState('');
  const [notesDraft, setNotesDraft] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminRetailOrders(statusFilter, searchTerm);
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, searchTerm]);

  const handleOpenDetails = async (orderId: number) => {
    try {
      const full = await fetchAdminRetailOrderById(orderId);
      setSelectedOrderDetails(full);
      setStatusDraft(full.order.order_status);
      setPaymentDraft(full.order.payment_status);
      setNotesDraft(full.order.notes || '');
    } catch (err) {
      alert('Failed to load order details');
    }
  };

  const handleSaveStatus = async () => {
    if (!selectedOrderDetails) return;
    setIsUpdating(true);
    try {
      await updateRetailOrderStatus(selectedOrderDetails.order.id, {
        orderStatus: statusDraft,
        paymentStatus: paymentDraft,
        notes: notesDraft,
      });
      await loadOrders();
      // refresh details
      const refreshed = await fetchAdminRetailOrderById(selectedOrderDetails.order.id);
      setSelectedOrderDetails(refreshed);
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const exportToCSV = () => {
    if (!orders.length) return;
    const headers = ['Order Number,Customer Name,Phone,Email,City,Total Amount,Payment Method,Payment Status,Order Status,Date'];
    const rows = orders.map(o =>
      `"${o.order_number}","${o.customer_name}","${o.customer_phone}","${o.customer_email || ''}","${o.city}",${o.total_amount},"${o.payment_method}","${o.payment_status}","${o.order_status}","${o.created_at}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jucicool_retail_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Search, Filter & Export Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-[#E6EBDD] shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by order ID, customer name, phone, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
            />
            <Search className="w-4 h-4 text-[#68756B] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-4 h-4 text-[#68756B]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#E6EBDD] bg-white text-[#183D2B] font-semibold focus:outline-none focus:border-[#138443]"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
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
            onClick={loadOrders}
            className="p-2 text-[#68756B] hover:text-[#138443] rounded-xl hover:bg-slate-100"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E6EBDD] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F4F8F0] text-[#183D2B] font-bold border-b border-[#E6EBDD]">
              <tr>
                <th className="py-3.5 px-4">Order Number</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Items Summary</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-center">Payment</th>
                <th className="py-3.5 px-4 text-center">Fulfillment</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6EBDD]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#68756B]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#138443]" />
                    <span>Loading retail orders...</span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#68756B]">
                    No retail orders found matching your search.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FFFEF7] transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#138443] font-mono">{o.order_number}</span>
                      <div className="text-[10px] text-[#68756B] mt-0.5">{new Date(o.created_at).toLocaleString()}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#183D2B]">{o.customer_name}</div>
                      <a href={`tel:${o.customer_phone}`} className="text-[11px] text-[#68756B] hover:text-[#138443] flex items-center gap-1">
                        <PhoneCall className="w-3 h-3 text-[#138443]" /> {o.customer_phone}
                      </a>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#183D2B]">{o.city}</div>
                      <div className="text-[11px] text-[#68756B]">{o.pincode}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#183D2B]">{o.itemCount || 1} product variety</span>
                      <div className="text-[11px] text-[#68756B]">Total: {o.totalItemsQuantity || 1} units</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-extrabold text-[#183D2B] text-sm">₹{o.total_amount.toFixed(2)}</div>
                      <div className="text-[10px] text-[#68756B]">{o.payment_method}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          o.payment_status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {o.payment_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          o.order_status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.order_status === 'New'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {o.order_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleOpenDetails(o.id)}
                        className="p-1.5 rounded-xl border border-[#E6EBDD] text-[#138443] hover:bg-[#F4F8F0] shadow-sm"
                        title="View & Manage Order"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Status Workflow Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E6EBDD] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 sm:p-6 bg-[#FFFEF7] border-b border-[#E6EBDD] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#68756B]">Retail Order Details</span>
                <h3 className="text-xl font-bold text-[#183D2B] font-mono">
                  {selectedOrderDetails.order.order_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-2 text-[#68756B] hover:text-[#183D2B] rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Customer & Address Details */}
              <div className="p-4 bg-[#F9FAF6] rounded-2xl border border-[#E6EBDD] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#68756B]">Customer Name:</span>
                  <div className="font-bold text-[#183D2B]">{selectedOrderDetails.order.customer_name}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <a
                      href={`tel:${selectedOrderDetails.order.customer_phone}`}
                      className="text-[#138443] font-bold hover:underline flex items-center gap-1"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Call Customer
                    </a>
                  </div>
                </div>

                <div>
                  <span className="text-[#68756B]">Full Delivery Address:</span>
                  <div className="font-semibold text-[#183D2B]">
                    {selectedOrderDetails.order.delivery_address}, {selectedOrderDetails.order.city}, {selectedOrderDetails.order.state} — {selectedOrderDetails.order.pincode}
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div>
                <h4 className="text-xs font-bold text-[#183D2B] mb-2 uppercase tracking-wider">
                  Ordered Products
                </h4>
                <div className="border border-[#E6EBDD] rounded-2xl overflow-hidden divide-y divide-[#E6EBDD] text-xs">
                  {selectedOrderDetails.items.map((it: any) => (
                    <div key={it.id} className="p-3 bg-white flex justify-between items-center">
                      <div>
                        <div className="font-bold text-[#183D2B]">{it.product_name}</div>
                        <div className="text-[11px] text-[#68756B]">{it.pack_size} • {it.quantity} units @ ₹{it.unit_price.toFixed(2)}</div>
                      </div>
                      <div className="font-bold text-[#183D2B]">
                        ₹{it.total_price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-2 text-right text-xs space-y-0.5 text-[#68756B]">
                  <div>Subtotal: ₹{selectedOrderDetails.order.subtotal.toFixed(2)}</div>
                  <div>Delivery Fee: ₹{selectedOrderDetails.order.delivery_fee.toFixed(2)}</div>
                  <div className="text-sm font-black text-[#138443]">Total Amount: ₹{selectedOrderDetails.order.total_amount.toFixed(2)}</div>
                </div>
              </div>

              {/* Update Status Controls */}
              <div className="p-4 bg-[#FFFEF7] rounded-2xl border border-[#E6EBDD] space-y-3">
                <h4 className="text-xs font-bold text-[#138443] uppercase tracking-wider">
                  Update Fulfillment & Payment Workflow
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                      Fulfillment Status
                    </label>
                    <select
                      value={statusDraft}
                      onChange={(e) => setStatusDraft(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] bg-white font-bold"
                    >
                      <option value="New">New</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                      Payment Status
                    </label>
                    <select
                      value={paymentDraft}
                      onChange={(e) => setPaymentDraft(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] bg-white font-bold"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                    Internal Admin Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dispatched with Hyderabad delivery van #3..."
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD]"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleSaveStatus}
                    disabled={isUpdating}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#138443] hover:bg-[#0d6131] text-white flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Save Order Updates</span>
                  </button>
                </div>
              </div>

              {/* Status History Timeline */}
              {selectedOrderDetails.history?.length > 0 && (
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-[#68756B]">Status Audit Trail:</span>
                  <div className="space-y-1">
                    {selectedOrderDetails.history.map((h: any) => (
                      <div key={h.id} className="text-[11px] text-[#68756B] flex justify-between py-1 border-b border-slate-100">
                        <span>Status changed to <strong>{h.new_status}</strong> by {h.changed_by} ({h.notes})</span>
                        <span>{new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
