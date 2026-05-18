'use client';

import { useState, useEffect } from 'react';
import { CVData, defaultCVData } from '@/types/cv';

const STORAGE_KEY = 'cepetcv_data';

export function useCV() {
  const [cvData, setCvData] = useState<CVData>(defaultCVData);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCvData(JSON.parse(saved));
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData));
    } catch {
      // ignore storage errors
    }
  }, [cvData, loaded]);

  const updateCV = (partial: Partial<CVData>) => {
    setCvData((prev) => ({ ...prev, ...partial }));
  };

  const resetCV = () => {
    setCvData(defaultCVData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return { cvData, updateCV, resetCV, loaded };
}
