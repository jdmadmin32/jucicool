import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ArrowRight, Loader2, PhoneCall, Sparkles, MessageCircle, ExternalLink } from 'lucide-react';
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
  const { items, subtotal, deliveryFee, total, clearCart, getItemPrice } = useCart();
  const { customerUser, isDealerRetailer } = useAuth();

  const [formData, setFormData] = useState({
    customerName: customerUser?.fullName || '',
    customerPhone: customerUser?.phone || '',
    customerEmail: customerUser?.email || '',
    deliveryAddress: '',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500001',
    paymentMethod: 'Direct Contact / WhatsApp Order',
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

  // Build formatted WhatsApp message and redirect URL
  const buildRetailWhatsAppUrl = (
    orderNum: string,
    currentItems: typeof items,
    itemsSubtotal: number,
    fee: number,
    finalTotal: number
  ) => {
    const whatsappNumber = '919393122122';

    const itemsSummary = currentItems.map((it, idx) => {
      const uPrice = getItemPrice(it.product);
      const lineTotal = uPrice * it.quantity;
      return `${idx + 1}. *${it.product.name}* (${it.product.pack_size || it.product.packaging_type || ''})\n   • Quantity: *${it.quantity}*\n   • Unit Rate: ₹${uPrice.toFixed(2)}\n   • Item Total: ₹${lineTotal.toFixed(2)}`;
    }).join('\n\n');

    const messageLines = [
      '🍹 *NEW ORDER - JUCI COOL* 🍹',
      '━━━━━━━━━━━━━━━━━━━━━',
      `📋 *Order Ref:* ${orderNum}`,
      '',
      '👤 *CUSTOMER DETAILS:*',
      `• *Name:* ${formData.customerName.trim()}`,
      `• *Phone:* ${formData.customerPhone.trim()}`,
      formData.customerEmail.trim() ? `• *Email:* ${formData.customerEmail.trim()}` : null,
      `• *Delivery Address:* ${formData.deliveryAddress.trim()}`,
      `• *City / State:* ${formData.city.trim()}, ${formData.state.trim()} - ${formData.pincode.trim()}`,
      formData.notes.trim() ? `• *Customer Notes:* ${formData.notes.trim()}` : null,
      '',
      '🛒 *ORDERED ITEMS & QUANTITIES:*',
      itemsSummary,
      '',
      '━━━━━━━━━━━━━━━━━━━━━',
      `💰 *Items Subtotal:* ₹${itemsSubtotal.toFixed(2)}`,
      `🚚 *Delivery Fee:* ${fee === 0 ? 'FREE' : `₹${fee.toFixed(2)}`}`,
      `💵 *TOTAL AMOUNT:* *₹${finalTotal.toFixed(2)}*`,
      '━━━━━━━━━━━━━━━━━━━━━',
      'Please confirm my order and share delivery details. Thank you!',
    ].filter(Boolean).join('\n');

    return `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(messageLines)}`;
  };

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

    if (items.length === 0) {
      setError('Your cart is empty. Please select products to order.');
      return;
    }

    setLoading(true);

    // Snapshot current cart data before clearing
    const itemsSnapshot = [...items];
    const subtotalSnapshot = subtotal;
    const feeSnapshot = deliveryFee;
    const totalSnapshot = total;

    let orderNumber = `JC-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const orderPayload = {
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        customerEmail: formData.customerEmail.trim() || undefined,
        deliveryAddress: formData.deliveryAddress.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        paymentMethod: 'Direct Contact / WhatsApp Order',
        notes: formData.notes.trim() || undefined,
        items: itemsSnapshot.map(it => ({
          productId: it.product.id,
          quantity: it.quantity,
        })),
      };

      const result = await submitRetailOrder(orderPayload);
      if (result && result.orderNumber) {
        orderNumber = result.orderNumber;
      }
    } catch (err: any) {
      console.warn('Backend order recording notice (proceeding with WhatsApp):', err);
    }

    // Generate WhatsApp Link with all selected data
    const whatsappUrl = buildRetailWhatsAppUrl(
      orderNumber,
      itemsSnapshot,
      subtotalSnapshot,
      feeSnapshot,
      totalSnapshot
    );

    // Trigger Confetti Celebration!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#138443', '#8CC63E', '#FFC928', '#F7941D']
      });
    } catch {
      // Ignore if canvas-confetti fails
    }

    setConfirmedOrder({
      orderNumber,
      customerName: formData.customerName.trim(),
      customerPhone: formData.customerPhone.trim(),
      city: formData.city.trim(),
      total: totalSnapshot,
      whatsappUrl,
      itemCount: itemsSnapshot.reduce((sum, it) => sum + it.quantity, 0),
    });

    clearCart();
    onOrderSuccess(orderNumber);
    setLoading(false);

    // Redirect to WhatsApp with number 9393122122
    try {
      const win = window.open(whatsappUrl, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = whatsappUrl;
      }
    } catch {
      window.location.href = whatsappUrl;
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
            <div className="p-2 bg-[#25D366]/15 text-[#138443] rounded-xl border border-[#25D366]/30">
              <MessageCircle className="w-5 h-5 text-[#138443]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#183D2B] font-poppins">
                {isDealerRetailer ? 'Dealer Order via WhatsApp' : 'Order via WhatsApp / Direct Delivery'}
              </h2>
              <p className="text-xs text-[#68756B]">Direct dispatch to WhatsApp (+91 9393122122) • Telangana & AP</p>
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
              <div className="w-16 h-16 bg-[#25D366]/15 text-[#138443] rounded-full flex items-center justify-center mx-auto shadow-inner border border-[#25D366]/30">
                <CheckCircle2 className="w-10 h-10 text-[#138443]" />
              </div>
              <h3 className="text-2xl font-bold text-[#183D2B] font-poppins">
                Order Submitted & Redirected to WhatsApp!
              </h3>
              <p className="text-sm text-[#68756B] max-w-md mx-auto">
                We've sent your order details to Juci Cool on WhatsApp (<strong className="text-[#138443]">+91 9393122122</strong>). If WhatsApp did not open automatically, tap the button below.
              </p>

              {/* Direct Open WhatsApp Button */}
              <div className="py-2 flex justify-center">
                <a
                  href={confirmedOrder.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-2.5 shadow-lg shadow-[#25D366]/30 transition-all transform hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                  <span>Open WhatsApp (+91 9393122122)</span>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>
              </div>

              <div className="p-4 bg-[#FFFEF7] rounded-2xl border border-[#E6EBDD] max-w-sm mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#68756B]">Order Reference:</span>
                  <span className="font-bold text-[#138443] text-sm">{confirmedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68756B]">Customer Name:</span>
                  <span className="font-semibold text-[#183D2B]">{confirmedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68756B]">Contact Phone:</span>
                  <span className="font-semibold text-[#183D2B]">{confirmedOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68756B]">City:</span>
                  <span className="font-semibold text-[#183D2B]">{confirmedOrder.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68756B]">Total Units:</span>
                  <span className="font-semibold text-[#183D2B]">{confirmedOrder.itemCount} items</span>
                </div>
                <div className="flex justify-between border-t border-[#E6EBDD] pt-2">
                  <span className="text-[#68756B] font-medium">Estimated Value:</span>
                  <span className="font-extrabold text-base text-[#138443]">₹{confirmedOrder.total?.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-[#183D2B] text-white hover:bg-[#138443] transition-colors"
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

              {/* WhatsApp Direct Dispatch Notice */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-[#138443] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-[#183D2B] block">Direct WhatsApp Order Confirmation</span>
                  <p className="text-[#68756B] mt-0.5 leading-relaxed">
                    When you click submit, your selected items and quantities will be sent directly to our dispatch desk on WhatsApp (<strong>+91 9393122122</strong>) for immediate delivery coordination. No advance online payment needed.
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
                    placeholder="+91 93931 22122"
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
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting & Redirecting to WhatsApp...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5 fill-white text-[#138443]" />
                    <span>Submit Order & Open in WhatsApp (+91 9393122122)</span>
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
