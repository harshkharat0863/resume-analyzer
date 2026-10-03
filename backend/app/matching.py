from difflib import SequenceMatcher

def match_skills(resume_skills: list[str], required_skills: list[str], threshold: float = 0.8):
    if not resume_skills or not required_skills:
        return {"matched": [], "missing": required_skills, "match_pct": 0}

    resume_lower = [s.lower() for s in resume_skills]

    matched, missing = [], []
    for req_skill in required_skills:
        req_lower = req_skill.lower()
        
        # Exact match fast path
        if req_lower in resume_lower:
            matched.append(req_skill)
            continue
            
        # Fuzzy match path
        best_score = 0.0
        for res_skill in resume_lower:
            score = SequenceMatcher(None, req_lower, res_skill).ratio()
            if score > best_score:
                best_score = score
                
        if best_score >= threshold:
            matched.append(req_skill)
        else:
            missing.append(req_skill)

    match_pct = round(len(matched) / len(required_skills) * 100, 1) if required_skills else 0
    return {"matched": matched, "missing": missing, "match_pct": match_pct}