import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Calendar, ChevronRight, ChevronDown, Tag, AlertCircle } from 'lucide-react';
import { Category, Transaction, TransactionType } from '../types/index.ts';
import { ConfirmDeleteModal } from './ConfirmDeleteModal.tsx';

interface DetailViewProps {
  type: TransactionType;
  categories: Category[];
  transactions: Transaction[];
  monthName: string;
  year: number;
  onBack: () => void;
  onAddTransaction: (preselectedType?: TransactionType, preselectedCategory?: string) => void;
  onDeleteTransaction: (id: string) => void;
  onManageCategories: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({
  type,
  categories,
  transactions,
  monthName,
  year,
  onBack,
  onAddTransaction,
  onDeleteTransaction,
  onManageCategories,
}) => {
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);

  // Filter transactions for this type
  const typeTransactions = transactions.filter((t) => t.type === type);
  const totalAmount = typeTransactions.reduce((acc, t) => acc + t.amount, 0);

  // Filter categories of this type
  const typeCategories = categories.filter((c) => c.type === type);

  // Calculate totals per category
  const categoryStats = typeCategories
    .map((category) => {
      const catTxs = typeTransactions.filter((t) => t.category_id === category.id);
      const sum = catTxs.reduce((acc, t) => acc + t.amount, 0);
      const percentage = totalAmount > 0 ? (sum / totalAmount) * 100 : 0;
      return {
        category,
        total: sum,
        percentage,
        transactions: catTxs,
      };
    })
    .filter((stat) => stat.total > 0 || typeCategories.length <= 8)
    .sort((a, b) => b.total - a.total);

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

