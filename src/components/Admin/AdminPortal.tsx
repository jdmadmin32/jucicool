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
  Sparkles,
  Store,
  UserPlus,
  Database,
  AlertTriangle,
  ShieldAlert,
  HardDrive
} from 'lucide-react';
import { DatabaseStorageAlertModal } from './DatabaseStorageAlertModal';
import { DatabaseStatus, fetchDatabaseStatus } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { DashboardOverview } from './DashboardOverview';
import { RetailOrdersTab } from './RetailOrdersTab';
import { BulkEnquiriesTab } from './BulkEnquiriesTab';
import { WholesaleOrdersTab } from './WholesaleOrdersTab';
import { ProductInventoryTab } from './ProductInventoryTab';
import { DealersTab } from './DealersTab';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Database Storage Health & Alert State
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchDatabaseStatus().then(setDbStatus).catch(console.warn);
      const timer = setInterval(() => {
        fetchDatabaseStatus().then(setDbStatus).catch(console.warn);
      }, 30000);
      return () => clearInterval(timer);
    }
  }, [isAuthenticated]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    }
  };



  // Nav Tabs Config
  const tabs = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'retail-orders', label: 'Retail Orders', icon: ShoppingBag },
    { id: 'bulk-enquiries', label: 'Bulk Enquiries', icon: Building2, highlight: true },
    { id: 'wholesale-orders', label: 'Wholesale Orders', icon: PackageCheck },
    { id: 'inventory', label: 'Products & Inventory', icon: Boxes },
    { id: 'dealers', label: 'Dealer Accounts', icon: Store, highlight: true },
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

          {/* Quick Demo Access Bar */}
          <div className="bg-emerald-50/80 border border-emerald-200 p-3 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#138443] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#138443]" /> Quick Admin Access:
              </span>
              <span className="text-[#68756B] text-[10px]">ID: jucicooladmin | Pass: juci@cool123</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('jucicooladmin');
                  setPassword('juci@cool123');
                }}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-emerald-100/70 border border-emerald-300 text-[#138443] font-bold text-[11px] rounded-lg transition-all"
              >
                Auto-fill Credentials
              </button>
              <button
                type="button"
                onClick={async () => {
                  setEmail('jucicooladmin');
                  setPassword('juci@cool123');
                  try {
                    await login('jucicooladmin', 'juci@cool123');
                  } catch (err: any) {
                    setLoginError(err.message);
                  }
                }}
                className="flex-1 py-1.5 px-2 bg-[#138443] hover:bg-[#0d6131] text-white font-bold text-[11px] rounded-lg shadow-sm transition-all"
              >
                ⚡ 1-Click Sign In
              </button>
            </div>
          </div>

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

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Database Storage Alert Button */}
            {dbStatus?.isFull ? (
              <button
                onClick={() => setIsDbModalOpen(true)}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black border border-red-500 bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 shadow-lg shadow-red-500/30 animate-bounce transition-all"
                title="CRITICAL: Database storage is full! Click to manage."
              >
                <ShieldAlert className="w-4 h-4 text-white" />
                <span>🚨 DB FULL ({dbStatus.usagePercent}%)</span>
              </button>
            ) : dbStatus?.isWarning ? (
              <button
                onClick={() => setIsDbModalOpen(true)}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-300 bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center gap-1.5 shadow-sm animate-pulse transition-all"
                title="Database storage warning! High usage."
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>DB Warning ({dbStatus.usagePercent}%)</span>
              </button>
            ) : (
              <button
                onClick={() => setIsDbModalOpen(true)}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-[#138443] flex items-center gap-1.5 transition-all shadow-sm"
                title="Database Storage: Healthy"
              >
                <Database className="w-3.5 h-3.5 text-[#138443]" />
                <span className="hidden md:inline font-bold">DB: {dbStatus?.totalFormatted || 'Healthy'} ({dbStatus?.usagePercent ?? 0}%)</span>
                <span className="md:hidden font-bold">DB</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </button>
            )}

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

      {/* Critical Database Full Alert Top Banner */}
      {dbStatus?.isFull && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold shadow-md sticky top-16 z-20 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-300 animate-pulse flex-shrink-0" />
            <span>DATABASE CAPACITY ALERT: Storage is {dbStatus.usagePercent}% full ({dbStatus.totalFormatted} / {dbStatus.maxStorageFormatted}). Action required to prevent write failures.</span>
          </div>
          <button
            onClick={() => setIsDbModalOpen(true)}
            className="px-3 py-1 bg-white text-red-700 hover:bg-yellow-50 rounded-lg text-xs font-black shadow transition-all ml-3 shrink-0"
          >
            Manage Storage &rarr;
          </button>
        </div>
      )}

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

          <div className="p-3.5 bg-white rounded-2xl border border-[#E6EBDD] text-xs space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#183D2B]">System Status</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#138443] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#138443] animate-pulse"></span> Live
              </span>
            </div>
            <div className="text-[11px] text-[#68756B] flex items-center justify-between pt-1 border-t border-[#E6EBDD]">
              <span>Storefront Sync:</span>
              <strong className="text-[#138443]">Active</strong>
            </div>
            <div className="text-[11px] text-[#68756B] flex items-center justify-between pt-1 border-t border-[#E6EBDD]">
              <span>DB Capacity:</span>
              <button
                onClick={() => setIsDbModalOpen(true)}
                className={`font-bold hover:underline ${
                  dbStatus?.isFull ? 'text-red-600' : dbStatus?.isWarning ? 'text-amber-600' : 'text-[#138443]'
                }`}
              >
                {dbStatus?.totalFormatted || '1.8 MB'} ({dbStatus?.usagePercent || 0}%)
              </button>
            </div>
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
          {activeTab === 'dealers' && <DealersTab />}
          {activeTab === 'customers' && <CustomerDirectoryTab />}
          {activeTab === 'reports' && <ReportsTab />}
        </main>
      </div>

      {/* Database Storage Alert & Maintenance Modal */}
      <DatabaseStorageAlertModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        onStatusChange={(newStatus) => setDbStatus(newStatus)}
      />
    </div>
  );
};
