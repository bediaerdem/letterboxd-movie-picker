import csv
import io
from typing import Any, Dict, List


class CSVError(Exception):
    """Base exception for CSV processing errors."""
    pass


class CSVDecodeError(CSVError):
    """Raised when CSV content cannot be decoded."""
    pass


class CSVMissingColumnsError(CSVError):
    """Raised when required columns are missing in the CSV."""
    pass


class CSVEmptyError(CSVError):
    """Raised when no movies are found in the CSV."""
    pass


REQUIRED_COLUMNS = {"Name", "Year", "Letterboxd URI"}


def parse_movies_csv(content: bytes) -> List[Dict[str, Any]]:
    """
    Parses Letterboxd CSV bytes into a list of movie dictionaries.

    Args:
        content: Raw bytes of the uploaded CSV file.

    Returns:
        List of movie dicts with keys 'name', 'year', 'uri'.

    Raises:
        CSVDecodeError: If decoding fails.
        CSVMissingColumnsError: If required columns are absent.
        CSVEmptyError: If no valid movie rows are present.
    """
    try:
        text = content.decode("utf-8-sig")
    except UnicodeDecodeError as exc:
        raise CSVDecodeError("The CSV file encoding could not be read.") from exc

    try:
        reader = csv.DictReader(io.StringIO(text))
    except Exception as exc:
        raise CSVError("Failed to parse CSV format.") from exc

    if not reader.fieldnames or not REQUIRED_COLUMNS.issubset(set(reader.fieldnames)):
        raise CSVMissingColumnsError(
            "The CSV file must contain Name, Year, and Letterboxd URI columns."
        )

    movies = []

    for row in reader:
        name = (row.get("Name") or "").strip()
        year = (row.get("Year") or "").strip()
        uri = (row.get("Letterboxd URI") or "").strip()
        date = (row.get("Date") or "").strip()
        rating = (row.get("Rating") or "").strip()

        if name:
            movies.append({
                "name": name,
                "year": year,
                "uri": uri,
                "date": date,
                "rating": rating,
            })

    if not movies:
        raise CSVEmptyError("No movies were found in the file.")

    return movies

