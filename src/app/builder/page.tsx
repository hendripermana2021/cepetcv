'use client';

import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { Download, Eye, Edit3, Globe, RotateCcw } from 'lucide-react';
import CVForm from '@/components/CVForm';
import CVPreview from '@/components/CVPreview';
import { useCV } from '@/hooks/useCV';
import { useLang } from '@/hooks/useLang';
import translations from '@/lib/i18n';
import { globalPreset, indonesiaPreset } from '@/lib/presets';

export default function BuilderPage() {
  const { cvData, updateCV, resetCV, loaded } = useCV();
  const { lang, toggleLang } = useLang();
  const [activeView, setActiveView] = useState<'form' | 'preview'>('form');
  const [isExporting, setIsExporting] = useState(false);
  const [formWidth, setFormWidth] = useState(42);
  const [isResizing, setIsResizing] = useState(false);
  const mainRef = useRef<HTMLElement | null>(null);
  const tr = translations[lang];

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!mainRef.current) return;
      const rect = mainRef.current.getBoundingClientRect();
      const next = ((e.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.max(30, Math.min(70, next));
      setFormWidth(clamped);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { exportToPDF, exportToATSTextPDF } = await import('@/lib/exportPDF');
      if (cvData.template === 'ats') {
        exportToATSTextPDF(cvData, `CV-ATS-${cvData.name || 'CepetCV'}`);
      } else {
        await exportToPDF('cv-preview', `CV-${cvData.name || 'CepetCV'}`);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset semua data CV? Tindakan ini tidak bisa dibatalkan.')) {
      resetCV();
    }
  };

  const handleQuickFill = (mode: 'id' | 'global') => {
    if (!confirm(tr.confirmQuickFill)) return;
    updateCV(mode === 'id' ? indonesiaPreset : globalPreset);
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-sm">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0 z-50">
        <a href="/" className="font-bold text-blue-600 text-xl tracking-tight">
          CepetCV
        </a>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuickFill('id')}
            className="hidden md:inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium border border-blue-100"
          >
            {tr.quickFillId}
          </button>

          <button
            onClick={() => handleQuickFill('global')}
            className="hidden md:inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors font-medium border border-indigo-100"
          >
            {tr.quickFillGlobal}
          </button>

          <button
            onClick={handleReset}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset CV"
          >
            <RotateCcw size={16} />
          </button>

          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            <Globe size={15} />
            {lang === 'id' ? 'EN' : 'ID'}
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            <Download size={15} />
            {isExporting ? tr.downloading : tr.downloadPDF}
          </button>
        </div>
      </header>

      {/* ── Mobile view toggle ─────────────────────────────────── */}
      <div className="lg:hidden flex shrink-0 border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveView('form')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeView === 'form'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-400 border-transparent'
          }`}
        >
          <Edit3 size={14} /> Edit
        </button>
        <button
          onClick={() => setActiveView('preview')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeView === 'preview'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-400 border-transparent'
          }`}
        >
          <Eye size={14} /> Preview
        </button>
      </div>

      {/* ── Main ───────────────────────────────────────────────── */}
      <main
        ref={mainRef}
        className="flex flex-1 overflow-hidden"
        style={{ '--form-width': `${formWidth}%` } as CSSProperties}
      >
        {/* Form panel */}
        <div
          className={`w-full lg:w-[var(--form-width)] lg:flex-none flex flex-col overflow-hidden bg-white border-r border-gray-200 ${
            activeView === 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <CVForm data={cvData} onChange={updateCV} lang={lang} />
        </div>

        {/* Draggable divider (desktop) */}
        <div
          className="hidden lg:flex w-2 shrink-0 items-center justify-center bg-gray-100 hover:bg-blue-100 transition-colors cursor-col-resize"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
          title="Geser untuk ubah ukuran panel"
        >
          <div className="h-10 w-1 rounded-full bg-gray-300" />
        </div>

        {/* Preview panel */}
        <div
          className={`w-full lg:w-[calc(100%-var(--form-width)-8px)] lg:flex-none overflow-y-auto bg-slate-100 ${
            activeView === 'form' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="p-8 flex justify-center">
            <div
              style={{
                boxShadow: '0 4px 32px rgba(0,0,0,0.13)',
                borderRadius: '2px',
                overflow: 'hidden',
                maxWidth: '794px',
                width: '100%',
              }}
            >
              <CVPreview data={cvData} lang={lang} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
