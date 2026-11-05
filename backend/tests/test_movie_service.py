import unittest

from backend.schemas.movie import MovieFilter
from backend.services.movie_service import (
    NoMoviesMatchingFilterError,
    filter_movies,
    pick_random_movie,
)


class TestMovieService(unittest.TestCase):
    """Unit tests for movie_service filtering and selection."""

    def setUp(self):
        self.sample_movies = [
            {"name": "Modern Times", "year": "1936", "uri": "https://boxd.it/1"},
            {"name": "The Godfather", "year": "1972", "uri": "https://boxd.it/2"},
            {"name": "Scarface", "year": "1983", "uri": "https://boxd.it/3"},
            {"name": "Pulp Fiction", "year": "1994", "uri": "https://boxd.it/4"},
            {"name": "The Matrix", "year": "1999", "uri": "https://boxd.it/5"},
            {"name": "Memento", "year": "2000", "uri": "https://boxd.it/6"},
            {"name": "Inception", "year": "2010", "uri": "https://boxd.it/7"},
            {"name": "Dune", "year": "2021", "uri": "https://boxd.it/8"},
        ]

    def test_pick_random_movie_unfiltered(self):
        selected, total = pick_random_movie(self.sample_movies)
        self.assertEqual(total, 8)
        self.assertIn(selected, self.sample_movies)

    def test_filter_by_query(self):
        filtered = filter_movies(self.sample_movies, MovieFilter(query="the"))
        titles = [m["name"] for m in filtered]
        self.assertEqual(len(filtered), 2)
        self.assertIn("The Godfather", titles)
        self.assertIn("The Matrix", titles)

    def test_filter_by_decade(self):
        # 1990s
        filtered_90s = filter_movies(self.sample_movies, MovieFilter(decade="1990"))
        titles_90s = [m["name"] for m in filtered_90s]
        self.assertEqual(len(filtered_90s), 2)
        self.assertIn("Pulp Fiction", titles_90s)
        self.assertIn("The Matrix", titles_90s)

        # Classic (<1970)
        filtered_classic = filter_movies(self.sample_movies, MovieFilter(decade="CLASSIC"))
        self.assertEqual(len(filtered_classic), 1)
        self.assertEqual(filtered_classic[0]["name"], "Modern Times")

    def test_filter_by_year_range(self):
        filtered_range = filter_movies(
            self.sample_movies,
            MovieFilter(year_min=1980, year_max=1995),
        )
        titles = [m["name"] for m in filtered_range]
        self.assertEqual(len(filtered_range), 2)
        self.assertIn("Scarface", titles)
        self.assertIn("Pulp Fiction", titles)

    def test_combined_filters(self):
        filtered = filter_movies(
            self.sample_movies,
            MovieFilter(query="matrix", decade="1990", year_min=1995),
        )
        self.assertEqual(len(filtered), 1)
        self.assertEqual(filtered[0]["name"], "The Matrix")

    def test_zero_match_raises_error(self):
        with self.assertRaises(NoMoviesMatchingFilterError):
            pick_random_movie(
                self.sample_movies,
                MovieFilter(query="NonExistentMovieTitle123"),
            )


if __name__ == "__main__":
    unittest.main()

