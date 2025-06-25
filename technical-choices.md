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

## 4. Video Control Logic

- Default browser `<video controls>` are hidden for design flexibility.
- Custom `VideoControls.vue` allows unified play, pause, and seek for:
  - Normal playback mode
  - Highlight-only playback mode
- Smooth transitions and fade effects added for better UX.

---

## 5. AI Mock API

- Created `getTranscriptData()` to simulate AI transcript output.
- Mock returns structured JSON including:
  - Full transcript
  - Section titles
  - Sentence timestamps
  - Highlight suggestions
- Enables realistic testing without backend dependencies.

---

## 6. UX & Synchronization

- Clicking timestamps updates video preview instantly.
- Active sentence highlighted and auto-scrolls during playback.
- Highlighted sentence overlay synced with video audio.

---

## 7. Scalability & Readability

- Modular folder structure (`components`, `api`, `stores`)
- Clear naming and comments for maintainability.
- Code is compatible with expansion toward real backend integration or external AI API.

---

Made for the GliaCloud Frontend Assignment.
