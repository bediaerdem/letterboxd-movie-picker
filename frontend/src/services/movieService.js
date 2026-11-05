const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Sends the Letterboxd watchlist CSV to the backend to pick a random movie.
 *
 * @param {File} file - Watchlist CSV file
 * @param {Object} [filters={}] - Backend-supported filters
 * @returns {Promise<{total_movies: number, movie: {name: string, year?: string, uri?: string}}>} 
 */
export async function pickMovieFromWatchlist(file, filters = {}) {
  if (!file) {
    throw new Error("Please select a CSV file first.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const { query, decade, yearMin, yearMax, addedYear, minRating } = filters;

  if (query) formData.append("query", query);
  if (decade && decade !== "ALL") formData.append("decade", decade);
  if (yearMin !== "" && yearMin !== null && yearMin !== undefined) {
    formData.append("year_min", String(yearMin));
  }
  if (yearMax !== "" && yearMax !== null && yearMax !== undefined) {
    formData.append("year_max", String(yearMax));
  }
  if (addedYear && addedYear !== "ALL") formData.append("added_year", addedYear);
  if (minRating !== "" && minRating !== null && minRating !== undefined) {
    formData.append("min_rating", String(minRating));
  }

  try {
    const response = await fetch(`${API_BASE_URL}/pick-movie`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.detail || "Something went wrong while picking a movie.");
    }

    return data;
  } catch (err) {
    if (err.message === "Failed to fetch") {
      throw new Error(
        "Could not connect to the server. Please make sure the backend is running.",
        { cause: err }
      );
    }
    throw err;
  }
}
