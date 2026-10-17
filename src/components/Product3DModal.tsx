import React, { useState, useRef } from 'react';
import {
  X,
  Box,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Building2,
  Camera,
  Check,
  Compass,
  Layers,
  ZoomIn
} from 'lucide-react';
import { Product } from '../types';
import ModelViewer from './ModelViewer';
import { getProductModelUrl } from '../utils/productModels';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface Product3DModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEnquireBulk?: (product: Product) => void;
}

export const Product3DModal: React.FC<Product3DModalProps> = ({
  product,
  isOpen,
  onClose,
  onEnquireBulk
}) => {
  const { addToCart } = useCart();
  const { isDealerRetailer } = useAuth();
  const viewerRef = useRef<{ capture: (type?: string) => string | null }>(null);

  const [environment, setEnvironment] = useState<'studio' | 'sunset' | 'city' | 'park' | 'lobby'>('studio');
  const [autoRotate, setAutoRotate] = useState(true);
  const [turntable, setTurntable] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  if (!isOpen || !product) return null;

  const modelUrl = getProductModelUrl(product);

  const wholesaleRate =
    product.wholesale_price && product.wholesale_price > 0
      ? product.wholesale_price
      : product.retail_price;
  const effectiveUnitPrice = isDealerRetailer ? wholesaleRate : product.retail_price;
  const minQty = isDealerRetailer ? product.min_wholesale_qty || 10 : 1;

  const handleAddToCart = () => {
    addToCart(product, Math.max(qty, minQty));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleCaptureSnapshot = () => {
    if (viewerRef.current) {
      const dataUrl = viewerRef.current.capture('image/png');
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `${product.name.replace(/\s+/g, '-').toLowerCase()}-3d.png`;
        link.href = dataUrl;
        link.click();
        setCaptured(true);
        setTimeout(() => setCaptured(false), 2000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#E6EBDD]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#E6EBDD] bg-[#FBFDF9]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#138443]/10 text-[#138443] flex items-center justify-center border border-[#138443]/20">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#138443] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Interactive 3D Experience
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-[#68756B]">
                  <Compass className="w-3 h-3 text-[#138443]" /> Drag to spin • Scroll to zoom
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#183D2B] font-poppins leading-tight truncate max-w-xs sm:max-w-md">
                {product.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white hover:bg-slate-100 text-[#183D2B] border border-[#E6EBDD] transition-colors"
            title="Close 3D viewer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left: 3D Canvas Area */}
          <div className="lg:col-span-8 relative bg-gradient-to-b from-[#F7FAF4] via-[#EEF6EA] to-[#E3EFE0] min-h-[360px] sm:min-h-[460px] flex items-center justify-center p-2 sm:p-4 border-b lg:border-b-0 lg:border-r border-[#E6EBDD]">
            {/* 3D Canvas */}
            <ModelViewer
              ref={viewerRef}
              url={modelUrl}
              product={product}
              width="100%"
              height="100%"
              environment={environment}
              environmentIntensity={1.2}
              exposure={1.05}
              autoRotate={autoRotate}
              autoRotateSpeed={0.5}
              turntable={turntable}
              float={0.25}
              shadow={true}
              shadowOpacity={0.4}
              fit={0.82}
              style={{ minHeight: '360px', height: '100%', width: '100%' }}
            />

            {/* Quick Floating Controls */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#E6EBDD] shadow-sm">
              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
                  autoRotate
                    ? 'bg-[#138443] text-white shadow-sm'
                    : 'text-[#68756B] hover:text-[#183D2B] hover:bg-slate-100'
                }`}
                title="Toggle Auto Rotate"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                <span className="hidden xs:inline">Auto Rotate</span>
              </button>

              <button
                type="button"
                onClick={() => setTurntable(!turntable)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
                  turntable
                    ? 'bg-[#138443] text-white shadow-sm'
                    : 'text-[#68756B] hover:text-[#183D2B] hover:bg-slate-100'
                }`}
                title="Limit dragging to left and right"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Turntable</span>
              </button>

              <button
                type="button"
                onClick={handleCaptureSnapshot}
                className="px-2.5 py-1 text-xs font-semibold text-[#183D2B] hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition-all"
                title="Save 3D Snapshot"
              >
                {captured ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#138443]" />
                    <span className="text-[#138443]">Saved</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Snapshot</span>
                  </>
                )}
              </button>
            </div>

            {/* Environment Lighting Picker */}
            <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-[#E6EBDD] shadow-sm flex items-center gap-2 text-xs">
              <span className="text-[#68756B] font-medium hidden sm:inline">Lighting:</span>
              {(['studio', 'sunset', 'city', 'park'] as const).map(env => (
                <button
                  key={env}
                  type="button"
                  onClick={() => setEnvironment(env)}
                  className={`px-2 py-0.5 rounded-lg capitalize font-medium transition-all ${
                    environment === env
                      ? 'bg-[#183D2B] text-white'
                      : 'text-[#68756B] hover:text-[#183D2B] hover:bg-slate-100'
                  }`}
                >
                  {env}
                </button>
              ))}
            </div>

            {/* Interaction Hint */}
            <div className="absolute bottom-4 right-4 z-10 hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-[#183D2B]/80 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#E6EBDD]/80">
              <ZoomIn className="w-3.5 h-3.5 text-[#138443]" /> Double-click to reset view
            </div>
          </div>

          {/* Right: Product Details & Purchase Actions */}
          <div className="lg:col-span-4 p-5 sm:p-6 flex flex-col justify-between bg-white">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-[#138443] bg-[#138443]/10 px-2.5 py-0.5 rounded-full">
                  {product.flavor}
                </span>
                <span className="text-[11px] font-medium text-[#68756B]">
                  {product.packaging_type}
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#183D2B] font-poppins mt-2">
                {product.name}
              </h3>
              <p className="text-xs text-[#68756B] mt-1.5 leading-relaxed line-clamp-4">
                {product.description}
              </p>

              {/* Specs */}
              <div className="mt-4 pt-3 border-t border-[#E6EBDD] space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#68756B]">Pack Size:</span>
                  <span className="font-semibold text-[#183D2B]">{product.pack_size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68756B]">Availability:</span>
                  <span className="font-semibold text-[#138443]">
                    {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity})` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Price card */}
              <div className="mt-4 p-3 rounded-2xl bg-[#F9FAF6] border border-[#E6EBDD]">
                <div className="text-[10px] text-[#68756B] font-semibold uppercase tracking-wider">
                  {isDealerRetailer ? 'Dealer Wholesale Price' : 'Retail Price'}
                </div>
                <div className="text-2xl font-black text-[#138443] mt-0.5">
                  ₹{effectiveUnitPrice.toFixed(2)}
                  <span className="text-xs font-normal text-[#68756B] ml-1">/ unit</span>
                </div>
                {isDealerRetailer && (
                  <div className="text-[11px] text-amber-700 font-bold mt-1">
                    MOQ: {minQty} units minimum
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-[#E6EBDD] space-y-2.5">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock_quantity <= 0}
                className={`w-full py-3 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#138443] hover:bg-[#0f6a35] text-white hover:shadow-md active:scale-[0.98]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Cart (₹{(effectiveUnitPrice * (isDealerRetailer ? minQty : 1)).toFixed(0)})
                  </>
                )}
              </button>

              {onEnquireBulk && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEnquireBulk(product);
                  }}
                  className="w-full py-2.5 px-4 rounded-2xl font-semibold text-xs sm:text-sm text-[#183D2B] bg-white border border-[#E6EBDD] hover:bg-slate-50 flex items-center justify-center gap-2 transition-all"
                >
                  <Building2 className="w-4 h-4 text-[#F7941D]" /> Wholesale / Bulk Inquiry
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
