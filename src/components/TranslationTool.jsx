import { useRef, useState } from 'react'
import {
  DEFAULT_SOURCE_LANGUAGE,
  DEFAULT_TARGET_LANGUAGE,
  SOURCE_LANGUAGES,
  getTargetLanguageOptions,
  resolveTargetLanguage,
} from '../constants/languages'
import { TranslationServiceError, translateText } from '../services/translationApi'

const PLACEHOLDER_RESULT = 'Your translation will appear here.'

function getUserFriendlyErrorMessage(error) {
  if (!(error instanceof TranslationServiceError)) {
    return 'Something went wrong. Please try again.'
  }

  switch (error.code) {
    case 'CONFIG_ERROR':
      return 'Translation service is not configured. Add GOOGLE_TRANSLATE_API_KEY to the server .env file.'
    case 'CONNECTION_ERROR':
      return 'Unable to connect to the translation server. Make sure the backend is running.'
    case 'API_RESPONSE_ERROR':
      return 'The translation service returned an invalid response. Please try again.'
    case 'AUTH_ERROR':
      return 'Translation API credentials are invalid or unauthorized.'
    case 'VALIDATION_ERROR':
      return error.message
    case 'API_ERROR':
      return error.message || 'The translation request failed. Please try again.'
    default:
      return error.message || 'Translation failed. Please try again.'
  }
}

function TranslationTool() {
  const [sourceText, setSourceText] = useState('')
  const [sourceLang, setSourceLang] = useState(DEFAULT_SOURCE_LANGUAGE)
  const [targetLang, setTargetLang] = useState(DEFAULT_TARGET_LANGUAGE)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const isTranslatingRef = useRef(false)

  const characterCount = sourceText.length
  const hasResult = result.length > 0
  const targetLanguageOptions = getTargetLanguageOptions(sourceLang)

  const handleSourceLanguageChange = (event) => {
    const nextSourceLang = event.target.value
    setSourceLang(nextSourceLang)
    setTargetLang((currentTargetLang) =>
      resolveTargetLanguage(nextSourceLang, currentTargetLang),
    )
  }

  const handleTargetLanguageChange = (event) => {
    setTargetLang(event.target.value)
  }

  const handleSourceTextChange = (event) => {
    setSourceText(event.target.value)
    if (error) {
      setError('')
    }
  }

  const handleTranslate = async () => {
    if (isTranslatingRef.current) {
      return
    }

    const trimmedText = sourceText.trim()

    if (!trimmedText) {
      setError('Please enter text to translate.')
      return
    }

    setError('')
    setIsTranslating(true)
    isTranslatingRef.current = true

    try {
      const { translatedText } = await translateText({
        text: trimmedText,
        sourceLang,
        targetLang,
      })
      setResult(translatedText)
    } catch (translationError) {
      setError(getUserFriendlyErrorMessage(translationError))
    } finally {
      isTranslatingRef.current = false
      setIsTranslating(false)
    }
  }

  const handleClear = () => {
    setSourceText('')
    setResult('')
    setError('')
  }

  const handleCopy = () => {
    // Placeholder for copy functionality.
    if (!result) return
  }

  const resultContent = hasResult ? result : PLACEHOLDER_RESULT

  return (
    <div className="translation-app">
      <header className="translation-header">
        <h1>Language Translation Tool</h1>
        <p>Enter text, choose languages, and translate instantly.</p>
      </header>

      <main className="translation-main">
        <section className="translation-panel" aria-labelledby="input-heading">
          <h2 id="input-heading" className="visually-hidden">
            Source text
          </h2>

          <div className="language-row">
            <div className="field">
              <label htmlFor="source-language">Source language</label>
              <select
                id="source-language"
                value={sourceLang}
                onChange={handleSourceLanguageChange}
                disabled={isTranslating}
              >
                {SOURCE_LANGUAGES.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="target-language">Target language</label>
              <select
                id="target-language"
                value={targetLang}
                onChange={handleTargetLanguageChange}
                disabled={isTranslating}
              >
                {targetLanguageOptions.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="source-text">Text to translate</label>
            <textarea
              id="source-text"
              className="source-textarea"
              value={sourceText}
              onChange={handleSourceTextChange}
              placeholder="Enter text to translate..."
              rows={8}
              aria-describedby="character-count translation-error"
              disabled={isTranslating}
            />
            <div className="textarea-footer">
              <p id="character-count" className="character-count" aria-live="polite">
                {characterCount} {characterCount === 1 ? 'character' : 'characters'}
              </p>
              <button
                type="button"
                className="clear-button"
                onClick={handleClear}
                disabled={(!sourceText && !result && !error) || isTranslating}
              >
                Clear
              </button>
            </div>
          </div>

          {error && (
            <p id="translation-error" className="translation-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="button"
            className="translate-button"
            onClick={handleTranslate}
            disabled={isTranslating}
            aria-busy={isTranslating}
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>
        </section>

        <section className="translation-panel" aria-labelledby="result-heading">
          <div className="result-header">
            <h2 id="result-heading">Translation</h2>
            <button
              type="button"
              className="copy-button"
              onClick={handleCopy}
              disabled={!hasResult || isTranslating}
              aria-label="Copy translation"
            >
              Copy
            </button>
          </div>

          <div
            className={`result-area ${hasResult ? 'result-area--filled' : ''} ${isTranslating ? 'result-area--loading' : ''}`}
            role="region"
            aria-live="polite"
            aria-busy={isTranslating}
            aria-label="Translation result"
          >
            {isTranslating && !hasResult ? 'Translating...' : resultContent}
          </div>
        </section>
      </main>
    </div>
  )
}

export default TranslationTool
