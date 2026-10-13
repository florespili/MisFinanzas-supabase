import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Database, Key, ExternalLink, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import { FinanceService } from '../services/supabase.ts';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const finance = FinanceService.getInstance();
  const [activeTab, setActiveTab] = useState<'config' | 'sql'>('config');

  const [url, setUrl] = useState<string>('');
  const [anonKey, setAnonKey] = useState<string>('');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = finance.getSupabaseConfig();
      setUrl(cfg.url);
      setAnonKey(cfg.anonKey);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sqlScript = FinanceService.getSqlScript();

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestResult(null);

    if (!url.trim() && !anonKey.trim()) {
      // Clear config to use local mode
      finance.setSupabaseConfig('', '');
      setTestResult({
        success: true,
        message: 'Modo Local Demo activado. Tus datos se guardarán en tu navegador.',
      });
      onSaved();
      return;
    }

    if (!url.startsWith('https://') || !anonKey.trim()) {
      setTestResult({
        success: false,
        message: 'Ingresa una URL válida (ej: https://xyz.supabase.co) y la clave anon pública.',
      });
      return;
    }

    setIsTesting(true);
    const test = await finance.testSupabaseConnection(url, anonKey);
    setIsTesting(false);

    if (test.success) {
      finance.setSupabaseConfig(url, anonKey);
      setTestResult({
        success: true,
        message: '¡Conexión exitosa con Supabase! Configuración guardada.',
      });
      onSaved();
    } else {
      setTestResult({
        success: false,
        message: `Error al conectar: ${test.error || 'Verifica que hayas ejecutado el Script SQL en Supabase.'}`,
      });
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-xl bg-[#FAF8F5] rounded-3xl border border-[#EDE8DF] shadow-xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8DF] bg-white">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#9678B6]" />
            <h2 className="text-base font-bold text-slate-800">Conexión con Supabase</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 bg-white border-b border-[#EDE8DF] flex gap-4">
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'config'
                ? 'border-[#9678B6] text-[#5B3E78]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Credenciales de Conexión
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'sql'
                ? 'border-[#9678B6] text-[#5B3E78]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Script SQL de Inicialización
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'config' ? (
            <form onSubmit={handleTestAndSave} className="space-y-4">
              <div className="bg-[#F4EDFA]/60 rounded-2xl p-4 border border-[#BCA3D4]/30 text-xs text-[#5B3E78] space-y-1.5">
                <p className="font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#9678B6]" />
                  Seguridad de Acceso Privado (PIN + Supabase):
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Tu PIN se guarda hasheado con SHA-256 en la tabla privada <code className="bg-white/80 px-1 py-0.5 rounded text-[11px]">app_config</code>. El script SQL incluye un trigger en la base de datos que <strong>impide que extraños sobreescriban tu PIN</strong> o creen uno nuevo desde GitHub Pages.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  SUPABASE_URL
                </label>
                <input
                  type="url"
                  placeholder="https://xyzcompany.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-white border border-[#EDE8DF] focus:outline-hidden focus:border-[#9678B6] text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  SUPABASE_ANON_KEY
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-white border border-[#EDE8DF] focus:outline-hidden focus:border-[#9678B6] text-slate-800 font-mono"
                />
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                    testResult.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                      : 'bg-rose-50 text-rose-800 border border-rose-100'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  )}
                  <p className="leading-relaxed">{testResult.message}</p>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={isTesting}
                  className="flex-1 h-12 rounded-2xl bg-[#9678B6] text-white text-xs font-bold shadow-2xs hover:bg-[#8666A6] active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Key className="w-4 h-4" />
                  <span>{isTesting ? 'Probando conexión...' : 'Conectar y Guardar'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    finance.setSupabaseConfig('', '');
                    setUrl('');
                    setAnonKey('');
                    setTestResult({
                      success: true,
                      message: 'Usando almacenamiento local de demostración.',
                    });
                    onSaved();
                  }}
                  className="px-4 h-12 rounded-2xl bg-white border border-[#EDE8DF] text-slate-600 text-xs font-semibold hover:bg-slate-50 active:scale-98 transition-all cursor-pointer"
                >
                  Usar Local
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Ejecuta este script en el <strong>SQL Editor</strong> de Supabase para crear las tablas necesarias:
                </p>
                <button
                  onClick={handleCopySql}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#9678B6] text-white hover:bg-[#8666A6] active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? '¡Copiado!' : 'Copiar SQL'}</span>
                </button>
              </div>

              <div className="relative bg-slate-900 text-slate-200 rounded-2xl p-4 font-mono text-[11px] leading-relaxed max-h-80 overflow-y-auto border border-slate-800">
                <pre className="whitespace-pre">{sqlScript}</pre>
              </div>

              <div className="bg-[#FCF6E5] rounded-2xl p-3.5 border border-[#E5C86F]/30 text-xs text-[#614E15]">
                <p className="font-semibold mb-1">Pasos recomendados en Supabase:</p>
                <ol className="list-decimal pl-4 space-y-1 text-slate-700 text-[11px]">
                  <li>Crea un proyecto gratuito en <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline font-semibold">supabase.com</a>.</li>
                  <li>Ve a <strong>SQL Editor</strong>, pega este script y haz clic en <strong>Run</strong>.</li>
                  <li>Ve a <strong>Project Settings → API</strong> y copia la Project URL y la clave anon (public).</li>
                  <li>Pégalas en la pestaña "Credenciales de Conexión".</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
