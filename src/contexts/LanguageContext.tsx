import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Comprehensive Translation Dictionary
const translations = {
  en: {
    settings: "Settings",
    customize: "Customize your experience",
    language: "Language",
    about: "About",
    description:
      "CropGuard AI v1.0 — AI-powered crop disease detection for farmers. Built to help protect harvests worldwide.",
    home: "Home",
    scan: "Scan",
    prevention_title: "Prevention & Long-term Care",
    history: "History",
    select_language: "Select Language",
    version: "Version",
  },
  sw: {
    settings: "Mipangilio",
    customize: "Binafsisha matumizi yako",
    language: "Lugha",
    about: "Kuhusu",
    description:
      "CropGuard AI v1.0 — Utambuzi wa magonjwa ya mazao unaoendeshwa na AI kwa wakulima. Imejengwa kusaidia kulinda mavuno duniani kote.",
    home: "Nyumbani",
    scan: "Kagua",
    prevention_title: "Kuzuia na Utunzaji wa Muda Mrefu",
    history: "Historia",
    select_language: "Chagua Lugha",
    version: "Toleo",
  },
  ha: {
    settings: "Saitawa",
    customize: "Keɓance kwarewar ku",
    language: "Harshe",
    about: "Game da",
    description:
      "CropGuard AI v1.0 — Gano cututtukan amfanin gona ta amfani da AI ga manoma. An gina shi don taimakawa kare girbi a duk duniya.",
    home: "Gida",
    scan: "Duba",
    history: "Tarihi",
    select_language: "Zaɓi Harshe",
    version: "Fassara",
  },
  fr: {
    settings: "Paramètres",
    customize: "Personnalisez votre expérience",
    language: "Langue",
    about: "À propos",
    description:
      "CropGuard AI v1.0 — Détection des maladies des cultures par IA pour les agriculteurs. Conçu pour aider à protéger les récoltes dans le monde entier.",
    home: "Accueil",
    scan: "Analyser",
    history: "Historique",
    select_language: "Choisir la langue",
    version: "Version",
  },
  hi: {
    settings: "सेटिंग्स",
    customize: "अपने अनुभव को अनुकूलित करें",
    language: "भाषा",
    about: "परिचय",
    description:
      "CropGuard AI v1.0 — किसानों के लिए AI-संचालित फसल रोग पहचान। दुनिया भर में फसलों की रक्षा में मदद करने के लिए बनाया गया।",
    home: "होम",
    scan: "स्कैन करें",
    history: "इतिहास",
    select_language: "भाषा चुनें",
    version: "संस्करण",
  },
};

type Language = keyof typeof translations;
type TranslationKeys = keyof (typeof translations)["en"];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Persistence: Load saved language from localStorage or default to English
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("app-language");
    return saved && saved in translations ? (saved as Language) : "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);
  };

  // Translation helper function
  const t = (key: TranslationKeys): string => {
    return translations[language][key] || translations["en"][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
