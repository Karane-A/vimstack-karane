import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Make i18n instance available for direct imports
export { default as i18next } from 'i18next';

// Initialize i18n
i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        load: 'currentOnly',
        debug: process.env.NODE_ENV === 'development',
        
        interpolation: {
            escapeValue: false,
        },
        
        backend: {
            loadPath: (lng) => window.route ? window.route('translations', lng) : `/translations/${lng}`,
            requestOptions: {
                cache: 'default'
            }
        },

        ns: ['translation'],
        defaultNS: 'translation',
        
        caches: ['localStorage'],
        saveMissing: false,
        
        partialBundledLanguages: true,
        loadOnInitialization: true
    });

// Export the initialized instance
export default i18n;

// Make sure the i18n instance is available for direct imports
window.i18next = i18n;