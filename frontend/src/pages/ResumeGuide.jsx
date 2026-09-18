import { BookOpen } from "lucide-react";

const TEAL = "#0F9D77";
const TEAL_BG = "#E7F7F1";
const INK = "#131B2E";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const BG = "#F6F7F9";

const sections = [
  {
    id: "write",
    title: "How to write a resume",
    content: "Start with your contact info and a short summary, then list your experience in reverse-chronological order (most recent first). For each role, use 2-4 bullet points that focus on measurable outcomes rather than just duties — 'Increased conversion by 15%' says more than 'Responsible for marketing.' Keep formatting consistent throughout, and always tailor your resume to the specific job you're applying for.",
  },
  {
    id: "format",
    title: "Choosing a resume format",
    content: "Reverse-chronological (most common) works best if you have a steady work history — it lists jobs from most recent to oldest. Functional format groups skills instead of jobs, useful for career changers or gaps in employment, but many ATS systems and recruiters prefer chronological. Combination format blends both, listing key skills up top followed by a chronological work history — a good middle ground for most people.",
  },
  {
    id: "summary",
    title: "Writing a resume summary",
    content: "A resume summary is 2-3 sentences at the top of your resume, right under your name and title. Structure it as: who you are professionally, your key strength or specialty, and what you're looking to do next. Avoid generic phrases like 'hardworking team player' — instead, be specific: mention years of experience, a notable skill, or a measurable achievement. Skip this section only if you're an entry-level candidate with limited experience.",
  },
  {
    id: "onepage",
    title: "Fit your experience on one page",
    content: "Recruiters spend seconds scanning a resume, so brevity matters — aim for one page if you have under 10 years of experience. Cut older or less relevant roles, trim bullet points to the most impactful ones (2-3 per role, not 6), remove an 'Objective' section (summaries are more effective), and tighten margins/font size slightly rather than adding a second page. If you truly have extensive relevant experience, two pages is acceptable — but never more.",
  },
];

export default function ResumeGuide() {
  return (
    <div style={{ backgroundColor: BG, fontFamily: "'Inter', sans-serif" }} className="min-h-screen pb-20">
      <div className="text-center py-14 px-5 animate-fade-in-up" style={{ backgroundColor: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: TEAL_BG }}>
          <BookOpen size={22} color={TEAL} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: INK }}>
          Resume Writing Guide
        </h1>
        <p className="text-[15px] max-w-md mx-auto" style={{ color: GRAY }}>
          The essentials of writing a resume that actually gets read.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-10 space-y-5">
        {sections.map((s, i) => (
          <div
            key={s.id}
            id={s.id}
            className="hover-lift bg-white rounded-2xl p-6 animate-fade-in-up scroll-mt-20"
            style={{ border: `1px solid ${BORDER}`, animationDelay: `${i * 60}ms` }}
          >
            <h2 className="text-lg font-bold mb-3" style={{ color: INK, fontFamily: "'Manrope', sans-serif" }}>{s.title}</h2>
            <p className="text-sm leading-relaxed" style={{ color: GRAY }}>{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}