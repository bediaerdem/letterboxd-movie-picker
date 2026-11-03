<div align="center">

# Letterboxd Movie Picker

**Pick a movie. Let your watchlist decide.**

A modern, cinematic web application that randomly selects a film from your exported Letterboxd watchlist CSV with a sleek, editorial aesthetic inspired by Letterboxd.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.139-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)

</div>

---

## Features

- **Letterboxd-Inspired Cinematic UI:** Charcoal dark surfaces (`#14181c`, `#1b2228`), subtle film grain ambiance, and signature Letterboxd accent green (`#00e054`).
- **Drag-and-Drop Watchlist Upload:** Easily upload or drop your exported Letterboxd `watchlist.csv` file.
- **Instant Random Selection:** Backend validates and randomly chooses a title while maintaining full film counts and direct Letterboxd links.
- **Fully Responsive & Accessible:** Seamless experience on mobile, tablet, and desktop with keyboard navigation, focus indicators, and `prefers-reduced-motion` support.

---

## Tech Stack

### Frontend
- **Framework:** [React 19](https://react.dev/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Styling:** Vanilla CSS with Design Tokens
- **Linting:** ESLint with React Hooks & Refresh plugins

### Backend
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/)
- **ASGI Server:** [Uvicorn](https://www.uvicorn.org/)
- **Data Parsing:** Python Standard Library `csv`, `io`

---

## Getting Started

### Prerequisites
- **Node.js** (v18 or higher) & **npm**
- **Python** (v3.10 or higher) & **pip**

---

### 1. Clone the Repository
```bash
git clone https://github.com/bediaerdem/letterboxd-movie-picker.git
cd letterboxd-movie-picker
```

---

### 2. Backend Setup
1. Create and activate a Python virtual environment (optional but recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install backend dependencies:
   ```bash
   pip install fastapi uvicorn python-multipart
   ```

3. Start the FastAPI development server:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```

---

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

---

## How to Export Your Letterboxd Watchlist

1. Log into your [Letterboxd](https://letterboxd.com) account.
2. Go to **Settings** → **Data** tab.
3. Click **"Export Your Data"** to download the ZIP file.
4. Extract the ZIP and locate `watchlist.csv`.
5. Upload or drag & drop `watchlist.csv` into the **Letterboxd Movie Picker** and hit **Pick for me**!

---


## Architecture & Principles

- **Single Responsibility (SRP):** Presentation components are decoupled from business logic and data fetching.
- **Dependency Inversion (DIP):** Components communicate with the backend exclusively through `movieService.js`.
- **Open / Closed (OCP):** `MoviePoster` supports real image URLs out of the box while gracefully rendering an editorial SVG/CSS fallback when no URL is supplied.
- **Interface Segregation (ISP):** Components only receive the minimal props they require.

