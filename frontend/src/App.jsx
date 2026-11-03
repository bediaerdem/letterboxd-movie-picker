import { useState, useMemo } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { FileUpload } from "./components/FileUpload";
import { FilterPanel } from "./components/FilterPanel";
import { PickMovieButton } from "./components/PickMovieButton";
import { MovieResult } from "./components/MovieResult";
import { LoadingState } from "./components/LoadingState";
import { ErrorMessage } from "./components/ErrorMessage";
import { pickMovieFromWatchlist } from "./services/movieService";
import {
  parseCsvText,
  extractFilterMetadata,
  applyFilters,
  exportMoviesToCsvFile,
} from "./utils/csvParser";
import "./App.css";

const INITIAL_FILTERS = {
  query: "",
  decade: "ALL",
  yearMin: "",
  yearMax: "",
  addedYear: "ALL",
  minRating: "",
};

export default function App() {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const [movie, setMovie] = useState(null);
  const [totalMovies, setTotalMovies] = useState(0);
  const [filteredCountAtPick, setFilteredCountAtPick] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Dynamically compute filtered movies whenever rows or filter values change
  const filteredMovies = useMemo(() => {
    if (!parsedData?.rows) return [];
    return applyFilters(parsedData.rows, filters);
  }, [parsedData, filters]);

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile) {
      setFile(null);
      setParsedData(null);
      setFilters(INITIAL_FILTERS);
      setMovie(null);
      setFilteredCountAtPick(null);
      setError("");
      return;
    }

    try {
      const text = await selectedFile.text();
      const { headers, rows } = parseCsvText(text);

      const requiredColumns = ["Name", "Year", "Letterboxd URI"];
      const missing = requiredColumns.filter((col) => !headers.includes(col));

      if (missing.length > 0) {
        throw new Error(
          "The CSV file must contain Name, Year, and Letterboxd URI columns."
        );
      }

      if (rows.length === 0) {
        throw new Error("No movies were found in the uploaded CSV file.");
      }

      const meta = extractFilterMetadata(headers, rows);
      setParsedData({ headers, rows, meta });
      setFilters(INITIAL_FILTERS);
      setFile(selectedFile);
      setMovie(null);
      setFilteredCountAtPick(null);
      setError("");
    } catch (err) {
      setFile(null);
      setParsedData(null);
      setMovie(null);
      setError(err.message || "Failed to read the CSV file.");
    }
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setError("");
  };

  const handlePickMovie = async () => {
    if (!file || loading) return;

    if (filteredMovies.length === 0) {
      setError(
        "No films match your selected filters. Please adjust or reset them before picking."
      );
      return;
    }

    setLoading(true);
    setError("");
    setMovie(null);

    const isFiltered = filteredMovies.length < (parsedData?.rows?.length || 0);
    const activeFilteredCount = filteredMovies.length;

    try {
      // If filters are applied, create an in-memory CSV with only filtered films
      // and send it to the existing backend endpoint without breaking the API contract.
      let fileToSend = file;
      if (isFiltered) {
        fileToSend = exportMoviesToCsvFile(
          filteredMovies,
          parsedData.headers,
          file.name
        );
      }

      const data = await pickMovieFromWatchlist(fileToSend);

      setMovie(data.movie);
      setTotalMovies(parsedData ? parsedData.rows.length : data.total_movies);
      setFilteredCountAtPick(isFiltered ? activeFilteredCount : null);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const isPickDisabled =
    !file || loading || (parsedData && filteredMovies.length === 0);

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

          {parsedData && (
            <FilterPanel
              meta={parsedData.meta}
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={handleResetFilters}
              totalCount={parsedData.rows.length}
              filteredCount={filteredMovies.length}
            />
          )}

          <div className="picker-action-row">
            <PickMovieButton
              onClick={handlePickMovie}
              disabled={isPickDisabled}
              loading={loading}
            />
          </div>

          <ErrorMessage message={error} onDismiss={() => setError("")} />
        </section>

        {loading && <LoadingState message="Rolling the reel..." />}

        {movie && !loading && (
          <MovieResult
            movie={movie}
            totalMovies={totalMovies}
            filteredCount={filteredCountAtPick}
          />
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
