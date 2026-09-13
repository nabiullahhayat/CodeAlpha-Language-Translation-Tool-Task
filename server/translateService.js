import { toGoogleLanguageCode } from './languageCodes.js'

export class TranslationApiError extends Error {
  constructor(message, code, statusCode = 500) {
    super(message)
    this.name = 'TranslationApiError'
    this.code = code
    this.statusCode = statusCode
  }
}

function getGoogleApiKey() {
  return process.env.GOOGLE_TRANSLATE_API_KEY?.trim() || ''
}

export function isTranslationConfigured() {
  return Boolean(getGoogleApiKey())
}

function validateTranslationRequest({ text, sourceLang, targetLang }) {
  if (!text?.trim()) {
    throw new TranslationApiError('Text is required for translation.', 'VALIDATION_ERROR', 400)
  }

  if (!sourceLang || !targetLang) {
    throw new TranslationApiError(
      'Source and target languages are required.',
      'VALIDATION_ERROR',
      400,
    )
  }

  if (sourceLang === targetLang) {
    throw new TranslationApiError(
      'Source and target languages must be different.',
      'VALIDATION_ERROR',
      400,
    )
  }
}

async function translateWithGoogle({ text, sourceLang, targetLang }) {
  const apiKey = getGoogleApiKey()

  if (!apiKey) {
    throw new TranslationApiError(
      'Translation API is not configured. Set GOOGLE_TRANSLATE_API_KEY in the server .env file.',
      'CONFIG_ERROR',
      503,
    )
  }

  const url = new URL('https://translation.googleapis.com/language/translate/v2')
  url.searchParams.set('key', apiKey)

  let response

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: toGoogleLanguageCode(sourceLang),
        target: toGoogleLanguageCode(targetLang),
        format: 'text',
      }),
    })
  } catch {
    throw new TranslationApiError(
      'Unable to reach the translation service. Check your network connection.',
      'CONNECTION_ERROR',
      503,
    )
  }

  let payload = {}

  try {
    payload = await response.json()
  } catch {
    throw new TranslationApiError(
      'Received an invalid response from the translation service.',
      'API_RESPONSE_ERROR',
      502,
    )
  }

  if (!response.ok) {
    const apiMessage =
      payload.error?.message || 'The translation service rejected the request.'

    if (response.status === 403 || response.status === 401) {
      throw new TranslationApiError(
        'Translation API credentials are invalid or unauthorized.',
        'AUTH_ERROR',
        502,
      )
    }

    throw new TranslationApiError(apiMessage, 'API_ERROR', 502)
  }

  const translatedText = payload.data?.translations?.[0]?.translatedText

  if (!translatedText) {
    throw new TranslationApiError(
      'The translation service returned an empty result.',
      'API_RESPONSE_ERROR',
      502,
    )
  }

  return {
    translatedText,
    sourceLang,
    targetLang,
  }
}

export async function translateText({ text, sourceLang, targetLang }) {
  validateTranslationRequest({ text, sourceLang, targetLang })
  return translateWithGoogle({ text, sourceLang, targetLang })
}
