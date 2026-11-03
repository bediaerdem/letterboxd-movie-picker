import { MoviePoster } from "./MoviePoster";

/**
 * MovieResult component renders the selected movie presentation.
 *
 * @param {Object} props
 * @param {Object} props.movie - Selected movie data
 * @param {string} props.movie.name - Movie title
 * @param {string} [props.movie.year] - Release year
 * @param {string} [props.movie.uri] - Letterboxd URL
 * @param {string} [props.movie.poster_url] - Optional poster image URL
 * @param {number} props.totalMovies - Total movies parsed from watchlist
 * @param {number} [props.filteredCount] - Matching movies if filtered
 */
export function MovieResult({ movie, totalMovies, filteredCount }) {
  if (!movie) return null;

  const hasFilterApplied =
    typeof filteredCount === "number" &&
    filteredCount > 0 &&
    filteredCount < totalMovies;

  return (
    <section className="movie-result-card" aria-live="polite">
      <header className="result-header">
        <p className="result-kicker">Your pick is</p>
      </header>

      <div className="result-body">
        <div className="result-poster-column">
          <MoviePoster
            title={movie.name}
            year={movie.year}
            posterUrl={movie.poster_url}
          />
        </div>

        <div className="result-details-column">
          <div className="title-group">
            <h2 className="movie-title">{movie.name}</h2>
            {movie.year && (
              <span className="movie-year-pill">{movie.year}</span>
            )}
          </div>

          {totalMovies > 0 && (
            <p className="total-movies-caption">
              {hasFilterApplied ? (
                <span>
                  Picked from{" "}
                  <strong className="count-highlight">{filteredCount}</strong>{" "}
                  matching films (out of {totalMovies} in your watchlist)
                </span>
              ) : (
                <span>
                  Picked from{" "}
                  <strong className="count-highlight">{totalMovies}</strong>{" "}
                  movies in your watchlist
                </span>
              )}
            </p>
          )}

          {movie.uri && (
            <div className="result-actions">
              <a
                href={movie.uri}
                target="_blank"
                rel="noreferrer noopener"
                className="letterboxd-link-button"
              >
                <span>View on Letterboxd</span>
                <span className="link-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
