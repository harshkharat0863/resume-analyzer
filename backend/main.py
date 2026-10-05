from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

from app.parsing import extract_text
from app.extraction import extract_skills
from app.matching import match_skills
from app.suggestions import generate_suggestions
from app.sections import detect_sections
from app.analysis import build_category_checks
from app.routes_auth import router as auth_router
from app.routes_history import router as history_router

app = FastAPI(title="Resume Analyzer API")

# Build allowed origins from environment (comma-separated) + always include localhost for dev
_frontend_url = os.getenv("FRONTEND_URL", "")
_allowed_origins = [o.strip() for o in _frontend_url.split(",") if o.strip()]
_allowed_origins += [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(history_router)


@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    resume_bytes = await resume.read()
    resume_text = extract_text(resume.filename, resume_bytes)

    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(job_description)

    match_result = match_skills(resume_skills, jd_skills)
    suggestions = generate_suggestions(resume_text, match_result["missing"], match_result["match_pct"])
    sections_found = list(detect_sections(resume_text).keys())

    category_checks = build_category_checks(
        resume_text=resume_text,
        filename=resume.filename,
        sections_found=sections_found,
        matched_skills=match_result["matched"],
        missing_skills=match_result["missing"],
    )

    return {
        "resume_skills": resume_skills,
        "required_skills": jd_skills,
        "matched_skills": match_result["matched"],
        "missing_skills": match_result["missing"],
        "match_percentage": match_result["match_pct"],
        "suggestions": suggestions,
        "sections_detected": sections_found,
        "category_checks": category_checks
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)