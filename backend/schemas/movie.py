from typing import Optional
from pydantic import BaseModel, Field


class MovieSchema(BaseModel):
    """Schema representing an individual movie record."""
    name: str = Field(..., description="Title of the movie")
    year: str = Field(default="", description="Release year")
    uri: str = Field(default="", description="Letterboxd URI link")


class PickMovieResponse(BaseModel):
    """API response model for random movie picking."""
    total_movies: int = Field(..., description="Total count of candidate movies")
    movie: MovieSchema = Field(..., description="Randomly selected movie")


class MovieFilter(BaseModel):
    """Optional filter criteria for movie selection."""
    query: Optional[str] = Field(default=None, description="Title search substring")
    decade: Optional[str] = Field(default=None, description="Target decade e.g. 1990 or CLASSIC")
    year_min: Optional[int] = Field(default=None, description="Minimum release year")
    year_max: Optional[int] = Field(default=None, description="Maximum release year")

