import json
import re
import spacy
from pathlib import Path

nlp = spacy.load("en_core_web_lg")

with open(Path(__file__).parent.parent / "data" / "skills_taxonomy.json") as f:
    TAXONOMY = json.load(f)
    ALL_SKILLS = [s for group in TAXONOMY.values() for s in group]
    ALL_SKILLS_LOWER = {s.lower(): s for s in ALL_SKILLS}

# Common English words that get wrongly flagged as "skills" by NLP if not filtered
NLP_BLOCKLIST = {
    "team", "project", "company", "work", "role", "job", "experience", "years",
    "skills", "development", "management", "systems", "solutions", "technology",
    "business", "product", "service", "client", "customer", "data", "process",
}


def extract_skills_taxonomy(text: str) -> list[str]:
    """Fast, precise matching against our known skills list."""
    text_lower = text.lower()
    found = set()
    for skill in ALL_SKILLS:
        skill_lower = skill.lower()
        pattern = r"\b" + re.escape(skill_lower) + r"\b"
        if re.search(pattern, text_lower):
            found.add(skill)
    return found


def extract_skills_nlp(text: str, known_skills: set) -> list[str]:
    """
    Backup layer: catches capitalized technical-looking terms (proper nouns,
    acronyms, or Title Case phrases) that aren't in our taxonomy at all —
    e.g. a niche framework or language we haven't listed.
    """
    doc = nlp(text)
    candidates = set()

    for token in doc:
        word = token.text.strip()
        word_lower = word.lower()

        if word_lower in known_skills or word_lower in NLP_BLOCKLIST:
            continue
        if len(word) < 2 or len(word) > 30:
            continue

        # All-caps acronyms (e.g. "AWS", "SQL", "ETL") not already known
        if word.isupper() and word.isalpha() and 2 <= len(word) <= 6:
            candidates.add(word)
            continue

        # CamelCase or dotted tech names (e.g. "Node.js", "TensorFlow")
        if re.match(r"^[A-Z][a-zA-Z]*\.?[a-zA-Z]*$", word) and any(c.isupper() for c in word[1:]):
            candidates.add(word)

    return candidates


def extract_skills(resume_text: str) -> list[str]:
    known = extract_skills_taxonomy(resume_text)
    known_lower = {s.lower() for s in known}

    nlp_found = extract_skills_nlp(resume_text, known_lower)

    all_found = known.union(nlp_found)
    return sorted(all_found)