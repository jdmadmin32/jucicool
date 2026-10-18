import React, { useState } from 'react';
import {
  X,
  Store,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CartoonEyesAvatar } from './ui/cloud-watch-form';

interface LoginModalProps {
  onDealerLoginSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onDealerLoginSuccess }) => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    customerLogin,
    isLoading
  } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isTypingPassword, setIsTypingPassword] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleClose = () => {
    setIsLoginModalOpen(false);
    setError(null);
    setSuccessMsg(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const user = await customerLogin(identifier.trim(), password.trim());
      setSuccessMsg(`Welcome, ${user.businessName || user.fullName || 'Authorized Dealer'}! Loading Wholesale Portal...`);
      setTimeout(() => {
        handleClose();
        if (onDealerLoginSuccess) {
          onDealerLoginSuccess();
        }
      }, 900);
    } catch (err: any) {
      setError(err.message || 'Invalid dealer email or password. Please verify your admin-assigned credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E6EBDD] overflow-hidden transform transition-all max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle pill */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-2.5 sm:hidden shrink-0"></div>

        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-[#183D2B] via-[#138443] to-[#0d6131] p-5 sm:p-6 text-white text-left shrink-0">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md mb-2 text-[#FFC928]">
            <Store className="w-3.5 h-3.5" />
            <span>Authorized B2B Wholesale Portal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Dealer Sign In
          </h2>
          <p className="text-white/80 text-xs mt-1 leading-relaxed">
            Enter your admin-issued dealer credentials to access wholesale pricing and bulk ordering.
          </p>
        </div>

        {/* Modal Body / Scrollable Form */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Interactive Cartoon Face with Eyes Tracking & Blinking */}
          <div className="py-2.5 px-3 bg-gradient-to-b from-[#FFFDF5] to-[#F5F9F0] rounded-2xl border border-[#E6EBDD] flex flex-col items-center justify-center shadow-inner">
            <CartoonEyesAvatar isTyping={isTypingPassword} />
            <div className="text-[10px] text-[#68756B] mt-0.5 font-semibold">
              {isTypingPassword ? "🙈 Shh! Peeking away while you enter password..." : "👀 Eyes track your cursor • Move your mouse around!"}
            </div>
          </div>

          {/* Error / Success Messages */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Dealer Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#183D2B] mb-1">
                Dealer Email ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. dealer@jucicool.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#E6EBDD] bg-white focus:outline-none focus:border-[#138443] focus:ring-1 focus:ring-[#138443]"
                />
                <Mail className="w-4 h-4 text-[#68756B] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#183D2B] mb-1">
                Security Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsTypingPassword(true)}
                  onBlur={() => setIsTypingPassword(false)}
                  placeholder="Enter assigned dealer password"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#E6EBDD] bg-white focus:outline-none focus:border-[#138443] focus:ring-1 focus:ring-[#138443]"
                />
                <Lock className="w-4 h-4 text-[#68756B] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-[#138443] hover:bg-[#0d6131] text-white shadow-lg shadow-[#138443]/20 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In to Dealer Portal...</span>
                </>
              ) : (
                <>
                  <Store className="w-4 h-4" />
                  <span>Access Dealer Wholesale Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Admin Issuance Notice */}
          <div className="pt-3 border-t border-[#E6EBDD] bg-[#FFFEF7] p-3 rounded-2xl border space-y-1.5 text-center">
            <div className="text-[11px] font-bold text-[#183D2B] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#138443]" />
              <span>Dealer Account Credentials Notice</span>
            </div>
            <p className="text-[11px] text-[#68756B] leading-relaxed">
              Wholesale accounts are created exclusively by the Juci Cool Administration. If you are a supermarket, kirana store, or distributor and need login credentials, contact our wholesale desk:
            </p>
            <a
              href="https://api.whatsapp.com/send?phone=919393122122&text=Hello%20Juci%20Cool,%20I%20would%20like%20to%20request%20dealer%20login%20credentials%20for%20my%20store."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#138443] hover:underline pt-1"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Contact Admin on WhatsApp (+91 9393122122)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
