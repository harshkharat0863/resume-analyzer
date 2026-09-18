import { FileSearch, TrendingUp } from "lucide-react";

const TEAL = "#0F9D77";
const TEAL_BG = "#E7F7F1";
const INK = "#131B2E";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const BG = "#F6F7F9";

const examples = [
  {
    role: "Software Engineer",
    summary: "Results-driven software engineer with 3+ years building scalable web applications. Specializes in Python, React, and cloud infrastructure.",
    highlights: [
      "Reduced API response time by 40% through query optimization and caching",
      "Led migration of legacy monolith to microservices, cutting deployment time by 60%",
      "Mentored 3 junior engineers on code review and testing best practices",
    ],
    skills: ["Python", "React", "AWS", "PostgreSQL", "Docker"],
  },
  {
    role: "Marketing Coordinator",
    summary: "Creative marketing coordinator with a track record of growing engagement through data-driven campaigns across social and email channels.",
    highlights: [
      "Grew Instagram engagement by 85% over 6 months through targeted content strategy",
      "Managed email campaigns generating $120K in attributed revenue",
      "Coordinated cross-functional launch for 3 product releases",
    ],
    skills: ["SEO", "Content Strategy", "Google Analytics", "Email Marketing"],
  },
  {
    role: "Data Analyst",
    summary: "Detail-oriented data analyst turning complex datasets into actionable business insights using SQL, Python, and visualization tools.",
    highlights: [
      "Built automated reporting dashboard saving the team 10 hours/week",
      "Identified pricing inefficiency that recovered $50K in annual revenue",
      "Presented quarterly insights directly to senior leadership",
    ],
    skills: ["SQL", "Python", "Tableau", "Excel", "Statistics"],
  },
];

export default function ResumeExamples() {
  return (
    <div style={{ backgroundColor: BG, fontFamily: "'Inter', sans-serif" }} className="min-h-screen pb-20">
      <div className="text-center py-14 px-5 animate-fade-in-up" style={{ backgroundColor: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: TEAL_BG }}>
          <FileSearch size={22} color={TEAL} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: INK }}>
          Resume Examples
        </h1>
        <p className="text-[15px] max-w-md mx-auto" style={{ color: GRAY }}>
          Real-style examples of strong resume summaries and bullet points, by role.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-5 pt-10 space-y-5">
        {examples.map((ex, i) => (
          <div
            key={ex.role}
            className="hover-lift bg-white rounded-2xl p-6 animate-fade-in-up"
            style={{ border: `1px solid ${BORDER}`, animationDelay: `${i * 80}ms` }}
          >
            <h2 className="text-lg font-bold mb-2" style={{ color: INK, fontFamily: "'Manrope', sans-serif" }}>{ex.role}</h2>
            <p className="text-sm leading-relaxed mb-4 italic" style={{ color: GRAY }}>"{ex.summary}"</p>

            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: TEAL }}>
              <TrendingUp size={13} /> Strong Bullet Points
            </p>
            <ul className="space-y-1.5 mb-4">
              {ex.highlights.map((h) => (
                <li key={h} className="text-sm flex gap-2" style={{ color: INK }}>
                  <span style={{ color: TEAL }}>•</span> {h}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2">
              {ex.skills.map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: BG, color: GRAY, border: `1px solid ${BORDER}` }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}