import React, { useState, useRef } from 'react';
import { X, Plus, Trash2, Edit2, Upload, Smile, Check, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Category, TransactionType } from '../types/index.ts';
import { ConfirmDeleteModal } from './ConfirmDeleteModal.tsx';
import { PhoneEmojiPicker } from './PhoneEmojiPicker.tsx';

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSaveCategory: (category: Category) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

export const CategoriesModal: React.FC<CategoriesModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSaveCategory,
  onDeleteCategory,
}) => {
  const [activeTab, setActiveTab] = useState<TransactionType>('expense');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [catToDelete, setCatToDelete] = useState<{ id: string; name: string } | null>(null);

  // Form State
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<TransactionType>('expense');
  const [iconOrImageUrl, setIconOrImageUrl] = useState<string>('🥑');
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [newSubcategoryInput, setNewSubcategoryInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const filteredCategories = categories.filter((c) => c.type === activeTab);

  const handleStartCreate = () => {
    setEditingCategory(null);
    setName('');
    setType(activeTab);
    setIconOrImageUrl(activeTab === 'income' ? '💼' : activeTab === 'saving' ? '⭐' : '🥑');
    setSubcategories([]);
    setNewSubcategoryInput('');
    setError('');
    setIsFormOpen(true);
  };

  const handleStartEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setType(category.type);
    setIconOrImageUrl(category.icon_or_image_url);
    setSubcategories(category.subcategories || []);
    setNewSubcategoryInput('');
    setError('');
    setIsFormOpen(true);
  };

  const handleAddSubcategory = () => {
    const val = newSubcategoryInput.trim();
    if (val && !subcategories.includes(val)) {
      setSubcategories([...subcategories, val]);
      setNewSubcategoryInput('');
    }
  };

  const handleRemoveSubcategory = (index: number) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('La imagen debe pesar menos de 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setIconOrImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor ingresa un nombre para la categoría');
      return;
    }

    setIsSubmitting(true);
    try {
      const catToSave: Category = {
        id: editingCategory ? editingCategory.id : 'cat-' + Date.now(),
        name: name.trim(),
        type,
        icon_or_image_url: iconOrImageUrl || '📁',
        subcategories,
      };

      await onSaveCategory(catToSave);
      setIsFormOpen(false);
      setEditingCategory(null);
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-lg bg-[#FAF8F5] rounded-3xl border border-[#EDE8DF] shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8DF] bg-white">
          <div className="flex items-center gap-2">
            {isFormOpen && (
              <button
                onClick={() => setIsFormOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 mr-1"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="text-base font-bold text-slate-800">
              {isFormOpen
                ? editingCategory
                  ? 'Editar Categoría'
                  : 'Nueva Categoría'
                : 'Administrar Categorías'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isFormOpen ? (
          <div className="flex flex-col flex-1 overflow-hidden p-5">
            {/* Type Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F0EDE6] rounded-2xl mb-4">
              <button
                onClick={() => setActiveTab('expense')}
                className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'expense'
                    ? 'bg-[#F4EDFA] text-[#4D3369] shadow-2xs border border-[#BCA3D4]/30'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌸 Gastos
              </button>
              <button
                onClick={() => setActiveTab('income')}
                className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'income'
                    ? 'bg-[#EBF1E6] text-[#3B4B2E] shadow-2xs border border-[#8E9F7C]/30'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌱 Ingresos
              </button>
              <button
                onClick={() => setActiveTab('saving')}
                className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'saving'
                    ? 'bg-[#FCF6E5] text-[#614E15] shadow-2xs border border-[#E5C86F]/30'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⭐ Ahorros
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {filteredCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl p-3.5 border border-[#EDE8DF] flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF] flex items-center justify-center text-xl shrink-0 overflow-hidden">
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
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {cat.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {cat.subcategories && cat.subcategories.length > 0
                          ? `${cat.subcategories.length} subcategorías: ${cat.subcategories.join(', ')}`
                          : 'Sin subcategorías'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleStartEdit(cat)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCatToDelete({ id: cat.id, name: cat.name })}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Add button */}
            <div className="pt-4 mt-auto">
              <button
                onClick={handleStartCreate}
                className="w-full h-12 rounded-2xl bg-[#9678B6] text-white text-xs font-bold shadow-2xs hover:bg-[#8666A6] active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Nueva Categoría</span>
              </button>
            </div>
          </div>
        ) : (
          /* Form for Create / Edit */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Category Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Nombre de la Categoría
              </label>
              <input
                type="text"
                placeholder="Ej: Mascotas, Alquiler, Belleza"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="w-full text-sm p-3 rounded-xl bg-white border border-[#EDE8DF] focus:outline-hidden focus:border-[#9678B6] text-slate-800 font-semibold"
              />
            </div>

            {/* Type selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Tipo
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F0EDE6] rounded-2xl">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`py-1.5 text-xs font-semibold rounded-xl ${
                    type === 'expense'
                      ? 'bg-[#F4EDFA] text-[#4D3369] shadow-2xs'
                      : 'text-slate-600'
                  }`}
                >
                  🌸 Gasto
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`py-1.5 text-xs font-semibold rounded-xl ${
                    type === 'income'
                      ? 'bg-[#EBF1E6] text-[#3B4B2E] shadow-2xs'
                      : 'text-slate-600'
                  }`}
                >
                  🌱 Ingreso
                </button>
                <button
                  type="button"
                  onClick={() => setType('saving')}
                  className={`py-1.5 text-xs font-semibold rounded-xl ${
                    type === 'saving'
                      ? 'bg-[#FCF6E5] text-[#614E15] shadow-2xs'
                      : 'text-slate-600'
                  }`}
                >
                  ⭐ Ahorro
                </button>
              </div>
            </div>

            {/* Icon / Image Chooser with Phone Emojis */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Icono o Emoji de la Categoría
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] font-semibold text-[#9678B6] hover:text-[#8666A6] flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Subir imagen</span>
                  </button>
                  {iconOrImageUrl.startsWith('data:image') && (
                    <button
                      type="button"
                      onClick={() => setIconOrImageUrl('🥑')}
                      className="text-[11px] font-semibold text-rose-500 hover:underline cursor-pointer"
                    >
                      Quitar imagen
                    </button>
                  )}
                </div>
              </div>

              {/* Preview actual si es una imagen personalizada */}
              {iconOrImageUrl.startsWith('data:image') || iconOrImageUrl.startsWith('http') ? (
                <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#EDE8DF] mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] border border-[#ECE7DF] overflow-hidden shadow-2xs shrink-0">
                    <img
                      src={iconOrImageUrl}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Imagen personalizada activa</p>
                    <p className="text-[11px] text-slate-400">
                      O selecciona cualquier emoji abajo para reemplazarla.
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Selector completo de Emojis del Teléfono */}
              <PhoneEmojiPicker
                selectedEmoji={iconOrImageUrl}
                onSelectEmoji={(emoji) => setIconOrImageUrl(emoji)}
              />
            </div>

            {/* Subcategories */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Subcategorías Dinámicas (Ilimitadas)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Ej: Farmacia, Alimentos, Seguro..."
                  value={newSubcategoryInput}
                  onChange={(e) => setNewSubcategoryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubcategory();
                    }
                  }}
                  className="flex-1 text-xs p-2.5 rounded-xl bg-white border border-[#EDE8DF] focus:outline-hidden focus:border-[#8E9F7C]"
                />
                <button
                  type="button"
                  onClick={handleAddSubcategory}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 active:scale-95 cursor-pointer"
                >
                  Agregar
                </button>
              </div>

              {/* Subcategories tags */}
              <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-white rounded-2xl border border-[#EDE8DF]">
                {subcategories.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">
                    Sin subcategorías agregadas todavía.
                  </span>
                ) : (
                  subcategories.map((sub, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium bg-[#FAF8F5] border border-[#E8E3DA] text-slate-700 px-2.5 py-1 rounded-xl flex items-center gap-1.5"
                    >
                      <span>{sub}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubcategory(i)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-xl">
                {error}
              </p>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-2xl bg-[#9678B6] text-white text-xs font-bold shadow-2xs hover:bg-[#8666A6] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={catToDelete !== null}
        title="¿Eliminar categoría?"
        message={catToDelete ? `Se eliminará la categoría "${catToDelete.name}".` : ''}
        onConfirm={async () => {
          if (catToDelete) {
            await onDeleteCategory(catToDelete.id);
            setCatToDelete(null);
          }
        }}
        onCancel={() => setCatToDelete(null)}
      />
    </div>
  );
};
