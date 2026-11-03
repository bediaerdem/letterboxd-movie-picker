import asyncio
import io
import unittest

from fastapi import HTTPException, UploadFile

from backend.main import home
from backend.routers.movies import pick_movie


class TestMoviesAPI(unittest.TestCase):
    """Integration tests for Movies API endpoints."""

    def test_home_endpoint(self):
        result = home()
        self.assertEqual(result, {"message": "Letterboxd Movie Picker is running!"})

    def test_pick_movie_success(self):
        csv_bytes = (
            b"Date,Name,Year,Letterboxd URI\n"
            b"2023-01-01,The Godfather,1972,https://boxd.it/2a\n"
            b"2023-01-02,The Matrix,1999,https://boxd.it/2b\n"
        )
        upload_file = UploadFile(
            filename="watchlist.csv",
            file=io.BytesIO(csv_bytes),
        )

        response = asyncio.run(pick_movie(file=upload_file))

        self.assertEqual(response.total_movies, 2)
        self.assertIn(response.movie.name, ["The Godfather", "The Matrix"])
        self.assertTrue(response.movie.uri.startswith("https://boxd.it/"))

    def test_pick_movie_with_backend_filter(self):
        csv_bytes = (
            b"Date,Name,Year,Letterboxd URI\n"
            b"2023-01-01,The Godfather,1972,https://boxd.it/2a\n"
            b"2023-01-02,The Matrix,1999,https://boxd.it/2b\n"
        )
        upload_file = UploadFile(
            filename="watchlist.csv",
            file=io.BytesIO(csv_bytes),
        )

        response = asyncio.run(
            pick_movie(file=upload_file, query="matrix")
        )

        self.assertEqual(response.total_movies, 1)
        self.assertEqual(response.movie.name, "The Matrix")

    def test_pick_movie_invalid_extension(self):
        upload_file = UploadFile(
            filename="watchlist.txt",
            file=io.BytesIO(b"dummy text"),
        )

        with self.assertRaises(HTTPException) as ctx:
            asyncio.run(pick_movie(file=upload_file))

        self.assertEqual(ctx.exception.status_code, 400)
        self.assertEqual(ctx.exception.detail, "Please upload a CSV file.")

    def test_pick_movie_missing_columns(self):
        upload_file = UploadFile(
            filename="watchlist.csv",
            file=io.BytesIO(b"Name,Year\nMovie 1,2020\n"),
        )

        with self.assertRaises(HTTPException) as ctx:
            asyncio.run(pick_movie(file=upload_file))

        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("Name, Year, and Letterboxd URI", ctx.exception.detail)

    def test_pick_movie_no_matching_filter(self):
        csv_bytes = (
            b"Date,Name,Year,Letterboxd URI\n"
            b"2023-01-01,The Godfather,1972,https://boxd.it/2a\n"
        )
        upload_file = UploadFile(
            filename="watchlist.csv",
            file=io.BytesIO(csv_bytes),
        )

        with self.assertRaises(HTTPException) as ctx:
            asyncio.run(pick_movie(file=upload_file, query="Interstellar"))

        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("No movies were found", ctx.exception.detail)


if __name__ == "__main__":
    unittest.main()

