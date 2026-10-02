import json
import re
from pathlib import Path

import spacy

# We only use spaCy's tokenizer (token.text), so a blank English pipeline is enough.
# This removes the need to download "en_core_web_sm" and fixes OSError [E050].
nlp = spacy.blank("en")

with open(Path(__file__).parent.parent / "data" / "skills_taxonomy.json", encoding="utf-8") as f:
    TAXONOMY = json.load(f)
ALL_SKILLS = [s for group in TAXONOMY.values() for s in group]

# Very short / common-word skills must match with exact capitalisation,
# otherwise "go to market" -> Go and "R&D" -> R.
CASE_SENSITIVE = {s for s in ALL_SKILLS if len(s) <= 2 or s == "Go"}

# \b breaks on skills ending in symbols (C++, C#, F#), so use explicit boundaries.
_BOUNDARY_BEFORE = r"(?<![A-Za-z0-9+#])"
_BOUNDARY_AFTER = r"(?![A-Za-z0-9+#&])"


def _compile(skill: str) -> re.Pattern:
    flags = 0 if skill in CASE_SENSITIVE else re.IGNORECASE
    return re.compile(_BOUNDARY_BEFORE + re.escape(skill) + _BOUNDARY_AFTER, flags)


SKILL_PATTERNS = {skill: _compile(skill) for skill in ALL_SKILLS}

# Words the heuristic layer must never report as "skills".
NLP_BLOCKLIST = {
    "team", "project", "company", "work", "role", "job", "experience", "years",
    "skills", "development", "management", "systems", "solutions", "technology",
    "business", "product", "service", "client", "customer", "data", "process",
    "usa", "uk", "ceo", "cto", "cfo", "eeo", "asap", "gpa", "cv", "hr", "pm", "am",
    "apis", "ok", "faq", "ceo", "vp", "llc", "inc", "ltd",
}


def extract_skills_taxonomy(text: str) -> set[str]:
    """Precise matching against the known skills list."""
    return {skill for skill, pat in SKILL_PATTERNS.items() if pat.search(text)}


def extract_skills_nlp(text: str, known_lower: set[str]) -> set[str]:
    """
    Backup layer for tech names missing from the taxonomy (TensorFlow, PostgreSQL...).
    Only CamelCase tokens are accepted; bare ALL-CAPS words were removed because they
    are mostly names, headings and acronyms (JANE, ACME, USA, ASAP), not skills.
    """
    candidates = set()
    for line in text.splitlines():
        # ALL-CAPS lines are headings or names ("SKILLS", "JANE DOE") -> ignore.
        if not line.strip() or (line.isupper() and len(line) > 1):
            continue
        for token in nlp.make_doc(line):
            word = token.text.strip()
            lower = word.lower()
            if lower in known_lower or lower in NLP_BLOCKLIST or not (2 <= len(word) <= 30):
                continue
            if word.isupper():
                continue
            # CamelCase: starts uppercase and has another uppercase later, plus a lowercase letter
            if re.fullmatch(r"[A-Z][a-zA-Z]*", word) and any(c.isupper() for c in word[1:]) \
                    and any(c.islower() for c in word):
                candidates.add(word)
    return candidates


def extract_skills(text: str) -> list[str]:
    known = extract_skills_taxonomy(text)
    known_lower = {s.lower() for s in known}
    return sorted(known | extract_skills_nlp(text, known_lower))
