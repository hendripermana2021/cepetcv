'use client';

import { useState, useEffect } from 'react';
import { Lang } from '@/lib/i18n';

export function useLang() {
  const [lang, setLang] = useState<Lang>('id');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cepetcv_lang') as Lang;
      if (saved === 'id' || saved === 'en') setLang(saved);
    } catch {
      // ignore
    }
  }, []);

  const toggleLang = () => {
    const next: Lang = lang === 'id' ? 'en' : 'id';
    setLang(next);
    try {
      localStorage.setItem('cepetcv_lang', next);
    } catch {
      // ignore
    }
  };

  return { lang, toggleLang };
}
