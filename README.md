# EchoCut - AI-Powered Video Highlight Editor

EchoCut is a demo project for a video highlight editing tool powered by mock AI. It allows users to upload a video, view a transcript, select key sentences, and preview an automatically composed highlight reel.

## Tech Stack

- Vue 3 + Vite
- Pinia (global state management)
- Tailwind CSS (UI styling)
- Composition API
- Mock API (simulated AI transcript processing)

## Project Structure

```
src/
├── api/               # Mock transcript API
├── components/
│   ├── TranscriptPanel.vue
│   ├── TranscriptSection.vue
│   ├── TranscriptSentence.vue
│   ├── VideoControls.vue
│   └── VideoPreview.vue
├── stores/            # Pinia store for shared playback data
└── App.vue
```

## Features

- Video file upload with custom UI
- Simulated AI transcription and highlight suggestion
- Sentence selection with timestamp navigation
- Preview mode with highlight playback and subtitle overlay
- Custom video controls (play, pause, seek)
- Highlight Mode toggle
- Auto-scroll and playback-time synchronization
- Responsive layout (desktop-first, mobile-adaptive)

## How to Run

```bash
npm install
npm run dev
```

## How to Deploy

You can deploy this project via services like Vercel or Netlify. Simply push to GitHub and connect your repo.

## Mock API Data

The `getTranscriptData()` function simulates a backend AI response with:

- Full transcript split into sections
- Timestamps, titles, and highlight suggestions

## Demo Goals

- ✔️ All required features implemented
- ✔️ Custom playback flow via Pinia
- ✔️ Mobile and desktop support
- ✔️ UX-first layout with clean interaction

## Future Improvements

- Real AI transcript support
- Mobile layout refinement
- Sentence-level editing
- Loading animations
