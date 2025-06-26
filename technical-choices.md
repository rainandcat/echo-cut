# Technical Choices

This document outlines the technical decisions made during the development of the EchoCut video highlight editing tool.

---

## 1. Frontend Framework: **Vue 3 + Vite**

- Chosen for its modern Composition API, fast bundling via Vite, and rich ecosystem.
- `<script setup>` used for simpler and more readable component logic.

---

## 2. State Management: **Pinia**

- Used to manage global playback state (current time, seek function).
- Avoids prop drilling and complex emit chains between nested components.
- Enables synchronization between Preview and Transcript editing area.

---

## 3. Styling: **Tailwind CSS**

- Utility-first CSS framework for rapid UI development.
- Allows fully responsive layouts with minimal custom CSS.
- Easily customizable via `tailwind.config.js` for brand colors or spacing.

---

## 4. Custom Composables

- `useVideoPreviewController.js`  
  Manages play/pause logic and mode switching between normal and highlight playback.

- `useVideoPreviewPlayer.js`  
  Implements smooth highlight playback using `requestAnimationFrame` to ensure fluid transitions and accurate timing (vs. using `setTimeout`).

These composables abstract playback logic out of the UI components, improving code maintainability and testability.

---

## 5. Custom Video Controls

- `VideoControls.vue` replaces the default video controls with custom UI that includes:

  - Play / Pause button
  - Toggle for highlight playback mode
  - Skip to next / previous highlight segment
  - Time display and highlight-aware progress bar

- Works with `ProgressBar.vue` to show both current playback position and highlight markers.

---

## 6. AI Mock API

- Created `getTranscriptData()` to simulate AI transcript output.
- Mock returns structured JSON including:
  - Full transcript
  - Section titles
  - Sentence timestamps
  - Highlight suggestions
- Enables realistic testing without backend dependencies.

---

## 7. UX & Synchronization

- Clicking timestamps updates video preview instantly.
- Active sentence highlighted and auto-scrolls during playback.
- Highlighted sentence overlay synced with video audio.

---

## 8. Scalability & Readability

- Modular folder structure (`components`, `api`, `stores`)
- Clear naming and comments for maintainability.
- Code is compatible with expansion toward real backend integration or external AI API.

---

Made for the GliaCloud Frontend Assignment.
