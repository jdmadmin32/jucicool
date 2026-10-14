import React from 'react';
import { X, Printer, Download, Building2, Phone, Mail, MapPin } from 'lucide-react';
import { Quotation } from '../../types';

interface PrintableQuotationModalProps {
  quotation: Quotation | null;
  onClose: () => void;
}

export const PrintableQuotationModal: React.FC<PrintableQuotationModalProps> = ({
  quotation,
  onClose,
}) => {
  if (!quotation) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#E6EBDD] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print p-4 bg-[#F4F8F0] border-b border-[#E6EBDD] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#138443]">Formal Wholesale Quotation</span>
            <span className="text-xs text-[#68756B]">#{quotation.quotation_number}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#138443] hover:bg-[#0d6131] text-white flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Quotation / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#68756B] hover:text-[#183D2B] rounded-full hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Quotation Sheet */}
        <div className="p-8 sm:p-12 printable-card bg-white text-[#183D2B]">
          {/* Company & Quotation Header */}
          <div className="flex justify-between items-start border-b-2 border-[#138443] pb-6 gap-6">
            <div>
              <img
                src="/images/juci-cool-logo.png"
                alt="Juci Cool"
                className="h-16 w-auto object-contain mb-2"
              />
              <div className="font-bold text-base text-[#183D2B]">JDM Fruit Products Pvt. Ltd.</div>
              <div className="text-xs text-[#68756B] mt-0.5">
                Industrial Area, Hyderabad, Telangana — 500037<br />
                GSTIN: 36AABCJ3920R1ZZ | FSSAI Lic No: 13621010000342<br />
                Phone: +91 98490 12345 | Email: sales@jucicool.com
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-[#138443] font-poppins uppercase tracking-wider">
                COMMERCIAL QUOTATION
              </div>
              <div className="text-sm font-bold text-[#183D2B] mt-1 font-mono">
                {quotation.quotation_number}
              </div>
              <div className="text-xs text-[#68756B] mt-1 space-y-0.5">
                <div>Date: {new Date(quotation.created_at || Date.now()).toLocaleDateString()}</div>
                <div>Valid Until: <span className="font-semibold text-[#183D2B]">{quotation.validity_date}</span></div>
                <div>Status: <span className="font-bold text-emerald-700">{quotation.status}</span></div>
              </div>
            </div>
          </div>

          {/* Customer / Dealer Info */}
          <div className="grid grid-cols-2 gap-8 my-6 p-4 rounded-xl bg-[#F9FAF6] border border-[#E6EBDD] text-xs">
            <div>
              <div className="text-[10px] font-bold text-[#138443] uppercase tracking-wider mb-1">
                Quotation Prepared For:
              </div>
              <div className="font-bold text-sm text-[#183D2B]">{quotation.business_name}</div>
              <div className="font-medium text-[#183D2B] mt-0.5">Attn: {quotation.customer_name}</div>
              <div className="text-[#68756B] mt-1">
                Phone: {quotation.phone_number}<br />
                {quotation.email && <>Email: {quotation.email}<br /></>}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-[#138443] uppercase tracking-wider mb-1">
                Supply Terms & Logistics:
              </div>
              <div className="text-[#68756B]">
                <strong className="text-[#183D2B]">Payment Terms:</strong> {quotation.payment_terms}<br />
                <strong className="text-[#183D2B]">Dispatch Point:</strong> Factory Warehouse, Hyderabad<br />
                <strong className="text-[#183D2B]">Authorized By:</strong> {quotation.created_by}
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <table className="w-full text-xs text-left border-collapse my-6">
            <thead>
              <tr className="bg-[#138443] text-white">
                <th className="py-2.5 px-3 rounded-l-lg font-bold">#</th>
                <th className="py-2.5 px-3 font-bold">Product Description & Packaging</th>
                <th className="py-2.5 px-3 text-center font-bold">Pack Size</th>
                <th className="py-2.5 px-3 text-center font-bold">Quantity</th>
                <th className="py-2.5 px-3 text-right font-bold">Approved Unit Price</th>
                <th className="py-2.5 px-3 text-right rounded-r-lg font-bold">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6EBDD]">
              {quotation.items?.map((it, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-semibold text-[#68756B]">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-bold text-[#183D2B]">{it.product_name}</td>
                  <td className="py-2.5 px-3 text-center text-[#68756B]">{it.pack_size}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-[#183D2B]">{it.requested_quantity}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-[#183D2B]">₹{Number(it.approved_unit_price).toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-[#183D2B]">₹{Number(it.total_price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Summary */}
          <div className="flex justify-end my-6">
            <div className="w-72 space-y-2 text-xs">
              <div className="flex justify-between text-[#68756B]">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-[#183D2B]">₹{quotation.subtotal.toFixed(2)}</span>
              </div>
              {quotation.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Trade Discount ({quotation.discount_percent}%):</span>
                  <span className="font-semibold">-₹{quotation.discount_amount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#68756B]">
                <span>GST Tax ({quotation.tax_percent}%):</span>
                <span className="font-semibold text-[#183D2B]">₹{quotation.tax_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#68756B]">
                <span>Freight & Delivery:</span>
                <span className="font-semibold text-[#183D2B]">₹{quotation.delivery_charges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t-2 border-[#183D2B] text-sm font-bold text-[#183D2B]">
                <span>Final Quotation Value:</span>
                <span className="text-base font-black text-[#138443]">₹{quotation.grand_total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          {quotation.notes_conditions && (
            <div className="p-3 bg-[#F9FAF6] rounded-xl border border-[#E6EBDD] text-xs space-y-1 mb-8">
              <div className="font-bold text-[#183D2B]">Terms & Conditions:</div>
              <div className="text-[#68756B] leading-relaxed">{quotation.notes_conditions}</div>
            </div>
          )}

          {/* Signature Block */}
          <div className="pt-8 border-t border-[#E6EBDD] flex justify-between items-end text-xs text-[#68756B]">
            <div>
              <div className="font-bold text-[#183D2B]">Prepared By:</div>
              <div>{quotation.created_by} — Commercial Desk</div>
              <div>JDM Fruit Products Pvt. Ltd.</div>
            </div>
            <div className="text-right">
              <div className="w-48 border-b border-[#183D2B] mb-1"></div>
              <div className="font-bold text-[#183D2B]">Authorized Signatory</div>
              <div>(Seal & Signature)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
