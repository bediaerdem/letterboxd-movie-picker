import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers.movies import router as movies_router

app = FastAPI(
    title="Letterboxd Movie Picker",
    description="A sleek API for picking random movies from Letterboxd watchlists.",
    version="1.0.0",
)

# Preserve CORS settings for the frontend application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(movies_router)


@app.get("/", tags=["health"])
def home():
    """Health check endpoint."""
    return {"message": "Letterboxd Movie Picker is running!"}


if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
