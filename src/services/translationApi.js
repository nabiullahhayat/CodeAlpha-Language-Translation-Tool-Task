const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export class TranslationServiceError extends Error {
  constructor(message, code, statusCode = 500) {
    super(message)
    this.name = 'TranslationServiceError'
    this.code = code
    this.statusCode = statusCode
  }
}

async function parseResponse(response) {
  try {
    return await response.json()
  } catch {
    return {}
  }
}

/**
 * Calls the backend translation proxy.
 * Part 6 will use this from the Translate button handler.
 */
export async function translateText({ text, sourceLang, targetLang }) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}/api/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, sourceLang, targetLang }),
    })
  } catch {
    throw new TranslationServiceError(
      'Unable to connect to the translation server. Make sure the backend is running.',
      'CONNECTION_ERROR',
      503,
    )
  }

  const data = await parseResponse(response)

  if (!response.ok) {
    throw new TranslationServiceError(
      data.error || 'Translation request failed.',
      data.code || 'TRANSLATION_FAILED',
      response.status,
    )
  }

  if (!data.translatedText) {
    throw new TranslationServiceError(
      'The translation server returned an empty result.',
      'API_RESPONSE_ERROR',
      502,
    )
  }

  return {
    translatedText: data.translatedText,
    sourceLang: data.sourceLang,
    targetLang: data.targetLang,
  }
}

/**
 * Checks whether the backend proxy is reachable and configured.
 */
export async function checkTranslationHealth() {
  let response

  try {
    response = await fetch(`${API_BASE_URL}/api/health`)
  } catch {
    throw new TranslationServiceError(
      'Unable to connect to the translation server. Make sure the backend is running.',
      'CONNECTION_ERROR',
      503,
    )
  }

  const data = await parseResponse(response)

  if (!response.ok) {
    throw new TranslationServiceError(
      data.error || 'Health check failed.',
      data.code || 'HEALTH_CHECK_FAILED',
      response.status,
    )
  }

  return data
}
