import { useState } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { FileUpload } from "./components/FileUpload";
import { PickMovieButton } from "./components/PickMovieButton";
import { MovieResult } from "./components/MovieResult";
import { LoadingState } from "./components/LoadingState";
import { ErrorMessage } from "./components/ErrorMessage";
import { pickMovieFromWatchlist } from "./services/movieService";
import "./App.css";

export default function App() {
  const [file, setFile] = useState(null);
  const [movie, setMovie] = useState(null);
  const [totalMovies, setTotalMovies] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setMovie(null);
    setError("");
  };

  const handlePickMovie = async () => {
    if (!file || loading) return;

    setLoading(true);
    setError("");
    setMovie(null);

    try {
      const data = await pickMovieFromWatchlist(file);
      setMovie(data.movie);
      setTotalMovies(data.total_movies);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Header />

      <main className="main-content">
        <HeroSection />

        <section className="picker-card" aria-label="Movie Picker Controls">
          <FileUpload
            file={file}
            onFileSelect={handleFileSelect}
            disabled={loading}
          />

          <div className="picker-action-row">
            <PickMovieButton
              onClick={handlePickMovie}
              disabled={!file || loading}
              loading={loading}
            />
          </div>

          <ErrorMessage message={error} onDismiss={() => setError("")} />
        </section>

        {loading && <LoadingState message="Rolling the reel..." />}

        {movie && !loading && (
          <MovieResult movie={movie} totalMovies={totalMovies} />
        )}
      </main>

      <footer className="site-footer">
        <p className="footer-brand">
          <span className="footer-dot" aria-hidden="true" />
          Letterboxd Movie Picker
        </p>
        <p className="footer-credit">
          Developed by{" "}
          <a
            href="https://github.com/bediaerdem"
            target="_blank"
            rel="noreferrer noopener"
            className="footer-author-link"
          >
            Bedia Erdem ↗
          </a>
        </p>
        <p className="footer-note">
          Your uploaded watchlist stays private and is only used to pick your next film.
        </p>
      </footer>
    </div>
  );
}
