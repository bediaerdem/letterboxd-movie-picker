/**
 * FilterPanel component renders dynamic filter controls based on detected CSV columns.
 *
 * @param {Object} props
 * @param {Object} props.meta - Extracted metadata from CSV
 * @param {Object} props.filters - Current filter values
 * @param {(filters: Object) => void} props.onFilterChange - Callback when filters change
 * @param {() => void} props.onResetFilters - Callback to clear all active filters
 * @param {number} props.totalCount - Total movies parsed from CSV
 * @param {number} props.filteredCount - Movies matching current filters
 */
export function FilterPanel({
  meta,
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
  filteredCount,
}) {
  if (!meta || totalCount === 0) return null;

  const isFiltered =
    Boolean(filters.query) ||
    filters.decade !== "ALL" ||
    Boolean(filters.yearMin) ||
    Boolean(filters.yearMax) ||
    filters.addedYear !== "ALL" ||
    Boolean(filters.minRating);

  const handleQueryChange = (e) => {
    onFilterChange({ ...filters, query: e.target.value });
  };

  const handleDecadeSelect = (decadeValue) => {
    onFilterChange({ ...filters, decade: decadeValue });
  };

  const handleYearMinChange = (e) => {
    onFilterChange({ ...filters, yearMin: e.target.value });
  };

  const handleYearMaxChange = (e) => {
    onFilterChange({ ...filters, yearMax: e.target.value });
  };

  const handleAddedYearChange = (e) => {
    onFilterChange({ ...filters, addedYear: e.target.value });
  };

  const handleRatingChange = (e) => {
    onFilterChange({ ...filters, minRating: e.target.value });
  };

  return (
    <section className="filter-panel" aria-label="Watchlist Filters">
      <header className="filter-panel-header">
        <div className="filter-title-group">
          <span className="filter-badge">FILTERS</span>
          <p className="filter-count-label">
            {filteredCount === totalCount ? (
              <span>
                All <strong className="count-num">{totalCount}</strong> films match
              </span>
            ) : (
              <span>
                <strong className="count-num">{filteredCount}</strong> of{" "}
                {totalCount} films match
              </span>
            )}
          </p>
        </div>

        {isFiltered && (
          <button
            type="button"
            className="filter-reset-button"
            onClick={onResetFilters}
            aria-label="Reset all filters"
          >
            Reset all
          </button>
        )}
      </header>

      <div className="filter-grid">
        {/* 1. Name Search Filter (Only if Name column exists) */}
        {meta.hasName && (
          <div className="filter-group filter-group-search">
            <label htmlFor="filter-search-input" className="filter-label">
              Search by title
            </label>
            <div className="search-input-wrapper">
              <span className="search-icon" aria-hidden="true">
                🔍
              </span>
              <input
                id="filter-search-input"
                type="text"
                className="filter-input filter-search-input"
                placeholder="Type film name..."
                value={filters.query || ""}
                onChange={handleQueryChange}
                autoComplete="off"
              />
              {filters.query && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => onFilterChange({ ...filters, query: "" })}
                  aria-label="Clear title search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* 2. Release Year / Decade Filter (Only if Year column exists) */}
        {meta.hasYear && meta.decades?.length > 1 && (
          <div className="filter-group filter-group-decade">
            <label className="filter-label">Release era</label>
            <div className="decade-pill-group" role="radiogroup" aria-label="Release decade">
              {meta.decades.map((d) => {
                const isSelected = (filters.decade || "ALL") === d.value;
                return (
                  <button
                    key={d.value}
                    type="button"
                    className={`decade-pill ${isSelected ? "is-selected" : ""}`}
                    onClick={() => handleDecadeSelect(d.value)}
                    role="radio"
                    aria-checked={isSelected}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Custom Year Range (Only if Year column exists) */}
        {meta.hasYear && meta.yearRange && (
          <div className="filter-group filter-group-year-range">
            <label className="filter-label">
              Year range ({meta.yearRange.min} – {meta.yearRange.max})
            </label>
            <div className="year-range-inputs">
              <input
                type="number"
                className="filter-input year-input"
                placeholder={String(meta.yearRange.min)}
                min={meta.yearRange.min}
                max={meta.yearRange.max}
                value={filters.yearMin || ""}
                onChange={handleYearMinChange}
                aria-label="Minimum release year"
              />
              <span className="range-separator" aria-hidden="true">
                –
              </span>
              <input
                type="number"
                className="filter-input year-input"
                placeholder={String(meta.yearRange.max)}
                min={meta.yearRange.min}
                max={meta.yearRange.max}
                value={filters.yearMax || ""}
                onChange={handleYearMaxChange}
                aria-label="Maximum release year"
              />
            </div>
          </div>
        )}

        {/* 4. Date Added Filter (Only if Date column exists and has years) */}
        {meta.hasDate && meta.addedYears?.length > 1 && (
          <div className="filter-group filter-group-date">
            <label htmlFor="filter-added-year" className="filter-label">
              Year added to watchlist
            </label>
            <select
              id="filter-added-year"
              className="filter-select"
              value={filters.addedYear || "ALL"}
              onChange={handleAddedYearChange}
            >
              <option value="ALL">Any time</option>
              {meta.addedYears.map((yr) => (
                <option key={yr} value={yr}>
                  Added in {yr}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 5. Rating Filter (Dynamically shown ONLY if CSV contains Rating) */}
        {meta.hasRating && meta.ratings?.length > 0 && (
          <div className="filter-group filter-group-rating">
            <label htmlFor="filter-rating-select" className="filter-label">
              Minimum rating
            </label>
            <select
              id="filter-rating-select"
              className="filter-select"
              value={filters.minRating || ""}
              onChange={handleRatingChange}
            >
              <option value="">Any rating</option>
              <option value="4.5">★★★★½ & up (4.5+)</option>
              <option value="4.0">★★★★ & up (4.0+)</option>
              <option value="3.5">★★★½ & up (3.5+)</option>
              <option value="3.0">★★★ & up (3.0+)</option>
            </select>
          </div>
        )}
      </div>

      {/* Zero match empty state */}
      {filteredCount === 0 && (
        <div className="zero-match-banner" role="status">
          <p className="zero-match-text">
            No films match your selected filters.
          </p>
          <button
            type="button"
            className="zero-match-reset-btn"
            onClick={onResetFilters}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}

