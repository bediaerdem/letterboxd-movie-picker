import { useState } from "react";

/**
 * MoviePoster component displays either the real movie poster (if available)
 * or an editorial, cinematic Letterboxd-styled fallback card.
 *
 * Adheres to OCP (Open/Closed Principle): if posterUrl is supplied later,
 * it will render the real image; otherwise it falls back elegantly.
 *
 * @param {Object} props
 * @param {string} props.title - Movie title
 * @param {string} [props.year] - Movie release year
 * @param {string} [props.posterUrl] - Poster image URL if provided
 */
export function MoviePoster({ title, year, posterUrl }) {
  const [imageError, setImageError] = useState(false);

  const hasRealImage = Boolean(posterUrl) && !imageError;

  return (
    <div className="movie-poster-frame" aria-label={`Poster for ${title}`}>
      {hasRealImage ? (
        <img
          src={posterUrl}
          alt={`${title} (${year || "N/A"}) poster`}
          className="movie-poster-image"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : (
        <div className="movie-poster-fallback">
          <div className="fallback-header">
            <span className="fallback-dots" aria-hidden="true">
              <span className="dot dot-orange" />
              <span className="dot dot-green" />
              <span className="dot dot-blue" />
            </span>
            <span className="fallback-tag">WATCHLIST PICK</span>
          </div>

          <div className="fallback-center">
            <div className="film-reel-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                <line x1="7" y1="2" x2="7" y2="22" />
                <line x1="17" y1="2" x2="17" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="2" y1="7" x2="7" y2="7" />
                <line x1="2" y1="17" x2="7" y2="17" />
                <line x1="17" y1="17" x2="22" y2="17" />
                <line x1="17" y1="7" x2="22" y2="7" />
              </svg>
            </div>
            <p className="fallback-title">{title}</p>
          </div>

          <div className="fallback-footer">
            {year && <span className="fallback-year">{year}</span>}
            <span className="fallback-cinema-badge">FILM</span>
          </div>
        </div>
      )}
    </div>
  );
}

