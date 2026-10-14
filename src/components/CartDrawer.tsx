import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Building2, Truck, AlertTriangle, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface CartDrawerProps {
  onProceedCheckout: () => void;
  onTransferToBulk: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedCheckout,
  onTransferToBulk,
}) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    getItemPrice,
    getItemMinQty,
    subtotal,
    deliveryFee,
    total,
  } = useCart();
  const { isDealerRetailer } = useAuth();

  // Check if any items violate MOQ for dealer
  const hasMoqViolation = isDealerRetailer && items.some(item => item.quantity < (item.product.min_wholesale_qty || 10));

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-[#E6EBDD] animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#E6EBDD] flex items-center justify-between bg-[#FFFEF7]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#138443]/10 text-[#138443] rounded-xl">
                {isDealerRetailer ? <Store className="w-5 h-5 text-[#138443]" /> : <ShoppingBag className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#183D2B] font-poppins">
                  {isDealerRetailer ? 'Dealer Cart (Bulk Rates)' : 'Your Order Enquiry Cart'}
                </h2>
                <p className="text-xs text-[#68756B]">
                  {isDealerRetailer ? 'Wholesale rates applied' : `${items.length} unique drink items`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#68756B] hover:text-[#183D2B] rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Notice */}
          <div className="bg-[#F4F8F0] px-5 py-2.5 text-xs text-[#138443] font-medium flex items-center justify-between border-b border-[#E6EBDD]">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4" />
              {subtotal >= 100
                ? 'Eligible for Free Standard Delivery!'
                : `Add ₹${(100 - subtotal).toFixed(2)} more for Free Delivery`}
            </span>
            <span className="font-bold">{subtotal >= 100 ? 'FREE' : '₹20 fee'}</span>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-[#68756B]">
                <div className="w-16 h-16 rounded-full bg-[#F4F8F0] flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-[#138443]" />
                </div>
                <h3 className="font-semibold text-base text-[#183D2B]">Your cart is empty</h3>
                <p className="text-xs text-[#68756B] mt-1 max-w-xs">
                  Explore Juci Cool's refreshing fruit drinks, mango juices, candies, and jellies!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-6 py-2.5 rounded-xl font-bold text-xs bg-[#138443] text-white shadow-sm hover:bg-[#0d6131]"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => {
                const unitPrice = getItemPrice(item.product);
                const minMoq = isDealerRetailer ? (item.product.min_wholesale_qty || 10) : 1;
                const isBelowMoq = isDealerRetailer && item.quantity < minMoq;

                return (
                  <div
                    key={item.product.id}
                    className={`flex items-center gap-3.5 p-3 rounded-2xl bg-[#FFFEF7] border transition-colors ${
                      isBelowMoq
                        ? 'border-amber-400 bg-amber-50/40'
                        : 'border-[#E6EBDD] hover:border-[#8CC63E]/60'
                    }`}
                  >
                    <img
                      src={item.product.shot_image_url || item.product.image_url}
                      alt={item.product.name}
                      className="w-16 h-16 object-contain rounded-xl bg-white p-1 border border-[#E6EBDD]/60"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#183D2B] truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-[#68756B]">{item.product.pack_size}</p>
                      
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs font-extrabold text-[#138443]">
                          ₹{unitPrice.toFixed(2)} each
                        </span>
                        {isDealerRetailer && (
                          <span className="text-[10px] text-[#68756B] line-through">
                            ₹{item.product.retail_price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {isDealerRetailer && (
                        <div className="mt-1">
                          {isBelowMoq ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                              <AlertTriangle className="w-3 h-3" /> Min MOQ: {minMoq} units
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-700 font-semibold">
                              ✓ MOQ Met ({minMoq}+)
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center border border-[#E6EBDD] rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.max(isDealerRetailer ? minMoq : 1, item.quantity - (isDealerRetailer ? 5 : 1)))}
                          className="p-1 hover:text-[#138443]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="min-w-6 text-center text-xs font-bold text-[#183D2B]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + (isDealerRetailer ? 5 : 1))}
                          className="p-1 hover:text-[#138443]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-xs font-bold text-[#183D2B]">
                        ₹{(unitPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Subtotals & Actions */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#E6EBDD] bg-[#FFFEF7] space-y-3.5">
              {hasMoqViolation && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-center gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>Some items are below Dealer MOQ. Please adjust quantities to proceed.</span>
                </div>
              )}

              <div className="space-y-1.5 text-xs text-[#68756B]">
                <div className="flex justify-between">
                  <span>Subtotal {isDealerRetailer && '(Dealer Bulk Rates)'}</span>
                  <span className="font-semibold text-[#183D2B]">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className={`font-semibold ${deliveryFee === 0 ? 'text-[#138443]' : 'text-[#183D2B]'}`}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#E6EBDD] text-sm font-bold text-[#183D2B]">
                  <span>Total Amount</span>
                  <span className="text-lg font-black text-[#138443]">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout / Enquiry Button */}
              <button
                onClick={() => {
                  if (hasMoqViolation) {
                    alert('Please meet the Minimum Order Quantity (MOQ) for all items before checking out.');
                    return;
                  }
                  setIsCartOpen(false);
                  onProceedCheckout();
                }}
                disabled={hasMoqViolation}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide text-white bg-[#138443] hover:bg-[#0d6131] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#138443]/20 transition-all flex items-center justify-center gap-2 group"
              >
                <span>{isDealerRetailer ? 'Send Dealer Order Enquiry' : 'Send Order Enquiry / Get in Touch'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Transfer to Wholesale Option */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onTransferToBulk();
                }}
                className="w-full py-2.5 px-3 rounded-xl font-medium text-xs text-[#183D2B] bg-[#FFF8E7] hover:bg-[#FFC928]/30 border border-[#FFC928]/60 transition-colors flex items-center justify-center gap-1.5"
              >
                <Building2 className="w-4 h-4 text-[#F7941D]" />
                <span>Buying for business? Enquire Bulk Wholesale Price instead</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
