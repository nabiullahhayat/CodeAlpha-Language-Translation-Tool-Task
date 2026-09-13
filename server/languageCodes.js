const APP_TO_GOOGLE = {
  en: 'en',
  ps: 'ps',
  'fa-AF': 'fa',
  ar: 'ar',
  ur: 'ur',
  tr: 'tr',
  fr: 'fr',
  de: 'de',
  es: 'es',
  ru: 'ru',
  zh: 'zh-CN',
  hi: 'hi',
}

export function toGoogleLanguageCode(appLanguageCode) {
  return APP_TO_GOOGLE[appLanguageCode] ?? appLanguageCode
}
