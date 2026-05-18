'use client';

import { useState } from 'react';
import { Download, Eye, Edit3, Globe, RotateCcw } from 'lucide-react';
import CVForm from '@/components/CVForm';
import CVPreview from '@/components/CVPreview';
import { useCV } from '@/hooks/useCV';
import { useLang } from '@/hooks/useLang';
import translations from '@/lib/i18n';

export default function BuilderPage() {
  const { cvData, updateCV, resetCV, loaded } = useCV();
  const { lang, toggleLang } = useLang();
  const [activeView, setActiveView] = useState<'form' | 'preview'>('form');
  const [isExporting, setIsExporting] = useState(false);
  const tr = translations[lang];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { exportToPDF } = await import('@/lib/exportPDF');
      await exportToPDF('cv-preview', `CV-${cvData.name || 'CepetCV'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset semua data CV? Tindakan ini tidak bisa dibatalkan.')) {
      resetCV();
    }
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
      <main className="flex flex-1 overflow-hidden">
        {/* Form panel */}
        <div
          className={`w-full lg:w-[42%] flex flex-col overflow-hidden bg-white border-r border-gray-200 ${
            activeView === 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <CVForm data={cvData} onChange={updateCV} lang={lang} />
        </div>

        {/* Preview panel */}
        <div
          className={`w-full lg:w-[58%] overflow-y-auto bg-slate-100 ${
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
