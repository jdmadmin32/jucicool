import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Plus, Minus, Building2, Check, Sparkles, Store } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onEnquireBulk: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onEnquireBulk,
}) => {
  const { addToCart } = useCart();
  const { isDealerRetailer, openLoginModal } = useAuth();

  // Admin-configured wholesale price for logged-in Dealer/Retailer
  const wholesaleRate = (product.wholesale_price && product.wholesale_price > 0) ? product.wholesale_price : product.retail_price;
  const effectiveUnitPrice = isDealerRetailer ? wholesaleRate : product.retail_price;
  const minQty = isDealerRetailer ? (product.min_wholesale_qty || 10) : 1;

  const [qty, setQty] = useState(minQty);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    if (isDealerRetailer && qty < minQty) {
      setQty(minQty);
    }
  }, [isDealerRetailer, minQty]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const isLowStock = product.stock_quantity < 50;

  return (
    <div className="group relative bg-white rounded-3xl p-4 border border-[#E6EBDD] shadow-sm hover:shadow-card hover:border-[#8CC63E]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Category / Flavor Tag */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-semibold text-[#138443] bg-[#138443]/10 px-2.5 py-0.5 rounded-full">
          {product.flavor}
        </span>
        {product.featured === 1 && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#F7941D] bg-[#F7941D]/10 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" /> Popular
          </span>
        )}
      </div>

      {/* Product Image Area */}
      <div
        onClick={() => onViewDetails(product)}
        className="relative aspect-square w-full rounded-2xl bg-gradient-to-b from-[#F9FAF6] to-white flex items-center justify-center p-3 cursor-pointer overflow-hidden border border-[#E6EBDD]/40 group-hover:bg-[#F2F8EC]/50 transition-colors"
      >
        <img
          src={product.shot_image_url || product.image_url}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(product);
          }}
          className="absolute bottom-2.5 right-2.5 p-2 bg-white/95 hover:bg-[#138443] hover:text-white text-[#183D2B] rounded-xl shadow-md border border-[#E6EBDD] opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100"
          title="Quick View"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Stock Badge */}
        <div className="absolute top-2 left-2">
          {product.stock_quantity > 0 ? (
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-md ${
                isLowStock
                  ? 'bg-amber-100/90 text-amber-800 border border-amber-200'
                  : 'bg-emerald-50/90 text-emerald-800 border border-emerald-200'
              }`}
            >
              {isLowStock ? `Only ${product.stock_quantity} left` : 'In Stock'}
            </span>
          ) : (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-100/90 text-rose-800 border border-rose-200">
              Out of stock
            </span>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="mt-4 flex-grow flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onViewDetails(product)}
            className="font-poppins font-bold text-base text-[#183D2B] hover:text-[#138443] transition-colors cursor-pointer line-clamp-1"
            title={product.name}
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#68756B] mt-0.5 flex items-center gap-1.5">
            <span>{product.pack_size}</span>
            <span className="w-1 h-1 rounded-full bg-[#68756B]"></span>
            <span>{product.packaging_type}</span>
          </p>
        </div>

        {/* Pricing Display */}
        <div className="mt-3.5 pt-3 border-t border-[#E6EBDD]/60 flex items-baseline justify-between">
          <div>
            {isDealerRetailer ? (
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[9px] uppercase font-black tracking-wider text-white bg-[#138443] px-1.5 py-0.5 rounded-full">
                    Dealer Bulk Rate
                  </span>
                  <span className="text-xs text-[#68756B] line-through font-medium">
                    ₹{product.retail_price.toFixed(2)}
                  </span>
                </div>
                <div className="text-xl font-black text-[#138443]">
                  ₹{wholesaleRate.toFixed(2)}
                  <span className="text-[11px] font-normal text-[#68756B] ml-1">/ unit</span>
                </div>
                <div className="text-[10px] text-amber-700 font-bold mt-0.5">
                  MOQ: {minQty} units required
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#68756B]">Retail Price</span>
                  <button
                    onClick={() => openLoginModal('dealer')}
                    className="text-[10px] font-semibold text-[#138443] hover:underline"
                    title="Sign in with your dealer account to see wholesale rates"
                  >
                    (Dealers: Login for bulk rates)
                  </button>
                </div>
                <div className="text-xl font-extrabold text-[#183D2B]">
                  ₹{product.retail_price.toFixed(2)}
                  <span className="text-[11px] font-normal text-[#68756B] ml-1">/ unit</span>
                </div>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center border border-[#E6EBDD] rounded-lg bg-[#FFFEF7]">
            <button
              onClick={() => setQty(Math.max(minQty, qty - (isDealerRetailer ? 5 : 1)))}
              className="p-1 hover:text-[#138443] transition-colors"
              title="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="min-w-7 px-1 text-center text-xs font-semibold text-[#183D2B]">
              {qty}
            </span>
            <button
              onClick={() => setQty(qty + (isDealerRetailer ? 5 : 1))}
              className="p-1 hover:text-[#138443] transition-colors"
              title="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons: Add to Cart & Get Best Price */}
      <div className="mt-4 space-y-2 pt-2 border-t border-[#E6EBDD]/60">
        <button
          onClick={handleAddToCart}
          disabled={product.stock_quantity <= 0}
          className={`w-full py-2.5 px-3 rounded-xl font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition-all ${
            addedAnimation
              ? 'bg-[#8CC63E] text-white shadow'
              : 'bg-[#138443] hover:bg-[#0d6131] text-white shadow-sm hover:shadow'
          }`}
        >
          {addedAnimation ? (
            <>
              <Check className="w-4 h-4" /> Added to Cart!
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 text-[#8CC63E]" />{' '}
              {isDealerRetailer ? (
                <span>Add {qty} Units (₹{(effectiveUnitPrice * qty).toFixed(2)})</span>
              ) : (
                <span>Add to Cart (₹{(effectiveUnitPrice * qty).toFixed(2)})</span>
              )}
            </>
          )}
        </button>

        {/* Wholesale Enquiry Trigger */}
        <button
          onClick={() => onEnquireBulk(product)}
          className="w-full py-2 px-3 rounded-xl font-medium text-xs text-[#183D2B] bg-[#FFF8E7] hover:bg-[#FFC928]/30 border border-[#FFC928]/60 transition-all flex items-center justify-center gap-1.5"
          title="Request wholesale quotation for bulk order"
        >
          <Building2 className="w-3.5 h-3.5 text-[#F7941D]" />
          <span>Get Best Price (Bulk MOQ: {product.min_wholesale_qty}+)</span>
        </button>
      </div>
    </div>
  );
};
