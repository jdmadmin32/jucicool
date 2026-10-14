import React, { useState, useEffect } from 'react';
import { X, Building2, Calculator, CheckCircle2, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { BulkEnquiry } from '../../types';
import { createQuotationForEnquiry } from '../../services/api';

interface QuotationBuilderModalProps {
  enquiry: BulkEnquiry | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const QuotationBuilderModal: React.FC<QuotationBuilderModalProps> = ({
  enquiry,
  onClose,
  onSuccess,
}) => {
  const [items, setItems] = useState<{
    productId: number;
    productName: string;
    packSize: string;
    requestedQuantity: number;
    unitLabel: string;
    approvedUnitPrice: number;
  }[]>([]);

  const [discountPercent, setDiscountPercent] = useState<number>(5);
  const [taxPercent, setTaxPercent] = useState<number>(12); // 12% standard GST on beverages
  const [deliveryCharges, setDeliveryCharges] = useState<number>(800);
  const [validityDate, setValidityDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });
  const [paymentTerms, setPaymentTerms] = useState<string>(
    '50% Advance via RTGS / Bank Transfer, Balance on Delivery'
  );
  const [notesConditions, setNotesConditions] = useState<string>(
    'Trade quotation valid for 15 days. Minimum carton order applicable. Dispatch within 3 days of advance receipt.'
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (enquiry) {
      setItems(
        (enquiry.items || []).map((it) => ({
          productId: it.product_id,
          productName: it.product_name,
          packSize: it.pack_size,
          requestedQuantity: it.requested_quantity,
          unitLabel: it.unit_label,
          approvedUnitPrice: it.product_name.includes('Pouch') ? 7.50 : it.product_name.includes('Bottle') ? 16.00 : 20.00,
        }))
      );
      setError(null);
    }
  }, [enquiry]);

  if (!enquiry) return null;

  // Calculations
  const subtotal = items.reduce((sum, it) => sum + (Number(it.requestedQuantity) * Number(it.approvedUnitPrice)), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxPercent) / 100;
  const grandTotal = taxableAmount + taxAmount + Number(deliveryCharges);

  const handlePriceChange = (index: number, newPrice: number) => {
    const updated = [...items];
    updated[index].approvedUnitPrice = newPrice;
    setItems(updated);
  };

  const handleQtyChange = (index: number, newQty: number) => {
    const updated = [...items];
    updated[index].requestedQuantity = newQty;
    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    for (const it of items) {
      if (!it.approvedUnitPrice || it.approvedUnitPrice <= 0) {
        setError(`Please enter a valid approved wholesale unit price for ${it.productName}`);
        setLoading(false);
        return;
      }
    }

    try {
      await createQuotationForEnquiry(enquiry.id, {
        items,
        discountPercent,
        taxPercent,
        deliveryCharges,
        validityDate,
        paymentTerms,
        notesConditions,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create quotation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#E6EBDD] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#FFFEF7] border-b border-[#E6EBDD] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#138443]/10 text-[#138443] rounded-xl">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#183D2B] font-poppins">
                Wholesale Quotation Builder
              </h2>
              <p className="text-xs text-[#68756B]">
                Enquiry #{enquiry.enquiry_number} • {enquiry.business_name} ({enquiry.customer_name})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#68756B] hover:text-[#183D2B] rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          {/* Customer Overview */}
          <div className="p-4 bg-[#F9FAF6] rounded-2xl border border-[#E6EBDD] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[#68756B]">Business Name:</span>
              <div className="font-bold text-[#183D2B] truncate">{enquiry.business_name}</div>
            </div>
            <div>
              <span className="text-[#68756B]">Contact Person:</span>
              <div className="font-bold text-[#183D2B] truncate">{enquiry.customer_name}</div>
            </div>
            <div>
              <span className="text-[#68756B]">Phone:</span>
              <div className="font-bold text-[#183D2B]">{enquiry.phone_number}</div>
            </div>
            <div>
              <span className="text-[#68756B]">City:</span>
              <div className="font-bold text-[#183D2B]">{enquiry.city}, {enquiry.state}</div>
            </div>
          </div>

          {/* Pricing Table (Line Items) */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-[#183D2B] flex items-center justify-between">
              <span>Approved Wholesale Unit Rates</span>
              <span className="text-[#68756B] font-normal text-[11px]">
                Private unit prices set by admin for this quotation
              </span>
            </div>

            <div className="border border-[#E6EBDD] rounded-2xl overflow-hidden divide-y divide-[#E6EBDD]">
              {items.map((it, idx) => (
                <div key={idx} className="p-3.5 bg-white flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
                  <div className="flex-1 min-w-[160px]">
                    <div className="font-bold text-xs text-[#183D2B]">{it.productName}</div>
                    <div className="text-[11px] text-[#68756B]">{it.packSize}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div>
                      <label className="block text-[10px] text-[#68756B] font-semibold">Quantity</label>
                      <input
                        type="number"
                        min={1}
                        value={it.requestedQuantity}
                        onChange={(e) => handleQtyChange(idx, Math.max(1, Number(e.target.value)))}
                        className="w-20 px-2 py-1 text-xs font-bold border border-[#E6EBDD] rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#68756B] font-semibold">
                        Wholesale Unit Price (₹)
                      </label>
                      <input
                        type="number"
                        step="0.10"
                        min={0.10}
                        value={it.approvedUnitPrice}
                        onChange={(e) => handlePriceChange(idx, Number(e.target.value))}
                        className="w-24 px-2.5 py-1 text-xs font-bold text-[#138443] border border-[#138443] bg-emerald-50/50 rounded-lg focus:outline-none"
                      />
                    </div>

                    <div className="text-right min-w-[70px]">
                      <label className="block text-[10px] text-[#68756B]">Line Total</label>
                      <div className="text-xs font-black text-[#183D2B]">
                        ₹{(it.requestedQuantity * it.approvedUnitPrice).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discount, Tax & Delivery Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                Bulk Discount (%)
              </label>
              <input
                type="number"
                min={0}
                max={50}
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E6EBDD]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                GST Tax (%)
              </label>
              <input
                type="number"
                min={0}
                max={28}
                value={taxPercent}
                onChange={(e) => setTaxPercent(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E6EBDD]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                Freight & Delivery (₹)
              </label>
              <input
                type="number"
                min={0}
                value={deliveryCharges}
                onChange={(e) => setDeliveryCharges(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E6EBDD]"
              />
            </div>
          </div>

          {/* Quotation Validity & Payment Terms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                Quotation Validity Date
              </label>
              <input
                type="date"
                required
                value={validityDate}
                onChange={(e) => setValidityDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E6EBDD]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                Payment Terms
              </label>
              <input
                type="text"
                required
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E6EBDD]"
              />
            </div>
          </div>

          {/* Terms & Conditions */}
          <div>
            <label className="block text-xs font-semibold text-[#183D2B] mb-1">
              Quotation Conditions / Notes
            </label>
            <textarea
              rows={2}
              value={notesConditions}
              onChange={(e) => setNotesConditions(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E6EBDD]"
            />
          </div>

          {/* Calculations Summary Card */}
          <div className="p-4 bg-[#FFFEF7] border border-[#E6EBDD] rounded-2xl flex flex-wrap justify-between items-center gap-4 text-xs">
            <div className="space-y-1 text-[#68756B]">
              <div>Subtotal: <strong className="text-[#183D2B]">₹{subtotal.toFixed(2)}</strong></div>
              <div>Discount ({discountPercent}%): <strong className="text-emerald-700">-₹{discountAmount.toFixed(2)}</strong></div>
              <div>GST Tax ({taxPercent}%): <strong className="text-[#183D2B]">₹{taxAmount.toFixed(2)}</strong></div>
              <div>Delivery Charges: <strong className="text-[#183D2B]">₹{Number(deliveryCharges).toFixed(2)}</strong></div>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold text-[#68756B] uppercase tracking-wider">Final Quotation Value</div>
              <div className="text-2xl font-black text-[#138443]">₹{grandTotal.toFixed(2)}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-[#E6EBDD] hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-[#138443] hover:bg-[#0d6131] text-white flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Quotation...
                </>
              ) : (
                <>
                  <span>Save & Issue Quotation (₹{grandTotal.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
