from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")

def match_skills(resume_skills: list[str], required_skills: list[str], threshold: float = 0.65):
    if not resume_skills or not required_skills:
        return {"matched": [], "missing": required_skills, "match_pct": 0}

    resume_emb = model.encode(resume_skills, convert_to_tensor=True)
    required_emb = model.encode(required_skills, convert_to_tensor=True)

    sims = util.cos_sim(required_emb, resume_emb)

    matched, missing = [], []
    for i, skill in enumerate(required_skills):
        best_score = sims[i].max().item()
        if best_score >= threshold:
            matched.append(skill)
        else:
            missing.append(skill)

    match_pct = round(len(matched) / len(required_skills) * 100, 1)
    return {"matched": matched, "missing": missing, "match_pct": match_pct}