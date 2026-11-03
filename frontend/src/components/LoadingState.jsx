/**
 * LoadingState component shows a cinematic loader while waiting for backend selection.
 *
 * @param {Object} props
 * @param {string} [props.message="Scanning your watchlist..."] - Optional loader message
 */
export function LoadingState({ message = "Scanning your watchlist..." }) {
  return (
    <div className="loading-state-card" role="status" aria-live="polite">
      <div className="film-scanner" aria-hidden="true">
        <span className="scanner-line" />
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
}

