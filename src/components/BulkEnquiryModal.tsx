import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Clock,
  Sparkles,
  MessageCircle,
  ExternalLink,
  Phone,
  User,
  Package
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product } from '../types';
import { submitBulkEnquiry } from '../services/api';

interface BulkEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableProducts: Product[];
  initialProduct?: Product | null;
}

export const BulkEnquiryModal: React.FC<BulkEnquiryModalProps> = ({
  isOpen,
  onClose,
  availableProducts,
  initialProduct,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(100);
  const [unitLabel, setUnitLabel] = useState<string>('Cartons');

  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('Hyderabad');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialProduct) {
        setSelectedProductId(initialProduct.id);
        setQuantity(initialProduct.min_wholesale_qty || 100);
      } else if (availableProducts.length > 0) {
        setSelectedProductId(availableProducts[0].id);
        setQuantity(availableProducts[0].min_wholesale_qty || 100);
      }
      setIsSubmitted(false);
      setError(null);
    }
  }, [isOpen, initialProduct, availableProducts]);

  if (!isOpen) return null;

  const currentProduct = availableProducts.find(p => p.id === selectedProductId) || initialProduct;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError('Please enter your name.');
      return;
    }

    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!currentProduct) {
      setError('Please select a product for the bulk enquiry.');
      return;
    }

    setLoading(true);
    let enquiryNumber = `JC-BLK-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const payload = {
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        businessName: 'Wholesale Buyer',
        customerType: 'Retailer',
        city: city.trim() || 'Hyderabad',
        state: 'Telangana',
        preferredContactMethod: 'WhatsApp',
        additionalNotes: 'Requested bulk wholesale quotation. Staff will contact within 12 hours.',
        items: [
          {
            productId: currentProduct.id,
            quantity: Number(quantity) || 100,
            unitLabel,
          },
        ],
      };

      const result = await submitBulkEnquiry(payload);
      if (result?.enquiryNumber) {
        enquiryNumber = result.enquiryNumber;
      }
    } catch (err: any) {
      console.warn('Backend bulk enquiry notice (proceeding with WhatsApp):', err);
    }

    // Build WhatsApp message
    const whatsappPhone = '919393122122';
    const messageLines = [
      '📦 *BULK WHOLESALE ENQUIRY - JUCI COOL* 📦',
      '━━━━━━━━━━━━━━━━━━━━━',
      `📋 *Enquiry Ref:* ${enquiryNumber}`,
      '',
      '👤 *CUSTOMER DETAILS:*',
      `• *Name:* ${customerName.trim()}`,
      `• *Mobile:* ${phoneNumber.trim()}`,
      city.trim() ? `• *City:* ${city.trim()}` : null,
      '',
      '🛒 *BULK PRODUCT & QUANTITY:*',
      `• *Product:* ${currentProduct.name} (${currentProduct.pack_size || ''})`,
      `• *Required Quantity:* ${quantity} ${unitLabel}`,
      `• *Flavor / Variety:* ${currentProduct.flavor || 'Standard'}`,
      '',
      '━━━━━━━━━━━━━━━━━━━━━',
      '⏰ *Notice:* Our staff will contact you within 12 hours.',
      'Please send the wholesale quotation and delivery timeline. Thank you!',
    ].filter(Boolean).join('\n');

    const generatedUrl = `https://api.whatsapp.com/send?phone=${whatsappPhone}&text=${encodeURIComponent(messageLines)}`;

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#138443', '#8CC63E', '#FFC928']
      });
    } catch {
      // Ignore if canvas-confetti is not available
    }

    setSubmittedRef(enquiryNumber);
    setWhatsappUrl(generatedUrl);
    setIsSubmitted(true);
    setLoading(false);

    // Redirect to WhatsApp
    try {
      const win = window.open(generatedUrl, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = generatedUrl;
      }
    } catch {
      window.location.href = generatedUrl;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[94vh] flex flex-col overflow-hidden shadow-2xl border border-[#E6EBDD] animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        {/* Mobile handle pill */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-2.5 sm:hidden shrink-0"></div>

        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#FFFEF7] border-b border-[#E6EBDD] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 sm:p-2.5 bg-[#FFC928]/20 text-[#183D2B] rounded-xl border border-[#FFC928]/40">
              <Building2 className="w-5 h-5 text-[#F7941D]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#183D2B] font-poppins">
                Get Bulk Wholesale Quotation
              </h2>
              <p className="text-[11px] sm:text-xs text-[#68756B]">
                Direct factory pricing for retailers, shops & bulk orders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#68756B] hover:text-[#183D2B] rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 pb-safe">
          {isSubmitted ? (
            /* ================= SUBMISSION CONFIRMATION ================= */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-[#25D366]/15 text-[#138443] rounded-full flex items-center justify-center mx-auto shadow-inner border border-[#25D366]/30">
                <CheckCircle2 className="w-10 h-10 text-[#138443]" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 mb-2">
                  ⚡ 12-Hour Callback Guarantee
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#183D2B] font-poppins">
                  Our staff will contact you within 12 hours!
                </h3>
              </div>

              <div className="p-4 bg-[#FFFEF7] border border-[#E6EBDD] rounded-2xl max-w-sm mx-auto text-center space-y-1.5">
                <div className="text-xs text-[#68756B]">Your Bulk Reference Number</div>
                <div className="text-lg font-black text-[#138443] tracking-wider font-mono">
                  {submittedRef}
                </div>
                <div className="text-xs text-[#183D2B] font-medium pt-1 border-t border-[#E6EBDD]">
                  {customerName} • {phoneNumber}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#68756B] max-w-sm mx-auto leading-relaxed">
                We've also redirected your enquiry directly to Juci Cool on WhatsApp (<strong>+91 9393122122</strong>). If WhatsApp didn't open automatically, tap below:
              </p>

              {whatsappUrl && (
                <div className="py-2 flex justify-center">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-2.5 shadow-lg shadow-[#25D366]/30 transition-all transform hover:scale-105 active:scale-95"
                  >
                    <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                    <span>Open in WhatsApp (+91 9393122122)</span>
                    <ExternalLink className="w-4 h-4 opacity-80" />
                  </a>
                </div>
              )}

              <div className="pt-2 flex justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-[#183D2B] text-white hover:bg-[#138443] shadow-md transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          ) : (
            /* ================= ENTER DETAILS FORM ================= */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                  {error}
                </div>
              )}

              {/* 12-Hour Service Commitment Banner */}
              <div className="p-3 bg-gradient-to-r from-amber-50 to-[#FFF9E6] rounded-2xl border border-amber-200 flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-amber-900 block">
                    Fast Response Guarantee
                  </span>
                  <p className="text-amber-800 mt-0.5 leading-relaxed">
                    Enter your details below. <strong>Our staff will contact you within 12 hours</strong> with tiered wholesale prices and freight quotes.
                  </p>
                </div>
              </div>

              {/* Selected Product Card */}
              {currentProduct && (
                <div className="p-3 bg-[#F4F8F0] rounded-2xl border border-[#E6EBDD] flex items-center gap-3">
                  <img
                    src={currentProduct.shot_image_url || currentProduct.image_url}
                    alt={currentProduct.name}
                    className="w-14 h-14 object-contain rounded-xl bg-white p-1 border border-[#E6EBDD]"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#138443] bg-emerald-100 px-2 py-0.5 rounded-full">
                      {currentProduct.flavor}
                    </span>
                    <h4 className="text-xs font-bold text-[#183D2B] truncate mt-0.5">
                      {currentProduct.name}
                    </h4>
                    <p className="text-[11px] text-[#68756B]">
                      {currentProduct.pack_size} • MOQ: {currentProduct.min_wholesale_qty || 100} units
                    </p>
                  </div>
                </div>
              )}

              {/* Quantity & Unit Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#183D2B] mb-1">
                    Quantity Required
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E6EBDD] font-bold text-[#183D2B] focus:outline-none focus:border-[#138443] focus:ring-1 focus:ring-[#138443]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#183D2B] mb-1">
                    Unit Type
                  </label>
                  <select
                    value={unitLabel}
                    onChange={(e) => setUnitLabel(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E6EBDD] bg-white font-semibold text-[#183D2B] focus:outline-none focus:border-[#138443]"
                  >
                    <option value="Cartons">Cartons (Bulk boxes)</option>
                    <option value="Units">Bottles / Pouches (Units)</option>
                    <option value="Crates">Crates</option>
                  </select>
                </div>
              </div>

              {/* Enter Name */}
              <div>
                <label className="block text-xs font-bold text-[#183D2B] mb-1">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443] focus:ring-1 focus:ring-[#138443]"
                  />
                  <User className="w-4 h-4 text-[#68756B] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Enter Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-[#183D2B] mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="+91 93931 22122"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443] focus:ring-1 focus:ring-[#138443]"
                  />
                  <Phone className="w-4 h-4 text-[#68756B] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Optional City */}
              <div>
                <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                  City / Location <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hyderabad, Warangal, Vijayawada"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide text-white bg-[#138443] hover:bg-[#0d6131] shadow-lg shadow-[#138443]/20 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting Bulk Enquiry...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5 fill-white text-[#138443]" />
                    <span>Submit & Connect on WhatsApp (+91 9393122122)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-[#68756B]">
                ⚡ Submitting will notify our wholesale desk and redirect you directly to WhatsApp.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
