import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Building2,
  PhoneCall,
  Mail,
  Calculator,
  Printer,
  CheckCircle2,
  ArrowRight,
  Loader2,
  RefreshCw,
  X,
  FileCheck,
  MessageCircle
} from 'lucide-react';
import { BulkEnquiry, Quotation } from '../../types';
import {
  fetchAdminBulkEnquiries,
  fetchAdminBulkEnquiryById,
  updateBulkEnquiryStatus,
  updateQuotationStatus,
  convertQuotationToWholesaleOrder
} from '../../services/api';
import { QuotationBuilderModal } from './QuotationBuilderModal';
import { PrintableQuotationModal } from './PrintableQuotationModal';

export const BulkEnquiriesTab: React.FC = () => {
  const [enquiries, setEnquiries] = useState<BulkEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [isQuotationBuilderOpen, setIsQuotationBuilderOpen] = useState(false);
  const [printableQuotation, setPrintableQuotation] = useState<Quotation | null>(null);

  // Status updates draft
  const [statusDraft, setStatusDraft] = useState('');
  const [assignedDraft, setAssignedDraft] = useState('');
  const [notesDraft, setNotesDraft] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminBulkEnquiries(statusFilter, searchTerm);
      setEnquiries(data);
    } catch (err) {
      console.error('Failed to load bulk enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [statusFilter, searchTerm]);

  const handleOpenDetails = async (id: number) => {
    try {
      const full = await fetchAdminBulkEnquiryById(id);
      setSelectedEnquiry(full);
      setStatusDraft(full.enquiry.status);
      setAssignedDraft(full.enquiry.assigned_to || '');
      setNotesDraft(full.enquiry.internal_notes || '');
    } catch (err) {
      alert('Failed to load enquiry details');
    }
  };

  const handleSaveEnquiryStatus = async () => {
    if (!selectedEnquiry) return;
    setIsUpdating(true);
    try {
      await updateBulkEnquiryStatus(selectedEnquiry.enquiry.id, {
        status: statusDraft,
        assignedTo: assignedDraft,
        internalNotes: notesDraft,
      });
      await loadEnquiries();
      const refreshed = await fetchAdminBulkEnquiryById(selectedEnquiry.enquiry.id);
      setSelectedEnquiry(refreshed);
    } catch (err: any) {
      alert('Failed to update enquiry: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Convert Quotation to Wholesale Order
  const handleConvertToWholesaleOrder = async (quotationId: number) => {
    if (!confirm('Convert this accepted quotation into a confirmed Wholesale Order and reserve factory inventory?')) {
      return;
    }
    setIsUpdating(true);
    try {
      await convertQuotationToWholesaleOrder(quotationId, {
        advancePaid: 0,
        paymentStatus: 'Pending',
      });
      alert('Quotation successfully converted to confirmed Wholesale Order!');
      await loadEnquiries();
      if (selectedEnquiry) {
        const refreshed = await fetchAdminBulkEnquiryById(selectedEnquiry.enquiry.id);
        setSelectedEnquiry(refreshed);
      }
    } catch (err: any) {
      alert('Failed to convert quotation: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const exportToCSV = () => {
    if (!enquiries.length) return;
    const headers = ['Reference Number,Business Name,Contact Person,Phone,Email,Customer Type,City,Status,Created At'];
    const rows = enquiries.map(e =>
      `"${e.enquiry_number}","${e.business_name}","${e.customer_name}","${e.phone_number}","${e.email || ''}","${e.customer_type}","${e.city}","${e.status}","${e.created_at}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jucicool_bulk_enquiries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Controls & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-[#E6EBDD] shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by business name, contact, phone, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
            />
            <Search className="w-4 h-4 text-[#68756B] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-4 h-4 text-[#68756B]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#E6EBDD] bg-white text-[#183D2B] font-semibold focus:outline-none focus:border-[#138443]"
            >
              <option value="All">All Pipeline Statuses</option>
              <option value="New">New Enquiries</option>
              <option value="Contacted">Contacted</option>
              <option value="Quotation Prepared">Quotation Prepared</option>
              <option value="Quotation Sent">Quotation Sent</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Accepted">Accepted by Customer</option>
              <option value="Converted to Order">Converted to Order</option>
              <option value="Declined">Declined</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-[#E6EBDD] text-[#183D2B] hover:bg-slate-50 flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4 text-[#F7941D]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={loadEnquiries}
            className="p-2 text-[#68756B] hover:text-[#138443] rounded-xl hover:bg-slate-100"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Bulk Enquiries Table */}
      <div className="bg-white rounded-3xl border border-[#E6EBDD] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F4F8F0] text-[#183D2B] font-bold border-b border-[#E6EBDD]">
              <tr>
                <th className="py-3.5 px-4">Enquiry Ref</th>
                <th className="py-3.5 px-4">Business / Store</th>
                <th className="py-3.5 px-4">Contact Person</th>
                <th className="py-3.5 px-4">Customer Type</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Drinks Requested</th>
                <th className="py-3.5 px-4 text-center">Pipeline Status</th>
                <th className="py-3.5 px-4 text-center">Quotation</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6EBDD]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#68756B]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#F7941D]" />
                    <span>Loading bulk enquiries...</span>
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#68756B]">
                    No bulk enquiries found matching your filter.
                  </td>
                </tr>
              ) : (
                enquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-[#FFFEF7] transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#F7941D] font-mono">{e.enquiry_number}</span>
                      <div className="text-[10px] text-[#68756B] mt-0.5">{new Date(e.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#183D2B]">{e.business_name}</div>
                      {e.gstin && <div className="text-[10px] text-slate-500 font-mono">GST: {e.gstin}</div>}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#183D2B]">{e.customer_name}</div>
                      <div className="text-[11px] text-[#68756B]">{e.phone_number}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#183D2B] bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                        {e.customer_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#183D2B]">{e.city}</div>
                      <div className="text-[10px] text-[#68756B]">{e.state}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-[11px] font-semibold text-[#183D2B]">
                        {e.items?.length || 1} drink varieties
                      </div>
                      <div className="text-[10px] text-[#68756B]">
                        {e.items?.[0] ? `${e.items[0].requested_quantity} ${e.items[0].unit_label}` : ''}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          e.status === 'Converted to Order'
                            ? 'bg-[#138443] text-white'
                            : e.status === 'Accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : e.status === 'New'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {e.latestQuotation ? (
                        <div>
                          <div className="font-black text-[#138443]">₹{e.latestQuotation.grand_total.toFixed(0)}</div>
                          <span className="text-[10px] text-slate-500">#{e.latestQuotation.quotation_number}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">No Quote Yet</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleOpenDetails(e.id)}
                        className="px-3 py-1.5 rounded-xl border border-[#E6EBDD] text-[#138443] hover:bg-[#F4F8F0] font-bold shadow-sm"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Enquiry Management Drawer / Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#E6EBDD] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 sm:p-6 bg-[#FFFEF7] border-b border-[#E6EBDD] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#68756B]">Wholesale Enquiry Review</span>
                <h3 className="text-xl font-bold text-[#183D2B] font-mono">
                  {selectedEnquiry.enquiry.enquiry_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 text-[#68756B] hover:text-[#183D2B] rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Customer Contact Card with Direct Call / WhatsApp */}
              <div className="p-4 bg-[#F9FAF6] rounded-2xl border border-[#E6EBDD] space-y-3 text-xs">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <div className="font-bold text-base text-[#183D2B]">{selectedEnquiry.enquiry.business_name}</div>
                    <div className="text-xs text-[#68756B]">
                      {selectedEnquiry.enquiry.customer_name} ({selectedEnquiry.enquiry.customer_type})
                    </div>
                    {selectedEnquiry.enquiry.gstin && (
                      <div className="text-[11px] font-mono text-[#138443]">GSTIN: {selectedEnquiry.enquiry.gstin}</div>
                    )}
                  </div>

                  {/* Direct Contact Links */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${selectedEnquiry.enquiry.phone_number}`}
                      className="px-3 py-1.5 rounded-xl bg-[#138443] text-white font-bold flex items-center gap-1.5 hover:bg-[#0d6131]"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Call {selectedEnquiry.enquiry.phone_number}
                    </a>
                    <a
                      href={`https://wa.me/${selectedEnquiry.enquiry.phone_number.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold flex items-center gap-1.5 hover:bg-emerald-700"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                    {selectedEnquiry.enquiry.email && (
                      <a
                        href={`mailto:${selectedEnquiry.enquiry.email}`}
                        className="px-3 py-1.5 rounded-xl border border-[#E6EBDD] bg-white text-[#183D2B] font-semibold hover:bg-slate-50 flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" /> Email
                      </a>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-[#E6EBDD]/60 text-[11px]">
                  <div>
                    <span className="text-[#68756B]">Location:</span>{' '}
                    <span className="font-semibold">{selectedEnquiry.enquiry.city}, {selectedEnquiry.enquiry.state}</span>
                  </div>
                  <div>
                    <span className="text-[#68756B]">Warehouse Hub:</span>{' '}
                    <span className="font-semibold">{selectedEnquiry.enquiry.delivery_location || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-[#68756B]">Preferred Channel:</span>{' '}
                    <span className="font-semibold text-[#138443]">{selectedEnquiry.enquiry.preferred_contact_method}</span>
                  </div>
                </div>

                {selectedEnquiry.enquiry.additional_notes && (
                  <div className="p-2.5 bg-white rounded-xl border border-[#E6EBDD] text-[11px]">
                    <span className="font-bold text-[#68756B]">Customer Note: </span>
                    <span>{selectedEnquiry.enquiry.additional_notes}</span>
                  </div>
                )}
              </div>

              {/* Requested Products Table */}
              <div>
                <h4 className="text-xs font-bold text-[#183D2B] mb-2 uppercase tracking-wider">
                  Requested Drinks & Cartons
                </h4>
                <div className="border border-[#E6EBDD] rounded-2xl overflow-hidden divide-y divide-[#E6EBDD] text-xs">
                  {selectedEnquiry.items.map((it: any) => (
                    <div key={it.id} className="p-3 bg-white flex justify-between items-center">
                      <div>
                        <div className="font-bold text-[#183D2B]">{it.product_name}</div>
                        <div className="text-[11px] text-[#68756B]">{it.pack_size}</div>
                      </div>
                      <div className="text-right font-extrabold text-[#138443]">
                        {it.requested_quantity} {it.unit_label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quotation Management Section */}
              <div className="p-4 bg-[#FFFEF7] rounded-2xl border border-[#E6EBDD] space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-[#138443] uppercase tracking-wider">
                      Wholesale Quotation Status
                    </h4>
                    <p className="text-[11px] text-[#68756B]">Formal trade quote with private unit prices</p>
                  </div>
                  <button
                    onClick={() => setIsQuotationBuilderOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#138443] hover:bg-[#0d6131] text-white flex items-center gap-1.5 shadow-sm"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>{selectedEnquiry.quotations?.length ? 'Create New Quotation Version' : 'Build Wholesale Quotation'}</span>
                  </button>
                </div>

                {selectedEnquiry.quotations?.length > 0 ? (
                  <div className="space-y-2 pt-2">
                    {selectedEnquiry.quotations.map((q: any) => (
                      <div
                        key={q.id}
                        className="p-3 bg-white rounded-xl border border-[#E6EBDD] flex flex-wrap justify-between items-center gap-2 text-xs"
                      >
                        <div>
                          <div className="font-bold text-[#183D2B]">Quotation #{q.quotation_number}</div>
                          <div className="text-[11px] text-[#68756B]">
                            Total: <strong className="text-[#138443]">₹{q.grand_total.toFixed(2)}</strong> • Valid till {q.validity_date}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            q.status === 'Converted' ? 'bg-[#138443] text-white' :
                            q.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {q.status}
                          </span>

                          <button
                            onClick={() => setPrintableQuotation(q)}
                            className="px-3 py-1.5 rounded-lg border border-[#E6EBDD] hover:bg-slate-50 font-bold flex items-center gap-1 text-[#183D2B]"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#138443]" />
                            <span>View / Print Sheet</span>
                          </button>

                          {/* If quotation is Accepted, allow conversion to Wholesale Order */}
                          {(q.status === 'Accepted' || selectedEnquiry.enquiry.status === 'Accepted') && q.status !== 'Converted' && (
                            <button
                              onClick={() => handleConvertToWholesaleOrder(q.id)}
                              className="px-3 py-1.5 rounded-lg bg-[#FFC928] hover:bg-[#ffbe0b] font-bold text-[#183D2B] flex items-center gap-1 shadow-sm"
                            >
                              <FileCheck className="w-3.5 h-3.5" />
                              <span>Convert to Wholesale Order</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                    No quotation created yet. Click "Build Wholesale Quotation" above to specify approved wholesale rates and create a formal quote.
                  </div>
                )}
              </div>

              {/* Status Update & Internal Notes */}
              <div className="p-4 bg-white rounded-2xl border border-[#E6EBDD] space-y-3 text-xs">
                <h4 className="font-bold text-[#183D2B] uppercase tracking-wider">
                  Pipeline Status & Representative
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#183D2B] mb-1">
                      Enquiry Pipeline Status
                    </label>
                    <select
                      value={statusDraft}
                      onChange={(e) => setStatusDraft(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD] bg-white font-bold"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Quotation Prepared">Quotation Prepared</option>
                      <option value="Quotation Sent">Quotation Sent</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Accepted">Accepted by Customer</option>
                      <option value="Converted to Order">Converted to Order</option>
                      <option value="Declined">Declined</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#183D2B] mb-1">
                      Assigned Representative
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hyderabad Sales Officer"
                      value={assignedDraft}
                      onChange={(e) => setAssignedDraft(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#183D2B] mb-1">
                    Internal Sales Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Spoke to owner, agreed on 5% bulk discount for 100 cartons..."
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD]"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleSaveEnquiryStatus}
                    disabled={isUpdating}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#138443] hover:bg-[#0d6131] text-white flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Save Pipeline Updates</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quotation Builder Modal */}
      {isQuotationBuilderOpen && selectedEnquiry && (
        <QuotationBuilderModal
          enquiry={selectedEnquiry.enquiry}
          onClose={() => setIsQuotationBuilderOpen(false)}
          onSuccess={async () => {
            setIsQuotationBuilderOpen(false);
            await loadEnquiries();
            const refreshed = await fetchAdminBulkEnquiryById(selectedEnquiry.enquiry.id);
            setSelectedEnquiry(refreshed);
          }}
        />
      )}

      {/* Printable Quotation Modal */}
      {printableQuotation && (
        <PrintableQuotationModal
          quotation={printableQuotation}
          onClose={() => setPrintableQuotation(null)}
        />
      )}
    </div>
  );
};
