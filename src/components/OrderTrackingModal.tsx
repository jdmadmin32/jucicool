import React, { useState } from 'react';
import { X, Search, Truck, Building2, CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { trackRetailOrder, trackBulkEnquiry } from '../services/api';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultQuery?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  defaultQuery = '',
}) => {
  const [activeTab, setActiveTab] = useState<'retail' | 'bulk'>('retail');
  const [query, setQuery] = useState(defaultQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (activeTab === 'retail') {
        const data = await trackRetailOrder(query.trim());
        setResult(data);
      } else {
        const data = await trackBulkEnquiry(query.trim());
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'No records found matching your enquiry or order ID.');
    } finally {
      setLoading(false);
    }
  };

  const getStepActiveIndex = (status: string) => {
    switch (status) {
      case 'New': return 0;
      case 'Confirmed': return 1;
      case 'Processing':
      case 'Packed': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  const retailSteps = ['Order Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#E6EBDD] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#FFFEF7] border-b border-[#E6EBDD] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#138443]/10 text-[#138443] rounded-xl">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#183D2B] font-poppins">Live Order & Enquiry Tracking</h2>
              <p className="text-xs text-[#68756B]">Track fulfillment status in real time</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#68756B] hover:text-[#183D2B] rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Retail Order vs Bulk Enquiry */}
        <div className="grid grid-cols-2 border-b border-[#E6EBDD] bg-[#F4F8F0] p-1.5 gap-1 text-xs font-bold text-center">
          <button
            onClick={() => { setActiveTab('retail'); setResult(null); setError(null); }}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'retail'
                ? 'bg-white text-[#138443] shadow-sm'
                : 'text-[#68756B] hover:text-[#183D2B]'
            }`}
          >
            Track Retail Order
          </button>
          <button
            onClick={() => { setActiveTab('bulk'); setResult(null); setError(null); }}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'bulk'
                ? 'bg-white text-[#F7941D] shadow-sm'
                : 'text-[#68756B] hover:text-[#183D2B]'
            }`}
          >
            Track Bulk Wholesale Enquiry
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder={
                activeTab === 'retail'
                  ? 'Enter Order ID (e.g. JC-RET-1001) or Phone'
                  : 'Enter Bulk Ref (e.g. JC-BLK-8901) or Phone'
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#138443] text-white hover:bg-[#0d6131] flex items-center gap-1.5 shadow-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Track</span>
            </button>
          </form>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Result View: Retail Order */}
          {result && activeTab === 'retail' && result.order && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 bg-[#FFFEF7] border border-[#E6EBDD] rounded-2xl space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-[#E6EBDD] pb-2">
                  <div>
                    <span className="text-[#68756B]">Order ID: </span>
                    <span className="font-bold text-[#138443] text-sm">{result.order.order_number}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-[#138443]/10 text-[#138443]">
                    {result.order.order_status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#68756B]">Customer: </span>
                    <span className="font-semibold text-[#183D2B]">{result.order.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-[#68756B]">Phone: </span>
                    <span className="font-semibold text-[#183D2B]">{result.order.customer_phone}</span>
                  </div>
                  <div>
                    <span className="text-[#68756B]">Delivery To: </span>
                    <span className="font-semibold text-[#183D2B]">{result.order.city}, {result.order.state}</span>
                  </div>
                  <div>
                    <span className="text-[#68756B]">Payment: </span>
                    <span className="font-semibold text-emerald-700">{result.order.payment_method} ({result.order.payment_status})</span>
                  </div>
                </div>

                {/* Visual Timeline */}
                <div className="pt-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#68756B] mb-2">Order Progress</div>
                  <div className="grid grid-cols-5 gap-1 text-center">
                    {retailSteps.map((step, idx) => {
                      const currentIdx = getStepActiveIndex(result.order.order_status);
                      const isComplete = idx <= currentIdx;
                      return (
                        <div key={step} className="flex flex-col items-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isComplete ? 'bg-[#138443] text-white' : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {isComplete ? '✓' : idx + 1}
                          </div>
                          <span className={`text-[10px] mt-1 line-clamp-1 ${isComplete ? 'font-bold text-[#138443]' : 'text-slate-400'}`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ordered Items */}
                <div className="pt-2 border-t border-[#E6EBDD]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#68756B] mb-1.5">Items in Order</div>
                  <div className="space-y-1">
                    {result.items?.map((it: any) => (
                      <div key={it.id} className="flex justify-between text-xs">
                        <span>{it.quantity}x {it.product_name}</span>
                        <span className="font-semibold text-[#183D2B]">₹{it.total_price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-bold text-xs pt-2 border-t border-[#E6EBDD]/60 mt-2">
                    <span>Total Order Amount:</span>
                    <span className="text-[#138443]">₹{result.order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Result View: Bulk Wholesale Enquiry */}
          {result && activeTab === 'bulk' && result.enquiry && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 bg-[#FFFEF7] border border-[#E6EBDD] rounded-2xl space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-[#E6EBDD] pb-2">
                  <div>
                    <span className="text-[#68756B]">Enquiry Ref: </span>
                    <span className="font-bold text-[#F7941D] text-sm">{result.enquiry.enquiryNumber}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-[#FFC928]/20 text-[#183D2B] border border-[#FFC928]/40">
                    {result.enquiry.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#68756B]">Business: </span>
                    <span className="font-semibold text-[#183D2B]">{result.enquiry.businessName}</span>
                  </div>
                  <div>
                    <span className="text-[#68756B]">Contact: </span>
                    <span className="font-semibold text-[#183D2B]">{result.enquiry.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[#68756B]">City: </span>
                    <span className="font-semibold text-[#183D2B]">{result.enquiry.city}</span>
                  </div>
                  <div>
                    <span className="text-[#68756B]">Submitted On: </span>
                    <span className="font-semibold text-[#183D2B]">{new Date(result.enquiry.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Quotation Info if available */}
                {result.quotationAvailable && result.quotation && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
                    <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Formal Quotation Prepared (#{result.quotation.quotation_number})</span>
                    </div>
                    <div className="flex justify-between text-emerald-900">
                      <span>Total Quoted Amount:</span>
                      <span className="font-bold text-sm">₹{result.quotation.grand_total.toFixed(2)}</span>
                    </div>
                    <div className="text-[11px] text-emerald-700">
                      Quotation Validity: {result.quotation.validity_date}
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="pt-2 border-t border-[#E6EBDD]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#68756B] mb-1.5">Requested Drinks</div>
                  <div className="space-y-1">
                    {result.items?.map((it: any) => (
                      <div key={it.id} className="flex justify-between text-xs">
                        <span>{it.product_name} ({it.pack_size})</span>
                        <span className="font-bold text-[#138443]">{it.requested_quantity} {it.unit_label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
