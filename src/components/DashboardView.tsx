import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  PiggyBank,
  Lock,
  Database,
  Trash2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Settings2,
  FolderOpen,
  PieChart,
  Layers
} from 'lucide-react';
import { Category, Transaction, Budget, TransactionType } from '../types/index.ts';
import { ConfirmDeleteModal } from './ConfirmDeleteModal.tsx';

interface DashboardViewProps {
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  currentDate: { year: number; month: number };
  onMonthChange: (year: number, month: number) => void;
  onNavigateDetail: (type: TransactionType) => void;
  onOpenAddTransaction: () => void;
  onOpenCategoriesManager: () => void;
  onOpenBudgetManager: () => void;
  onOpenDataManagement?: () => void;
  onOpenSupabaseConfig: () => void;
  onOpenExportHtml: () => void;
  onLockApp: () => void;
  onDeleteTransaction: (id: string) => void;
  isConnectedToSupabase: boolean;
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  categories,
  transactions,
  budgets,
  currentDate,
  onMonthChange,
  onNavigateDetail,
  onOpenAddTransaction,
  onOpenCategoriesManager,
  onOpenBudgetManager,
  onOpenDataManagement,
  onOpenSupabaseConfig,
  onOpenExportHtml,
  onLockApp,
  onDeleteTransaction,
  isConnectedToSupabase,
}) => {
  const { year, month } = currentDate;
  const [searchFilter, setSearchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      onMonthChange(year - 1, 11);
    } else {
      onMonthChange(year, month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      onMonthChange(year + 1, 0);
    } else {
      onMonthChange(year, month + 1);
    }
  };

  // Calculations for current month
  const incomeTransactions = useMemo(
    () => transactions.filter((t) => t.type === 'income'),
    [transactions]
  );
  const expenseTransactions = useMemo(
    () => transactions.filter((t) => t.type === 'expense'),
    [transactions]
  );
  const savingTransactions = useMemo(
    () => transactions.filter((t) => t.type === 'saving'),
    [transactions]
  );

  const totalIncome = useMemo(
    () => incomeTransactions.reduce((acc, t) => acc + t.amount, 0),
    [incomeTransactions]
  );
  const totalExpense = useMemo(
    () => expenseTransactions.reduce((acc, t) => acc + t.amount, 0),
    [expenseTransactions]
  );
  const totalSavings = useMemo(
    () => savingTransactions.reduce((acc, t) => acc + t.amount, 0),
    [savingTransactions]
  );

  const currentMonthBalance = totalIncome - totalExpense;

  // Filtered transactions for the movements list
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      if (!searchFilter.trim()) return true;
      const q = searchFilter.toLowerCase();
      const cat = categories.find((c) => c.id === tx.category_id);
      return (
        (cat && cat.name.toLowerCase().includes(q)) ||
        (tx.subcategory && tx.subcategory.toLowerCase().includes(q)) ||
        (tx.note && tx.note.toLowerCase().includes(q)) ||
        tx.amount.toString().includes(q)
      );
    });
  }, [transactions, categories, typeFilter, searchFilter]);

  // Sum of filtered transactions
  const filteredTotal = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => {
      if (t.type === 'income') return acc + t.amount;
      if (t.type === 'expense') return acc - t.amount;
      return acc;
    }, 0);
  }, [filteredTransactions]);

  // Format date to DD/MM/AA
  const formatDateDDMMAA = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0].slice(2)}`;
      }
    } catch (e) {}
    return dateStr;
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      const targetId = deleteTarget.id;
      const targetLabel = deleteTarget.label;
      setDeleteTarget(null);
      onDeleteTransaction(targetId);
      showToast(`Movimiento "${targetLabel}" eliminado.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 sm:pb-28 text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg backdrop-blur-md flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          TOP HEADER BAR (Responsive: Celular, Tablet, Computadora)
      ========================================================================= */}
      <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#ECE7DF] px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Nombre */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F4EDFA] via-[#EFE7F6] to-[#FAF8F5] flex items-center justify-center border border-white shadow-2xs shrink-0">
              <Sparkles className="w-4 h-4 text-[#9678B6]" />
            </div>
            <div className="min-w-0">
              <span className="text-sm sm:text-base font-bold tracking-tight text-slate-800 truncate block">
                Mis Finanzas
              </span>
            </div>
          </div>

          {/* Desktop & Tablet Top Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Categorías Shortcut on Desktop / Tablet */}
            <button
              onClick={onOpenCategoriesManager}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#EDE8DF] text-slate-700 text-xs font-semibold shadow-2xs hover:bg-[#FAF8F5] active:scale-95 transition-all cursor-pointer"
              title="Administrar Categorías"
            >
              <FolderOpen className="w-3.5 h-3.5 text-[#9678B6]" />
              <span className="hidden lg:inline">Categorías</span>
            </button>

            {/* Presupuestos Shortcut on Desktop */}
            <button
              onClick={onOpenBudgetManager}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#EDE8DF] text-slate-700 text-xs font-semibold shadow-2xs hover:bg-[#FAF8F5] active:scale-95 transition-all cursor-pointer"
              title="Presupuestos"
            >
              <PieChart className="w-3.5 h-3.5 text-[#9678B6]" />
              <span>Presupuestos</span>
            </button>

            {/* Nuevo Movimiento Shortcut (Desktop / Tablet) */}
            <button
              onClick={onOpenAddTransaction}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#9678B6] text-white text-xs font-semibold shadow-2xs hover:bg-[#8666A6] active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo</span>
            </button>

            {/* Bloquear con PIN */}
            <button
              onClick={onLockApp}
              className="w-8 h-8 rounded-xl bg-white border border-[#EDE8DF] text-slate-600 flex items-center justify-center shadow-2xs hover:text-slate-900 active:scale-95 transition-all cursor-pointer"
              title="Bloquear con PIN"
              aria-label="Bloquear"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN CONTAINER (Adaptable: Móvil 1 col, Tablet 1-2 col, Computadora 2 cols)
      ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* =====================================================================
              COLUMNA IZQUIERDA (Desktop: 7 cols | Tablet / Mobile: 100%)
          ===================================================================== */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Selector de Mes */}
            <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-2.5 border border-[#EDE8DF] shadow-2xs">
              <button
                onClick={handlePrevMonth}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                aria-label="Mes anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="text-center">
                <span className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
                  {MONTH_NAMES[month]} {year}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {transactions.length} movimiento{transactions.length !== 1 ? 's' : ''} este mes
                </span>
              </div>

              <button
                onClick={handleNextMonth}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                aria-label="Mes siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Balance Acumulado Card (Estilo Mujer Financiera) */}
            <div className="bg-gradient-to-br from-white via-white to-[#FAF8F5] rounded-3xl p-6 sm:p-7 border border-[#EDE8DF] shadow-2xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-44 h-44 bg-[#F4EDFA]/50 rounded-full blur-3xl pointer-events-none" />

              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Balance Acumulado
                  </span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      currentMonthBalance >= 0
                        ? 'text-[#3B4B2E] bg-[#EBF1E6]'
                        : 'text-[#8B2E2E] bg-[#FDECE8]'
                    }`}
                  >
                    {currentMonthBalance >= 0 ? 'Superávit' : 'Déficit'}
                  </span>
                </div>

                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 tabular-nums tracking-tight my-2">
                  $ {currentMonthBalance.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Saldo disponible mensual (Ingresos menos Gastos)
                </p>

                {/* Micro KPI Row en Computadora / Tablet */}
                <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-[#F2ECE4]">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Ingresos
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#3B4B2E] tabular-nums">
                      + $ {totalIncome.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Gastos
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#8B2E2E] tabular-nums">
                      - $ {totalExpense.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Ahorros
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#614E15] tabular-nums">
                      $ {totalSavings.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Las 3 Tarjetas de Resumen Financiero */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Resumen Financiero
                </h2>
                <span className="text-[11px] text-slate-400">Toca para ver detalle por categorías</span>
              </div>

              {/* Grid 1 col en celular, 3 cols en Tablet y Computadora */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* 1. Ingresos Card (Verde pastel oliva) */}
                <div
                  onClick={() => onNavigateDetail('income')}
                  className="bg-[#EBF1E6] hover:bg-[#E4ECE0] rounded-2xl p-4 sm:p-4.5 border border-[#D7E3D0] shadow-2xs cursor-pointer transition-all hover:-translate-y-0.5 active:scale-[0.98] group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center text-[#3B4B2E] shadow-2xs">
                      <ArrowDownLeft className="w-4 h-4 text-[#8E9F7C]" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#3B4B2E]/70 mb-0.5">
                    Ingresos
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-[#3B4B2E] tabular-nums tracking-tight">
                    $ {totalIncome.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-[11px] text-[#3B4B2E]/60 mt-1">
                    {incomeTransactions.length} movimiento{incomeTransactions.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* 2. Gastos Card (Rojo pastel suave) */}
                <div
                  onClick={() => onNavigateDetail('expense')}
                  className="bg-[#FDECE8] hover:bg-[#FCE4DF] rounded-2xl p-4 sm:p-4.5 border border-[#F8D2CA] shadow-2xs cursor-pointer transition-all hover:-translate-y-0.5 active:scale-[0.98] group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center text-[#8B2E2E] shadow-2xs">
                      <ArrowUpRight className="w-4 h-4 text-[#E06A60]" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8B2E2E]/70 mb-0.5">
                    Gastos
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-[#8B2E2E] tabular-nums tracking-tight">
                    $ {totalExpense.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-[11px] text-[#8B2E2E]/60 mt-1">
                    {expenseTransactions.length} movimiento{expenseTransactions.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* 3. Ahorros Card (Amarillo pastel suave) */}
                <div
                  onClick={() => onNavigateDetail('saving')}
                  className="bg-[#FCF6E5] hover:bg-[#F8EFCF] rounded-2xl p-4 sm:p-4.5 border border-[#F2E5BD] shadow-2xs cursor-pointer transition-all hover:-translate-y-0.5 active:scale-[0.98] group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center text-[#614E15] shadow-2xs">
                      <PiggyBank className="w-4 h-4 text-[#E5C86F]" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#614E15]/70 mb-0.5">
                    Ahorros
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-[#614E15] tabular-nums tracking-tight">
                    $ {totalSavings.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-[11px] text-[#614E15]/60 mt-1">
                    {savingTransactions.length} aporte{savingTransactions.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Sección "Mis Presupuestos Mensuales" */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Mis Presupuestos
                </h2>
                <button
                  onClick={onOpenBudgetManager}
                  className="text-xs font-semibold text-[#9678B6] hover:text-[#8465A4] flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar / Editar
                </button>
              </div>

              {budgets.length === 0 ? (
                <div className="bg-white rounded-2xl p-5 border border-[#EDE8DF] text-center shadow-2xs">
                  <p className="text-xs text-slate-500">
                    Define límites mensuales para tus categorías de gasto y mantén el control.
                  </p>
                  <button
                    onClick={onOpenBudgetManager}
                    className="mt-2 text-xs font-semibold text-[#9678B6] hover:underline cursor-pointer"
                  >
                    Crear mi primer presupuesto
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {budgets.map((budget) => {
                    const category = categories.find((c) => c.id === budget.category_id);
                    const spent = expenseTransactions
                      .filter((t) => t.category_id === budget.category_id)
                      .reduce((acc, t) => acc + t.amount, 0);

                    const percent = Math.min(100, (spent / budget.monthly_limit) * 100);
                    const isOver = spent > budget.monthly_limit;

                    return (
                      <div
                        key={budget.id}
                        className="bg-white rounded-2xl p-4 border border-[#EDE8DF] shadow-2xs space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-base shrink-0">{category?.icon_or_image_url || '📁'}</span>
                            <span className="text-xs font-bold text-slate-800 truncate">
                              {category?.name || 'Categoría'}
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-bold text-slate-800 tabular-nums">
                              $ {spent.toLocaleString('es-AR')}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              de $ {budget.monthly_limit.toLocaleString('es-AR')}
                            </span>
                          </div>
                        </div>

                        {/* Barra de progreso delgada */}
                        <div className="w-full bg-[#F3EFEA] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isOver
                                ? 'bg-rose-400'
                                : percent > 80
                                ? 'bg-[#E5C86F]'
                                : 'bg-[#8E9F7C]'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        <div className="flex justify-between items-center text-[10px]">
                          <span
                            className={`font-semibold ${
                              isOver ? 'text-rose-600' : 'text-slate-400'
                            }`}
                          >
                            {percent.toFixed(0)}% utilizado
                          </span>
                          {isOver && (
                            <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                              Excedido
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* =====================================================================
              COLUMNA DERECHA (Desktop: 5 cols | Tablet / Mobile: 100%)
              Panel de Movimientos, Búsqueda, Filtros y Eliminación
          ===================================================================== */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-white rounded-3xl p-5 border border-[#EDE8DF] shadow-2xs space-y-3.5">
              
              {/* Header del panel */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-800">
                    Movimientos ({filteredTransactions.length})
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    {MONTH_NAMES[month]} {year}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenCategoriesManager}
                    className="text-xs font-semibold text-slate-600 bg-slate-50 border border-[#ECE7DF] px-2.5 py-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Categorías
                  </button>
                  <button
                    onClick={onOpenAddTransaction}
                    className="text-xs font-semibold text-white bg-[#9678B6] px-3 py-1 rounded-full hover:bg-[#8666A6] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3 h-3" /> Nuevo
                  </button>
                </div>
              </div>

              {/* Barra de búsqueda interactiva */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por categoría, nota o monto..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF] focus:outline-hidden focus:border-[#9678B6] text-slate-700"
                />
              </div>

              {/* Filtro por tipo (Todos, Ingresos, Gastos, Ahorros) */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-[#FAF8F5] rounded-xl text-[11px]">
                <button
                  onClick={() => setTypeFilter('all')}
                  className={`py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    typeFilter === 'all'
                      ? 'bg-white shadow-2xs font-bold text-slate-800'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setTypeFilter('income')}
                  className={`py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    typeFilter === 'income'
                      ? 'bg-[#EBF1E6] text-[#3B4B2E] font-bold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Ingresos
                </button>
                <button
                  onClick={() => setTypeFilter('expense')}
                  className={`py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    typeFilter === 'expense'
                      ? 'bg-[#FDECE8] text-[#8B2E2E] font-bold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Gastos
                </button>
                <button
                  onClick={() => setTypeFilter('saving')}
                  className={`py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    typeFilter === 'saving'
                      ? 'bg-[#FCF6E5] text-[#614E15] font-bold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Ahorros
                </button>
              </div>

              {/* Lista de Movimientos con Scroll suave */}
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-0.5">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12 px-4 bg-[#FAF8F5]/50 rounded-2xl border border-dashed border-[#ECE7DF]">
                    <p className="text-3xl mb-2">🍃</p>
                    <p className="text-xs font-semibold text-slate-700">
                      {transactions.length === 0
                        ? 'Sin movimientos registrados este mes'
                        : 'No se encontraron resultados con ese filtro'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {transactions.length === 0
                        ? 'Toca el botón (+) para registrar tu primer movimiento.'
                        : 'Prueba cambiando el término de búsqueda.'}
                    </p>
                    {transactions.length === 0 && (
                      <button
                        onClick={onOpenAddTransaction}
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#9678B6] text-white text-xs font-semibold cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" /> Agregar Movimiento
                      </button>
                    )}
                  </div>
                ) : (
                  filteredTransactions.map((tx) => {
                    const cat = categories.find((c) => c.id === tx.category_id);
                    const isIncome = tx.type === 'income';
                    const isSaving = tx.type === 'saving';

                    return (
                      <div
                        key={tx.id}
                        className="bg-white rounded-2xl p-3 sm:p-3.5 border border-[#EDE8DF] flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-all group"
                      >
                        {/* Avatar e información */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF] flex items-center justify-center text-lg shrink-0 overflow-hidden">
                            {cat?.icon_or_image_url.startsWith('data:image') ||
                            cat?.icon_or_image_url.startsWith('http') ? (
                              <img
                                src={cat.icon_or_image_url}
                                alt={cat.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{cat?.icon_or_image_url || '📁'}</span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                                {cat?.name || 'Movimiento'}
                              </p>
                              {tx.subcategory && (
                                <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md truncate max-w-[110px]">
                                  {tx.subcategory}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              <span>{formatDateDDMMAA(tx.date)}</span>
                              {tx.note && (
                                <span className="truncate max-w-[130px] sm:max-w-[180px]">
                                  · {tx.note}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Monto y Botón de Eliminar Cómodo */}
                        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                          <span
                            className={`text-xs sm:text-sm font-bold tabular-nums ${
                              isIncome
                                ? 'text-[#3B4B2E]'
                                : isSaving
                                ? 'text-[#614E15]'
                                : 'text-[#8B2E2E]'
                            }`}
                          >
                            {isIncome ? '+ ' : '- '}$ {tx.amount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>

                          {/* Botón de eliminación visible, con área táctil cómoda (36px) */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const catName = cat?.name || 'Movimiento';
                              setDeleteTarget({
                                id: tx.id,
                                label: `${catName} ($ ${tx.amount})`,
                              });
                            }}
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:scale-95 transition-all cursor-pointer"
                            title="Eliminar este movimiento"
                            aria-label="Eliminar movimiento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button '+' (Mobile Thumb-Zone) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={onOpenAddTransaction}
          className="w-14 h-14 rounded-full bg-[#9678B6] text-white shadow-lg flex items-center justify-center hover:bg-[#8666A6] active:scale-95 transition-all cursor-pointer ring-4 ring-[#FAF8F5]"
          title="Agregar Movimiento (+)"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* In-App Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteTarget !== null}
        title="¿Eliminar este movimiento?"
        message={
          deleteTarget
            ? `Se eliminará permanentemente "${deleteTarget.label}". Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
