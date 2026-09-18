import re

def check_ats_essentials(resume_text: str, filename: str) -> list[dict]:
    checks = []
    checks.append({
        "label": "File format is ATS-readable",
        "pass": filename.lower().endswith((".pdf", ".docx", ".doc")),
    })
    email_found = bool(re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", resume_text))
    checks.append({"label": "Contains a professional email address", "pass": email_found})
    phone_found = bool(re.search(r"(\+?\d[\d\s-]{8,}\d)", resume_text))
    checks.append({"label": "Contains a phone number", "pass": phone_found})
    word_count = len(resume_text.split())
    checks.append({"label": "Adequate length (150-1000 words)", "pass": 150 <= word_count <= 1000})
    return checks


def check_content(resume_text: str) -> list[dict]:
    checks = []
    has_numbers = bool(re.search(r"\d", resume_text))
    checks.append({"label": "Uses quantified achievements (numbers/metrics)", "pass": has_numbers})

    action_verbs = ["led", "built", "developed", "managed", "created", "designed",
                     "improved", "launched", "implemented", "achieved", "increased", "reduced"]
    text_lower = resume_text.lower()
    verb_count = sum(1 for v in action_verbs if v in text_lower)
    checks.append({"label": "Uses strong action verbs", "pass": verb_count >= 2})

    words = resume_text.split()
    unique_ratio = len(set(w.lower() for w in words)) / max(len(words), 1)
    checks.append({"label": "Low repetition of words/phrases", "pass": unique_ratio > 0.4})

    checks.append({"label": "No obvious spelling issues detected", "pass": True})
    return checks


def check_resume_sections(sections_found: list[str]) -> list[dict]:
    required = ["header", "experience", "education", "skills"]
    return [
        {"label": f"{s.capitalize() if s != 'header' else 'Contact Info'} section present", "pass": s in sections_found}
        for s in required
    ]


def check_job_tailoring(matched_skills: list[str], missing_skills: list[str]) -> list[dict]:
    total = len(matched_skills) + len(missing_skills)
    match_ratio = len(matched_skills) / total if total > 0 else 0
    return [
        {"label": "Hard skills match the job description", "pass": match_ratio >= 0.5},
        {"label": "Most required keywords are present", "pass": match_ratio >= 0.6},
        {"label": "Missing skills are limited (under 3)", "pass": len(missing_skills) < 3},
    ]


def check_seniority_impact(resume_text: str) -> list[dict]:
    text_lower = resume_text.lower()
    leadership_words = ["led", "managed", "mentored", "supervised", "directed", "headed"]
    has_leadership = any(w in text_lower for w in leadership_words)

    impact_words = ["increased", "reduced", "improved", "saved", "grew", "achieved", "delivered"]
    has_impact = any(w in text_lower for w in impact_words)

    years_mentioned = bool(re.search(r"\d+\+?\s*years?", text_lower))

    return [
        {"label": "Shows leadership or ownership language", "pass": has_leadership},
        {"label": "Shows measurable impact language", "pass": has_impact},
        {"label": "Mentions years of experience", "pass": years_mentioned},
    ]


def check_hr_red_flags(resume_text: str) -> list[dict]:
    text_lower = resume_text.lower()

    first_person_count = len(re.findall(r"\b(i|my|me)\b", text_lower))
    checks = [{"label": "Avoids excessive first-person pronouns", "pass": first_person_count < 8}]

    filler_phrases = ["responsible for", "duties included", "worked on", "helped with"]
    has_filler = any(phrase in text_lower for phrase in filler_phrases)
    checks.append({"label": "Avoids vague filler phrases", "pass": not has_filler})

    has_dates = bool(re.search(r"\b(19|20)\d{2}\b", resume_text))
    checks.append({"label": "Work history includes clear dates", "pass": has_dates})

    return checks


def check_discrimination(resume_text: str) -> list[dict]:
    text_lower = resume_text.lower()

    has_dob = bool(re.search(r"\b(date of birth|d\.?o\.?b\.?)\b", text_lower))
    checks = [{"label": "No age-revealing information (date of birth)", "pass": not has_dob}]

    marital_words = ["marital status", "married", "single", "divorced"]
    has_marital = any(w in text_lower for w in marital_words)
    checks.append({"label": "No marital status disclosed", "pass": not has_marital})

    gender_words = ["gender:", "sex:", "male,", "female,"]
    has_gender = any(w in text_lower for w in gender_words)
    checks.append({"label": "No gender information disclosed", "pass": not has_gender})

    return checks


def build_category_checks(resume_text, filename, sections_found, matched_skills, missing_skills) -> dict:
    return {
        "content": check_content(resume_text),
        "resume_sections": check_resume_sections(sections_found),
        "ats_essentials": check_ats_essentials(resume_text, filename),
        "hr_red_flags": check_hr_red_flags(resume_text),
        "discrimination": check_discrimination(resume_text),
        "seniority_impact": check_seniority_impact(resume_text),
        "job_tailoring": check_job_tailoring(matched_skills, missing_skills),
    }