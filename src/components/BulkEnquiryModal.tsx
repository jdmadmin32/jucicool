import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  FileText,
  PhoneCall,
  Clock,
  Sparkles,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
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
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Products, 2: Business Info, 3: Review, 4: Success
  const [selectedItems, setSelectedItems] = useState<
    Array<{ productId: number; productName: string; packSize: string; quantity: number; unitLabel: string }>
  >([]);

  const [businessData, setBusinessData] = useState({
    customerName: '',
    phoneNumber: '',
    email: '',
    businessName: '',
    customerType: 'Retailer', // Retailer, Dealer, Distributor, Supermarket, Other
    city: 'Hyderabad',
    state: 'Telangana',
    preferredContactMethod: 'Phone', // Phone, WhatsApp, Email
    gstin: '',
    deliveryLocation: '',
    additionalNotes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Initialize selected items when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialProduct) {
        setSelectedItems([
          {
            productId: initialProduct.id,
            productName: initialProduct.name,
            packSize: initialProduct.pack_size,
            quantity: initialProduct.min_wholesale_qty || 100,
            unitLabel: 'Units',
          },
        ]);
      } else if (selectedItems.length === 0 && availableProducts.length > 0) {
        // Default to first popular product
        setSelectedItems([
          {
            productId: availableProducts[0].id,
            productName: availableProducts[0].name,
            packSize: availableProducts[0].pack_size,
            quantity: availableProducts[0].min_wholesale_qty || 100,
            unitLabel: 'Units',
          },
        ]);
      }
      setStep(1);
      setError(null);
    }
  }, [isOpen, initialProduct, availableProducts]);

  if (!isOpen) return null;

  const handleAddProduct = (prodId: number) => {
    const prod = availableProducts.find(p => p.id === prodId);
    if (!prod) return;
    if (selectedItems.some(it => it.productId === prod.id)) return;

    setSelectedItems([
      ...selectedItems,
      {
        productId: prod.id,
        productName: prod.name,
        packSize: prod.pack_size,
        quantity: prod.min_wholesale_qty || 100,
        unitLabel: 'Units',
      },
    ]);
  };

  const handleUpdateItem = (index: number, field: string, val: any) => {
    const updated = [...selectedItems];
    (updated[index] as any)[field] = val;
    setSelectedItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (selectedItems.length === 1) {
      setError('Please keep at least one product in your bulk quotation request.');
      return;
    }
    setError(null);
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  // Step 1 to Step 2 Validation
  const handleNextToBusiness = () => {
    if (selectedItems.length === 0) {
      setError('Please select at least one product.');
      return;
    }
    for (const it of selectedItems) {
      if (!it.quantity || it.quantity <= 0) {
        setError(`Please enter a valid positive quantity for ${it.productName}.`);
        return;
      }
    }
    setError(null);
    setStep(2);
  };

  // Step 2 to Step 3 Validation
  const handleNextToReview = () => {
    if (
      !businessData.customerName.trim() ||
      !businessData.phoneNumber.trim() ||
      !businessData.businessName.trim() ||
      !businessData.city.trim()
    ) {
      setError('Please provide your name, phone number, business/shop name, and city.');
      return;
    }

    const cleanPhone = businessData.phoneNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit contact number.');
      return;
    }

    setError(null);
    setStep(3);
  };

  // Step 3: Final Submission with WhatsApp Redirection
  const [bulkWhatsappUrl, setBulkWhatsappUrl] = useState<string>('');

  const handleSubmitEnquiry = async () => {
    setLoading(true);
    setError(null);

    let enquiryNumber = `JC-BLK-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const payload = {
        customerName: businessData.customerName.trim(),
        phoneNumber: businessData.phoneNumber.trim(),
        email: businessData.email.trim() || undefined,
        businessName: businessData.businessName.trim(),
        customerType: businessData.customerType,
        city: businessData.city.trim(),
        state: businessData.state.trim(),
        preferredContactMethod: businessData.preferredContactMethod,
        gstin: businessData.gstin.trim() || undefined,
        deliveryLocation: businessData.deliveryLocation.trim() || undefined,
        additionalNotes: businessData.additionalNotes.trim() || undefined,
        items: selectedItems.map(it => ({
          productId: it.productId,
          quantity: it.quantity,
          unitLabel: it.unitLabel,
        })),
      };

      const result = await submitBulkEnquiry(payload);
      if (result && result.enquiryNumber) {
        enquiryNumber = result.enquiryNumber;
      }
    } catch (err: any) {
      console.warn('Backend bulk enquiry notice (proceeding with WhatsApp):', err);
    }

    // Build WhatsApp URL with all selected products, quantities, and business details
    const whatsappNumber = '919393122122';
    const itemsList = selectedItems
      .map((it, idx) => `${idx + 1}. *${it.productName}* (${it.packSize})\n   • Quantity: *${it.quantity} ${it.unitLabel}*`)
      .join('\n\n');

    const messageLines = [
      '📦 *NEW WHOLESALE / BULK ORDER ENQUIRY - JUCI COOL* 📦',
      '━━━━━━━━━━━━━━━━━━━━━',
      `📋 *Enquiry Ref:* ${enquiryNumber}`,
      '',
      '🏢 *BUSINESS & CONTACT DETAILS:*',
      `• *Contact Person:* ${businessData.customerName.trim()}`,
      `• *Business / Shop Name:* ${businessData.businessName.trim()}`,
      `• *Customer Type:* ${businessData.customerType}`,
      `• *Phone Number:* ${businessData.phoneNumber.trim()}`,
      businessData.email.trim() ? `• *Email:* ${businessData.email.trim()}` : null,
      `• *City / State:* ${businessData.city.trim()}, ${businessData.state.trim()}`,
      businessData.deliveryLocation.trim() ? `• *Delivery Location:* ${businessData.deliveryLocation.trim()}` : null,
      businessData.gstin.trim() ? `• *GSTIN:* ${businessData.gstin.trim()}` : null,
      businessData.additionalNotes.trim() ? `• *Notes:* ${businessData.additionalNotes.trim()}` : null,
      '',
      '📦 *REQUESTED PRODUCTS & QUANTITIES:*',
      itemsList,
      '',
      '━━━━━━━━━━━━━━━━━━━━━',
      'Please send the wholesale quotation with tiered pricing and delivery schedule. Thank you!',
    ].filter(Boolean).join('\n');

    const generatedWhatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(messageLines)}`;

    setSubmittedRef(enquiryNumber);
    setBulkWhatsappUrl(generatedWhatsappUrl);
    setStep(4);
    setLoading(false);

    // Redirect to WhatsApp
    try {
      const win = window.open(generatedWhatsappUrl, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = generatedWhatsappUrl;
      }
    } catch {
      window.location.href = generatedWhatsappUrl;
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
            <div className="p-2 sm:p-2.5 bg-[#FFC928]/20 text-[#183D2B] rounded-xl border border-[#FFC928]/40">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#F7941D]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#183D2B] font-poppins">
                Wholesale Price Quotation Enquiry
              </h2>
              <p className="text-[11px] sm:text-xs text-[#68756B]">
                For Retail Stores, Supermarkets, Dealers & Distributors
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

        {/* Progress Bar (Steps 1, 2, 3) */}
        {step < 4 && (
          <div className="bg-[#F4F8F0] px-4 sm:px-6 py-2.5 border-b border-[#E6EBDD] flex items-center justify-between text-[11px] sm:text-xs font-semibold shrink-0 overflow-x-auto no-scrollbar">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#138443]' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-[#138443] text-white' : 'bg-slate-200'}`}>1</span>
              <span>Select Drinks</span>
            </div>
            <div className="w-6 sm:w-8 h-0.5 bg-[#E6EBDD]"></div>
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#138443]' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#138443] text-white' : 'bg-slate-200'}`}>2</span>
              <span>Business Info</span>
            </div>
            <div className="w-6 sm:w-8 h-0.5 bg-[#E6EBDD]"></div>
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#138443]' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#138443] text-white' : 'bg-slate-200'}`}>3</span>
              <span>Review & Submit</span>
            </div>
          </div>
        )}

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 pb-safe">
          {error && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          {/* STEP 1: PRODUCTS & QUANTITIES */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#183D2B]">Requested Products & Quantities</h3>
                  <p className="text-xs text-[#68756B]">Specify wholesale cartons or unit requirements</p>
                </div>

                {/* Add product dropdown */}
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddProduct(Number(e.target.value));
                      e.target.value = '';
                    }
                  }}
                  className="text-xs border border-[#E6EBDD] rounded-xl px-3 py-1.5 bg-white text-[#183D2B] focus:outline-none focus:border-[#138443]"
                  defaultValue=""
                >
                  <option value="" disabled>+ Add Another Drink</option>
                  {availableProducts
                    .filter(p => !selectedItems.some(it => it.productId === p.id))
                    .map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.pack_size})
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {selectedItems.map((item, idx) => (
                  <div
                    key={item.productId}
                    className="p-3.5 rounded-2xl bg-[#FFFEF7] border border-[#E6EBDD] flex flex-wrap sm:flex-nowrap items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-[180px]">
                      <h4 className="font-bold text-xs text-[#183D2B]">{item.productName}</h4>
                      <p className="text-[11px] text-[#68756B]">{item.packSize}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <label className="text-[10px] text-[#68756B] font-semibold">Bulk Quantity</label>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(idx, 'quantity', Math.max(1, Number(e.target.value)))}
                          className="w-24 px-2.5 py-1 text-xs font-bold rounded-lg border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[10px] text-[#68756B] font-semibold">Unit Type</label>
                        <select
                          value={item.unitLabel}
                          onChange={(e) => handleUpdateItem(idx, 'unitLabel', e.target.value)}
                          className="px-2.5 py-1 text-xs rounded-lg border border-[#E6EBDD] bg-white focus:outline-none focus:border-[#138443]"
                        >
                          <option value="Units">Units (Bottles/Pouches)</option>
                          <option value="Cartons">Cartons (Standard Box)</option>
                          <option value="Pallets">Pallets</option>
                        </select>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors mt-3"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#E6EBDD] flex justify-end">
                <button
                  onClick={handleNextToBusiness}
                  className="px-6 py-3 rounded-xl font-bold text-xs bg-[#138443] text-white hover:bg-[#0d6131] flex items-center gap-2 shadow-md"
                >
                  <span>Continue to Business Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: BUSINESS & CONTACT INFO */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                    Contact Person Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Suresh Kumar"
                    value={businessData.customerName}
                    onChange={(e) => setBusinessData({ ...businessData, customerName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                    Phone / Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 94400 00000"
                    value={businessData.phoneNumber}
                    onChange={(e) => setBusinessData({ ...businessData, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                    Business / Store Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sri Krishna Supermart"
                    value={businessData.businessName}
                    onChange={(e) => setBusinessData({ ...businessData, businessName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                    Business Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={businessData.customerType}
                    onChange={(e) => setBusinessData({ ...businessData, customerType: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] bg-white focus:outline-none focus:border-[#138443]"
                  >
                    <option value="Retailer">Retail Shop / Grocery Store</option>
                    <option value="Dealer">Dealer / Stockist</option>
                    <option value="Distributor">Regional Beverage Distributor</option>
                    <option value="Supermarket">Supermarket / Hypermarket</option>
                    <option value="Other">Hotel / Restaurant / Event Caterer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad / Warangal"
                    value={businessData.city}
                    onChange={(e) => setBusinessData({ ...businessData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Telangana"
                    value={businessData.state}
                    onChange={(e) => setBusinessData({ ...businessData, state: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                    Preferred Contact Channel <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={businessData.preferredContactMethod}
                    onChange={(e) => setBusinessData({ ...businessData, preferredContactMethod: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] bg-white focus:outline-none focus:border-[#138443]"
                  >
                    <option value="Phone">Phone Call</option>
                    <option value="WhatsApp">WhatsApp Message</option>
                    <option value="Email">Email</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="buyer@business.com"
                    value={businessData.email}
                    onChange={(e) => setBusinessData({ ...businessData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                    GSTIN Number <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="36AAAAA0000A1Z5"
                    value={businessData.gstin}
                    onChange={(e) => setBusinessData({ ...businessData, gstin: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] uppercase focus:outline-none focus:border-[#138443]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                    Delivery Warehouse Hub / Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Medchal Hub / Secunderabad"
                    value={businessData.deliveryLocation}
                    onChange={(e) => setBusinessData({ ...businessData, deliveryLocation: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                  Additional Requirements / Target Price / Frequency
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Weekly recurring supply, require sample display rack, credit terms..."
                  value={businessData.additionalNotes}
                  onChange={(e) => setBusinessData({ ...businessData, additionalNotes: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                />
              </div>

              <div className="pt-4 border-t border-[#E6EBDD] flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-[#E6EBDD] text-[#183D2B] hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Products
                </button>
                <button
                  type="button"
                  onClick={handleNextToReview}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-[#138443] text-white hover:bg-[#0d6131] flex items-center gap-2 shadow-md"
                >
                  <span>Review Enquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW BEFORE FINAL SUBMISSION */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-[#FFFEF7] rounded-2xl border border-[#E6EBDD] space-y-3">
                <div className="border-b border-[#E6EBDD] pb-2 flex justify-between items-center">
                  <h4 className="font-bold text-xs text-[#138443] uppercase tracking-wider">Business Details</h4>
                  <button
                    onClick={() => setStep(2)}
                    className="text-[11px] text-[#138443] hover:underline"
                  >
                    Edit Details
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#68756B]">Business Name:</span>{' '}
                    <span className="font-bold text-[#183D2B]">{businessData.businessName}</span>
                  </div>
                  <div>
                    <span className="text-[#68756B]">Contact Person:</span>{' '}
                    <span className="font-bold text-[#183D2B]">{businessData.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[#68756B]">Phone:</span>{' '}
                    <span className="font-bold text-[#183D2B]">{businessData.phoneNumber}</span>
                  </div>
                  <div>
                    <span className="text-[#68756B]">Type:</span>{' '}
                    <span className="font-semibold text-[#183D2B]">{businessData.customerType}</span>
                  </div>
                  <div>
                    <span className="text-[#68756B]">Location:</span>{' '}
                    <span className="font-semibold text-[#183D2B]">{businessData.city}, {businessData.state}</span>
                  </div>
                  <div>
                    <span className="text-[#68756B]">Contact via:</span>{' '}
                    <span className="font-semibold text-[#138443]">{businessData.preferredContactMethod}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#FFFEF7] rounded-2xl border border-[#E6EBDD] space-y-3">
                <div className="border-b border-[#E6EBDD] pb-2 flex justify-between items-center">
                  <h4 className="font-bold text-xs text-[#138443] uppercase tracking-wider">Requested Drink Quantities</h4>
                  <button
                    onClick={() => setStep(1)}
                    className="text-[11px] text-[#138443] hover:underline"
                  >
                    Edit Items
                  </button>
                </div>
                <div className="space-y-2">
                  {selectedItems.map((it) => (
                    <div key={it.productId} className="flex justify-between text-xs py-1 border-b border-[#E6EBDD]/40 last:border-0">
                      <div>
                        <span className="font-bold text-[#183D2B]">{it.productName}</span>
                        <span className="text-[#68756B] text-[11px] ml-2">({it.packSize})</span>
                      </div>
                      <div className="font-extrabold text-[#138443]">
                        {it.quantity} {it.unitLabel}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>
                  Our wholesale sales desk reviews carton volumes, verifies trade credentials, and prepares custom quotations with tiered discounts within 24 hours.
                </span>
              </div>

              <div className="pt-3 border-t border-[#E6EBDD] flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-[#E6EBDD] text-[#183D2B] hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmitEnquiry}
                  disabled={loading}
                  className="px-8 py-3 rounded-xl font-bold text-xs tracking-wide bg-[#138443] hover:bg-[#0d6131] text-white flex items-center gap-2 shadow-lg shadow-[#138443]/20 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting & Redirecting to WhatsApp...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4 fill-white text-[#138443]" />
                      <span>Submit & Open in WhatsApp (+91 9393122122)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUBMISSION CONFIRMATION */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-[#25D366]/15 text-[#138443] rounded-full flex items-center justify-center mx-auto shadow-inner border border-[#25D366]/30">
                <CheckCircle2 className="w-10 h-10 text-[#138443]" />
              </div>

              <h3 className="text-2xl font-bold text-[#183D2B] font-poppins">
                Wholesale Enquiry Submitted & Redirected to WhatsApp!
              </h3>

              <div className="p-4 bg-[#FFFEF7] border border-[#E6EBDD] rounded-2xl max-w-md mx-auto text-center space-y-2">
                <div className="text-xs text-[#68756B]">Your Bulk Reference Number</div>
                <div className="text-xl font-black text-[#138443] tracking-wider font-mono">
                  {submittedRef}
                </div>
              </div>

              <p className="text-sm text-[#183D2B] max-w-md mx-auto leading-relaxed">
                “Your bulk quotation request with all selected products and quantities has been prepared and sent to Juci Cool sales desk on WhatsApp (<strong>+91 9393122122</strong>).”
              </p>

              {bulkWhatsappUrl && (
                <div className="py-2 flex justify-center">
                  <a
                    href={bulkWhatsappUrl}
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

              <p className="text-xs text-[#68756B] max-w-sm mx-auto">
                We will contact you via {businessData.preferredContactMethod} at {businessData.phoneNumber} with customized wholesale pricing, freight estimates, and GST invoices.
              </p>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-[#183D2B] text-white hover:bg-[#138443] shadow-md"
                >
                  Back to Products
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
