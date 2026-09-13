import { useState } from 'react'
import {
  DEFAULT_SOURCE_LANGUAGE,
  DEFAULT_TARGET_LANGUAGE,
  SOURCE_LANGUAGES,
  getTargetLanguageOptions,
  resolveTargetLanguage,
} from '../constants/languages'

const PLACEHOLDER_RESULT = 'Your translation will appear here.'

function TranslationTool() {
  const [sourceText, setSourceText] = useState('')
  const [sourceLang, setSourceLang] = useState(DEFAULT_SOURCE_LANGUAGE)
  const [targetLang, setTargetLang] = useState(DEFAULT_TARGET_LANGUAGE)
  const [result, setResult] = useState('')

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

  const handleTranslate = () => {
    // Temporary preview until API integration is added.
    // sourceLang and targetLang are stored in state for future API use.
    setResult(sourceText.trim() ? sourceText : '')
  }

  const handleClear = () => {
    setSourceText('')
    setResult('')
  }

  const handleCopy = () => {
    // Placeholder for copy functionality.
    if (!result) return
  }

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
              onChange={(event) => setSourceText(event.target.value)}
              placeholder="Enter text to translate..."
              rows={8}
              aria-describedby="character-count"
            />
            <div className="textarea-footer">
              <p id="character-count" className="character-count" aria-live="polite">
                {characterCount} {characterCount === 1 ? 'character' : 'characters'}
              </p>
              <button
                type="button"
                className="clear-button"
                onClick={handleClear}
                disabled={!sourceText && !result}
              >
                Clear
              </button>
            </div>
          </div>

          <button type="button" className="translate-button" onClick={handleTranslate}>
            Translate
          </button>
        </section>

        <section className="translation-panel" aria-labelledby="result-heading">
          <div className="result-header">
            <h2 id="result-heading">Translation</h2>
            <button
              type="button"
              className="copy-button"
              onClick={handleCopy}
              disabled={!hasResult}
              aria-label="Copy translation"
            >
              Copy
            </button>
          </div>

          <div
            className={`result-area ${hasResult ? 'result-area--filled' : ''}`}
            role="region"
            aria-live="polite"
            aria-label="Translation result"
          >
            {hasResult ? result : PLACEHOLDER_RESULT}
          </div>
        </section>
      </main>
    </div>
  )
}

export default TranslationTool
