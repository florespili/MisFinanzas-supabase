import React, { useState } from 'react';
import {
  X,
  Trash2,
  RotateCcw,
  Database,
  FileCode,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { ConfirmDeleteModal } from './ConfirmDeleteModal.tsx';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthName: string;
  year: number;
  totalTransactionsCount: number;
  monthTransactionsCount: number;
  onDeleteAllTransactions: () => Promise<void>;
  onDeleteMonthTransactions: () => Promise<void>;
  onResetDemoData: () => Promise<void>;
  onOpenSupabaseConfig: () => void;
  onOpenExportHtml: () => void;
  isConnectedToSupabase: boolean;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  monthName,
  year,
  totalTransactionsCount,
  monthTransactionsCount,
  onDeleteAllTransactions,
  onDeleteMonthTransactions,
  onResetDemoData,
  onOpenSupabaseConfig,
  onOpenExportHtml,
  isConnectedToSupabase,
}) => {
  const [confirmAction, setConfirmAction] = useState<
    'all_txs' | 'month_txs' | 'reset_demo' | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExecuteAction = async () => {
    if (!confirmAction) return;
    setIsProcessing(true);
    try {
      if (confirmAction === 'all_txs') {
        await onDeleteAllTransactions();
        showToast('Todos los movimientos han sido eliminados.');
      } else if (confirmAction === 'month_txs') {
        await onDeleteMonthTransactions();
        showToast(`Movimientos de ${monthName} ${year} eliminados.`);
      } else if (confirmAction === 'reset_demo') {
        await onResetDemoData();
        showToast('Datos de prueba restablecidos correctamente.');
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsProcessing(false);
      setConfirmAction(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FAF8F5] rounded-3xl border border-[#EDE8DF] shadow-xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8DF] bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F4EDFA] text-[#9678B6] flex items-center justify-center shadow-2xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-800">
                Gestión y Eliminación de Datos
              </h2>
              <span className="text-[11px] text-slate-400 block -mt-0.5">
                {isConnectedToSupabase ? 'Base de datos Supabase conectada' : 'Almacenamiento Local'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {toastMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Sección: Opciones de Limpieza y Eliminación */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              Eliminar Movimientos
            </h3>

            {/* Opción 1: Borrar todo para empezar de cero */}
            <div className="bg-white rounded-2xl p-4 border border-[#EDE8DF] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    Vaciar Todos los Movimientos
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                    Elimina todas las transacciones registradas para empezar desde $0.00.
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    Total actual: {totalTransactionsCount} movimiento{totalTransactionsCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmAction('all_txs')}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 active:scale-95 transition-all shadow-2xs cursor-pointer shrink-0"
              >
                Vaciar Todo
              </button>
            </div>

            {/* Opción 2: Borrar movimientos del mes seleccionado */}
            <div className="bg-white rounded-2xl p-4 border border-[#EDE8DF] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    Borrar Solo {monthName} {year}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                    Elimina únicamente los movimientos registrados en este mes.
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                    En este mes: {monthTransactionsCount} movimiento{monthTransactionsCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmAction('month_txs')}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 active:scale-95 transition-all shadow-2xs cursor-pointer shrink-0"
              >
                Borrar Mes
              </button>
            </div>

            {/* Opción 3: Restablecer datos de prueba */}
            <div className="bg-white rounded-2xl p-4 border border-[#EDE8DF] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    Restablecer Datos de Demostración
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                    Vuelve a cargar los movimientos de ejemplo de salario, compras y ahorros.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmAction('reset_demo')}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#9678B6] text-white text-xs font-bold hover:bg-[#8666A6] active:scale-95 transition-all shadow-2xs cursor-pointer shrink-0"
              >
                Restablecer
              </button>
            </div>
          </div>

          {/* Sección: Opciones Avanzadas (Supabase y Exportar) */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              Conexión y Respaldo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenSupabaseConfig();
                }}
                className="p-3.5 bg-white rounded-2xl border border-[#EDE8DF] hover:border-[#9678B6] text-left transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Database className="w-4 h-4 text-[#9678B6]" />
                  <span className="text-xs font-bold text-slate-800">Base de Datos Supabase</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Configurar URL, Clave anónima y ver Script SQL.
                </p>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenExportHtml();
                }}
                className="p-3.5 bg-white rounded-2xl border border-[#EDE8DF] hover:border-[#9678B6] text-left transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileCode className="w-4 h-4 text-[#9678B6]" />
                  <span className="text-xs font-bold text-slate-800">Exportar HTML GitHub</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Descargar archivo index.html para GitHub Pages.
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#EDE8DF] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={confirmAction !== null}
        title={
          confirmAction === 'all_txs'
            ? '¿Vaciar todos los movimientos?'
            : confirmAction === 'month_txs'
            ? `¿Borrar movimientos de ${monthName} ${year}?`
            : '¿Restablecer datos de demostración?'
        }
        message={
          confirmAction === 'all_txs'
            ? 'Se eliminarán permanentemente todas las transacciones cargadas. Tu balance quedará en $0.00.'
            : confirmAction === 'month_txs'
            ? `Se eliminarán todos los movimientos registrados en ${monthName} ${year}.`
            : 'Se volverán a crear las categorías y transacciones de ejemplo iniciales.'
        }
        confirmLabel={
          confirmAction === 'reset_demo'
            ? 'Sí, restablecer'
            : 'Sí, eliminar datos'
        }
        onConfirm={handleExecuteAction}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
};
