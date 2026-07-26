# 🧭 AI Smart Tourism & Heritage Intelligence Platform

An immersive, full-stack, AI-powered platform designed to bridge the gap between ancient living monuments and modern sustainable tourism. Combining the multimodal understanding of Gemini 3.5 with real-time analytics, weather-aware planning, conversational guide assistants (RAG), and gamified exploration.

---

## 🎨 Creative Architecture & Interface Highlights

Our platform features a highly tactile, dark cosmic-slate UI theme designed to showcase ancient monuments with pristine contrast. Highlights include:
* **Custom Vector Representation**: Preset heritage assets such as the **Madurai Meenakshi Temple**, **Taj Mahal**, **Hampi Ruins**, and **Great Living Chola Temples** are rendered with detailed hand-styled SVG layouts representing traditional temple alignments and Gopurams.
* **Simulated AR Anchors (Fictional Scan)**: Allows tourists to explore virtual spatial coordinates mapped with persistent anchor IDs, real-time spatial positioning metrics, camera pose angles, and context-dependent informative overlays.
* **Resilient Playback Core**: A robust, multi-tier speech narration engine utilizing Gemini's Text-to-Speech (`gemini-3.1-flash-tts-preview`) with immediate browser `SpeechSynthesis` failovers. Includes garbage-collection overrides and scheduling workarounds to keep voice narration seamless across Chromium and other modern browsers.
* **Dual-Engine Precision**: Operates both online (via server-side Gemini endpoints) and fully offline (via high-quality localized fallback algorithms) for uninterrupted travel assistance.

---

## 🧭 Key Features & Modules

### 1. Smart Travel Planner
* **Personalized Itineraries**: Instantly creates day-by-day travel plans customized to budgets, durations (fully dynamic), and specific heritage interests.
* **Context-Optimized Schedules**: Adjusts and optimizes itineraries dynamically depending on sweltering or rainy weather patterns, preferred travel modes (auto-rickshaws, metro, private cars), and crowd preferences.
* **Crowd-Density Signals**: Hourly warnings warn travelers about expected crowd patterns, recommending morning exclusive hours or standard flows to minimize long queue lines.

### 2. Multimodal Heritage Explorer
* **Gemini Vision Recognition**: Point your camera or upload a photo of architectural carvings, stone inscriptions, or temple structures. Gemini instantly decodes the heritage landmark.
* **Interactive Storytelling Guides**: Read detailed historical narrations, architectural design reviews, local folk tales, and construction timelines translated instantly into 10+ global languages.
* **Pre-built Living Heritage Library**: Quick links to famous sites like *Madurai Meenakshi Temple*, *Taj Mahal*, *Hampi Ruins*, and *Great Living Chola Temples*.

### 3. Voice Tour Guide (TTS)
* **Prebuilt Auditory Narration**: Generates clear, high-quality audio narration for historical contexts or architectural summaries on-demand.
* **Voice Customization**: Cycle between distinct prebuilt guide personalities (e.g., *Kore*, *Zephyr*, *Puck*, *Charon*, *Fenrir*) to suit your storytelling vibe.

### 4. Local Business & Community Support
* **Eco-tourism and Local Sourcing**: Recommends surrounding handcrafted workshops, local artisan boutiques, traditional restaurants (with must-try local dishes), and live cultural events to support community well-being and local livelihoods.

### 5. AR Scavenger Hunt & Time Travel Puzzle
* **Simulated Physical QR Scans**: Earn experience points (XP) and collect mythical badges (e.g., *Gopuram Master*, *Vimana Seeker*) by simulating physical QR plaque scans.
* **Interactive Time-Travel Puzzle**: Solve spatial jigsaw puzzles reconstructed from authentic monument photographs across historical eras.
* **Seamless Full-Image Completion**: Upon arranging all puzzle tiles correctly, tile partitions automatically dissolve to display a single, full-resolution, unsegmented photograph with completion badges and monument overlays.
* **Authentic Monument Photography**: Integrates dynamic Wikipedia & Wikimedia Commons photograph fetching with rich curated image pairs for global monuments (Taj Mahal, Meenakshi Temple, Qutub Minar, Colosseum, Pyramids, etc.).
* **Multi-Model AI Resilience**: Implements intelligent model fallback switching (`gemini-2.5-flash` → `gemini-2.0-flash` → localized rich datasets) to guarantee uninterrupted learning and quiz generation even under API rate limits.
* **Heritage Certificate**: Accumulate all four master badges to unlock a personalized digital *Certificate of Heritage Intelligence* approved by the simulated Global Heritage Foundation.

### 6. Decision Intelligence Dashboard (Global Architecture)
* **Any Landmark Worldwide**: Dynamic search bar allows tourism departments and city officials to query visitor traffic, crowd density, and structural feedback for *any* architectural monument globally (e.g., *Colosseum*, *Machu Picchu*, *Ajanta Caves*).
* **AI Conservation Advisories**: Auto-generates detailed structural health summaries, environmental wear analysis, and budget distribution recommendations for preservation.

---

## 🛠 Tech Stack & Architecture

```
                Tourist
                   │
          Mobile/Web React App
                   │
      ┌────────────┼─────────────┐
      │            │             │
  Planner AI   Heritage AI   Navigation AI
      │            │             │
      └───────Gemini 3.5─────────┘
              │
      RAG Knowledge Base & Vision APIs
              │
    Decision Analytics Dashboard
```

* **Frontend**: React 19, TypeScript, Tailwind CSS, Motion (Animations), Recharts (Analytical Graphs), Lucide Icons
* **Backend**: Express, Node.js (compiled with Esbuild CJS configuration)
* **AI Engine**: `@google/genai` TypeScript SDK utilizing modern `gemini-3.5-flash` for multimodal reasoning, JSON schemas, dynamic translation, and `gemini-3.1-flash-tts-preview` for high-quality speech.

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18 or later
* A valid `GEMINI_API_KEY` (configured in your environment variables or workspace secrets)

### Installation & Run
1. Install base project dependencies:
   ```bash
   npm install
   ```
2. Start the local development server:
   ```bash
   npm run dev
   ```
3. Open your browser to `http://localhost:3000` to preview the interactive platform.

---

## 🛡 License
This project is licensed under the Apache-2.0 License. See files for details.
