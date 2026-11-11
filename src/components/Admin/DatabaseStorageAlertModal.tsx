import React, { useState, useEffect } from 'react';
import {
  Database,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  HardDrive,
  RefreshCw,
  Sparkles,
  Trash2,
  X,
  Gauge,
  Layers,
  ShieldAlert,
  Sliders
} from 'lucide-react';
import {
  DatabaseStatus,
  fetchDatabaseStatus,
  vacuumDatabase,
  clearOldDatabaseLogs
} from '../../services/api';
import { SecurityActionModal } from './DeleteConfirmationModal';

interface DatabaseStorageAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (status: DatabaseStatus) => void;
}

export const DatabaseStorageAlertModal: React.FC<DatabaseStorageAlertModalProps> = ({
  isOpen,
  onClose,
  onStatusChange
}) => {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVacuuming, setIsVacuuming] = useState(false);
  const [isClearingLogs, setIsClearingLogs] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [simulatedMode, setSimulatedMode] = useState<string | null>(null);
  const [clearSecurityOpen, setClearSecurityOpen] = useState(false);

  const loadStatus = async (simMode = simulatedMode) => {
    setLoading(true);
    try {
      const data = await fetchDatabaseStatus(simMode || undefined);
      setStatus(data);
      if (onStatusChange) {
        onStatusChange(data);
      }
    } catch (err: any) {
      console.error('Failed to load database status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadStatus(simulatedMode);
      setActionMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVacuum = async () => {
    setIsVacuuming(true);
    setActionMessage(null);
    try {
      const res = await vacuumDatabase();
      setActionMessage(`✅ ${res.message || 'Optimization complete'}. Freed: ${res.freedFormatted || '0 B'}`);
      await loadStatus(simulatedMode);
    } catch (err: any) {
      setActionMessage(`❌ Optimization error: ${err.message}`);
    } finally {
      setIsVacuuming(false);
    }
  };

  const handleClearLogs = () => {
    setClearSecurityOpen(true);
  };

  const handleAuthorizedClearLogs = async () => {
    setClearSecurityOpen(false);
    setIsClearingLogs(true);
    setActionMessage(null);
    try {
      const res = await clearOldDatabaseLogs();
      setActionMessage(`✅ ${res.message || 'Old logs purged successfully.'}`);
      await loadStatus(simulatedMode);
    } catch (err: any) {
      setActionMessage(`❌ Failed to clear logs: ${err.message}`);
    } finally {
      setIsClearingLogs(false);
    }
  };

  const handleToggleSimulation = async (mode: 'full' | 'warning' | null) => {
    setSimulatedMode(mode);
    await loadStatus(mode);
    if (mode === 'full') {
      setActionMessage('⚠️ Simulating Full Database state (94.2% capacity alert).');
    } else if (mode === 'warning') {
      setActionMessage('⚠️ Simulating Elevated Warning state (78.5% capacity alert).');
    } else {
      setActionMessage('Restored live real-time database storage metrics.');
    }
  };

  const usagePercent = status?.usagePercent || 0;
  const isFull = status?.isFull || false;
  const isWarning = status?.isWarning || false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-[#E6EBDD] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with status badge */}
        <div className={`p-4 sm:p-6 border-b flex items-center justify-between text-white ${
          isFull
            ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700'
            : isWarning
            ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700'
            : 'bg-gradient-to-r from-[#183D2B] via-[#0d6131] to-[#138443]'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
              {isFull ? (
                <ShieldAlert className="w-6 h-6 text-white animate-bounce" />
              ) : isWarning ? (
                <AlertTriangle className="w-6 h-6 text-yellow-200" />
              ) : (
                <HardDrive className="w-6 h-6 text-[#8CC63E]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">Database Storage Monitor</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isFull
                    ? 'bg-red-950 text-red-200 border border-red-400'
                    : isWarning
                    ? 'bg-amber-950 text-amber-200 border border-amber-400'
                    : 'bg-emerald-950/70 text-emerald-300 border border-emerald-400/50'
                }`}>
                  {isFull ? 'Critical Alert' : isWarning ? 'Warning' : 'Healthy'}
                </span>
              </div>
              <p className="text-xs text-white/80">
                SQLite Engine • Auto-WAL Mode • Threshold Alerts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto">
          {/* Action Message Alert */}
          {actionMessage && (
            <div className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-between ${
              actionMessage.startsWith('✅')
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : actionMessage.startsWith('⚠️')
                ? 'bg-amber-50 border border-amber-200 text-amber-900'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}>
              <span>{actionMessage}</span>
              <button onClick={() => setActionMessage(null)} className="text-xs opacity-60 hover:opacity-100 ml-2">
                ✕
              </button>
            </div>
          )}

          {/* Full Alert Callout Banner */}
          {isFull && (
            <div className="bg-red-50 border-2 border-red-400 p-4 rounded-2xl space-y-2 text-red-900 animate-pulse">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <h4 className="font-black text-sm">DATABASE FULL ALERT: Capacity Reached</h4>
              </div>
              <p className="text-xs leading-relaxed text-red-800">
                The database has reached <strong>{usagePercent}%</strong> of its recommended storage quota ({status?.totalFormatted} of {status?.maxStorageFormatted}). To prevent database write blocks or transaction aborts, please run VACUUM optimization or purge historical logs below.
              </p>
            </div>
          )}

          {/* Warning Banner */}
          {!isFull && isWarning && (
            <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-2xl flex items-start gap-2.5 text-amber-900 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Elevated Storage Warning ({usagePercent}%)</strong>
                <span>Storage utilization is high. We recommend running SQLite VACUUM optimization to clean up unused memory pages.</span>
              </div>
            </div>
          )}

          {/* Capacity Progress Bar & Numbers */}
          <div className="bg-[#F9FAF6] border border-[#E6EBDD] p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#183D2B] flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-[#138443]" /> Storage Utilization
              </span>
              <span className={`text-xs font-black ${
                isFull ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-[#138443]'
              }`}>
                {usagePercent}% Used
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300/60">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isFull
                    ? 'bg-gradient-to-r from-red-500 to-rose-600 shadow-sm'
                    : isWarning
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                    : 'bg-gradient-to-r from-[#8CC63E] to-[#138443]'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, usagePercent))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#68756B] pt-1">
              <div>
                <span>Current Size: </span>
                <strong className="text-[#183D2B]">{status?.totalFormatted || '0 MB'}</strong>
                <span className="text-[10px] text-slate-400 block sm:inline sm:ml-1">
                  (DB: {status?.dbSizeFormatted || '0'} + WAL: {status?.walSizeFormatted || '0'})
                </span>
              </div>
              <div>
                <span>Safe Limit: </span>
                <strong className="text-[#183D2B]">{status?.maxStorageFormatted || '50 MB'}</strong>
              </div>
            </div>
          </div>

          {/* Table Breakdown Grid */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#183D2B] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#138443]" /> Database Table Records
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[10px] text-[#68756B] block">Products</span>
                <span className="text-sm font-bold text-[#183D2B]">{status?.tables.products ?? 0}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[10px] text-[#68756B] block">Soft Copy Photos</span>
                <span className="text-sm font-bold text-[#183D2B]">{status?.tables.productImages ?? 0}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[10px] text-[#68756B] block">Retail Orders</span>
                <span className="text-sm font-bold text-[#183D2B]">{status?.tables.retailOrders ?? 0}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[10px] text-[#68756B] block">Bulk Enquiries</span>
                <span className="text-sm font-bold text-[#183D2B]">{status?.tables.bulkEnquiries ?? 0}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[10px] text-[#68756B] block">Wholesale Quotes</span>
                <span className="text-sm font-bold text-[#183D2B]">{status?.tables.quotations ?? 0}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[10px] text-[#68756B] block">Wholesale Orders</span>
                <span className="text-sm font-bold text-[#183D2B]">{status?.tables.wholesaleOrders ?? 0}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[10px] text-[#68756B] block">User Accounts</span>
                <span className="text-sm font-bold text-[#183D2B]">{status?.tables.users ?? 0}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[10px] text-[#68756B] block">Audit Logs</span>
                <span className="text-sm font-bold text-[#183D2B]">{status?.tables.auditLogs ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Database Maintenance Actions */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-[#183D2B] block">
              Database Maintenance & Space Reclamation
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={handleVacuum}
                disabled={isVacuuming}
                className="py-2.5 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-[#183D2B] font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isVacuuming ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#138443]" />
                ) : (
                  <Sparkles className="w-4 h-4 text-[#138443]" />
                )}
                <span>Run VACUUM & Optimize</span>
              </button>

              <button
                onClick={handleClearLogs}
                disabled={isClearingLogs}
                className="py-2.5 px-3 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isClearingLogs ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-rose-600" />
                ) : (
                  <Trash2 className="w-4 h-4 text-rose-600" />
                )}
                <span>Purge Old Audit Logs</span>
              </button>
            </div>
          </div>

          {/* Test Alert Simulation Tools */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
            <div>
              <span className="font-bold text-[#183D2B] block flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-[#138443]" /> Test Alert Simulator:
              </span>
              <span className="text-[11px] text-[#68756B]">
                Test how the Admin Panel responds when the database fills up.
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleToggleSimulation('full')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                  simulatedMode === 'full'
                    ? 'bg-red-600 text-white border-red-700'
                    : 'bg-white hover:bg-red-50 text-red-700 border-red-300'
                }`}
              >
                Simulate Full (94%)
              </button>
              <button
                onClick={() => handleToggleSimulation('warning')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                  simulatedMode === 'warning'
                    ? 'bg-amber-600 text-white border-amber-700'
                    : 'bg-white hover:bg-amber-50 text-amber-700 border-amber-300'
                }`}
              >
                Warning (78%)
              </button>
              {simulatedMode && (
                <button
                  onClick={() => handleToggleSimulation(null)}
                  className="px-2 py-1 text-[11px] font-bold rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-[#E6EBDD] flex items-center justify-between">
          <button
            onClick={() => loadStatus()}
            disabled={loading}
            className="text-xs text-[#138443] font-bold hover:underline flex items-center gap-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Metrics</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#183D2B] hover:bg-[#138443] text-white font-bold text-xs rounded-xl transition-all shadow"
          >
            Done
          </button>
        </div>
      </div>

      {/* Security Password Modal for Purging Database Logs */}
      <SecurityActionModal
        isOpen={clearSecurityOpen}
        actionType="delete"
        title="Authorize Database Log Purge"
        itemName="Audit and Status History Logs"
        itemType="Database Logs"
        description="This will permanently delete historical audit records to reclaim database storage space. This action cannot be undone."
        confirmButtonText="Authorize & Purge Logs"
        onClose={() => setClearSecurityOpen(false)}
        onConfirm={handleAuthorizedClearLogs}
        isLoading={isClearingLogs}
      />
    </div>
  );
};
