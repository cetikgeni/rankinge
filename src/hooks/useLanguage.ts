import { useState, useEffect, useCallback } from 'react';
import { Language, translations, TranslationKey } from '@/lib/i18n';

const LANGUAGE_KEY = 'rankinge_language';

export const useLanguage = () => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LANGUAGE_KEY);
      if (stored === 'en' || stored === 'id') return stored;
    }
    return 'en'; // Default to English
  });

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language);
    // Update HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => prev === 'en' ? 'id' : 'en');
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language] || translation.en;
  }, [language]);

  return { language, setLanguage, toggleLanguage, t };
};

// Export a singleton-like context approach for global access
export type LanguageContextType = ReturnType<typeof useLanguage>;
