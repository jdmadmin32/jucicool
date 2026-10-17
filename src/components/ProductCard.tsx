import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Plus, Minus, Building2, Check, Sparkles, Box } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onEnquireBulk: (product: Product) => void;
  onView3D?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onEnquireBulk,
  onView3D,
}) => {
  const { addToCart, items, updateQuantity } = useCart();
  const { isDealerRetailer, openLoginModal } = useAuth();

  // Find if already in cart
  const cartItem = items.find(it => it.product.id === product.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  // Pricing
  const wholesaleRate = (product.wholesale_price && product.wholesale_price > 0)
    ? product.wholesale_price
    : product.retail_price;
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
    <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border border-[#E6EBDD] shadow-sm hover:shadow-card hover:border-[#8CC63E]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Tag Row */}
      <div className="flex items-center justify-between gap-1 mb-1.5 sm:mb-2">
        <span className="text-[9px] sm:text-[11px] font-semibold text-[#138443] bg-[#138443]/10 px-2 py-0.5 rounded-full truncate max-w-[90px] sm:max-w-none">
          {product.flavor}
        </span>
        {product.featured === 1 && (
          <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[10px] font-bold text-[#F7941D] bg-[#F7941D]/10 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden xs:inline">Popular</span>
          </span>
        )}
      </div>

      {/* Product Image Area */}
      <div
        onClick={() => onViewDetails(product)}
        className="relative aspect-square w-full rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#F9FAF6] to-white flex items-center justify-center p-2 sm:p-3 cursor-pointer overflow-hidden border border-[#E6EBDD]/40 group-hover:bg-[#F2F8EC]/50 transition-colors"
      >
        <img
          src={product.shot_image_url || product.image_url}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 active:scale-95"
          loading="lazy"
        />

        {/* 3D Interactive View Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onView3D) {
              onView3D(product);
            } else {
              onViewDetails(product);
            }
          }}
          className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 bg-white/95 hover:bg-[#138443] text-[#183D2B] hover:text-white rounded-xl shadow-sm hover:shadow-md border border-[#E6EBDD] text-[10px] sm:text-xs font-bold transition-all transform hover:scale-105 active:scale-95 group/btn"
          title="Interactive 3D View"
        >
          <Box className="w-3.5 h-3.5 text-[#138443] group-hover/btn:text-white transition-colors animate-pulse" />
          <span className="font-poppins">3D View</span>
        </button>

        {/* Quick View Button on Desktop Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(product);
          }}
          className="hidden sm:flex absolute bottom-2.5 right-2.5 p-2 bg-white/95 hover:bg-[#138443] hover:text-white text-[#183D2B] rounded-xl shadow-md border border-[#E6EBDD] opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100"
          title="Quick View"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Stock Badge */}
        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
          {product.stock_quantity > 0 ? (
            <span
              className={`text-[8px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-full backdrop-blur-md ${
                isLowStock
                  ? 'bg-amber-100/90 text-amber-800 border border-amber-200'
                  : 'bg-emerald-50/90 text-emerald-800 border border-emerald-200'
              }`}
            >
              {isLowStock ? `Only ${product.stock_quantity} left` : 'In Stock'}
            </span>
          ) : (
            <span className="text-[8px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-full bg-rose-100/90 text-rose-800 border border-rose-200">
              Out of stock
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-2.5 sm:mt-3 flex-grow flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onViewDetails(product)}
            className="font-poppins font-bold text-xs sm:text-base text-[#183D2B] hover:text-[#138443] transition-colors cursor-pointer line-clamp-2 min-h-[32px] sm:min-h-[40px] leading-tight"
            title={product.name}
          >
            {product.name}
          </h3>

          <p className="text-[10px] sm:text-xs text-[#68756B] mt-0.5 flex items-center gap-1 truncate">
            <span>{product.pack_size}</span>
            <span className="w-1 h-1 rounded-full bg-[#68756B]"></span>
            <span className="truncate">{product.packaging_type}</span>
          </p>
        </div>

        {/* Pricing Area */}
        <div className="mt-2 pt-2 border-t border-[#E6EBDD]/60">
          {isDealerRetailer ? (
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[8px] sm:text-[9px] uppercase font-black text-white bg-[#138443] px-1 py-0.2 rounded">
                  Dealer
                </span>
                <span className="text-[10px] sm:text-xs text-[#68756B] line-through">
                  ₹{product.retail_price.toFixed(0)}
                </span>
              </div>
              <div className="text-base sm:text-xl font-black text-[#138443] leading-none">
                ₹{wholesaleRate.toFixed(2)}
                <span className="text-[9px] sm:text-[11px] font-normal text-[#68756B] ml-0.5">/unit</span>
              </div>
              <div className="text-[9px] sm:text-[10px] text-amber-700 font-bold mt-0.5">
                MOQ: {minQty}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-[9px] sm:text-[10px] text-[#68756B] font-medium leading-none mb-0.5">
                Retail Price
              </div>
              <div className="text-base sm:text-xl font-extrabold text-[#183D2B] leading-none">
                ₹{product.retail_price.toFixed(2)}
                <span className="text-[9px] sm:text-[11px] font-normal text-[#68756B] ml-0.5">/unit</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions for Mobile & Desktop */}
      <div className="mt-2.5 sm:mt-3 space-y-1.5 pt-1.5 border-t border-[#E6EBDD]/60">
        {/* Quantity and Add to Cart Row */}
        <div className="flex items-center gap-1.5">
          {/* Stepper on Desktop or when needed */}
          <div className="hidden sm:flex items-center border border-[#E6EBDD] rounded-lg bg-[#FFFEF7]">
            <button
              onClick={() => setQty(Math.max(minQty, qty - (isDealerRetailer ? 5 : 1)))}
              className="p-1 hover:text-[#138443] transition-colors"
              title="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="min-w-6 px-1 text-center text-xs font-semibold text-[#183D2B]">
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

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity <= 0}
            className={`flex-1 py-2 sm:py-2.5 px-2 rounded-xl font-bold text-[11px] sm:text-xs tracking-wide flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 ${
              addedAnimation
                ? 'bg-[#8CC63E] text-white'
                : 'bg-[#138443] hover:bg-[#0d6131] text-white hover:shadow'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs">Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8CC63E]" />
                <span className="truncate">
                  {cartQuantity > 0 ? `Add (${cartQuantity + qty})` : 'ADD'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Wholesale Enquiry Button */}
        <button
          onClick={() => onEnquireBulk(product)}
          className="w-full py-1.5 sm:py-2 px-1.5 rounded-lg sm:rounded-xl font-semibold text-[10px] sm:text-xs text-[#183D2B] bg-[#FFF8E7] hover:bg-[#FFC928]/30 border border-[#FFC928]/60 transition-all flex items-center justify-center gap-1 truncate active:scale-98"
          title="Request wholesale quotation for bulk order"
        >
          <Building2 className="w-3 h-3 text-[#F7941D] shrink-0" />
          <span className="truncate">
            <span className="hidden sm:inline">Get Best Price (</span>MOQ: {product.min_wholesale_qty}+<span className="hidden sm:inline">)</span>
          </span>
        </button>
      </div>
    </div>
  );
};
