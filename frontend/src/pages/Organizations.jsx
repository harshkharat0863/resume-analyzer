import { useNavigate } from "react-router-dom";
import { Users, GraduationCap, Users2, ArrowRight } from "lucide-react";

const TEAL = "#0F9D77";
const TEAL_BG = "#E7F7F1";
const INK = "#131B2E";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const BG = "#F6F7F9";

const useCases = [
  {
    id: "recruitment",
    icon: Users,
    title: "Recruitment",
    tagline: "On-brand resumes that land interviews",
    desc: "Help candidates put their best foot forward before they even reach the interview stage. Recruiters using ResumeCheck can guide applicants toward stronger, more targeted resumes — improving match quality and reducing back-and-forth before submission.",
    benefits: [
      "Screen candidate resumes for skill alignment automatically",
      "Give applicants instant, actionable feedback",
      "Reduce time spent on resumes that won't pass ATS filters",
    ],
    cta: "Try the Resume Checker",
    ctaLink: "/",
  },
  {
    id: "education",
    icon: GraduationCap,
    title: "Higher Education",
    tagline: "Support more students at scale",
    desc: "Career centers can't review every student's resume one-on-one. ResumeCheck gives students instant, consistent feedback so career advisors can focus their time on students who need deeper, personalized guidance.",
    benefits: [
      "Give every student instant resume feedback, 24/7",
      "Free up advisor time for higher-value coaching",
      "Help students build their first resume with the AI Builder",
    ],
    cta: "Try the Resume Builder",
    ctaLink: "/resume-builder",
  },
  {
    id: "coaches",
    icon: Users2,
    title: "Career Coaches",
    tagline: "Deliver ATS-friendly resumes faster",
    desc: "Speed up your coaching sessions by starting from data instead of guesswork. Run a client's resume through the checker before your session so you can spend your time on strategy, not just formatting fixes.",
    benefits: [
      "Walk into sessions with a clear list of gaps to address",
      "Show clients exactly what's missing vs. a specific job",
      "Use the Cover Letter Generator to speed up client deliverables",
    ],
    cta: "Try the Cover Letter Generator",
    ctaLink: "/cover-letter",
  },
];

export default function Organizations() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: BG, fontFamily: "'Inter', sans-serif" }} className="min-h-screen pb-20">
      <div className="text-center py-14 px-5 animate-fade-in-up" style={{ backgroundColor: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-5 tracking-wide" style={{ backgroundColor: TEAL_BG, color: TEAL }}>
          FOR ORGANIZATIONS
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: INK }}>
          Built for teams, not just individuals
        </h1>
        <p className="text-[15px] max-w-md mx-auto" style={{ color: GRAY }}>
          Whether you're hiring, teaching, or coaching — ResumeCheck scales with you.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-5 pt-10 space-y-6">
        {useCases.map((u, i) => (
          <div
            key={u.id}
            id={u.id}
            className="hover-lift bg-white rounded-2xl p-7 animate-fade-in-up scroll-mt-20"
            style={{ border: `1px solid ${BORDER}`, animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: TEAL_BG }}>
                <u.icon size={22} color={TEAL} />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: INK, fontFamily: "'Manrope', sans-serif" }}>{u.title}</h2>
                <p className="text-sm font-medium" style={{ color: TEAL }}>{u.tagline}</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-4" style={{ color: GRAY }}>{u.desc}</p>

            <ul className="space-y-1.5 mb-5">
              {u.benefits.map((b) => (
                <li key={b} className="text-sm flex gap-2" style={{ color: INK }}>
                  <span style={{ color: TEAL }}>✓</span> {b}
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate(u.ctaLink)}
              className="hover-lift inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-xl text-white"
              style={{ backgroundColor: TEAL }}
            >
              {u.cta}
              <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}