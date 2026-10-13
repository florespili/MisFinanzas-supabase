import React, { useState } from 'react';
import { X, Download, Copy, Check, FileCode, ExternalLink, Github, CheckCircle2 } from 'lucide-react';
import { getStandaloneHtml } from '../utils/generateStandaloneHtml.ts';

interface ExportHtmlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportHtmlModal: React.FC<ExportHtmlModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const htmlContent = getStandaloneHtml();

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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
            <div className="w-8 h-8 rounded-xl bg-[#F4EDFA] flex items-center justify-center text-[#4D3369]">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Exportar para GitHub Pages</h2>
              <span className="text-[11px] text-slate-400">1 Solo Archivo HTML con Todo Incluido</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="bg-[#EBF1E6] rounded-2xl p-4 border border-[#8E9F7C]/20 text-xs text-[#3B4B2E] space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#8E9F7C]" />
              Archivo Autónomo Listo para Publicar
            </p>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Este archivo reúne todo el código en un único <code className="bg-white/80 px-1 py-0.5 rounded font-mono font-semibold">index.html</code> (con Tailwind CDN, Lucide CDN, Supabase JS embebido, estética pastel de Mujer Financiera y PIN de seguridad).
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleDownload}
              className="py-3 px-4 rounded-2xl bg-[#9678B6] text-white text-xs font-bold shadow-2xs hover:bg-[#8666A6] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Descargar index.html</span>
            </button>

            <button
              onClick={handleCopy}
              className="py-3 px-4 rounded-2xl bg-white border border-[#EDE8DF] text-slate-700 text-xs font-bold shadow-2xs hover:bg-slate-50 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Código Copiado!' : 'Copiar Código HTML'}</span>
            </button>
          </div>

          {/* How to deploy to GitHub Pages steps */}
          <div className="bg-white rounded-2xl p-4 border border-[#EDE8DF] space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Github className="w-4 h-4 text-slate-700" />
              <span>Cómo publicarlo gratis en GitHub Pages:</span>
            </div>
            <ol className="list-decimal pl-4 space-y-1.5 text-slate-600 text-[11px] leading-relaxed">
              <li>Crea un nuevo repositorio público en GitHub (ej: <code className="bg-slate-100 px-1 py-0.5 rounded">mis-finanzas</code>).</li>
              <li>Sube el archivo <code className="bg-slate-100 px-1 py-0.5 rounded font-bold">index.html</code> en la raíz del repositorio.</li>
              <li>Ve a <strong>Settings → Pages</strong> en tu repositorio de GitHub.</li>
              <li>En <em>Branch</em>, selecciona <strong>main</strong> (o <em>master</em>) y carpeta <strong>/ (root)</strong>, luego haz clic en <strong>Save</strong>.</li>
              <li>¡Listo! Tu web estará online en minutos con URL propia. Al abrirla por primera vez te pedirá ingresar tu URL/Clave de Supabase y tu PIN privado.</li>
            </ol>
          </div>

          {/* Code preview snippet */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              Vista previa del código ({htmlContent.length} caracteres):
            </span>
            <div className="bg-slate-900 text-slate-300 font-mono text-[10px] p-3 rounded-2xl max-h-40 overflow-y-auto leading-relaxed border border-slate-800">
              <pre>{htmlContent.slice(0, 1500)}... (código completo disponible para descarga)</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
