import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ArrowRight, Loader2, PhoneCall, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { submitRetailOrder } from '../services/api';

interface RetailCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderNumber: string) => void;
}

export const RetailCheckoutModal: React.FC<RetailCheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { customerUser, isDealerRetailer } = useAuth();

  const [formData, setFormData] = useState({
    customerName: customerUser?.fullName || '',
    customerPhone: customerUser?.phone || '',
    customerEmail: customerUser?.email || '',
    deliveryAddress: '',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500001',
    paymentMethod: 'Direct Contact / Order Enquiry',
    notes: '',
  });

  useEffect(() => {
    if (customerUser) {
      setFormData(prev => ({
        ...prev,
        customerName: prev.customerName || customerUser.fullName || '',
        customerPhone: prev.customerPhone || customerUser.phone || '',
        customerEmail: prev.customerEmail || customerUser.email || '',
      }));
    }
  }, [customerUser]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.customerName.trim() || !formData.customerPhone.trim() || !formData.deliveryAddress.trim() || !formData.city.trim()) {
      setError('Please fill in your name, contact phone number, and delivery address.');
      return;
    }

    const cleanPhone = formData.customerPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        customerEmail: formData.customerEmail.trim() || undefined,
        deliveryAddress: formData.deliveryAddress.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        paymentMethod: 'Direct Contact / Order Enquiry',
        notes: formData.notes.trim() || undefined,
        items: items.map(it => ({
          productId: it.product.id,
          quantity: it.quantity,
        })),
      };

      const result = await submitRetailOrder(orderPayload);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#138443', '#8CC63E', '#FFC928', '#F7941D']
        });
      } catch {
        // Ignore if canvas-confetti fails in test environments
      }

      setConfirmedOrder(result);
      clearCart();
      onOrderSuccess(result.orderNumber);
    } catch (err: any) {
      setError(err.message || 'Failed to submit order enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[94vh] flex flex-col overflow-hidden shadow-2xl border border-[#E6EBDD] animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        {/* Mobile handle pill */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-2.5 sm:hidden shrink-0"></div>

        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#FFFEF7] border-b border-[#E6EBDD] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#138443]/10 text-[#138443] rounded-xl">
              <PhoneCall className="w-5 h-5 text-[#138443]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#183D2B] font-poppins">
                {isDealerRetailer ? 'Dealer Order Enquiry' : 'Send Order Enquiry / Get in Touch'}
              </h2>
              <p className="text-xs text-[#68756B]">Direct door delivery and customer assistance across Telangana & AP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#68756B] hover:text-[#183D2B] rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 pb-safe">
          {confirmedOrder ? (
            /* Order Confirmation View */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-[#138443] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-[#183D2B] font-poppins">
                Order Enquiry Submitted Successfully!
              </h3>
              <p className="text-sm text-[#68756B] max-w-md mx-auto">
                Thank you for choosing Juci Cool. Our dispatch desk will get in touch directly via Phone/WhatsApp to confirm your delivery and coordinate fulfillment.
              </p>

              <div className="p-4 bg-[#FFFEF7] rounded-2xl border border-[#E6EBDD] max-w-sm mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#68756B]">Enquiry Reference:</span>
                  <span className="font-bold text-[#138443] text-sm">{confirmedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68756B]">Customer Name:</span>
                  <span className="font-semibold text-[#183D2B]">{formData.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68756B]">Contact Phone:</span>
                  <span className="font-semibold text-[#183D2B]">{formData.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68756B]">City:</span>
                  <span className="font-semibold text-[#183D2B]">{formData.city}</span>
                </div>
                <div className="flex justify-between border-t border-[#E6EBDD] pt-2">
                  <span className="text-[#68756B] font-medium">Estimated Value:</span>
                  <span className="font-extrabold text-base text-[#138443]">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-[#138443] text-white hover:bg-[#0d6131] transition-colors"
                >
                  Continue Browsing Catalog
                </button>
              </div>
            </div>
          ) : (
            /* Enquiry Form View */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                  {error}
                </div>
              )}

              {/* No Payment Required Notice */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-[#138443] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-[#183D2B] block">No Online Payment Required</span>
                  <p className="text-[#68756B] mt-0.5 leading-relaxed">
                    Submit your order enquiry below. Our customer support desk will contact you directly to confirm delivery and fulfillment details.
                  </p>
                </div>
              </div>

              {/* Contact & Delivery Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443] focus:ring-1 focus:ring-[#138443]"
                  />
                </div>

                {/* Mobile Phone */}
                <div>
                  <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                    Mobile Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98490 00000"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443] focus:ring-1 focus:ring-[#138443]"
                  />
                </div>

                {/* Email Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="ramesh@example.com"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443] focus:ring-1 focus:ring-[#138443]"
                  />
                </div>

                {/* Street Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                    Complete Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House / Flat No., Apartment / Building Name, Street, Landmark"
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443] focus:ring-1 focus:ring-[#138443]"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Hyderabad"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443] focus:ring-1 focus:ring-[#138443]"
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="500001"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443] focus:ring-1 focus:ring-[#138443]"
                  />
                </div>
              </div>

              {/* Order Summary Snapshot */}
              <div className="p-3.5 bg-[#FFFEF7] rounded-xl border border-[#E6EBDD] text-xs space-y-1.5">
                <div className="flex justify-between text-[#68756B]">
                  <span>Items ({items.length} beverage types):</span>
                  <span className="font-semibold text-[#183D2B]">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#68756B]">
                  <span>Delivery Charges:</span>
                  <span className={`font-semibold ${deliveryFee === 0 ? 'text-[#138443]' : 'text-[#183D2B]'}`}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#183D2B] pt-1.5 border-t border-[#E6EBDD]">
                  <span>Estimated Total:</span>
                  <span className="text-[#138443]">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide text-white bg-[#138443] hover:bg-[#0d6131] shadow-lg shadow-[#138443]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting Your Enquiry...
                  </>
                ) : (
                  <>
                    <span>Submit Order Enquiry / Get in Touch</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
