
import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [movie, setMovie] = useState(null);
  const [totalMovies, setTotalMovies] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePickMovie() {
    if (!file) return;

    setLoading(true);
    setError("");
    setMovie(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/pick-movie",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong.");
      }

      setMovie(data.movie);
      setTotalMovies(data.total_movies);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Could not connect to the server. Please make sure the backend is running."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <header className="header">
        <a className="logo" href="/">
          <span className="logo-icon">▶</span>
          <span>reelpick</span>
        </a>

        <span className="header-note">YOUR NEXT MOVIE NIGHT</span>
      </header>

      <section className="hero">
        <p className="eyebrow">LESS SCROLLING, MORE WATCHING</p>

        <h1>
          What are we
          <br />
          <span>watching tonight?</span>
        </h1>

        <p className="description">
          Leave the decision to us. Upload your Letterboxd watchlist
          and discover your next movie.
        </p>

        <div className="upload-card">
          <div className="upload-icon">↑</div>

          <h2>Bring your watchlist</h2>

          <p className="upload-description">
            Upload the CSV file exported from Letterboxd.
          </p>

          <label className="file-button">
            {file ? "Change file" : "Choose CSV file"}

            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(event) => {
                setFile(event.target.files?.[0] ?? null);
                setMovie(null);
                setError("");
              }}
              hidden
            />
          </label>

          <p className="file-name">
            {file ? file.name : "CSV files only"}
          </p>

          <button
            className="pick-button"
            onClick={handlePickMovie}
            disabled={!file || loading}
          >
            {loading ? "Picking a movie..." : "Pick a movie for me"}
            {!loading && <span>↗</span>}
          </button>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          {movie && (
            <div className="movie-result" aria-live="polite">
              <p className="result-label">YOUR RANDOM PICK</p>

              <h2 className="movie-title">{movie.name}</h2>

              {movie.year && (
                <p className="movie-year">{movie.year}</p>
              )}

              <p className="movie-count">
                Picked from {totalMovies} movies in your watchlist
              </p>

              {movie.uri && (
                <a
                  className="movie-link"
                  href={movie.uri}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on Letterboxd ↗
                </a>
              )}
            </div>
          )}
        </div>

        <p className="privacy-note">
          ◈ Your file is used only to pick a movie.
        </p>
      </section>

      <footer className="footer">
        <span>reelpick</span>
        <span>ONE WATCHLIST. ONE RANDOM PICK.</span>
      </footer>
    </main>
  );
}

export default App;
