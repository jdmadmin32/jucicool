import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Building2,
  PackageCheck,
  Boxes,
  Users,
  BarChart3,
  LogOut,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Mail,
  Loader2,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DashboardOverview } from './DashboardOverview';
import { RetailOrdersTab } from './RetailOrdersTab';
import { BulkEnquiriesTab } from './BulkEnquiriesTab';
import { WholesaleOrdersTab } from './WholesaleOrdersTab';
import { ProductInventoryTab } from './ProductInventoryTab';
import { CustomerDirectoryTab } from './CustomerDirectoryTab';
import { ReportsTab } from './ReportsTab';

interface AdminPortalProps {
  onBackToStore: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToStore }) => {
  const { isAuthenticated, user, login, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Login form states
  const [email, setEmail] = useState('admin@jucicool.com');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const autofillAdmin = () => {
    setEmail('jucicooladmin');
    setPassword('juci@cool123');
  };

  // Nav Tabs Config
  const tabs = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'retail-orders', label: 'Retail Orders', icon: ShoppingBag },
    { id: 'bulk-enquiries', label: 'Bulk Enquiries', icon: Building2, highlight: true },
    { id: 'wholesale-orders', label: 'Wholesale Orders', icon: PackageCheck },
    { id: 'inventory', label: 'Products & Inventory', icon: Boxes },
    { id: 'customers', label: 'Customer Directory', icon: Users },
    { id: 'reports', label: 'Reports & Exports', icon: BarChart3 },
  ];

  // If NOT logged in or not admin, show secure admin login screen
  if (!isAuthenticated || (user && user.role !== 'admin' && user.role !== 'sales_rep')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#183D2B] via-[#0d6131] to-[#138443] flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-[#E6EBDD] space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center space-y-2">
            <img
              src="/images/juci-cool-logo.png"
              alt="Juci Cool"
              className="h-16 w-auto mx-auto object-contain"
            />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#138443]" />
              <span>Admin & Commercial Console</span>
            </div>
            <h2 className="text-2xl font-black text-[#183D2B] font-poppins">
              Authorized Sign In
            </h2>
            <p className="text-xs text-[#68756B]">
              Manage product catalog rates, wholesale pricing, quotations, warehouse inventory, and customer enquiries.
            </p>
          </div>

          {user && user.role !== 'admin' && user.role !== 'sales_rep' && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-medium">
              Signed in as {user.fullName}. Administrator credentials are required to open this portal.
            </div>
          )}

          {loginError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                Admin Username / ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. jucicooladmin"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                Security Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-xs bg-[#138443] hover:bg-[#0d6131] text-white flex items-center justify-center gap-2 shadow-lg shadow-[#138443]/25 transition-all disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>Enter Admin Management Portal</span>
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="p-3 bg-[#F4F8F0] rounded-2xl border border-[#E6EBDD] text-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-[#183D2B]">Admin ID & Password:</div>
              <div className="text-[11px] text-[#68756B]">ID: <strong>jucicooladmin</strong> &bull; Pass: <strong>juci@cool123</strong></div>
            </div>
            <button
              onClick={autofillAdmin}
              className="px-2.5 py-1 text-[11px] font-bold bg-white border border-[#E6EBDD] rounded-lg text-[#138443] hover:bg-[#138443] hover:text-white transition-colors"
            >
              Autofill
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onBackToStore}
              className="text-xs font-semibold text-[#68756B] hover:text-[#183D2B] flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD SHELL
  return (
    <div className="min-h-screen bg-[#F9FAF6] flex flex-col">
      {/* Top Admin Header Bar */}
      <header className="bg-white border-b border-[#E6EBDD] sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 text-[#183D2B] rounded-lg hover:bg-slate-100"
            >
              {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <img
              src="/images/juci-cool-logo.png"
              alt="Juci Cool"
              className="h-10 w-auto object-contain"
            />
            <div className="hidden sm:block border-l border-[#E6EBDD] pl-3">
              <span className="text-xs font-bold text-[#183D2B] font-poppins">Management Hub</span>
              <span className="text-[10px] text-[#68756B] block">JDM Fruit Products Pvt. Ltd.</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-[#E6EBDD] hover:bg-slate-50 text-[#183D2B] flex items-center gap-1.5 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#138443]" />
              <span className="hidden sm:inline">Storefront</span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-[#E6EBDD]">
              <div className="w-8 h-8 rounded-full bg-[#138443] text-white flex items-center justify-center font-bold text-xs">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <div className="hidden md:block text-left text-xs">
                <div className="font-bold text-[#183D2B]">{user?.fullName || 'Admin Officer'}</div>
                <div className="text-[10px] text-[#68756B] capitalize">{user?.role || 'Super Admin'}</div>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout: Sidebar + Tab Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 space-y-2">
          <div className="bg-white p-3 rounded-3xl border border-[#E6EBDD] shadow-sm space-y-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#138443] text-white shadow-md'
                      : 'text-[#68756B] hover:text-[#183D2B] hover:bg-[#F4F8F0]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#8CC63E]' : ''}`} />
                    <span>{t.label}</span>
                  </div>
                  {t.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#F7941D]"></span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-4 bg-white rounded-3xl border border-[#E6EBDD] text-xs text-[#68756B] space-y-1 shadow-sm">
            <div className="font-bold text-[#183D2B]">Centralized Engine</div>
            <p className="text-[11px] leading-relaxed">
              Separates retail consumer checkouts from wholesale dealer quotation negotiations.
            </p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50 p-4">
            <div className="bg-white rounded-3xl max-w-xs p-4 space-y-2 border border-[#E6EBDD] shadow-2xl">
              <div className="flex justify-between items-center pb-2 border-b border-[#E6EBDD]">
                <span className="font-bold text-sm text-[#183D2B]">Admin Navigation</span>
                <button onClick={() => setMobileSidebarOpen(false)} className="p-1">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              {tabs.map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTab(t.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold ${
                      isActive ? 'bg-[#138443] text-white' : 'text-[#68756B] hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Tab View */}
        <main className="flex-1 min-w-0">
          {activeTab === 'overview' && <DashboardOverview onNavigateTab={(t) => setActiveTab(t)} />}
          {activeTab === 'retail-orders' && <RetailOrdersTab />}
          {activeTab === 'bulk-enquiries' && <BulkEnquiriesTab />}
          {activeTab === 'wholesale-orders' && <WholesaleOrdersTab />}
          {activeTab === 'inventory' && <ProductInventoryTab />}
          {activeTab === 'customers' && <CustomerDirectoryTab />}
          {activeTab === 'reports' && <ReportsTab />}
        </main>
      </div>
    </div>
  );
};
