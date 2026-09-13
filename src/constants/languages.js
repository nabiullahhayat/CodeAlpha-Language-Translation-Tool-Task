export const SOURCE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ps', name: 'Pashto' },
  { code: 'fa-AF', name: 'Dari' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ur', name: 'Urdu' },
  { code: 'tr', name: 'Turkish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
]

export const TARGET_LANGUAGES = SOURCE_LANGUAGES

export const DEFAULT_SOURCE_LANGUAGE = 'en'
export const DEFAULT_TARGET_LANGUAGE = 'ps'

export function getTargetLanguageOptions(sourceLanguageCode) {
  return TARGET_LANGUAGES.filter((language) => language.code !== sourceLanguageCode)
}

export function resolveTargetLanguage(sourceLanguageCode, currentTargetLanguage) {
  const available = getTargetLanguageOptions(sourceLanguageCode)

  if (available.some((language) => language.code === currentTargetLanguage)) {
    return currentTargetLanguage
  }

  if (available.some((language) => language.code === DEFAULT_TARGET_LANGUAGE)) {
    return DEFAULT_TARGET_LANGUAGE
  }

  return available[0]?.code ?? DEFAULT_TARGET_LANGUAGE
}
