import React, { useState, useEffect } from 'react';
import { X, Check, Calendar, Plus, FileText, DollarSign } from 'lucide-react';
import { Category, Transaction, TransactionType } from '../types/index.ts';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  initialType?: TransactionType;
  initialCategoryId?: string;
  defaultDate?: string;
  onSave: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  onOpenCategoriesManager: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  categories,
  initialType = 'expense',
  initialCategoryId,
  defaultDate,
  onSave,
  onOpenCategoriesManager,
}) => {
  const [type, setType] = useState<TransactionType>(initialType);
  const [categoryId, setCategoryId] = useState<string>('');
  const [subcategory, setSubcategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      const filtered = categories.filter((c) => c.type === initialType);
      if (initialCategoryId && filtered.some((c) => c.id === initialCategoryId)) {
        setCategoryId(initialCategoryId);
      } else if (filtered.length > 0) {
        setCategoryId(filtered[0].id);
      } else {
        setCategoryId('');
      }
      setSubcategory('');
      setAmount('');
      setNote('');
      setError('');

      if (defaultDate) {
        setDate(defaultDate);
      } else {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        setDate(`${yyyy}-${mm}-${dd}`);
      }
    }
  }, [isOpen, initialType, initialCategoryId, defaultDate, categories]);

  // When type changes, adjust selected category
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const available = categories.filter((c) => c.type === newType);
    if (available.length > 0) {
      setCategoryId(available[0].id);
    } else {
      setCategoryId('');
    }
    setSubcategory('');
  };

  const currentCategory = categories.find((c) => c.id === categoryId);
  const availableCategories = categories.filter((c) => c.type === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(',', '.'));

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Por favor ingresa un monto válido mayor a 0');
      return;
    }
    if (!categoryId) {
      setError('Selecciona una categoría');
      return;
    }
    if (!date) {
      setError('Selecciona una fecha');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        type,
        category_id: categoryId,
        subcategory: subcategory.trim(),
        amount: numAmount,
        date,
        note: note.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el movimiento');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-lg bg-[#FAF8F5] rounded-t-3xl sm:rounded-3xl border border-[#EDE8DF] shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8DF] bg-white">
          <h2 className="text-base font-bold text-slate-800">Registrar Movimiento</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Segmented Type Toggle */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F0EDE6] rounded-2xl">
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                type === 'income'
                  ? 'bg-[#EBF1E6] text-[#3B4B2E] shadow-2xs border border-[#8E9F7C]/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌱 Ingreso
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-[#F4EDFA] text-[#4D3369] shadow-2xs border border-[#BCA3D4]/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌸 Gasto
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('saving')}
              className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                type === 'saving'
                  ? 'bg-[#FCF6E5] text-[#614E15] shadow-2xs border border-[#E5C86F]/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⭐ Ahorro
            </button>
          </div>

          {/* Amount Input (Big and Clear) */}
          <div className="bg-white rounded-2xl p-4 border border-[#EDE8DF] shadow-2xs">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Monto
            </label>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-400">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                className="w-full text-3xl font-bold text-slate-800 focus:outline-hidden placeholder:text-slate-300 tabular-nums bg-transparent"
              />
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Categoría
              </label>
              <button
                type="button"
                onClick={onOpenCategoriesManager}
                className="text-xs text-[#9678B6] hover:text-[#8465A4] font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Administrar
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1">
              {availableCategories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategoryId(cat.id);
                      setSubcategory('');
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#9678B6] bg-[#FAF8F5] shadow-2xs ring-1 ring-[#9678B6]'
                        : 'border-[#EDE8DF] bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-base shrink-0 overflow-hidden">
                      {cat.icon_or_image_url.startsWith('data:image') ||
                      cat.icon_or_image_url.startsWith('http') ? (
                        <img
                          src={cat.icon_or_image_url}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{cat.icon_or_image_url || '📁'}</span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 truncate">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subcategory */}
          {currentCategory && currentCategory.subcategories && currentCategory.subcategories.length > 0 && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Subcategoría
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {currentCategory.subcategories.map((sub, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSubcategory(subcategory === sub ? '' : sub)}
                    className={`text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      subcategory === sub
                        ? 'bg-[#9678B6] text-white font-semibold shadow-2xs'
                        : 'bg-white border border-[#EDE8DF] text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="O escribe otra subcategoría..."
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-white border border-[#EDE8DF] focus:outline-hidden focus:border-[#9678B6] text-slate-700"
              />
            </div>
          )}

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Fecha
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-white border border-[#EDE8DF] focus:outline-hidden focus:border-[#8E9F7C] text-slate-700 font-medium"
              />
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Nota / Concepto (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: Compra semanal verdulería, Pago con débito"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full text-xs p-3 rounded-xl bg-white border border-[#EDE8DF] focus:outline-hidden focus:border-[#8E9F7C] text-slate-700"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-xl">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-2xl bg-[#9678B6] text-white text-sm font-bold shadow-sm hover:bg-[#7E8F6C] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Guardando...' : 'Guardar Movimiento'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
