import random
from typing import Any, Dict, List, Optional, Tuple

from backend.schemas.movie import MovieFilter


class NoMoviesMatchingFilterError(Exception):
    """Raised when no movies remain after applying filters."""
    pass


def filter_movies(
    movies: List[Dict[str, Any]],
    filters: Optional[MovieFilter] = None,
) -> List[Dict[str, Any]]:
    """
    Filters a list of movies based on the provided filter criteria.

    Args:
        movies: List of movie dictionaries.
        filters: Optional criteria (query, decade, year_min, year_max).

    Returns:
        Filtered list of movie dictionaries.
    """
    if not filters:
        return movies

    filtered = []

    for movie in movies:
        name = movie.get("name", "")
        year_str = movie.get("year", "")
        date = movie.get("date", "")
        rating_str = movie.get("rating", "")

        # 1. Title substring filter
        if filters.query:
            if filters.query.strip().lower() not in name.lower():
                continue

        # 2. Year numeric conversions
        year_num: Optional[int] = None
        if year_str:
            try:
                year_num = int(year_str)
            except ValueError:
                year_num = None

        # 3. Minimum year filter
        if filters.year_min is not None:
            if year_num is None or year_num < filters.year_min:
                continue

        # 4. Maximum year filter
        if filters.year_max is not None:
            if year_num is None or year_num > filters.year_max:
                continue

        # 5. Decade filter
        if filters.decade and filters.decade.upper() != "ALL":
            if year_num is None:
                continue
            if filters.decade.upper() == "CLASSIC":
                if year_num >= 1970:
                    continue
            else:
                try:
                    dec_start = int(filters.decade)
                    if not (dec_start <= year_num <= dec_start + 9):
                        continue
                except ValueError:
                    pass

        # 6. Added year filter
        if filters.added_year:
            if not date or not date.startswith(str(filters.added_year)):
                continue

        # 7. Minimum rating filter
        if filters.min_rating is not None:
            rating_num: Optional[float] = None
            if rating_str:
                try:
                    rating_num = float(rating_str)
                except ValueError:
                    rating_num = None
            if rating_num is None or rating_num < filters.min_rating:
                continue

        filtered.append(movie)

    return filtered


def pick_random_movie(
    movies: List[Dict[str, Any]],
    filters: Optional[MovieFilter] = None,
) -> Tuple[Dict[str, Any], int]:
    """
    Picks a single movie at random from the candidate list (optionally filtered).

    Args:
        movies: List of movie dictionaries.
        filters: Optional filter criteria.

    Returns:
        A tuple of (selected_movie, total_matching_count).

    Raises:
        NoMoviesMatchingFilterError: If no movies remain after filtering.
    """
    candidates = filter_movies(movies, filters)

    if not candidates:
        raise NoMoviesMatchingFilterError("No movies match the specified filter criteria.")

    selected = random.choice(candidates)
    return selected, len(candidates)

