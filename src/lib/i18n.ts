import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const en = {
  translation: {
    "Home": "Home",
    "Tasks": "Tasks",
    "Check In": "Check In",
    "Referrals": "Referrals",
    "Profile": "Profile",
    "Language": "Language",
    "Watch & Earn": "Watch & Earn",
    "Total VA Balance": "Total VA Balance",
    "Daily Limit": "Daily Limit",
    "Limit Reached": "Limit Reached",
    "Watch Ad Now": "Watch Ad Now",
    "Sponsored": "Sponsored"
  }
};

// Bengali translations
const bn = {
  translation: {
    "Home": "হোম",
    "Tasks": "টাস্ক",
    "Check In": "চেক ইন",
    "Referrals": "রেফারেল",
    "Profile": "প্রোফাইল",
    "Language": "ভাষা",
    "Watch & Earn": "দেখুন এবং আয় করুন",
    "Total VA Balance": "মোট ভিএ ব্যালেন্স",
    "Daily Limit": "দৈনিক সীমা",
    "Limit Reached": "সীমা শেষ",
    "Watch Ad Now": "বিজ্ঞাপন দেখুন",
    "Sponsored": "স্পনসর্ড"
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      bn,
    },
    lng: localStorage.getItem('app_language') || 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
