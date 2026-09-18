import re

SECTION_HEADERS = {
    "summary": ["summary", "objective", "profile", "about me"],
    "experience": ["experience", "work experience", "professional experience", "employment history", "work history"],
    "education": ["education", "academic background", "academic qualifications"],
    "skills": ["skills", "technical skills", "core competencies", "key skills"],
    "projects": ["projects", "personal projects", "academic projects"],
    "certifications": ["certifications", "certificates", "licenses", "licenses & certifications"],
}

def detect_sections(text: str) -> dict:
    """
    Splits resume text into sections based on common headers.
    Returns a dict like {"experience": "...text...", "education": "...text..."}
    """
    lines = text.split("\n")
    sections = {"header": []}
    current_section = "header"

    for line in lines:
        stripped = line.strip()
        lower = stripped.lower().rstrip(":").strip()

        matched = None
        if 0 < len(lower) < 40:
            for section_name, keywords in SECTION_HEADERS.items():
                if lower in keywords:
                    matched = section_name
                    break

        if matched:
            current_section = matched
            sections[current_section] = []
        else:
            sections.setdefault(current_section, []).append(line)

    # Join lines back into text, drop empty sections
    result = {}
    for name, lines_list in sections.items():
        joined = "\n".join(lines_list).strip()
        if joined:
            result[name] = joined

    return result