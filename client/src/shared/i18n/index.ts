import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ru } from './locales/ru';

export const defaultNS = 'common';
export const supportedLngs = ['ru'] as const;

void i18n.use(initReactI18next).init({
  resources: { ru },
  lng: 'ru',
  fallbackLng: 'ru',
  supportedLngs: [...supportedLngs],
  defaultNS,
  ns: ['common'],
  interpolation: {
    // React уже экранирует значения
    escapeValue: false,
  },
  react: {
    // без Suspense: состояния загрузки контролируем сами
    useSuspense: false,
  },
});

export default i18n;
