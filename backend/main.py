from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

from app.parsing import extract_text
from app.extraction import extract_skills
from app.matching import match_skills
from app.suggestions import generate_suggestions
from app.sections import detect_sections
from app.analysis import build_category_checks
from app.routes_auth import router as auth_router
from app.routes_history import router as history_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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