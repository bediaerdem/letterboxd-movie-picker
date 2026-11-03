
import csv
import io
import random

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Letterboxd Movie Picker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Letterboxd Movie Picker is running!"}


@app.post("/pick-movie")
async def pick_movie(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Lütfen bir CSV dosyası yükleyin.",
        )

    content = await file.read()

    try:
        text = content.decode("utf-8-sig")
        reader = csv.DictReader(io.StringIO(text))

        required_columns = {"Name", "Year", "Letterboxd URI"}

        if not reader.fieldnames or not required_columns.issubset(
            set(reader.fieldnames)
        ):
            raise HTTPException(
                status_code=400,
                detail="CSV dosyasında Name, Year ve Letterboxd URI sütunları bulunmalı.",
            )

        movies = []

        for row in reader:
            name = (row.get("Name") or "").strip()
            year = (row.get("Year") or "").strip()
            uri = (row.get("Letterboxd URI") or "").strip()

            if name:
                movies.append({
                    "name": name,
                    "year": year,
                    "uri": uri,
                })

    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="CSV dosyasının karakter kodlaması okunamadı.",
        )

    if not movies:
        raise HTTPException(
            status_code=400,
            detail="Dosyada seçilebilecek film bulunamadı.",
        )

    selected_movie = random.choice(movies)

    return {
        "total_movies": len(movies),
        "movie": selected_movie,
    }
