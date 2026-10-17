import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, Building2, Box, Image as ImageIcon, Maximize2, RotateCcw } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ModelViewer from './ModelViewer';
import { getProductModelUrl } from '../utils/productModels';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onEnquireBulk: (product: Product) => void;
  onOpen3DModal?: (product: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onEnquireBulk,
  onOpen3DModal,
}) => {
  const { addToCart } = useCart();
  const { isDealerRetailer, openLoginModal } = useAuth();

  const [activeImage, setActiveImage] = useState<string>('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [viewMode, setViewMode] = useState<'photos' | '3d'>('photos');

  useEffect(() => {
    if (product) {
      setActiveImage(product.shot_image_url || product.image_url || '');
      setQty(isDealerRetailer ? (product.min_wholesale_qty || 10) : 1);
      setViewMode('photos');
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
  const wholesaleRate = (product.wholesale_price && product.wholesale_price > 0)
    ? product.wholesale_price
    : product.retail_price;
  const effectiveUnitPrice = isDealerRetailer ? wholesaleRate : product.retail_price;
  const minQty = isDealerRetailer ? (product.min_wholesale_qty || 10) : 1;

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#E6EBDD] animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        {/* Mobile Handle Pill */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-2.5 sm:hidden shrink-0"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-[#183D2B] shadow-sm border border-[#E6EBDD] transition-colors"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image / 3D Column */}
            <div className="bg-gradient-to-tr from-[#FFF7DE] via-[#F4F8F0] to-[#E9F4E3] p-4 sm:p-6 flex flex-col items-center justify-between relative border-b md:border-b-0 md:border-r border-[#E6EBDD]">
              <div className="w-full flex items-center justify-between gap-2 mb-2">
                <div className="bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold text-[#138443] border border-[#E6EBDD]">
                  {product.flavor}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-[#E6EBDD] shadow-xs">
                  <button
                    type="button"
                    onClick={() => setViewMode('photos')}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                      viewMode === 'photos'
                        ? 'bg-[#183D2B] text-white shadow-xs'
                        : 'text-[#68756B] hover:text-[#183D2B]'
                    }`}
                  >
                    <ImageIcon className="w-3 h-3" />
                    <span>Photos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('3d')}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                      viewMode === '3d'
                        ? 'bg-[#138443] text-white shadow-xs'
                        : 'text-[#68756B] hover:text-[#183D2B]'
                    }`}
                  >
                    <Box className="w-3 h-3 animate-pulse" />
                    <span>3D View</span>
                  </button>
                </div>
              </div>

              {viewMode === '3d' ? (
                <div className="w-full flex-1 flex flex-col items-center justify-center relative min-h-[220px] sm:min-h-[260px]">
                  <ModelViewer
                    url={getProductModelUrl(product)}
                    product={product}
                    width="100%"
                    height={260}
                    environment="studio"
                    environmentIntensity={1.2}
                    exposure={1.05}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                    dragRotate={true}
                    fit={0.82}
                    shadow={true}
                    shadowOpacity={0.4}
                  />

                  {/* 3D Action Tools */}
                  <div className="w-full flex items-center justify-between gap-2 mt-2 pt-2 border-t border-[#E6EBDD]/60 text-[10px] text-[#68756B]">
                    <span>Drag to rotate • Scroll to zoom</span>
                    {onOpen3DModal && (
                      <button
                        type="button"
                        onClick={() => onOpen3DModal(product)}
                        className="inline-flex items-center gap-1 font-bold text-[#138443] hover:underline"
                      >
                        <Maximize2 className="w-3 h-3" /> Full 3D Studio
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 flex items-center justify-center p-2 sm:p-4 min-h-[180px] sm:min-h-[220px]">
                    <img
                      src={activeImage}
                      alt={product.name}
                      className="max-h-48 sm:max-h-64 max-w-full object-contain drop-shadow-md transition-all duration-300"
                    />
                  </div>

                  {/* Extra Image Thumbnails */}
                  {allImages.length > 1 && (
                    <div className="w-full flex items-center justify-center gap-2 pt-2 border-t border-[#E6EBDD]/60 overflow-x-auto no-scrollbar">
                      {allImages.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImage(imgUrl)}
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl p-1 bg-white border transition-all shrink-0 ${
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
                </>
              )}
            </div>

            {/* Details Column */}
            <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-[#8CC63E]">
                  {product.category_name || 'Juci Cool Beverage'}
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-[#183D2B] mt-0.5 sm:mt-1 font-poppins leading-tight">
                  {product.name}
                </h2>

                <p className="text-xs sm:text-sm text-[#68756B] mt-2 sm:mt-3 leading-relaxed">
                  {product.description}
                </p>

                {/* Specifications */}
                <div className="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-[#E6EBDD] space-y-1.5 text-xs">
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#68756B]">Pack Size:</span>
                    <span className="font-semibold text-[#183D2B]">{product.pack_size}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#68756B]">Packaging Type:</span>
                    <span className="font-semibold text-[#183D2B]">{product.packaging_type}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#68756B]">Availability:</span>
                    <span className="font-semibold text-[#138443]">
                      {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} available)` : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Quantity Box */}
              <div className="mt-4 pt-3 border-t border-[#E6EBDD]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    {isDealerRetailer ? (
                      <div>
                        <span className="text-[9px] uppercase font-bold text-[#138443] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Dealer Bulk Rate
                        </span>
                        <div className="text-xl sm:text-2xl font-black text-[#138443] mt-0.5">
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
                          <span className="text-[10px] sm:text-[11px] font-semibold text-[#68756B]">Approved Retail Price</span>
                          <button
                            onClick={() => {
                              onClose();
                              openLoginModal('dealer');
                            }}
                            className="text-[10px] sm:text-[11px] font-semibold text-[#138443] hover:underline"
                          >
                            (Dealers: Login)
                          </button>
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-[#183D2B]">
                          ₹{product.retail_price.toFixed(2)}
                          <span className="text-xs font-normal text-[#68756B] ml-1">/ unit</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-[#E6EBDD] rounded-xl bg-white shadow-sm">
                    <button
                      onClick={() => setQty(Math.max(minQty, qty - (isDealerRetailer ? 5 : 1)))}
                      className="p-1.5 sm:p-2 hover:text-[#138443] transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <span className="min-w-7 sm:min-w-8 px-1 text-center text-xs sm:text-sm font-bold text-[#183D2B]">{qty}</span>
                    <button
                      onClick={() => setQty(qty + (isDealerRetailer ? 5 : 1))}
                      className="p-1.5 sm:p-2 hover:text-[#138443] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Actions Bar (Mobile E-Commerce App Pattern) */}
        <div className="p-3 sm:p-4 border-t border-[#E6EBDD] bg-white space-y-2 pb-safe">
          <button
            onClick={handleAdd}
            disabled={product.stock_quantity <= 0}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
              added
                ? 'bg-[#8CC63E] text-white'
                : 'bg-[#138443] hover:bg-[#0d6131] text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#8CC63E]" />
            {added
              ? 'Added to Cart!'
              : `Add to Cart • ₹${(effectiveUnitPrice * qty).toFixed(2)} (${qty} units)`}
          </button>

          <button
            onClick={() => {
              onClose();
              onEnquireBulk(product);
            }}
            className="w-full py-2 px-3 rounded-xl font-semibold text-xs text-[#183D2B] bg-[#FFF8E7] hover:bg-[#FFC928]/30 border border-[#FFC928] flex items-center justify-center gap-1.5 transition-colors active:scale-98"
          >
            <Building2 className="w-3.5 h-3.5 text-[#F7941D]" />
            <span>Request Bulk Wholesale Price Quotation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
