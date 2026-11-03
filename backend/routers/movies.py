from typing import Optional

from fastapi import APIRouter, File, HTTPException, Query, UploadFile, status

from backend.schemas.movie import MovieFilter, MovieSchema, PickMovieResponse
from backend.services.csv_service import (
    CSVDecodeError,
    CSVEmptyError,
    CSVMissingColumnsError,
    parse_movies_csv,
)
from backend.services.movie_service import (
    NoMoviesMatchingFilterError,
    pick_random_movie,
)

router = APIRouter(tags=["movies"])


@router.post(
    "/pick-movie",
    response_model=PickMovieResponse,
    status_code=status.HTTP_200_OK,
    summary="Pick a random movie from Letterboxd CSV",
)
async def pick_movie(
    file: UploadFile = File(..., description="Letterboxd watchlist CSV file"),
    query: Optional[str] = None,
    decade: Optional[str] = None,
    year_min: Optional[int] = None,
    year_max: Optional[int] = None,
):
    """
    Receives a Letterboxd watchlist CSV, optionally applies filters,
    and returns a randomly selected movie along with total matching count.
    """
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload a CSV file.",
        )

    content = await file.read()

    # 1. Parse and validate CSV data
    try:
        movies = parse_movies_csv(content)
    except CSVDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The CSV file encoding could not be read.",
        ) from exc
    except CSVMissingColumnsError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The CSV file must contain Name, Year, and Letterboxd URI columns.",
        ) from exc
    except CSVEmptyError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No movies were found in the file.",
        ) from exc

    # 2. Construct optional filters
    filters = (
        MovieFilter(
            query=query,
            decade=decade,
            year_min=year_min,
            year_max=year_max,
        )
        if any([query, decade, year_min is not None, year_max is not None])
        else None
    )

    # 3. Apply selection via movie service
    try:
        selected_movie, total_candidates = pick_random_movie(movies, filters)
    except NoMoviesMatchingFilterError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No movies were found matching your criteria.",
        ) from exc

    return PickMovieResponse(
        total_movies=total_candidates,
        movie=MovieSchema(
            name=selected_movie["name"],
            year=selected_movie.get("year", ""),
            uri=selected_movie.get("uri", ""),
        ),
    )
