import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HTTPApi from "i18next-http-backend";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HTTPApi)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "fr"],
    // debug: process.env.NODE_ENV === "development",
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
    detection: {
      order: ["localStorage", "navigator", "querystring", "cookie", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18next;