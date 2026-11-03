/**
 * ErrorMessage component renders accessible error banners.
 *
 * @param {Object} props
 * @param {string} props.message - Error message to display
 * @param {() => void} [props.onDismiss] - Optional dismiss handler
 */
export function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="error-banner" role="alert">
      <span className="error-icon" aria-hidden="true">
        ⚠️
      </span>
      <p className="error-text">{message}</p>
      {onDismiss && (
        <button
          type="button"
          className="error-dismiss-button"
          onClick={onDismiss}
          aria-label="Dismiss error message"
        >
          ✕
        </button>
      )}
    </div>
  );
}

