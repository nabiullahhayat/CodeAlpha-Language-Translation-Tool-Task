import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import {
  isTranslationConfigured,
  translateText,
  TranslationApiError,
} from './translateService.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT) || 3001

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    configured: isTranslationConfigured(),
  })
})

app.post('/api/translate', async (request, response) => {
  try {
    const { text, sourceLang, targetLang } = request.body ?? {}
    const result = await translateText({ text, sourceLang, targetLang })
    response.json(result)
  } catch (error) {
    if (error instanceof TranslationApiError) {
      response.status(error.statusCode).json({
        error: error.message,
        code: error.code,
      })
      return
    }

    response.status(500).json({
      error: 'Unexpected server error.',
      code: 'INTERNAL_ERROR',
    })
  }
})

app.listen(port, () => {
  console.log(`Translation API proxy running on http://localhost:${port}`)
})
