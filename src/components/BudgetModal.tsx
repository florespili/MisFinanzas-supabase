import React, { useState } from 'react';
import { X, Check, Trash2, Plus } from 'lucide-react';
import { Budget, Category } from '../types/index.ts';
import { ConfirmDeleteModal } from './ConfirmDeleteModal.tsx';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  budgets: Budget[];
  onSaveBudget: (budget: Budget) => Promise<void>;
  onDeleteBudget: (id: string) => Promise<void>;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  categories,
  budgets,
  onSaveBudget,
  onDeleteBudget,
}) => {
  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    expenseCategories[0]?.id || ''
  );
  const [monthlyLimit, setMonthlyLimit] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [budgetToDelete, setBudgetToDelete] = useState<{ id: string; name: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const limit = parseFloat(monthlyLimit.replace(',', '.'));
    if (isNaN(limit) || limit <= 0) {
      setError('Ingresa un monto límite válido');
      return;
    }
    if (!selectedCategoryId) {
      setError('Selecciona una categoría');
      return;
    }

    setIsSubmitting(true);
    try {
      const existing = budgets.find((b) => b.category_id === selectedCategoryId);
      const budgetToSave: Budget = {
        id: existing ? existing.id : 'bud-' + Date.now(),
        category_id: selectedCategoryId,
        monthly_limit: limit,
      };

      await onSaveBudget(budgetToSave);
      setMonthlyLimit('');
      setError('');
    } catch (err: any) {
      setError(err.message || 'Error al guardar presupuesto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-md bg-[#FAF8F5] rounded-3xl border border-[#EDE8DF] shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8DF] bg-white">
          <h2 className="text-base font-bold text-slate-800">Mis Presupuestos Mensuales</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Add / Edit Budget Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 border border-[#EDE8DF] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Asignar Presupuesto a Categoría
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Categoría de Gasto
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  const existing = budgets.find((b) => b.category_id === e.target.value);
                  if (existing) {
                    setMonthlyLimit(existing.monthly_limit.toString());
                  } else {
                    setMonthlyLimit('');
                  }
                }}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-[#EDE8DF] focus:outline-hidden text-slate-700 font-medium"
              >
                {expenseCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon_or_image_url} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Límite Mensual Máximo ($)
              </label>
              <input
                type="number"
                step="1"
                min="1"
                placeholder="Ej: 500"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-[#EDE8DF] focus:outline-hidden font-bold tabular-nums text-slate-800"
              />
            </div>

            {error && <p className="text-xs text-rose-600">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-[#9678B6] text-white text-xs font-bold shadow-2xs hover:bg-[#8666A6] active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Guardar Presupuesto</span>
            </button>
          </form>

          {/* Current Budgets List */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 px-1">
              Presupuestos Activos ({budgets.length})
            </h3>

            {budgets.length === 0 ? (
              <p className="text-xs text-slate-400 italic px-1">
                No tienes presupuestos configurados aún.
              </p>
            ) : (
              <div className="space-y-2">
                {budgets.map((b) => {
                  const cat = categories.find((c) => c.id === b.category_id);
                  return (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl p-3 border border-[#EDE8DF] flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{cat?.icon_or_image_url || '📁'}</span>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">
                            {cat?.name || 'Categoría'}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Límite: $ {b.monthly_limit.toLocaleString('es-AR')} / mes
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setBudgetToDelete({
                            id: b.id,
                            name: cat?.name || 'Categoría',
                          })
                        }
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Eliminar presupuesto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={budgetToDelete !== null}
        title="¿Eliminar presupuesto?"
        message={
          budgetToDelete
            ? `Se eliminará el presupuesto mensual de "${budgetToDelete.name}".`
            : ''
        }
        onConfirm={async () => {
          if (budgetToDelete) {
            await onDeleteBudget(budgetToDelete.id);
            setBudgetToDelete(null);
          }
        }}
        onCancel={() => setBudgetToDelete(null)}
      />
    </div>
  );
};
