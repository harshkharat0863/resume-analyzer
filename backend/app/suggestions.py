def generate_suggestions(resume_text: str, missing_skills: list[str], match_pct: float) -> list[str]:
    suggestions = []

    if missing_skills:
        skills_str = ", ".join(missing_skills)
        suggestions.append(
            f"Consider adding or highlighting experience with: {skills_str}. "
            f"If you have exposure to these, even informally, mention specific projects or tools used."
        )

    if match_pct < 50:
        suggestions.append(
            "Your skill match is below 50%. Review the job description closely and mirror its exact "
            "keywords in your resume (many companies use automated filters that scan for exact terms)."
        )

    word_count = len(resume_text.split())
    if word_count < 150:
        suggestions.append(
            "Your resume seems quite short. Consider adding more detail about your projects, "
            "responsibilities, and measurable achievements."
        )
    elif word_count > 1000:
        suggestions.append(
            "Your resume is quite long. Consider trimming it to 1-2 pages, focusing on your most "
            "relevant and recent experience."
        )

    if not any(char.isdigit() for char in resume_text):
        suggestions.append(
            "Try adding numbers to your achievements (e.g. 'increased efficiency by 20%', "
            "'managed a team of 5') — quantified results stand out more to recruiters."
        )

    action_verbs = ["led", "built", "developed", "managed", "created", "designed", "improved", "launched"]
    text_lower = resume_text.lower()
    if not any(verb in text_lower for verb in action_verbs):
        suggestions.append(
            "Start your bullet points with strong action verbs like 'Led', 'Built', 'Developed', "
            "or 'Improved' instead of passive phrases."
        )

    if not suggestions:
        suggestions.append("Your resume looks solid against this job description — nice work!")

    return suggestions