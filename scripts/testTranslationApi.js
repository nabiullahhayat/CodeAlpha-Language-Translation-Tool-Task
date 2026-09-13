const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3001'

async function runTest(name, fn) {
  try {
    await fn()
    console.log(`PASS: ${name}`)
  } catch (error) {
    console.error(`FAIL: ${name}`)
    console.error(error.message)
    process.exitCode = 1
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options)
  const data = await response.json().catch(() => ({}))
  return { response, data }
}

async function main() {
  await runTest('health endpoint responds', async () => {
    const { response, data } = await request('/api/health')

    if (!response.ok) {
      throw new Error(`Expected 200, received ${response.status}`)
    }

    if (data.status !== 'ok') {
      throw new Error('Health status was not ok')
    }
  })

  await runTest('missing API key returns configuration error', async () => {
    const { response, data } = await request('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Hello',
        sourceLang: 'en',
        targetLang: 'ps',
      }),
    })

    if (response.status !== 503 || data.code !== 'CONFIG_ERROR') {
      throw new Error(`Expected CONFIG_ERROR 503, received ${data.code} ${response.status}`)
    }
  })

  await runTest('English to Dari language codes are accepted', async () => {
    const { response, data } = await request('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Good morning',
        sourceLang: 'en',
        targetLang: 'fa-AF',
      }),
    })

    if (response.status !== 503 || data.code !== 'CONFIG_ERROR') {
      throw new Error(`Expected CONFIG_ERROR 503, received ${data.code} ${response.status}`)
    }
  })

  await runTest('same source and target language is rejected', async () => {
    const { response, data } = await request('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Hello',
        sourceLang: 'en',
        targetLang: 'en',
      }),
    })

    if (response.status !== 400 || data.code !== 'VALIDATION_ERROR') {
      throw new Error(`Expected VALIDATION_ERROR 400, received ${data.code} ${response.status}`)
    }
  })

  await runTest('validation rejects empty text', async () => {
    const { response, data } = await request('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: '   ',
        sourceLang: 'en',
        targetLang: 'ps',
      }),
    })

    if (response.status !== 400 || data.code !== 'VALIDATION_ERROR') {
      throw new Error(`Expected VALIDATION_ERROR 400, received ${data.code} ${response.status}`)
    }
  })

  if (process.env.GOOGLE_TRANSLATE_API_KEY) {
    await runTest('live translation request succeeds', async () => {
      const { response, data } = await request('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'Hello',
          sourceLang: 'en',
          targetLang: 'ps',
        }),
      })

      if (!response.ok) {
        throw new Error(data.error || `Live translation failed with ${response.status}`)
      }

      if (!data.translatedText) {
        throw new Error('Live translation returned no translatedText')
      }
    })
  } else {
    console.log('SKIP: live translation test (GOOGLE_TRANSLATE_API_KEY not set)')
  }
}

main()
