import React, { useState, useMemo, useRef } from 'react';
import { Search, Sparkles, Smartphone, Check, X, RotateCcw } from 'lucide-react';
import { EMOJI_CATEGORIES, extractFirstEmoji } from '../utils/emojiData.ts';

interface PhoneEmojiPickerProps {
  selectedEmoji: string;
  onSelectEmoji: (emoji: string) => void;
  onClose?: () => void;
}

export const PhoneEmojiPicker: React.FC<PhoneEmojiPickerProps> = ({
  selectedEmoji,
  onSelectEmoji,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('frecuentes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [phoneInputVal, setPhoneInputVal] = useState<string>('');
  const [lastInputStatus, setLastInputStatus] = useState<string | null>(null);

  const phoneInputRef = useRef<HTMLInputElement>(null);

  // Handle phone keyboard input
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    setPhoneInputVal(rawVal);
    if (rawVal.trim()) {
      const extracted = extractFirstEmoji(rawVal);
      if (extracted) {
        onSelectEmoji(extracted);
        setLastInputStatus(`Emoji detectado: ${extracted}`);
      }
    }
  };

  const handlePhoneInputBlur = () => {
    if (phoneInputVal.trim()) {
      const extracted = extractFirstEmoji(phoneInputVal);
      if (extracted) {
        onSelectEmoji(extracted);
        setPhoneInputVal(extracted);
      }
    }
  };

  // Filter emojis based on search or active category
  const filteredEmojis = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const results: { emoji: string; keywords: string[] }[] = [];
      const seen = new Set<string>();

      for (const cat of EMOJI_CATEGORIES) {
        for (const item of cat.emojis) {
          if (!seen.has(item.emoji)) {
            const matchesKeyword = item.keywords.some((k) => k.toLowerCase().includes(q));
            const matchesEmoji = item.emoji.includes(q);
            if (matchesKeyword || matchesEmoji) {
              seen.add(item.emoji);
              results.push(item);
            }
          }
        }
      }
      return results;
    }

    const currentCat = EMOJI_CATEGORIES.find((c) => c.id === activeCategory);
    return currentCat ? currentCat.emojis : [];
  }, [searchQuery, activeCategory]);

  return (
    <div className="bg-[#FAF8F5] rounded-3xl border border-[#EDE8DF] p-3.5 sm:p-4 space-y-3 shadow-xs">
      
      {/* =========================================================================
          SECCIÓN 1: USAR TECLADO DEL CELULAR (NATIVO)
      ========================================================================= */}
      <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-[#EDE8DF] shadow-2xs space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#F4EDFA] flex items-center justify-center text-[#9678B6]">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Usar emoji de tu celular
              </p>
              <p className="text-[10px] text-slate-400">
                Toca aquí abajo para abrir tu teclado de emojis (iPhone / Android)
              </p>
            </div>
          </div>

          {selectedEmoji && !selectedEmoji.startsWith('data:') && !selectedEmoji.startsWith('http') && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F4EDFA] border border-[#E9DCF5] shrink-0">
              <span className="text-[11px] font-semibold text-[#9678B6]">Elegido:</span>
              <span className="text-lg leading-none">{selectedEmoji}</span>
            </div>
          )}
        </div>

        {/* Campo táctil para abrir el teclado de emojis nativo */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              ref={phoneInputRef}
              type="text"
              inputMode="text"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              value={phoneInputVal}
              onChange={handlePhoneInputChange}
              onBlur={handlePhoneInputBlur}
              placeholder="Toca aquí y elige cualquier emoji de tu teclado..."
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EDE8DF] focus:outline-hidden focus:border-[#9678B6] focus:bg-white text-slate-800 font-medium placeholder:text-slate-400 transition-all"
            />
            {phoneInputVal && (
              <button
                type="button"
                onClick={() => {
                  setPhoneInputVal('');
                  setLastInputStatus(null);
                  phoneInputRef.current?.focus();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                title="Limpiar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => phoneInputRef.current?.focus()}
            className="px-3 py-2.5 rounded-xl bg-[#9678B6] text-white text-xs font-semibold hover:bg-[#8666A6] active:scale-95 transition-all flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs"
          >
            <span>Teclado</span>
          </button>
        </div>

        {lastInputStatus && (
          <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-500" />
            <span>{lastInputStatus}</span>
          </p>
        )}
      </div>

      {/* =========================================================================
          SECCIÓN 2: BIBLIOTECA EXTENDIDA DE EMOJIS CON BÚSQUEDA Y CATEGORÍAS
      ========================================================================= */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 px-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            O elige de la lista completa
          </span>
          <span className="text-[10px] text-slate-400">
            {filteredEmojis.length} emojis disponibles
          </span>
        </div>

        {/* Buscador de emojis */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar emoji (ej: café, auto, perro, gym, comida, viaje)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-white border border-[#EDE8DF] focus:outline-hidden focus:border-[#9678B6] text-slate-700 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Barra de Categorías (solo si no hay búsqueda activa) */}
        {!searchQuery && (
          <div className="flex items-center gap-1 overflow-x-auto pb-1 pt-0.5 scrollbar-none -mx-1 px-1">
            {EMOJI_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                    isActive
                      ? 'bg-[#9678B6] text-white shadow-2xs font-bold'
                      : 'bg-white border border-[#EDE8DF] text-slate-600 hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Grilla de Emojis */}
        <div className="bg-white rounded-2xl p-2.5 border border-[#EDE8DF] max-h-48 overflow-y-auto">
          {filteredEmojis.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              <p>No se encontraron emojis con "{searchQuery}"</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-1 text-[11px] text-[#9678B6] font-semibold hover:underline cursor-pointer"
              >
                Ver todos los emojis
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5">
              {filteredEmojis.map((item, idx) => {
                const isSelected = selectedEmoji === item.emoji;
                return (
                  <button
                    key={`${item.emoji}-${idx}`}
                    type="button"
                    onClick={() => {
                      onSelectEmoji(item.emoji);
                      setPhoneInputVal(item.emoji);
                      setLastInputStatus(`Seleccionado: ${item.emoji}`);
                    }}
                    className={`h-10 w-full rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#F4EDFA] ring-2 ring-[#9678B6] scale-110 shadow-2xs z-10'
                        : 'hover:bg-[#FAF8F5] hover:scale-105 active:scale-95'
                    }`}
                    title={item.keywords.join(', ')}
                  >
                    {item.emoji}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
