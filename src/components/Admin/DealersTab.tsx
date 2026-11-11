import React, { useState, useEffect } from 'react';
import {
  Store,
  UserPlus,
  Search,
  Trash2,
  Lock,
  Mail,
  Phone,
  Building2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  X,
  Eye,
  EyeOff,
  Key,
  Check,
  Edit
} from 'lucide-react';
import { DealerRecord } from '../../types';
import { fetchAdminDealers, createAdminDealer, deleteAdminDealer, updateAdminDealer } from '../../services/api';
import { getStoredDealerPassword } from '../../services/adminStore';
import { SecurityActionModal } from './DeleteConfirmationModal';

export const DealersTab: React.FC = () => {
  const [dealers, setDealers] = useState<DealerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // New / Edit Dealer Form
  const [storeName, setStoreName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [state, setState] = useState('Telangana');

  // Edit Dealer State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDealer, setEditingDealer] = useState<DealerRecord | null>(null);

  // Security Confirmation Modal State (Requires Password: Mango@123)
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [securityAction, setSecurityAction] = useState<'delete' | 'update'>('delete');
  const [targetDealerForSecurity, setTargetDealerForSecurity] = useState<DealerRecord | null>(null);
  const [isProcessingSecurityAction, setIsProcessingSecurityAction] = useState(false);

  // Recently Created Credentials Banner
  const [recentlyCreated, setRecentlyCreated] = useState<{
    email: string;
    pass: string;
    store: string;
  } | null>(null);

  // Password Visibility & Copy States
  const [showAllPasswords, setShowAllPasswords] = useState(true);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<number, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyCredentials = (d: DealerRecord) => {
    const pass = d.password || (d.email === 'dealer@jucicool.com' ? 'dealer123' : 'dealer123');
    const store = d.business_name || d.businessName || d.full_name || d.fullName || 'Wholesale Partner';
    const text = `Juci Cool Wholesale Dealer Account:\nStore: ${store}\nDealer Login URL: ${window.location.origin}\nLogin ID / Email: ${d.email}\nPassword: ${pass}`;
    handleCopyText(text, `cred-${d.id}`);
  };

  const isPasswordVisible = (dealerId: number) => {
    if (visiblePasswords[dealerId] !== undefined) {
      return visiblePasswords[dealerId];
    }
    return showAllPasswords;
  };

  const togglePasswordVisibility = (dealerId: number) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [dealerId]: !isPasswordVisible(dealerId)
    }));
  };

  const loadDealers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminDealers();
      setDealers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dealers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDealers();
  }, []);

  const handleOpenAddModal = () => {
    setStoreName('');
    setContactName('');
    setEmail('');
    setPassword(`Juci${Math.floor(1000 + Math.random() * 9000)}#`);
    setPhone('');
    setCity('Hyderabad');
    setState('Telangana');
    setModalError(null);
    setIsAddModalOpen(true);
  };

  const handleCreateDealer = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!email.trim() || !password.trim()) {
      setModalError('Dealer Email ID and Password are required');
      return;
    }

    setSubmitting(true);
    try {
      await createAdminDealer({
        email: email.trim(),
        password: password.trim(),
        businessName: storeName.trim() || undefined,
        fullName: contactName.trim() || undefined,
        phone: phone.trim() || undefined,
        city: city.trim() || 'Hyderabad',
        state: state.trim() || 'Telangana'
      });

      setRecentlyCreated({
        email: email.trim(),
        pass: password.trim(),
        store: storeName.trim() || contactName.trim() || email.trim()
      });

      setSuccessMsg(`Dealer account for ${email} created successfully!`);
      setIsAddModalOpen(false);
      loadDealers();
    } catch (err: any) {
      setModalError(err.message || 'Failed to create dealer account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEditModal = (d: DealerRecord) => {
    setEditingDealer(d);
    setStoreName(d.business_name || d.businessName || '');
    setContactName(d.full_name || d.fullName || '');
    setEmail(d.email || '');
    setPassword(d.password || getStoredDealerPassword(d.email) || '');
    setPhone(d.phone || '');
    setCity(d.city || 'Hyderabad');
    setState(d.state || 'Telangana');
    setModalError(null);
    setIsEditModalOpen(true);
  };

  const promptUpdateDealer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDealer) return;
    setTargetDealerForSecurity(editingDealer);
    setSecurityAction('update');
    setSecurityModalOpen(true);
  };

  const handleAuthorizedUpdateDealer = async () => {
    if (!targetDealerForSecurity) return;
    setIsProcessingSecurityAction(true);
    try {
      await updateAdminDealer(targetDealerForSecurity.id, {
        businessName: storeName.trim(),
        fullName: contactName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        state: state.trim(),
        password: password.trim() || undefined,
      });

      setSuccessMsg(`Dealer ${targetDealerForSecurity.email} updated successfully!`);
      setIsEditModalOpen(false);
      setSecurityModalOpen(false);
      setEditingDealer(null);
      setTargetDealerForSecurity(null);
      await loadDealers();
    } catch (err: any) {
      alert('Failed to update dealer: ' + (err.message || 'Error'));
    } finally {
      setIsProcessingSecurityAction(false);
    }
  };

  const promptDeleteDealer = (d: DealerRecord) => {
    setTargetDealerForSecurity(d);
    setSecurityAction('delete');
    setSecurityModalOpen(true);
  };

  const handleAuthorizedDeleteDealer = async () => {
    if (!targetDealerForSecurity) return;
    setIsProcessingSecurityAction(true);
    try {
      await deleteAdminDealer(targetDealerForSecurity.id);
      setSuccessMsg(`Dealer account (${targetDealerForSecurity.email}) deleted successfully.`);
      setSecurityModalOpen(false);
      setTargetDealerForSecurity(null);
      await loadDealers();
    } catch (err: any) {
      alert('Failed to delete dealer: ' + (err.message || 'Error'));
    } finally {
      setIsProcessingSecurityAction(false);
    }
  };

  const filteredDealers = dealers.filter(d => {
    const q = searchTerm.toLowerCase();
    return (
      (d.business_name || '').toLowerCase().includes(q) ||
      (d.full_name || '').toLowerCase().includes(q) ||
      (d.email || '').toLowerCase().includes(q) ||
      (d.phone || '').includes(q) ||
      (d.city || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-[#E6EBDD] shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Store className="w-3.5 h-3.5 text-[#138443]" />
            <span>Authorized Wholesale Dealers ({dealers.length})</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#183D2B] font-poppins">
            Dealer Management
          </h2>
          <p className="text-xs text-[#68756B] max-w-xl">
            Create and manage authorized dealer accounts. Dealers use these admin-issued credentials to sign in and view bulk wholesale prices on the dedicated Dealer Page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDealers}
            disabled={loading}
            className="p-2.5 rounded-2xl border border-[#E6EBDD] hover:bg-slate-50 text-[#183D2B] transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs bg-[#138443] hover:bg-[#0d6131] text-white shadow-md shadow-[#138443]/20 transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Dealer</span>
          </button>
        </div>
      </div>

      {/* Recently Created Credentials Notification */}
      {recentlyCreated && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-xs text-emerald-900 block">
                Dealer Credentials Ready for: {recentlyCreated.store}
              </span>
              <div className="text-xs text-emerald-800 mt-1 font-mono flex flex-wrap gap-x-4 gap-y-1">
                <span>Email: <strong className="select-all">{recentlyCreated.email}</strong></span>
                <span>Password: <strong className="select-all">{recentlyCreated.pass}</strong></span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(`Juci Cool Dealer Login:\nEmail: ${recentlyCreated.email}\nPassword: ${recentlyCreated.pass}`);
                alert('Credentials copied to clipboard!');
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100 flex items-center gap-1.5 shadow-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Login Info</span>
            </button>
            <button
              onClick={() => setRecentlyCreated(null)}
              className="p-1 text-emerald-600 hover:text-emerald-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Success / Error Alerts */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-600 hover:text-rose-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#E6EBDD] flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search dealers by store name, email, phone, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Dealers Table / Cards */}
      <div className="bg-white rounded-3xl border border-[#E6EBDD] overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-[#68756B]">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#138443] mb-3" />
            <p className="text-xs font-semibold">Loading dealer accounts...</p>
          </div>
        ) : filteredDealers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Store className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-[#183D2B]">No dealer accounts found</h3>
            <p className="text-xs text-[#68756B] max-w-sm mx-auto">
              {searchTerm ? 'No dealers matched your search filter.' : 'Click "+ Add Dealer" above to create credentials for your first wholesale partner.'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#138443] text-white hover:bg-[#0d6131]"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add First Dealer</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFFEF7] border-b border-[#E6EBDD] text-[#68756B] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Store / Business Name</th>
                  <th className="py-3 px-4">Contact Person</th>
                  <th className="py-3 px-4">Dealer Email (Login ID)</th>
                  <th className="py-3 px-4 min-w-[200px]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[#183D2B]">Dealer Password</span>
                      <button
                        type="button"
                        onClick={() => setShowAllPasswords(!showAllPasswords)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100/90 hover:bg-amber-200/90 text-amber-900 border border-amber-300 text-[10px] font-bold normal-case transition-colors"
                        title={showAllPasswords ? "Hide all passwords" : "Show all passwords"}
                      >
                        {showAllPasswords ? <EyeOff className="w-3 h-3 text-amber-700" /> : <Eye className="w-3 h-3 text-amber-700" />}
                        <span>{showAllPasswords ? "Hide All" : "Show All"}</span>
                      </button>
                    </div>
                  </th>
                  <th className="py-3 px-4">Phone / City</th>
                  <th className="py-3 px-4">Account Type</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6EBDD]">
                {filteredDealers.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#183D2B]">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#138443] flex items-center justify-center shrink-0">
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#183D2B]">
                            {d.business_name || d.businessName || d.full_name || d.fullName || 'Wholesale Partner'}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-semibold">
                            ID: #{d.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#183D2B] font-medium">
                      {d.full_name || d.fullName || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#138443] font-semibold select-all">
                      <div className="flex items-center gap-1.5">
                        <span>{d.email}</span>
                        <button
                          onClick={() => handleCopyText(d.email, `email-${d.id}`)}
                          className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                          title="Copy dealer email"
                        >
                          {copiedKey === `email-${d.id}` ? (
                            <Check className="w-3 h-3 text-emerald-600 font-bold" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {(() => {
                        const pwd = d.password || getStoredDealerPassword(d.email);
                        const isVisible = isPasswordVisible(d.id);
                        return (
                          <div className="flex items-center gap-1.5">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50/90 border border-amber-300/80 font-mono text-xs font-bold text-amber-900 shadow-2xs select-all">
                              <Key className="w-3 h-3 text-amber-600 shrink-0" />
                              <span>{isVisible ? pwd : '••••••••'}</span>
                            </div>
                            <button
                              onClick={() => togglePasswordVisibility(d.id)}
                              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                              title={isVisible ? "Mask password" : "Show password"}
                            >
                              {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleCopyText(pwd, `pwd-${d.id}`)}
                              className="p-1 rounded-lg hover:bg-emerald-50 text-slate-500 hover:text-[#138443] transition-colors"
                              title="Copy password"
                            >
                              {copiedKey === `pwd-${d.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="py-3.5 px-4 text-[#68756B]">
                      <div>{d.phone || '—'}</div>
                      <div className="text-[10px] text-slate-400">{d.city || 'Hyderabad'}, {d.state || 'Telangana'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Wholesale Dealer
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#68756B] text-[11px]">
                      {d.created_at || d.createdAt ? new Date(d.created_at || d.createdAt!).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleCopyCredentials(d)}
                          className="px-2.5 py-1 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors inline-flex items-center gap-1 text-[11px] font-bold border border-emerald-200"
                          title="Copy Full Login Credentials (Email & Password)"
                        >
                          {copiedKey === `cred-${d.id}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600 font-bold" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Details</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(d)}
                          className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200"
                          title="Edit dealer account (Requires admin password to save)"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => promptDeleteDealer(d)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
                          title="Delete dealer account (Requires admin password)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL: ADD DEALER ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E6EBDD] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6EBDD]">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-[#138443] rounded-xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#183D2B]">Add New Dealer</h3>
                  <p className="text-[11px] text-[#68756B]">Provide credentials for wholesale portal access</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-[#183D2B] rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateDealer} className="space-y-3.5">
              {/* Store Name */}
              <div>
                <label className="block text-xs font-bold text-[#183D2B] mb-1">
                  Dealer Store / Business Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Balaji Supermarket & Agency"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                  />
                  <Store className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Contact Person Name */}
              <div>
                <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                  Contact Person Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Sharma"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                />
              </div>

              {/* Dealer Email ID */}
              <div>
                <label className="block text-xs font-bold text-[#183D2B] mb-1">
                  Dealer Email ID (Login Username) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="e.g. balaji@dealers.jucicool.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] text-[#68756B] mt-0.5">Dealer will use this email address to sign in.</p>
              </div>

              {/* Assigned Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#183D2B]">
                    Assigned Security Password <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setPassword(`Juci${Math.floor(1000 + Math.random() * 9000)}#`)}
                    className="text-[10px] text-[#138443] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate New</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter security password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E6EBDD] font-mono font-bold text-[#183D2B] bg-amber-50/50 focus:outline-none focus:border-[#138443]"
                  />
                  <Key className="w-4 h-4 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] text-[#68756B] mt-0.5">This password will be displayed in the admin dealer table and can be copied anytime.</p>
              </div>

              {/* Phone & City Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hyderabad"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E6EBDD]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#68756B] hover:text-[#183D2B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#138443] hover:bg-[#0d6131] text-white shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Dealer...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Save & Issue Credentials</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ================= MODAL: EDIT DEALER ================= */}
      {isEditModalOpen && editingDealer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E6EBDD] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6EBDD]">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-[#138443] rounded-xl">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#183D2B]">Edit Dealer Account</h3>
                  <p className="text-[11px] text-[#68756B]">Update profile or reset password (password required to authorize)</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingDealer(null);
                }}
                className="p-1.5 text-slate-400 hover:text-[#183D2B] rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={promptUpdateDealer} className="space-y-3.5">
              {/* Store Name */}
              <div>
                <label className="block text-xs font-bold text-[#183D2B] mb-1">
                  Dealer Store / Business Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Balaji Supermarket & Agency"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                  />
                  <Store className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Contact Person Name */}
              <div>
                <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                  Contact Person Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Sharma"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                />
              </div>

              {/* Email (Readonly) */}
              <div>
                <label className="block text-xs font-bold text-[#183D2B] mb-1">
                  Dealer Email ID (Login Username)
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-mono"
                />
                <p className="text-[10px] text-[#68756B] mt-0.5">Dealer email ID is permanent.</p>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#183D2B]">
                    Assigned Dealer Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setPassword(`Juci${Math.floor(1000 + Math.random() * 9000)}#`)}
                    className="text-[10px] text-[#138443] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate New</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter security password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E6EBDD] font-mono font-bold text-[#183D2B] bg-amber-50/50 focus:outline-none focus:border-[#138443]"
                  />
                  <Key className="w-4 h-4 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Phone & City Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hyderabad"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E6EBDD]">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingDealer(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-[#68756B] hover:text-[#183D2B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#138443] hover:bg-[#0d6131] text-white shadow-md flex items-center gap-1.5 transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Authorize & Update</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Security Action Authorization Modal */}
      <SecurityActionModal
        isOpen={securityModalOpen}
        actionType={securityAction}
        title={securityAction === 'delete' ? 'Confirm Dealer Account Deletion' : 'Authorize Dealer Account Update'}
        itemName={targetDealerForSecurity ? `${targetDealerForSecurity.business_name || targetDealerForSecurity.businessName || 'Dealer'} (${targetDealerForSecurity.email})` : ''}
        itemType="Dealer Account"
        description={
          securityAction === 'delete'
            ? `You are about to permanently remove wholesale portal access for "${targetDealerForSecurity?.email}".`
            : `You are about to update credentials and business details for "${targetDealerForSecurity?.email}".`
        }
        confirmButtonText={securityAction === 'delete' ? 'Delete Dealer Account' : 'Confirm & Update Dealer'}
        onClose={() => {
          setSecurityModalOpen(false);
          setTargetDealerForSecurity(null);
        }}
        onConfirm={securityAction === 'delete' ? handleAuthorizedDeleteDealer : handleAuthorizedUpdateDealer}
        isLoading={isProcessingSecurityAction}
      />
    </div>
  );
};
export default DealersTab;
