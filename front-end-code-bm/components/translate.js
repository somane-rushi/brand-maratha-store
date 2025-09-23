import en from "@/language/en/common.json";
import mr from "@/language/mr/common.json";

const translations = { en, mr };

export function t(key, lang = 'en') {
  return translations[lang]?.[key] || key;
}
