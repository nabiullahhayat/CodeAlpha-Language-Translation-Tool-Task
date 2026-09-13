# Language Translation Tool

A responsive React web application for translating text between multiple languages. Built as **CodeAlpha AI Internship Task 1**.

## Project Description

This project is a full-stack language translation tool with a clean, professional UI. Users can enter text, choose source and target languages, translate via a secure backend proxy, and copy the result to the clipboard. API credentials are kept on the server and never exposed in the frontend.

## Features

- Multi-language translation (English, Pashto, Dari, Arabic, Urdu, Turkish, French, German, Spanish, Russian, Chinese, Hindi)
- Source and target language selectors with duplicate-language prevention
- Real-time character counter
- Clear / reset input and output
- Secure translation API proxy (Google Cloud Translation)
- Loading state with duplicate-request prevention
- User-friendly error handling
- Copy translated text to clipboard with feedback
- Fully responsive layout (mobile, tablet, desktop)
- Accessible keyboard navigation and focus states

## Technologies Used

- **Frontend:** React 19, Vite 6, CSS
- **Backend:** Node.js, Express, CORS, dotenv
- **Translation API:** Google Cloud Translation API (via server proxy)
- **Tooling:** Oxlint, Concurrently

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd alph
```

2. Install dependencies:

```bash
npm install
```

3. Create your environment file:

```bash
cp .env.example .env
```

4. Add your Google Cloud Translation API key to `.env`:

```env
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key_here
PORT=3001
```

> **Important:** Never commit `.env` or real API keys to GitHub. Only `.env.example` with placeholder values should be tracked.

## Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `GOOGLE_TRANSLATE_API_KEY` | Server `.env` | Google Cloud Translation API key (required for live translation) |
| `PORT` | Server `.env` | Backend proxy port (default: `3001`) |
| `VITE_API_BASE_URL` | Optional | Frontend API base URL (leave empty in development to use Vite proxy) |

## How to Run

### Run frontend and backend together (recommended)

```bash
npm run dev:all
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Run separately

**Backend:**

```bash
npm run server
```

**Frontend:**

```bash
npm run dev
```

### Production build

```bash
npm run build
npm run preview
```

## How to Use the Translation Tool

1. Open the app in your browser.
2. Select a **source language** (default: English).
3. Select a **target language** (default: Pashto).
4. Enter text in the input area.
5. Click **Translate**.
6. View the translated result in the output panel.
7. Click **Copy** to copy the translation to your clipboard.
8. Click **Clear** to reset the input and output.

## Testing

Run automated API tests (backend must be running):

```bash
npm run server
npm run test:api
```

Run lint and production build:

```bash
npm run lint
npm run build
```

### Manual test checklist

- [ ] Text input and character counter update correctly
- [ ] Clear button resets input, output, and errors
- [ ] Source and target language selectors work
- [ ] Same language cannot be selected for both source and target
- [ ] Translate shows loading state and disables controls
- [ ] Empty input shows a validation error
- [ ] Missing API key shows a configuration error
- [ ] Successful translation displays real API output
- [ ] Copy button copies result and shows "Copied!"
- [ ] Layout works on mobile, tablet, and desktop widths

### Tested language pairs

- English → Pashto (`en` → `ps`)
- English → Dari (`en` → `fa-AF`)

## CodeAlpha Task 1

This repository fulfills **CodeAlpha AI Internship Task 1: Language Translation Tool**, implemented in parts:

1. UI layout
2. Text input and preview
3. Source language selector
4. Target language selector
5. Translation API integration
6. Translate button functionality
7. Loading and error handling
8. Copy translation
9. Professional responsive UI
10. Final testing and submission preparation

## Project Structure

```
alph/
├── server/                 # Express translation API proxy
├── src/
│   ├── components/         # React UI components
│   ├── constants/          # Language definitions
│   └── services/           # Frontend API client
├── scripts/                # API test script
├── .env.example            # Safe environment template
└── README.md
```

## Security Notes

- API keys are stored only in server-side `.env` files
- `.env` is listed in `.gitignore`
- The frontend calls `/api/translate` through a Vite dev proxy or your deployed backend
- Do not hardcode secrets in frontend code

## License

This project was created for educational purposes as part of the CodeAlpha AI Internship.