  // Pastel styling configuration per type
  const theme = {
    expense: {
      title: 'Detalle de Gastos',
      bgHeader: 'bg-gradient-to-b from-[#FDECE8] via-[#FCE4DF] to-[#FAF8F5]',
      badgeColor: 'bg-[#F8D2CA]/60 text-[#8B2E2E]',
      cardBg: 'bg-[#FDECE8]',
      barColor: 'bg-[#E06A60]',
      textColor: 'text-[#8B2E2E]',
      accentBg: 'bg-[#E06A60]',
    },
    income: {
      title: 'Detalle de Ingresos',
      bgHeader: 'bg-gradient-to-b from-[#EBF1E6] via-[#E2EAD9] to-[#FAF8F5]',
      badgeColor: 'bg-[#A3B899]/50 text-[#3B4B2E]',
      cardBg: 'bg-[#EBF1E6]',
      barColor: 'bg-[#8E9F7C]',
      textColor: 'text-[#3B4B2E]',
      accentBg: 'bg-[#8E9F7C]',
    },
    saving: {
      title: 'Detalle de Ahorros',
      bgHeader: 'bg-gradient-to-b from-[#FCF6E5] via-[#FDF2D6] to-[#FAF8F5]',
      badgeColor: 'bg-[#E5C86F]/50 text-[#614E15]',
      cardBg: 'bg-[#FCF6E5]',
      barColor: 'bg-[#E5C86F]',
      textColor: 'text-[#614E15]',
      accentBg: 'bg-[#E5C86F]',
    },
  }[type];

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-28">
      {/* Top Header with Back button and Pastel Banner (Responsive width) */}
      <div className={`${theme.bgHeader} pt-4 pb-7 px-4 sm:px-6 lg:px-8 border-b border-[#ECE7DF]`}>
        <div className="max-w-4xl mx-auto">
          {/* Top navigation row */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/80 border border-[#ECE7DF] shadow-2xs flex items-center justify-center text-slate-700 hover:text-slate-900 active:scale-95 transition-transform cursor-pointer"
              aria-label="Volver al dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold text-slate-700">
              {monthName} {year}
            </span>
            <button
              onClick={onManageCategories}
              className="text-xs font-medium text-slate-600 bg-white/80 border border-[#ECE7DF] px-3 py-1.5 rounded-full shadow-2xs hover:bg-white active:scale-95 transition-all cursor-pointer"
            >
              Categorías
            </button>
          </div>

          {/* Prominent Highlight Card with Total of the Month */}
          <div className={`${theme.cardBg} rounded-3xl p-6 sm:p-8 border border-white/80 shadow-xs text-center max-w-xl mx-auto`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Total {type === 'expense' ? 'Gastos' : type === 'income' ? 'Ingresos' : 'Ahorros'} del Mes
            </p>
            <p className={`text-3xl sm:text-5xl font-bold ${theme.textColor} tabular-nums tracking-tight my-1`}>
              $ {totalAmount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {typeTransactions.length} movimiento{typeTransactions.length !== 1 ? 's' : ''} registrado{typeTransactions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Categories Breakdown List (Responsive: grid on tablet/desktop) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Desglose por Categorías
          </h2>
          <span className="text-xs text-slate-400">
            {categoryStats.length} categoría{categoryStats.length !== 1 ? 's' : ''}
          </span>
        </div>

        {categoryStats.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-[#EDE8DF] text-center my-4">
            <p className="text-3xl mb-2">🍃</p>
            <p className="text-sm font-medium text-slate-700">Aún no hay movimientos este mes</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Agrega tu primer registro para ver el análisis de categorías.
            </p>
            <button
              onClick={() => onAddTransaction(type)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-2xs hover:opacity-95 transition-opacity ${theme.accentBg}`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Movimiento</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {categoryStats.map(({ category, total, percentage, transactions: catTxs }) => {
              const isExpanded = expandedCategoryId === category.id;

              return (
                <div
                  key={category.id}
                  className="bg-white rounded-2xl border border-[#EDE8DF] shadow-2xs overflow-hidden transition-all duration-200 hover:border-slate-300"
                >
                  {/* Category main bar item */}
                  <div
                    onClick={() => setExpandedCategoryId(isExpanded ? null : category.id)}
                    className="p-4 sm:p-5 cursor-pointer flex flex-col gap-2 select-none"
                  >
                    <div className="flex items-center justify-between">
                      {/* Left icon and title */}
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FAF8F5] border border-[#ECE7DF] flex items-center justify-center text-xl shrink-0 overflow-hidden">
                          {category.icon_or_image_url.startsWith('data:image') ||
                          category.icon_or_image_url.startsWith('http') ? (
                            <img
                              src={category.icon_or_image_url}
                              alt={category.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>{category.icon_or_image_url || '📁'}</span>
                          )}
                        </div>

                        <div>
                          <p className="text-sm sm:text-base font-semibold text-slate-800 tracking-tight">
                            {category.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {catTxs.length} movimiento{catTxs.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      {/* Right amount, percentage and chevron */}
                      <div className="flex items-center gap-2.5">
                        <div className="text-right">
                          <p className="text-sm sm:text-base font-bold text-slate-800 tabular-nums">
                            $ {total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-[11px] font-medium text-slate-400 tabular-nums">
                            {percentage.toFixed(1)}%
                          </p>
                        </div>
                        <div className="text-slate-400 pl-1">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Thin progress bar */}
                    <div className="w-full bg-[#F3EFEA] h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${theme.barColor}`}
                        style={{ width: `${Math.min(100, Math.max(1, percentage))}%` }}
                      />
                    </div>
                  </div>

                  {/* Expanded Drill-down: subcategories and movements */}
                  {isExpanded && (
                    <div className="border-t border-[#F2EEE9] bg-[#FAF8F5]/60 p-4 sm:p-5 space-y-3 animate-fade-in">
                      {/* Subcategories preview tags */}
                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pb-2">
                          {category.subcategories.map((sub, i) => (
                            <span
                              key={i}
                              className="text-[11px] font-medium bg-white border border-[#E9E4DC] text-slate-600 px-2.5 py-1 rounded-full"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* List of movements */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-1">
                          <span>Movimientos ({catTxs.length})</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddTransaction(type, category.id);
                            }}
                            className="text-[#9678B6] hover:text-[#8465A4] font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" /> Agregar
                          </button>
                        </div>

                        {catTxs.length === 0 ? (
                          <p className="text-xs text-slate-400 italic px-1 py-2">
                            Sin movimientos registrados en este mes.
                          </p>
                        ) : (
                          catTxs.map((tx) => (
                            <div
                              key={tx.id}
                              className="bg-white rounded-xl p-3 sm:p-3.5 border border-[#EBE6DE] flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-colors"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-slate-400" />
                                    {formatDateDDMMAA(tx.date)}
                                  </span>
                                  {tx.subcategory && (
                                    <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md truncate max-w-[140px]">
                                      {tx.subcategory}
                                    </span>
                                  )}
                                </div>
                                {tx.note && (
                                  <p className="text-xs text-slate-700 mt-1 truncate">
                                    {tx.note}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                                <span className="text-sm font-bold text-slate-800 tabular-nums">
                                  $ {tx.amount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteTarget({
                                      id: tx.id,
                                      label: `${category.name} ($ ${tx.amount})`,
                                    });
                                  }}
                                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:scale-95 transition-all cursor-pointer"
                                  title="Eliminar movimiento"
                                  aria-label="Eliminar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button at Bottom Right */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => onAddTransaction(type)}
          className={`w-14 h-14 rounded-full ${theme.accentBg} text-white shadow-lg flex items-center justify-center hover:opacity-95 active:scale-95 transition-all cursor-pointer`}
          title={`Agregar ${type === 'expense' ? 'Gasto' : type === 'income' ? 'Ingreso' : 'Ahorro'}`}
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Modal de confirmación sin bloqueo de iframe */}
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
        onConfirm={() => {
          if (deleteTarget) {
            onDeleteTransaction(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
