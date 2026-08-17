import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // App & Header
    appName: "Aumtara Samay",
    tagline: "Dual-Shift School Timetable Platform",
    schoolPortal: "School Institution Portal",
    superAdminPortal: "School Admin Portal",
    viewSchoolApp: "View School App",
    viewSAHub: "Super Admin Hub",
    activeYear: "Academic Session",
    
    // Navigation Tabs
    navDashboard: "Dashboard Overview",
    navSetup: "Institutional Setup",
    navData: "Setup & Data",
    navGenerator: "AI Timetable Generator",
    navConstraints: "Rules & Constraints",
    navSubstitute: "Substitute Duty Manager",
    navDEO: "DEO Compliance Reports",
    navSettings: "System Settings",
    navSuperAdmin: "Super Admin Master Hub",
    navVersionHistory: "Version History",
    navHelp: "Help Guide",

    // Common Actions & Badges
    save: "Save Changes",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add New",
    exportCSV: "Export CSV",
    printPDF: "Print Official PDF",
    searchPlaceholder: "Search records...",
    morningShift: "Morning Shift (CBSE)",
    afternoonShift: "Afternoon Shift (State)",
    bothShifts: "Shared / Both Shifts",

    // Data Management
    tabClasses: "Classes & Sections",
    tabSubjects: "Subjects Catalog",
    tabTeachers: "Teachers Directory",
    tabRooms: "Rooms & Labs",
    
    // Multi-Subject Teacher Capabilities
    teacherExpertiseTitle: "Teacher Subject Expertise & Capabilities (૨-૩ વિષય જ્ઞાન)",
    primarySubject: "Primary Specialization Subject (મુખ્ય વિષય)",
    secondarySubjects: "Secondary Subject Capabilities (ગૌણ વિષય)",
    proxySubjects: "Emergency Proxy / Substitute Subjects (એવેજી તાસ જ્ઞાન)",
    badgeMain: "⭐ Main",
    badgeSec: "🌿 2nd",
    badgeProxy: "🔄 Proxy",

    // DEO Reports
    deoHeader: "DISTRICT EDUCATION OFFICER (DEO) OFFICIAL COMPLIANCE REGISTERS",
    selectDEOFormat: "Choose DEO Format:",
    deoPatrakA_Sec: "Secondary Section - Patrak-A (માધ્યમિક કાર્યભાર પત્રક-અ)",
    deoPatrakB_Sec: "Secondary Section - Patrak-B (માધ્યમિક શિક્ષક કાર્ય બોજ પત્રક-બ)",
    deoPatrakK_Sec: "Secondary Section - Patrak-K (માધ્યમિક કાર્યભાર પત્રક-ક)",
    deoPatrakA_HS: "Higher Sec Section - Patrak-A (ઉ.માધ્યમિક કાર્યભાર પત્રક-અ)",
    deoPatrakB_HS: "Higher Sec Section - Patrak-B (ઉચ્ચતર માધ્યમિક શિક્ષક પત્રક-બ)",
    deoPatrakK_HS: "Higher Sec Section - Patrak-K (ઉ.માં. માધ્યમિક પત્રક-ક)",
    cert21Hours: "It is hereby certified that the workload shown in the above form is reflected in the school timetable and conforms to the regulatory provision of 21 hours workload.",
    principalSignature: "Principal Signature & Stamp Seal",
    deoSignature: "District Education Officer (DEO) Signature & Seal",
    dateLabel: "Date",
    placeLabel: "Place",

    // Language Selector Labels
    langEnglish: "English (🇬🇧)",
    langGujarati: "ગુજરાતી (🇬🇯)",
    langHindi: "हिंदी (🇮🇳)"
  },
  gu: {
    // App & Header
    appName: "ઔમતારા સમય",
    tagline: "દ્વિ-શિફ્ટ શાળા સમયપત્રક પ્લેટફોર્મ",
    schoolPortal: "શાળા સંસ્થા પોર્ટલ",
    superAdminPortal: "સુપર એડમિન માસ્ટર પોર્ટલ",
    viewSchoolApp: "🏫 શાળા પ્લેટફોર્મ જુઓ",
    viewSAHub: "👑 સુપર એડમિન હબ",
    activeYear: "શૈક્ષણિક વર્ષ",

    // Navigation Tabs
    navDashboard: "ડેશબોર્ડ સંક્ષિપ્ત",
    navSetup: "સંસ્થાકીય સેટઅપ",
    navData: "સેટઅપ અને ડેટા સંચાલન",
    navGenerator: "એઆઈ સમયપત્રક જનરેટર",
    navConstraints: "નિયમો અને મર્યાદાઓ",
    navSubstitute: "એવેજી તાસ સંચાલક (સબ્સ્ટિટ્યુટ)",
    navDEO: "ડી.ઈ.ઓ. પત્રકો અને રિપોર્ટ",
    navSettings: "સિસ્ટમ સેટિંગ્સ",
    navSuperAdmin: "સુપર એડમિન માસ્ટર હબ",
    navVersionHistory: "આવૃત્તિ ઇતિહાસ (વર્ઝન)",
    navHelp: "મદદ અને માર્ગદર્શિકા",

    // Common Actions & Badges
    save: "સેવ કરો",
    cancel: "રદ કરો",
    delete: "કાઢી નાખો",
    edit: "સંપાદિત કરો",
    add: "નવું ઉમેરો",
    exportCSV: "સીએસવી ડાઉનલોડ",
    printPDF: "પીડીએફ પ્રિન્ટ કરો",
    searchPlaceholder: "શોધો...",
    morningShift: "સવારની શિફ્ટ (સીબીએસઈ)",
    afternoonShift: "બપોરની શિફ્ટ (સ્ટેટ બોર્ડ)",
    bothShifts: "બંને શિફ્ટ (સાઝા શિક્ષક/ઓરડા)",

    // Data Management
    tabClasses: "વર્ગો અને સેક્શન",
    tabSubjects: "વિષયોની યાદી",
    tabTeachers: "શિક્ષકોની ડિરેક્ટરી",
    tabRooms: "ઓરડાઓ અને લેબ",

    // Multi-Subject Teacher Capabilities
    teacherExpertiseTitle: "શિક્ષકની વિષય ક્ષમતા અને વિષય જ્ઞાન (૨-૩ વિષય જ્ઞાન)",
    primarySubject: "⭐ મુખ્ય વિષય (Primary Specialization)",
    secondarySubjects: "🌿 ગૌણ વિષય (Secondary Capabilities - ૨જો/૩જો વિષય)",
    proxySubjects: "🔄 એવેજી તાસ વિષય (Emergency Proxy Duty)",
    badgeMain: "⭐ મુખ્ય વિષય",
    badgeSec: "🌿 ગૌણ વિષય",
    badgeProxy: "🔄 એવેજી તાસ",

    // DEO Reports
    deoHeader: "જિલ્લા શિક્ષણાધિકારીશ્રી (DEO) કચેરી સત્તાવાર નિરીક્ષણ પત્રકો",
    selectDEOFormat: "ડી.ઈ.ઓ. પત્રક પસંદ કરો:",
    deoPatrakA_Sec: "માધ્યમિક વિભાગ - કાર્યભાર પત્રક-અ",
    deoPatrakB_Sec: "માધ્યમિક વિભાગ - હાલમાં કામ કરતા શિક્ષકોનો કાર્ય બોજ પત્રક-બ",
    deoPatrakK_Sec: "માધ્યમિક વિભાગ - કાર્યભાર પત્રક-ક",
    deoPatrakA_HS: "ઉ.માધ્યમિક વિભાગ - કાર્યભાર પત્રક-અ",
    deoPatrakB_HS: "ઉચ્ચતર માધ્યમિક વિભાગ - પત્રક-બ",
    deoPatrakK_HS: "ઉ.માં. માધ્યમિક વિભાગ - કાર્યભાર પત્રક-ક",
    cert21Hours: "આથી પ્રમાણપત્ર આપવામાં આવે છે કે ઉપર્યુક્ત પત્રકમાં દર્શાવ્યા મુજબનો કાર્યભાર શાળાના સમયપત્રકમાં દર્શાવેલ છે અને વિનિયમની જોગવાઈ મુજબનો ૨૧ કલાકનો કાર્યભાર થાય છે.",
    principalSignature: "આચાર્યની સહી/સિક્કો",
    deoSignature: "જિલ્લા શિક્ષણાધિકારીશ્રી (DEO) સહી અને સિક્કો",
    dateLabel: "તારીખ",
    placeLabel: "સ્થળ",

    // Language Selector Labels
    langEnglish: "English (🇬🇧)",
    langGujarati: "ગુજરાતી (🇬🇯)",
    langHindi: "हिंदी (🇮🇳)"
  },
  hi: {
    // App & Header
    appName: "ઔમતારા સમય",
    tagline: "द्वि-शिफ्ट स्कूल समय सारणी प्लेटफॉर्म",
    schoolPortal: "स्कूल संस्थान पोर्टल",
    superAdminPortal: "सुपर एडमिन मास्टर पोर्टल",
    viewSchoolApp: "🏫 स्कूल ऐप देखें",
    viewSAHub: "👑 सुपर एडमिन हब",
    activeYear: "शैक्षणिक सत्र",

    // Navigation Tabs
    navDashboard: "डैशबोर्ड अवलोकन",
    navSetup: "संस्थागत सेटअप",
    navData: "सेटअप और डेटा प्रबंधन",
    navGenerator: "एआई समय सारणी जनरेटर",
    navConstraints: "नियम एवं सीमाएं",
    navSubstitute: "स्थानापन्न कार्य प्रबंधक (सब्सटीट्यूट)",
    navDEO: "डीईओ रिपोर्ट एवं अनुपालन",
    navSettings: "सिस्टम सेटिंग्स",
    navSuperAdmin: "सुपर एडमिन मास्टर हब",
    navVersionHistory: "संस्करण इतिहास",
    navHelp: "सहायता एवं मार्गदर्शिका",

    // Common Actions & Badges
    save: "सहेजें",
    cancel: "रद्द करें",
    delete: "हटाएं",
    edit: "संपादित करें",
    add: "नया जोड़ें",
    exportCSV: "सीएसवी डाउनलोड",
    printPDF: "प्रिंट पीडीएफ",
    searchPlaceholder: "खोजें...",
    morningShift: "सुबह की शिफ्ट (CBSE)",
    afternoonShift: "दोपहर की शिफ्ट (स्टेट बोर्ड)",
    bothShifts: "दोनों शिफ्ट (साझा)",

    // Data Management
    tabClasses: "कक्षाएं और सेक्शन",
    tabSubjects: "विषय सूची",
    tabTeachers: "शिक्षक निर्देशिका",
    tabRooms: "कमरे और प्रयोगशालाएं",

    // Multi-Subject Teacher Capabilities
    teacherExpertiseTitle: "शिक्षक विषय विशेषज्ञता एवं योग्यता (2-3 विषय ज्ञान)",
    primarySubject: "⭐ मुख्य विषय (Primary Subject)",
    secondarySubjects: "🌿 द्वितीयक विषय (Secondary Subjects)",
    proxySubjects: "🔄 आपातकालीन स्थानापन्न विषय (Proxy Duty)",
    badgeMain: "⭐ मुख्य",
    badgeSec: "🌿 द्वितीयक",
    badgeProxy: "🔄 स्थानापन्न",

    // DEO Reports
    deoHeader: "जिला शिक्षा अधिकारी (DEO) आधिकारिक निरीक्षण रजिस्टर",
    selectDEOFormat: "डीईओ प्रारूप चुनें:",
    deoPatrakA_Sec: "माध्यमिक विभाग - कार्यभार पत्रक-अ",
    deoPatrakB_Sec: "माध्यमिक विभाग - कार्यरत शिक्षकों का कार्यभार पत्रक-ब",
    deoPatrakK_Sec: "माध्यमिक विभाग - कार्यभार पत्रक-क",
    deoPatrakA_HS: "उच्चतर माध्यमिक विभाग - कार्यभार पत्रक-अ",
    deoPatrakB_HS: "उच्चतर माध्यमिक विभाग - पत्रक-ब",
    deoPatrakK_HS: "उच्चतर माध्यमिक विभाग - कार्यभार पत्रक-क",
    cert21Hours: "एतद्द्वारा प्रमाणित किया जाता है कि उपर्युक्त पत्रक में दर्शाया गया कार्यभार स्कूल की समय सारणी में परिलक्षित है और नियमानुसार 21 घंटे का कार्यभार पूरा करता है।",
    principalSignature: "प्राचार्य के हस्ताक्षर एवं मुहर",
    deoSignature: "जिला शिक्षा अधिकारी (DEO) हस्ताक्षर एवं मुहर",
    dateLabel: "दिनांक",
    placeLabel: "स्थान",

    // Language Selector Labels
    langEnglish: "English (🇬🇧)",
    langGujarati: "ગુજરાતી (🇬🇯)",
    langHindi: "हिंदी (🇮🇳)"
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('aumtara_language') || 'en';
    } catch (e) {
      return 'en';
    }
  });

  const setLanguage = (lang) => {
    try {
      localStorage.setItem('aumtara_language', lang);
    } catch (e) {
      console.warn('Could not save language to localStorage:', e);
    }
    setLanguageState(lang);
  };

  const t = (key) => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
