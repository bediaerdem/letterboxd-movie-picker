<div align="center">

# 🎬 Letterboxd Movie Picker

**Pick a movie. Let your watchlist decide.**

A modern, cinematic web application that randomly selects a film from your exported Letterboxd watchlist CSV with a sleek, editorial aesthetic inspired by Letterboxd.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.139-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## ✨ Features

- **Letterboxd-Inspired Cinematic UI:** Charcoal dark surfaces (`#14181c`, `#1b2228`), subtle film grain ambiance, and signature Letterboxd accent green (`#00e054`).
- **Drag-and-Drop Watchlist Upload:** Easily upload or drop your exported Letterboxd `watchlist.csv` file.
- **Instant Random Selection:** Backend validates and randomly chooses a title while maintaining full film counts and direct Letterboxd links.
- **Editorial Poster Fallback:** Displays a 2:3 cinematic typographic poster card featuring film reels and Letterboxd brand marks when real poster URLs are unavailable.
- **SOLID & Component-Driven Architecture:** Clean, decoupled React components built around Single Responsibility and Dependency Inversion principles.
- **Fully Responsive & Accessible:** Seamless experience on mobile, tablet, and desktop with keyboard navigation, focus indicators, and `prefers-reduced-motion` support.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [React 19](https://react.dev/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Styling:** Vanilla CSS with Design Tokens (`index.css` & `App.css`)
- **Linting:** ESLint with React Hooks & Refresh plugins

### Backend
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/)
- **ASGI Server:** [Uvicorn](https://www.uvicorn.org/)
- **Data Parsing:** Python Standard Library `csv`, `io`

---

## 🚀 Getting Started

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
   *The backend will be live at `http://127.0.0.1:8000`.*

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
   *The frontend will run at `http://localhost:5173`.*

---

## 📖 How to Export Your Letterboxd Watchlist

1. Log into your [Letterboxd](https://letterboxd.com) account.
2. Go to **Settings** → **Data** tab.
3. Click **"Export Your Data"** to download the ZIP file.
4. Extract the ZIP and locate `watchlist.csv`.
5. Upload or drag & drop `watchlist.csv` into the **Letterboxd Movie Picker** and hit **Pick for me**!

---

## 📂 Project Structure

```text
letterboxd-movie-picker/
├── backend/
│   └── main.py                     # FastAPI application & CSV parser
├── data/
│   └── watchlist.csv               # Sample Letterboxd watchlist for testing
├── frontend/
│   ├── public/
│   │   └── favicon.svg             # Application favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx          # Header with Letterboxd triad dots
│   │   │   ├── HeroSection.jsx     # "Pick a movie. Let your watchlist decide."
│   │   │   ├── FileUpload.jsx      # Drag-and-drop CSV uploader
│   │   │   ├── PickMovieButton.jsx # Interactive action button with loading states
│   │   │   ├── MovieResult.jsx     # "Your pick is" presentation card
│   │   │   ├── MoviePoster.jsx     # 2:3 cinematic poster & fallback card
│   │   │   ├── LoadingState.jsx    # Cinematic scanner loading animation
│   │   │   └── ErrorMessage.jsx    # Accessible error alert banner
│   │   ├── services/
│   │   │   └── movieService.js     # API service layer (DIP)
│   │   ├── App.jsx                 # Main state coordinator
│   │   ├── App.css                 # Component & layout styles
│   │   ├── index.css               # Design tokens & global resets
│   │   └── main.jsx                # React root entry
│   ├── index.html                  # HTML template
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🏛️ Architecture & Principles

- **Single Responsibility (SRP):** Presentation components are decoupled from business logic and data fetching.
- **Dependency Inversion (DIP):** Components communicate with the backend exclusively through `movieService.js`.
- **Open / Closed (OCP):** `MoviePoster` supports real image URLs out of the box while gracefully rendering an editorial SVG/CSS fallback when no URL is supplied.
- **Interface Segregation (ISP):** Components only receive the minimal props they require.

---

## 👤 Author

Developed with care by **Bedia Erdem**  
- GitHub: [@bediaerdem](https://github.com/bediaerdem)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

