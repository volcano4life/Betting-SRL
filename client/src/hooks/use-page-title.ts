import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getPageTitle } from '@/config/siteConfig';

/**
 * Custom hook to manage page titles with language synchronization
 * Automatically updates the document title when language changes
 */
export function usePageTitle(pageTitle: string, customValue?: string) {
  const { language, t } = useLanguage();

  useEffect(() => {
    // Generate the localized title
    let finalTitle: string;
    
    // If pageTitle contains a translation key, translate it first
    if (pageTitle.includes('.')) {
      const translatedTitle = t(pageTitle);
      finalTitle = getPageTitle(translatedTitle, customValue);
    } else {
      finalTitle = getPageTitle(pageTitle, customValue);
    }
    
    // Update document title
    document.title = finalTitle;
    
    // Listen for language changes from other tabs and update title accordingly
    const handleLanguageChange = () => {
      let updatedTitle: string;
      if (pageTitle.includes('.')) {
        const translatedTitle = t(pageTitle);
        updatedTitle = getPageTitle(translatedTitle, customValue);
      } else {
        updatedTitle = getPageTitle(pageTitle, customValue);
      }
      document.title = updatedTitle;
    };

    // Set up cross-tab synchronization
    window.addEventListener('language-changed', handleLanguageChange);
    
    return () => {
      window.removeEventListener('language-changed', handleLanguageChange);
    };
  }, [language, pageTitle, customValue, t]);
}