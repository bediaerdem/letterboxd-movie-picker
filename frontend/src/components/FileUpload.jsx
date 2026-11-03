import { useState, useRef } from "react";

/**
 * FileUpload component for selecting or dropping a Letterboxd watchlist CSV file.
 *
 * @param {Object} props
 * @param {File|null} props.file - Selected CSV file
 * @param {(file: File|null) => void} props.onFileSelect - File selection callback
 * @param {boolean} [props.disabled=false] - Whether upload interaction is disabled
 */
export function FileUpload({ file, onFileSelect, disabled = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const droppedFile = e.dataTransfer?.files?.[0];
    if (droppedFile && droppedFile.name.toLowerCase().endsWith(".csv")) {
      onFileSelect(droppedFile);
    }
  };

  const handleChange = (e) => {
    const selected = e.target.files?.[0] ?? null;
    if (selected) {
      onFileSelect(selected);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onFileSelect(null);
  };

  return (
    <div
      className={`upload-dropzone ${isDragging ? "is-dragging" : ""} ${
        file ? "has-file" : ""
      } ${disabled ? "is-disabled" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload your Letterboxd watchlist CSV file"
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleChange}
        disabled={disabled}
        className="upload-input-hidden"
        aria-hidden="true"
      />

      <div className="upload-icon-wrapper" aria-hidden="true">
        <svg
          className="upload-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>

      <div className="upload-content">
        <p className="upload-title">Upload your Letterboxd watchlist</p>
        <p className="upload-hint">
          {file
            ? "Click or drop another file to replace"
            : "Drag and drop your watchlist.csv here, or browse"}
        </p>
      </div>

      {file && (
        <div className="selected-file-badge" onClick={(e) => e.stopPropagation()}>
          <span className="file-format-tag">CSV</span>
          <span className="file-name" title={file.name}>
            {file.name}
          </span>
          <button
            type="button"
            className="file-remove-button"
            onClick={handleClear}
            disabled={disabled}
            aria-label="Remove selected file"
            title="Remove file"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

