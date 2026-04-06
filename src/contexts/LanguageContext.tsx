import React, { createContext, useContext, useState } from "react";

const translations = {
  en: {
    good_morning: "Good morning, Farmer! 🌱",
    good_afternoon: "Good afternoon, Farmer! ☀️",
    good_evening: "Good evening, Farmer! 🌆",
    good_night: "Good night, Farmer! 🌙",
    scans_saved_count: "{count} scans saved locally",
    settings: "Settings",
    customize: "Customize your experience",
    language: "Language",
    about: "About",
    description:
      "CropGuard AI v1.0 — AI-powered crop disease detection for farmers. Built to help protect harvests worldwide.",
    select_language: "Select Language",
    version: "Version",
    storage_management: "Storage Management",
    saved_scans: "Saved Scans",
    scans_used: "{count} of 20 scans used",
    clear_history: "Clear All History",
    clear_confirm:
      "Are you sure you want to delete all scan history? This cannot be undone.",
    history_cleared: "History cleared successfully",
    home: "Home",
    scan: "Scan",
    history: "History",
    hero_subtitle: "Keep your crops healthy with AI-powered diagnostics",
    scan_new_plant: "Scan New Plant",
    total_scans: "Total Scans",
    healthy: "Healthy",
    issues_found: "Issues Found",
    recent_scans: "Recent Scans",
    view_all: "View All",
    scan_your_crop: "Scan Your Crop",
    scan_subtitle: "Take a clear photo of the leaf for AI diagnosis",
    drop_image: "Drop leaf image here",
    tap_browse: "or tap to browse files",
    take_picture: "Take Picture",
    retake: "Retake",
    analyze: "Analyze Plant",
    analyzing: "CropGuard AI is examining your crop...",
    translating: "Translating results to your language...",
    image_tip: "Ensure the leaf is well-lit and clearly visible.",
    select_image_first: "Please select an image first.",
    upload_valid_image: "Please upload a valid image file.",
    analysis_complete: "Analysis complete!",
    analysis_failed:
      "AI Analysis failed. Please check your internet or API key.",
    scan_history: "Scan History",
    diagnoses_recorded: "diagnoses recorded",
    diagnosis_recorded: "diagnosis recorded",
    search_placeholder: "Search by plant or disease...",
    no_results: "No results found",
    action_required: "Action Required",
    prevention_title: "Prevention & Long-term Care",
    organic_tab: "Organic",
    chemical_tab: "Chemical",
    biological_solutions: "Biological Solutions",
    chemical_control: "Chemical Control",
    healthy_badge: "✅ Healthy",
    issue_badge: "⚠️ Issue Detected",
    low_certainty: "Low Certainty",
    no_data_title: "No Data Available",
    no_data_body:
      "We couldn't find any scan results. Please try scanning a leaf again.",
    start_new_scan: "Start New Scan",
    rescan: "Re-scan Image",
    low_confidence_note:
      "Note: The AI confidence is low. For a more accurate result, ensure your photo is clear, centered, and well-lit before trying again.",
    disclaimer:
      "Disclaimer: AI diagnoses are for informational purposes. Consult a local agricultural officer for severe infestations.",
  },
  sw: {
    // Kiswahili
    good_morning: "Habari za asubuhi, Mkulima! 🌱",
    good_afternoon: "Habari za mchana, Mkulima! ☀️",
    good_evening: "Habari za jioni, Mkulima! 🌆",
    good_night: "Usiku mwema, Mkulima! 🌙",
    scans_saved_count: "Skani {count} zimehifadhiwa",

    settings: "Mipangilio",
    customize: "Binafsisha matumizi yako",
    language: "Lugha",
    about: "Kuhusu",
    description:
      "CropGuard AI v1.0 — Utambuzi wa magonjwa ya mazao unaoendeshwa na AI kwa wakulima. Imejengwa kusaidia kulinda mavuno duniani kote.",
    select_language: "Chagua Lugha",
    version: "Toleo",
    storage_management: "Usimamizi wa Hifadhi",
    saved_scans: "Skani Zilizohifadhiwa",
    scans_used: "{count} kati ya skani 20 zimetumika",
    clear_history: "Futa Historia Yote",
    clear_confirm:
      "Je, una uhakika unataka kufuta historia yote ya skani? Hii haiwezi kutendeka.",
    history_cleared: "Historia imefutwa",
    home: "Nyumbani",
    scan: "Kagua",
    history: "Historia",
    hero_subtitle: "Weka mazao yako kuwa na afya kwa uchunguzi unaotumia AI",
    scan_new_plant: "Kagua Mmea Mpya",
    total_scans: "Skani Zote",
    healthy: "Zenye Afya",
    issues_found: "Matatizo Yaliyopatikana",
    recent_scans: "Skani za Hivi Karibuni",
    view_all: "Ona Zote",
    scan_your_crop: "Kagua Zao Lako",
    scan_subtitle: "Piga picha wazi ya jani kwa uchunguzi wa AI",
    drop_image: "Weka picha ya jani hapa",
    tap_browse: "au gonga kuchagua faili",
    take_picture: "Piga Picha",
    retake: "Rudia",
    analyze: "Changanua Mmea",
    analyzing: "CropGuard AI inachunguza zao lako...",
    translating: "Inatafsiri matokeo kwa lugha yako...",
    image_tip: "Hakikisha jani liko wazi na linaonekana vizuri.",
    select_image_first: "Tafadhali chagua picha kwanza.",
    upload_valid_image: "Tafadhali pakia faili sahihi ya picha.",
    analysis_complete: "Uchambuzi umekamilika!",
    analysis_failed:
      "Uchambuzi wa AI umeshindwa. Angalia intaneti au ufunguo wako wa API.",
    scan_history: "Historia ya Skani",
    diagnoses_recorded: "uchunguzi umerekodiwa",
    diagnosis_recorded: "uchunguzi umerekodiwa",
    search_placeholder: "Tafuta kwa mmea au ugonjwa...",
    no_results: "Hakuna matokeo",
    action_required: "Hatua Inahitajika",
    prevention_title: "Kuzuia na Utunzaji wa Muda Mrefu",
    organic_tab: "Asili",
    chemical_tab: "Kemikali",
    biological_solutions: "Suluhisho za Kibiolojia",
    chemical_control: "Udhibiti wa Kemikali",
    healthy_badge: "✅ Mzima",
    issue_badge: "⚠️ Tatizo Limegunduliwa",
    low_certainty: "Uhakika Mdogo",
    no_data_title: "Hakuna Data",
    no_data_body:
      "Hatukuweza kupata matokeo ya skani. Tafadhali jaribu kuchanganua jani tena.",
    start_new_scan: "Anza Skani Mpya",
    rescan: "Kagua Tena",
    low_confidence_note:
      "Kumbuka: Uhakika wa AI ni mdogo. Kwa matokeo sahihi zaidi, hakikisha picha yako iko wazi na ina mwanga mzuri.",
    disclaimer:
      "Kanusho: Uchunguzi wa AI ni kwa madhumuni ya habari. Wasiliana na afisa wa kilimo wa karibu kwa maambukizi makali.",
  },
  fr: {
    // French
    good_morning: "Bonjour, Agriculteur! 🌱",
    good_afternoon: "Bon après-midi, Agriculteur! ☀️",
    good_evening: "Bonsoir, Agriculteur! 🌆",
    good_night: "Bonne nuit, Agriculteur! 🌙",
    scans_saved_count: "{count} scans enregistrés",
    settings: "Paramètres",
    customize: "Personnalisez votre expérience",
    language: "Langue",
    about: "À propos",
    description:
      "CropGuard AI v1.0 — Détection des maladies des cultures par IA pour les agriculteurs. Conçu pour aider à protéger les récoltes dans le monde entier.",
    select_language: "Choisir la langue",
    version: "Version",
    storage_management: "Gestion du stockage",
    saved_scans: "Scans enregistrés",
    scans_used: "{count} sur 20 scans utilisés",
    clear_history: "Effacer tout l'historique",
    clear_confirm:
      "Êtes-vous sûr de vouloir supprimer tout l'historique ? Cette action est irréversible.",
    history_cleared: "Historique effacé avec succès",
    home: "Accueil",
    scan: "Analyser",
    history: "Historique",
    hero_subtitle: "Gardez vos cultures saines grâce aux diagnostics IA",
    scan_new_plant: "Scanner une nouvelle plante",
    total_scans: "Total des scans",
    healthy: "Sain",
    issues_found: "Problèmes détectés",
    recent_scans: "Scans récents",
    view_all: "Voir tout",
    scan_your_crop: "Scanner votre culture",
    scan_subtitle: "Prenez une photo nette de la feuille pour le diagnostic IA",
    drop_image: "Déposez l'image de la feuille ici",
    tap_browse: "ou appuyez pour parcourir les fichiers",
    take_picture: "Prendre une photo",
    retake: "Reprendre",
    analyze: "Analyser la plante",
    analyzing: "CropGuard AI examine votre culture...",
    translating: "Traduction des résultats en cours...",
    image_tip:
      "Assurez-vous que la feuille est bien éclairée et clairement visible.",
    select_image_first: "Veuillez d'abord sélectionner une image.",
    upload_valid_image: "Veuillez télécharger un fichier image valide.",
    analysis_complete: "Analyse terminée !",
    analysis_failed:
      "L'analyse IA a échoué. Vérifiez votre connexion Internet ou votre clé API.",
    scan_history: "Historique des scans",
    diagnoses_recorded: "diagnostics enregistrés",
    diagnosis_recorded: "diagnostic enregistré",
    search_placeholder: "Rechercher par plante ou maladie...",
    no_results: "Aucun résultat trouvé",
    action_required: "Action requise",
    prevention_title: "Prévention et soins à long terme",
    organic_tab: "Organique",
    chemical_tab: "Chimique",
    biological_solutions: "Solutions biologiques",
    chemical_control: "Contrôle chimique",
    healthy_badge: "✅ Sain",
    issue_badge: "⚠️ Problème détecté",
    low_certainty: "Faible certitude",
    no_data_title: "Aucune donnée disponible",
    no_data_body:
      "Nous n'avons pas trouvé de résultats de scan. Veuillez réessayer.",
    start_new_scan: "Nouveau scan",
    rescan: "Rescanner",
    low_confidence_note:
      "Note : La confiance de l'IA est faible. Pour un meilleur résultat, assurez-vous que la photo est nette et bien éclairée.",
    disclaimer:
      "Avertissement : Les diagnostics IA sont à titre informatif. Consultez un agent agricole local pour les infestations graves.",
  },
  hi: {
    // Hindi
    good_morning: "शुभ प्रभात, किसान! 🌱",
    good_afternoon: "शुभ दोपहर, किसान! ☀️",
    good_evening: "शुभ संध्या, किसान! 🌆",
    good_night: "शुभ रात्रि, किसान! 🌙",
    scans_saved_count: "{count} स्कैन सहेजे गए",
    settings: "सेटिंग्स",
    customize: "अपने अनुभव को अनुकूलित करें",
    language: "भाषा",
    about: "परिचय",
    description:
      "CropGuard AI v1.0 — किसानों के लिए AI-संचालित फसल रोग पहचान। दुनिया भर में फसलों की रक्षा में मदद करने के लिए बनाया गया।",
    select_language: "भाषा चुनें",
    version: "संस्करण",
    storage_management: "भंडारण प्रबंधन",
    saved_scans: "सहेजे गए स्कैन",
    scans_used: "20 में से {count} स्कैन उपयोग किए",
    clear_history: "सारा इतिहास साफ करें",
    clear_confirm:
      "क्या आप वाकई सभी स्कैन इतिहास हटाना चाहते हैं? यह पूर्ववत नहीं किया जा सकता।",
    history_cleared: "इतिहास सफलतापूर्वक साफ किया गया",
    home: "होम",
    scan: "स्कैन करें",
    history: "इतिहास",
    hero_subtitle: "AI-संचालित निदान से अपनी फसलें स्वस्थ रखें",
    scan_new_plant: "नया पौधा स्कैन करें",
    total_scans: "कुल स्कैन",
    healthy: "स्वस्थ",
    issues_found: "समस्याएं मिलीं",
    recent_scans: "हाल के स्कैन",
    view_all: "सभी देखें",
    scan_your_crop: "अपनी फसल स्कैन करें",
    scan_subtitle: "AI निदान के लिए पत्ती की स्पष्ट फोटो लें",
    drop_image: "पत्ती की छवि यहाँ छोड़ें",
    tap_browse: "या फ़ाइलें देखने के लिए टैप करें",
    take_picture: "फोटो लें",
    retake: "दोबारा लें",
    analyze: "पौधे का विश्लेषण करें",
    analyzing: "CropGuard AI आपकी फसल की जांच कर रहा है...",
    translating: "आपकी भाषा में परिणाम अनुवाद हो रहे हैं...",
    image_tip:
      "सुनिश्चित करें कि पत्ती अच्छी तरह से रोशन और स्पष्ट रूप से दिखाई दे।",
    select_image_first: "कृपया पहले एक छवि चुनें।",
    upload_valid_image: "कृपया एक वैध छवि फ़ाइल अपलोड करें।",
    analysis_complete: "विश्लेषण पूर्ण!",
    analysis_failed: "AI विश्लेषण विफल। अपना इंटरनेट या API कुंजी जांचें।",
    scan_history: "स्कैन इतिहास",
    diagnoses_recorded: "निदान दर्ज",
    diagnosis_recorded: "निदान दर्ज",
    search_placeholder: "पौधे या बीमारी से खोजें...",
    no_results: "कोई परिणाम नहीं मिला",
    action_required: "कार्रवाई आवश्यक",
    prevention_title: "रोकथाम और दीर्घकालिक देखभाल",
    organic_tab: "जैविक",
    chemical_tab: "रासायनिक",
    biological_solutions: "जैविक समाधान",
    chemical_control: "रासायनिक नियंत्रण",
    healthy_badge: "✅ स्वस्थ",
    issue_badge: "⚠️ समस्या मिली",
    low_certainty: "कम निश्चितता",
    no_data_title: "कोई डेटा उपलब्ध नहीं",
    no_data_body: "हमें कोई स्कैन परिणाम नहीं मिले। कृपया फिर से स्कैन करें।",
    start_new_scan: "नया स्कैन शुरू करें",
    rescan: "दोबारा स्कैन करें",
    low_confidence_note:
      "नोट: AI की निश्चितता कम है। बेहतर परिणाम के लिए सुनिश्चित करें कि फोटो स्पष्ट और अच्छी तरह से रोशन हो।",
    disclaimer:
      "अस्वीकरण: AI निदान केवल सूचनात्मक उद्देश्यों के लिए है। गंभीर संक्रमण के लिए स्थानीय कृषि अधिकारी से संपर्क करें।",
  },
  ha: {
    // Hausa
    good_morning: "Barka da safiya, Manomi! 🌱",
    good_afternoon: "Barka da rana, Manomi! ☀️",
    good_evening: "Barka da yamma, Manomi! 🌆",
    good_night: "Barka da dare, Manomi! 🌙",
    scans_saved_count: "An adana bincike {count}",
    settings: "Saitawa",
    customize: "Keɓance kwarewar ku",
    language: "Harshe",
    about: "Game da",
    description:
      "CropGuard AI v1.0 — Gano cututtukan amfanin gona ta amfani da AI ga manoma. An gina shi don taimakawa kare girbi a duk duniya.",
    select_language: "Zaɓi Harshe",
    version: "Fassara",
    storage_management: "Sarrafa Ma'ajiya",
    saved_scans: "Binciken da aka adana",
    scans_used: "{count} daga cikin bincike 20 an yi amfani",
    clear_history: "Share Duk Tarihin",
    clear_confirm:
      "Shin kuna tabbata kuna son share duk tarihin bincike? Ba za a iya mayar da wannan ba.",
    history_cleared: "An share tarihin cikin nasara",
    home: "Gida",
    scan: "Duba",
    history: "Tarihi",
    hero_subtitle: "Kiyaye amfanin gonarku lafiya tare da ganewar AI",
    scan_new_plant: "Duba Sabuwar Shuka",
    total_scans: "Jimillar Bincike",
    healthy: "Lafiya",
    issues_found: "Matsaloli da aka Gano",
    recent_scans: "Binciken Kwanan nan",
    view_all: "Duba Duka",
    scan_your_crop: "Duba Amfanin Gonarku",
    scan_subtitle: "Ɗauki hoto mai tsabta na ganye don ganewar AI",
    drop_image: "Saka hoton ganye anan",
    tap_browse: "ko taɓa don bincika fayiloli",
    take_picture: "Dauki Hoto",
    retake: "Sake Dauka",
    analyze: "Nazarin Shuka",
    analyzing: "CropGuard AI yana binciken amfanin gonarku...",
    translating: "Ana fassara sakamakon zuwa harshenku...",
    image_tip: "Tabbatar ganyen yana da haske kuma yana bayyane.",
    select_image_first: "Da fatan za a zaɓi hoto da farko.",
    upload_valid_image: "Da fatan za a loda fayil mai inganci na hoto.",
    analysis_complete: "Nazarin ya kammala!",
    analysis_failed: "Nazarin AI ya kasa. Duba intanet ko maɓallin API.",
    scan_history: "Tarihin Bincike",
    diagnoses_recorded: "ganewar da aka yi rikodin",
    diagnosis_recorded: "ganewar da aka yi rikodin",
    search_placeholder: "Nemi ta shuka ko cuta...",
    no_results: "Ba a sami sakamako ba",
    action_required: "Ana Buƙatar Aiki",
    prevention_title: "Rigakafi da Kulawa ta Dogon Lokaci",
    organic_tab: "Na Halitta",
    chemical_tab: "Na Sinadarai",
    biological_solutions: "Hanyoyin Halittar Magani",
    chemical_control: "Sarrafawa ta Sinadarai",
    healthy_badge: "✅ Lafiya",
    issue_badge: "⚠️ An Gano Matsala",
    low_certainty: "Tabbaci Kadan",
    no_data_title: "Babu Bayani",
    no_data_body: "Ba mu sami sakamakon bincike ba. Da fatan za a gwada sake.",
    start_new_scan: "Fara Sabon Bincike",
    rescan: "Sake Duba",
    low_confidence_note:
      "Lura: Tabbacin AI ya kasa. Don ingantaccen sakamako, tabbatar hoton yana bayyane kuma yana da haske.",
    disclaimer:
      "Faɗakarwa: Ganewar AI don dalilai na bayani ne. Yi tuntuɓe da jami'in noma na gida don manyan cututtuka.",
  },
};

type Language = keyof typeof translations;
type TranslationKeys = keyof (typeof translations)["en"];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKeys) => string;
  // Add this to the LanguageContextType interface:
  tWithCount: (key: TranslationKeys, count: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("app-language");
    return saved && saved in translations ? (saved as Language) : "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);
  };

  const t = (key: TranslationKeys): string => {
    return translations[language][key] || translations["en"][key];
  };

  const tWithCount = (key: TranslationKeys, count: number): string => {
    const template = translations[language][key] || translations["en"][key];
    return template.replace("{count}", String(count));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tWithCount }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};


