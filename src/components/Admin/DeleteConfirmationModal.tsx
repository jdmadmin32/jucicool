import React, { useState } from 'react';
import { ShieldAlert, KeyRound, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const ADMIN_SECURITY_PASSWORD = 'Mango@123';
// Backward-compatibility alias
export const ADMIN_DELETE_PASSWORD = ADMIN_SECURITY_PASSWORD;

interface SecurityActionModalProps {
  isOpen: boolean;
  title: string;
  actionType: 'delete' | 'update';
  itemName: string;
  itemType?: string;
  description?: string;
  confirmButtonText?: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const SecurityActionModal: React.FC<SecurityActionModalProps> = ({
  isOpen,
  title,
  actionType,
  itemName,
  itemType = 'record',
  description,
  confirmButtonText,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isDelete = actionType === 'delete';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError(`Please enter the security password to authorize ${actionType}.`);
      return;
    }

    if (password.trim() !== ADMIN_SECURITY_PASSWORD) {
      setError('Incorrect admin security password. Authorization rejected.');
      return;
    }

    setError(null);
    onConfirm();
  };

  const handleClose = () => {
    setPassword('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border ${isDelete ? 'border-red-200' : 'border-amber-200'} animate-in fade-in zoom-in-95 duration-200`}>
        {/* Header */}
        <div className={`p-5 ${isDelete ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700' : 'bg-gradient-to-r from-amber-600 via-orange-600 to-[#138443]'} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base font-poppins">{title}</h3>
              <p className="text-[11px] text-white/80">Restricted Admin Security Check</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
            title="Cancel"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          <div className={`p-3.5 ${isDelete ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'} border rounded-2xl space-y-1`}>
            <div className={`flex items-center gap-2 ${isDelete ? 'text-red-800' : 'text-amber-800'} font-bold text-xs uppercase tracking-wider`}>
              <AlertTriangle className={`w-4 h-4 ${isDelete ? 'text-red-600' : 'text-amber-600'} shrink-0`} />
              <span>{isDelete ? 'Permanent Deletion Authorization' : 'Admin Update Authorization'}</span>
            </div>
            <p className={`text-xs ${isDelete ? 'text-red-700' : 'text-amber-900'} leading-relaxed`}>
              {description || (isDelete
                ? `You are about to permanently delete this ${itemType}:`
                : `You are authorizing changes to this ${itemType}:`)}
            </p>
            <p className={`text-xs font-black ${isDelete ? 'text-red-950' : 'text-amber-950'} font-mono break-all pt-0.5`}>
              "{itemName}"
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#183D2B] flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#138443]" />
              Enter Admin Password to Authorize:
            </label>
            <input
              type="password"
              placeholder="Enter admin password (Mango@123)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6EBDD] bg-[#FFFEF7] focus:border-[#138443] focus:ring-1 focus:ring-[#138443] text-xs font-mono outline-hidden transition-all"
            />
            <p className="text-[10px] text-[#68756B]">
              Enter the master security password (<strong>Mango@123</strong>) to authorize this {actionType}.
            </p>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#68756B] hover:text-[#183D2B] hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 ${
                isDelete
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-[#138443] hover:bg-[#0d6131]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isLoading
                  ? isDelete ? 'Deleting...' : 'Updating...'
                  : confirmButtonText || (isDelete ? 'Confirm & Delete' : 'Authorize & Update')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Backward-compatible component export
export const DeleteConfirmationModal: React.FC<any> = ({
  isOpen,
  title,
  itemName,
  itemType = 'record',
  warningNote,
  onClose,
  onConfirm,
  isDeleting = false,
}) => (
  <SecurityActionModal
    isOpen={isOpen}
    title={title}
    actionType="delete"
    itemName={itemName}
    itemType={itemType}
    description={warningNote}
    confirmButtonText="Confirm & Delete"
    onClose={onClose}
    onConfirm={onConfirm}
    isLoading={isDeleting}
  />
);
