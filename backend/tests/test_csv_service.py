import unittest

from backend.services.csv_service import (
    CSVDecodeError,
    CSVEmptyError,
    CSVMissingColumnsError,
    parse_movies_csv,
)


class TestCSVService(unittest.TestCase):
    """Unit tests for csv_service functions."""

    def test_parse_valid_csv(self):
        sample_csv = (
            b"Date,Name,Year,Letterboxd URI\n"
            b"2023-01-01,Inception,2010,https://boxd.it/1\n"
            b"2023-01-02,Memento,2000,https://boxd.it/2\n"
        )
        movies = parse_movies_csv(sample_csv)
        self.assertEqual(len(movies), 2)
        self.assertEqual(movies[0]["name"], "Inception")
        self.assertEqual(movies[0]["year"], "2010")
        self.assertEqual(movies[0]["uri"], "https://boxd.it/1")
        self.assertEqual(movies[1]["name"], "Memento")

    def test_parse_csv_with_utf8_bom(self):
        sample_csv = (
            "\uFEFFDate,Name,Year,Letterboxd URI\n"
            "2023-01-01,Parasite,2019,https://boxd.it/3\n"
        ).encode("utf-8")
        movies = parse_movies_csv(sample_csv)
        self.assertEqual(len(movies), 1)
        self.assertEqual(movies[0]["name"], "Parasite")

    def test_missing_required_columns(self):
        missing_uri_csv = b"Date,Name,Year\n2023-01-01,Alien,1979\n"
        with self.assertRaises(CSVMissingColumnsError) as ctx:
            parse_movies_csv(missing_uri_csv)
        self.assertIn("Name, Year, and Letterboxd URI", str(ctx.exception))

    def test_empty_csv(self):
        empty_csv = b""
        with self.assertRaises(CSVMissingColumnsError):
            parse_movies_csv(empty_csv)

    def test_csv_with_headers_only(self):
        headers_only = b"Date,Name,Year,Letterboxd URI\n"
        with self.assertRaises(CSVEmptyError) as ctx:
            parse_movies_csv(headers_only)
        self.assertIn("No movies were found", str(ctx.exception))

    def test_decode_error(self):
        # Invalid UTF-8 sequence
        invalid_bytes = b"\x80abc"
        with self.assertRaises(CSVDecodeError):
            parse_movies_csv(invalid_bytes)


if __name__ == "__main__":
    unittest.main()

