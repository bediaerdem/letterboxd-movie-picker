/**
 * PickMovieButton component triggers the random movie selection.
 *
 * @param {Object} props
 * @param {() => void} props.onClick - Click handler
 * @param {boolean} [props.disabled=false] - Whether button is disabled
 * @param {boolean} [props.loading=false] - Loading state during API request
 */
export function PickMovieButton({ onClick, disabled = false, loading = false }) {
  return (
    <button
      type="button"
      className={`pick-movie-button ${loading ? "is-loading" : ""}`}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading ? (
        <span className="button-loading-content">
          <span className="spinner" aria-hidden="true" />
          <span>Picking...</span>
        </span>
      ) : (
        <span className="button-idle-content">
          <span className="button-text">Pick for me</span>
          <span className="button-icon" aria-hidden="true">
            🎲
          </span>
        </span>
      )}
    </button>
  );
}

