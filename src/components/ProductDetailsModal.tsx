import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, Building2 } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onEnquireBulk: (product: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onEnquireBulk,
}) => {
  const { addToCart } = useCart();
  const { isDealerRetailer, openLoginModal } = useAuth();

  const [activeImage, setActiveImage] = useState<string>('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImage(product.shot_image_url || product.image_url || '');
      setQty(isDealerRetailer ? (product.min_wholesale_qty || 10) : 1);
    }
  }, [product, isDealerRetailer]);

  if (!product) return null;

  // All images
  const allImages = Array.from(new Set([
    product.shot_image_url || product.image_url,
    product.image_url,
    ...(product.extra_images || [])
  ])).filter(Boolean) as string[];

  // Dealer rate set by admin
  const wholesaleRate = (product.wholesale_price && product.wholesale_price > 0) ? product.wholesale_price : product.retail_price;
  const effectiveUnitPrice = isDealerRetailer ? wholesaleRate : product.retail_price;
  const minQty = isDealerRetailer ? (product.min_wholesale_qty || 10) : 1;

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E6EBDD] animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-[#183D2B] shadow-sm border border-[#E6EBDD] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Column */}
          <div className="bg-gradient-to-tr from-[#FFF7DE] via-[#F4F8F0] to-[#E9F4E3] p-6 flex flex-col items-center justify-between relative border-b md:border-b-0 md:border-r border-[#E6EBDD]">
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#138443] border border-[#E6EBDD]">
              {product.flavor}
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
              <img
                src={activeImage}
                alt={product.name}
                className="max-h-64 max-w-full object-contain drop-shadow-md transition-all duration-300"
              />
            </div>

            {/* Extra Image Thumbnails */}
            {allImages.length > 1 && (
              <div className="w-full flex items-center justify-center gap-2 pt-2 border-t border-[#E6EBDD]/60 overflow-x-auto">
                {allImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-12 h-12 rounded-xl p-1 bg-white border transition-all shrink-0 ${
                      activeImage === imgUrl
                        ? 'border-[#138443] ring-2 ring-[#138443]/30 shadow-sm'
                        : 'border-[#E6EBDD] hover:border-[#138443]/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-[#8CC63E]">
                {product.category_name || 'Juci Cool Beverage'}
              </div>
              <h2 className="text-2xl font-bold text-[#183D2B] mt-1 font-poppins">
                {product.name}
              </h2>

              <p className="text-sm text-[#68756B] mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Specifications */}
              <div className="mt-4 pt-4 border-t border-[#E6EBDD] space-y-2 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-[#68756B]">Pack Size:</span>
                  <span className="font-semibold text-[#183D2B]">{product.pack_size}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#68756B]">Packaging Type:</span>
                  <span className="font-semibold text-[#183D2B]">{product.packaging_type}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#68756B]">Stock Availability:</span>
                  <span className={`font-semibold ${product.stock_quantity > 0 ? 'text-[#138443]' : 'text-red-500'}`}>
                    {product.stock_quantity > 0 ? `${product.stock_quantity} units available` : 'Out of stock'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#68756B]">Wholesale MOQ:</span>
                  <span className="font-semibold text-[#138443]">{product.min_wholesale_qty} units</span>
                </div>
              </div>

              {/* Price Display */}
              <div className="mt-4 p-3.5 bg-[#FFFEF7] rounded-2xl border border-[#E6EBDD] flex items-center justify-between">
                <div>
                  {isDealerRetailer ? (
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-black uppercase text-white bg-[#138443] px-2 py-0.5 rounded-full">
                          Dealer Bulk Price
                        </span>
                        <span className="text-xs text-[#68756B] line-through">
                          ₹{product.retail_price.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-2xl font-black text-[#138443]">
                        ₹{wholesaleRate.toFixed(2)}
                        <span className="text-xs font-normal text-[#68756B] ml-1">/ unit</span>
                      </div>
                      <div className="text-[10px] text-amber-700 font-bold mt-0.5">
                        Dealer MOQ: {minQty} units minimum
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[11px] font-semibold text-[#68756B]">Approved Retail Price</span>
                        <button
                          onClick={() => {
                            onClose();
                            openLoginModal('dealer');
                          }}
                          className="text-[11px] font-semibold text-[#138443] hover:underline"
                          title="Sign in with your dealer account to see wholesale rates"
                        >
                          (Dealers: Login for bulk rates)
                        </button>
                      </div>
                      <div className="text-2xl font-black text-[#183D2B]">
                        ₹{product.retail_price.toFixed(2)}
                        <span className="text-xs font-normal text-[#68756B] ml-1">/ retail unit</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quantity */}
                <div className="flex items-center border border-[#E6EBDD] rounded-xl bg-white shadow-sm">
                  <button
                    onClick={() => setQty(Math.max(minQty, qty - (isDealerRetailer ? 5 : 1)))}
                    className="p-2 hover:text-[#138443] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="min-w-8 px-1 text-center text-sm font-bold text-[#183D2B]">{qty}</span>
                  <button
                    onClick={() => setQty(qty + (isDealerRetailer ? 5 : 1))}
                    className="p-2 hover:text-[#138443] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-2.5">
              <button
                onClick={handleAdd}
                disabled={product.stock_quantity <= 0}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  added
                    ? 'bg-[#8CC63E] text-white shadow-md'
                    : 'bg-[#138443] hover:bg-[#0d6131] text-white shadow-md'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                {added
                  ? 'Added to Cart!'
                  : `Add to Cart • ₹${(effectiveUnitPrice * qty).toFixed(2)} (${qty} units)`}
              </button>

              <button
                onClick={() => {
                  onClose();
                  onEnquireBulk(product);
                }}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-[#183D2B] bg-[#FFC928] hover:bg-[#ffbe0b] border border-[#FFC928] shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <Building2 className="w-4 h-4" />
                <span>Request Bulk Wholesale Price Quotation</span>
              </button>

              <p className="text-[11px] text-center text-[#68756B]">
                Wholesale prices are determined privately by admin based on carton quantities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
