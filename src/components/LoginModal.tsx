import React, { useState } from 'react';
import {
  X,
  Store,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  Phone,
  Building2,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    loginModalSection,
    setLoginModalSection,
    customerLogin,
    customerRegister,
    isLoading
  } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Register form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Telangana');

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
      const user = await customerLogin(identifier, password);
      setSuccessMsg(`Welcome back, ${user.fullName || 'Partner'}!`);
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (loginModalSection === 'dealer' && !businessName.trim()) {
      setError('Business or Store Name is required for Dealer/Retailer account');
      return;
    }

    try {
      const user = await customerRegister({
        email,
        password,
        fullName,
        phone,
        customerType: loginModalSection === 'dealer' ? 'dealer_retailer' : 'general',
        businessName: loginModalSection === 'dealer' ? businessName : undefined,
        city,
        state
      });
      setSuccessMsg(`Account created successfully! Welcome, ${user.fullName}.`);
      setTimeout(() => {
        handleClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };



  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E6EBDD] overflow-hidden transform transition-all max-h-[94vh] flex flex-col"
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
          
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC928]" />
            <span>Juci Cool Official Portal</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            {isRegisterMode ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-white/80 text-xs mt-1">
            Choose your account type below to get tailored pricing & order privileges.
          </p>
        </div>

        {/* Section Tabs: Dealer / Retailer vs General Customer */}
        <div className="p-4 bg-[#F8FAF5] border-b border-[#E6EBDD]">
          <div className="grid grid-cols-2 gap-2 bg-[#EAEFE2] p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setLoginModalSection('dealer');
                setError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs transition-all ${
                loginModalSection === 'dealer'
                  ? 'bg-white text-[#183D2B] shadow-md shadow-emerald-900/5 ring-1 ring-[#138443]/20'
                  : 'text-[#68756B] hover:text-[#183D2B]'
              }`}
            >
              <Store className="w-4 h-4 text-[#138443]" />
              <div className="text-left">
                <div className="leading-tight">Dealer / Retailer</div>
                <div className="text-[10px] text-[#138443] font-bold uppercase tracking-wider">
                  Wholesale Rates
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginModalSection('general');
                setError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs transition-all ${
                loginModalSection === 'general'
                  ? 'bg-white text-[#183D2B] shadow-md shadow-emerald-900/5 ring-1 ring-[#138443]/20'
                  : 'text-[#68756B] hover:text-[#183D2B]'
              }`}
            >
              <UserIcon className="w-4 h-4 text-[#F7941D]" />
              <div className="text-left">
                <div className="leading-tight">General Customer</div>
                <div className="text-[10px] text-[#68756B] font-medium">Standard Retail</div>
              </div>
            </button>
          </div>

          {/* Value proposition pill */}
          <div className="mt-3 text-center">
            {loginModalSection === 'dealer' ? (
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3 py-1 rounded-full text-[11px] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#138443]" />
                <span>Dealers & Retailers get access to <strong>wholesale trade rates</strong> set by admin (with MOQ)!</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 px-3 py-1 rounded-full text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Personal delivery right to your door with real fruit freshness!</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Body / Scrollable Form */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Error / Success Messages */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
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

          {!isRegisterMode ? (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#183D2B] mb-1">
                  {loginModalSection === 'dealer' ? 'Dealer Email or Username' : 'Customer Email or Mobile'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={loginModalSection === 'dealer' ? 'e.g. dealer@jucicool.com or phone' : 'e.g. customer@jucicool.com'}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#E6EBDD] bg-white focus:outline-none focus:border-[#138443] focus:ring-1 focus:ring-[#138443]"
                  />
                  <Mail className="w-4 h-4 text-[#68756B] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183D2B] mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#E6EBDD] bg-white focus:outline-none focus:border-[#138443] focus:ring-1 focus:ring-[#138443]"
                  />
                  <Lock className="w-4 h-4 text-[#68756B] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-[#138443] hover:bg-[#0d6131] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to {loginModalSection === 'dealer' ? 'Dealer Portal' : 'Store'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>


            </form>
          ) : (
            /* ================= REGISTER FORM ================= */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {loginModalSection === 'dealer' && (
                <div>
                  <label className="block text-xs font-bold text-[#183D2B] mb-1">
                    Business / Store Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Sree Balaji Supermarket"
                      className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#E6EBDD] bg-white focus:outline-none focus:border-[#138443]"
                    />
                    <Building2 className="w-4 h-4 text-[#68756B] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#183D2B] mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#E6EBDD] bg-white focus:outline-none focus:border-[#138443]"
                  />
                  <UserIcon className="w-4 h-4 text-[#68756B] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#183D2B] mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@domain.com"
                      className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#E6EBDD] bg-white focus:outline-none focus:border-[#138443]"
                    />
                    <Mail className="w-4 h-4 text-[#68756B] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#183D2B] mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98490 XXXXX"
                      className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#E6EBDD] bg-white focus:outline-none focus:border-[#138443]"
                    />
                    <Phone className="w-4 h-4 text-[#68756B] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#183D2B] mb-1">City</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Hyderabad"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E6EBDD] bg-white focus:outline-none focus:border-[#138443]"
                    />
                    <MapPin className="w-4 h-4 text-[#68756B] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#183D2B] mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Telangana"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6EBDD] bg-white focus:outline-none focus:border-[#138443]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183D2B] mb-1">
                  Create Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#E6EBDD] bg-white focus:outline-none focus:border-[#138443]"
                  />
                  <Lock className="w-4 h-4 text-[#68756B] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-[#138443] hover:bg-[#0d6131] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Register as {loginModalSection === 'dealer' ? 'Dealer / Retailer' : 'General Customer'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Toggle between Login and Register */}
          <div className="pt-3 text-center">
            {isRegisterMode ? (
              <p className="text-xs text-[#68756B]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                    setError(null);
                  }}
                  className="font-bold text-[#138443] hover:underline"
                >
                  Sign In instead
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#68756B]">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    setError(null);
                  }}
                  className="font-bold text-[#138443] hover:underline"
                >
                  Create one now
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
