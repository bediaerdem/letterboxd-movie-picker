/**
 * Robust RFC-4180 compliant CSV parser and filter utility.
 */

/**
 * Parses raw CSV text into an array of objects based on header row.
 * Handles quoted cells with commas, newlines, and UTF-8 BOM.
 *
 * @param {string} csvText - Raw CSV text
 * @returns {{ headers: string[], rows: Record<string, string>[] }}
 */
export function parseCsvText(csvText) {
  // Strip BOM if present
  const cleanText = csvText.replace(/^\uFEFF/, "").trim();
  if (!cleanText) {
    return { headers: [], rows: [] };
  }

  const lines = [];
  let currentLine = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      currentLine.push(currentField.trim());
      currentField = "";
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i++; // skip CRLF
      }
      currentLine.push(currentField.trim());
      if (currentLine.some((field) => field.length > 0)) {
        lines.push(currentLine);
      }
      currentLine = [];
      currentField = "";
    } else {
      currentField += char;
    }
  }

  // Last field/line flush
  if (currentField.length > 0 || currentLine.length > 0) {
    currentLine.push(currentField.trim());
    if (currentLine.some((field) => field.length > 0)) {
      lines.push(currentLine);
    }
  }

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = lines[0].map((h) => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i];
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = (values[j] || "").trim();
    }
    // Only add rows that have at least a Name
    if (row["Name"] || Object.values(row).some((v) => v.length > 0)) {
      rows.push(row);
    }
  }

  return { headers, rows };
}

/**
 * Extracts metadata and available filter ranges from parsed rows and headers.
 *
 * @param {string[]} headers
 * @param {Record<string, string>[]} rows
 */
export function extractFilterMetadata(headers, rows) {
  const headerSet = new Set(headers);
  const hasYear = headerSet.has("Year");
  const hasDate = headerSet.has("Date");
  const hasName = headerSet.has("Name");
  const hasRating = headerSet.has("Rating");

  let minYear = Infinity;
  let maxYear = -Infinity;
  const yearsSet = new Set();
  const addedYearsSet = new Set();
  const ratingsSet = new Set();

  for (const row of rows) {
    if (hasYear && row.Year) {
      const yearNum = parseInt(row.Year, 10);
      if (!isNaN(yearNum) && yearNum > 1850 && yearNum < 2100) {
        minYear = Math.min(minYear, yearNum);
        maxYear = Math.max(maxYear, yearNum);
        yearsSet.add(yearNum);
      }
    }

    if (hasDate && row.Date) {
      // Date format is usually YYYY-MM-DD
      const dateYear = row.Date.slice(0, 4);
      if (/^\d{4}$/.test(dateYear)) {
        addedYearsSet.add(dateYear);
      }
    }

    if (hasRating && row.Rating) {
      const ratingNum = parseFloat(row.Rating);
      if (!isNaN(ratingNum)) {
        ratingsSet.add(ratingNum);
      }
    }
  }

  const validYearRange =
    minYear !== Infinity && maxYear !== -Infinity
      ? { min: minYear, max: maxYear }
      : null;

  // Build decade options based on minYear and maxYear
  const decades = [];
  if (validYearRange) {
    decades.push({ label: "All Eras", value: "ALL" });
    const currentDecade = Math.floor(new Date().getFullYear() / 10) * 10;
    for (let dec = currentDecade; dec >= 1970; dec -= 10) {
      if (dec <= validYearRange.max && dec + 9 >= validYearRange.min) {
        decades.push({ label: `${dec}s`, value: String(dec) });
      }
    }
    if (validYearRange.min < 1970) {
      decades.push({ label: "Classic (< 1970)", value: "CLASSIC" });
    }
  }

  const addedYears = Array.from(addedYearsSet).sort((a, b) => b.localeCompare(a));
  const ratings = Array.from(ratingsSet).sort((a, b) => b - a);

  return {
    hasName,
    hasYear,
    hasDate,
    hasRating,
    yearRange: validYearRange,
    decades,
    addedYears,
    ratings,
    totalMovies: rows.length,
  };
}

/**
 * Filters movies based on the active filter state.
 *
 * @param {Record<string, string>[]} movies
 * @param {Object} filters
 * @param {string} [filters.query] - Search query for movie name
 * @param {string} [filters.decade] - Decade filter value ('ALL', '2020', 'CLASSIC', etc.)
 * @param {string|number} [filters.yearMin] - Minimum year
 * @param {string|number} [filters.yearMax] - Maximum year
 * @param {string} [filters.addedYear] - Filter by Date added year
 * @param {string|number} [filters.minRating] - Minimum rating
 * @returns {Record<string, string>[]}
 */
export function applyFilters(movies, filters) {
  if (!movies || movies.length === 0) return [];

  const query = (filters.query || "").trim().toLowerCase();
  const decade = filters.decade || "ALL";
  const yearMin = filters.yearMin ? parseInt(filters.yearMin, 10) : null;
  const yearMax = filters.yearMax ? parseInt(filters.yearMax, 10) : null;
  const addedYear = filters.addedYear || "ALL";
  const minRating = filters.minRating ? parseFloat(filters.minRating) : null;

  return movies.filter((movie) => {
    // 1. Name query filter
    if (query && !movie.Name?.toLowerCase().includes(query)) {
      return false;
    }

    // 2. Year-based filters
    const yearNum = movie.Year ? parseInt(movie.Year, 10) : null;

    if (yearMin !== null && (!yearNum || yearNum < yearMin)) {
      return false;
    }

    if (yearMax !== null && (!yearNum || yearNum > yearMax)) {
      return false;
    }

    if (decade !== "ALL") {
      if (!yearNum) return false;
      if (decade === "CLASSIC") {
        if (yearNum >= 1970) return false;
      } else {
        const decNum = parseInt(decade, 10);
        if (yearNum < decNum || yearNum > decNum + 9) {
          return false;
        }
      }
    }

    // 3. Date added filter
    if (addedYear !== "ALL") {
      if (!movie.Date || !movie.Date.startsWith(addedYear)) {
        return false;
      }
    }

    // 4. Rating filter
    if (minRating !== null) {
      const ratingNum = movie.Rating ? parseFloat(movie.Rating) : 0;
      if (ratingNum < minRating) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Converts an array of movie objects back into a standard Letterboxd CSV File.
 *
 * @param {Record<string, string>[]} movies
 * @param {string[]} headers
 * @param {string} [filename="filtered_watchlist.csv"]
 * @returns {File}
 */
export function exportMoviesToCsvFile(movies, headers, filename = "filtered_watchlist.csv") {
  const effectiveHeaders =
    headers && headers.length > 0
      ? headers
      : ["Date", "Name", "Year", "Letterboxd URI"];

  const escapeCell = (val) => {
    const str = val == null ? "" : String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerRow = effectiveHeaders.map(escapeCell).join(",");
  const dataRows = movies.map((m) =>
    effectiveHeaders.map((h) => escapeCell(m[h] || "")).join(",")
  );

  const csvContent = [headerRow, ...dataRows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  return new File([blob], filename, { type: "text/csv" });
}

