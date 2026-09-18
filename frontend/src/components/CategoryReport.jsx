import { useState, useRef } from "react";
import {
  ClipboardCheck, PenLine, Layers, Target, TrendingUp, Flag, ShieldAlert,
  ChevronDown, ChevronUp, CheckCircle2, XCircle, Sparkles,
} from "lucide-react";

const TEAL = "#0F9D77";
const TEAL_BG = "#E7F7F1";
const RED = "#E1493C";
const RED_BG = "#FDECEB";
const AMBER = "#D97706";
const AMBER_BG = "#FEF3C7";
const INK = "#131B2E";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const BG = "#F6F7F9";

const CATEGORY_META = {
  content: {
    title: "Content",
    icon: PenLine,
    intro: "Employers use an Applicant Tracking System (ATS) to scan applications. Strong, specific content increases how much of your resume actually gets read.",
  },
  resume_sections: {
    title: "Sections",
    icon: Layers,
    intro: "We check that your resume includes the essential sections recruiters expect to see before they read further.",
  },
  ats_essentials: {
    title: "ATS Essentials",
    icon: ClipboardCheck,
    intro: "These are the technical basics that determine whether an Applicant Tracking System can read your resume at all.",
  },
  hr_red_flags: {
    title: "HR Red Flags",
    icon: Flag,
    intro: "Recruiters skim resumes in seconds. These checks catch phrasing habits that can make a resume feel unpolished or generic.",
  },
  discrimination: {
    title: "Discrimination",
    icon: ShieldAlert,
    intro: "Some information can unintentionally expose you to bias during screening. It's generally safer to leave it off your resume.",
  },
  seniority_impact: {
    title: "Seniority",
    icon: TrendingUp,
    intro: "We look for language that signals leadership, ownership, and measurable impact in your work history.",
  },
  job_tailoring: {
    title: "Tailoring",
    icon: Target,
    intro: "This checks how well your resume is tailored to the specific job description you provided.",
  },
};

const CHECK_NOTES = {
  "File format is ATS-readable": "PDF and DOCX files are preferred — ATS systems can reliably extract text from them.",
  "Contains a professional email address": "Recruiters need a working email to reach you. Use a format like firstname.lastname@email.com.",
  "Contains a phone number": "A phone number gives recruiters a fast way to reach you for a quick screening call.",
  "Adequate length (150-1000 words)": "Too short and it looks empty; too long and recruiters won't read it all.",
  "Uses quantified achievements (numbers/metrics)": "Numbers make impact concrete — '20% faster' says more than 'faster'.",
  "Uses strong action verbs": "Verbs like 'Led', 'Built', 'Improved' read stronger than passive phrases.",
  "Low repetition of words/phrases": "Repeating the same words makes a resume feel flat. Vary your vocabulary.",
  "No obvious spelling issues detected": "Typos are one of the fastest ways to lose credibility with a recruiter.",
  "Hard skills match the job description": "This measures how many of your listed skills actually overlap with the role.",
  "Most required keywords are present": "ATS systems often filter by keyword — more overlap means fewer auto-rejections.",
  "Missing skills are limited (under 3)": "A handful of small gaps is normal; too many suggests a poor fit for this role.",
  "Shows leadership or ownership language": "Words like 'led' or 'managed' signal you take initiative, not just follow tasks.",
  "Shows measurable impact language": "Impact words like 'increased' or 'reduced' show outcomes, not just responsibilities.",
  "Mentions years of experience": "Stating years of experience helps recruiters quickly gauge your seniority level.",
  "Avoids excessive first-person pronouns": "Resumes read more professionally when 'I' and 'my' are implied, not repeated constantly.",
  "Avoids vague filler phrases": "Phrases like 'responsible for' describe duties, not results — replace them with action verbs and outcomes.",
  "Work history includes clear dates": "Missing or unclear dates can look like you're hiding an employment gap.",
  "No age-revealing information (date of birth)": "Age isn't relevant to your qualifications and can introduce unconscious bias in screening.",
  "No marital status disclosed": "Marital status is personal and not relevant to your ability to do the job.",
  "No gender information disclosed": "Your resume should be judged on skills and experience, not demographic details.",
};

function CheckDetailCard({ check }) {
  const note = CHECK_NOTES[check.label] || "This affects how ATS systems and recruiters evaluate your resume.";
  return (
    <div className="hover-lift bg-white rounded-2xl p-6" style={{ border: `1px solid ${BORDER}` }}>
      <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide mb-3" style={{ color: INK }}>
        {check.label}
      </p>
      <p className="text-sm leading-relaxed mb-4" style={{ color: GRAY }}>{note}</p>

      <div
        className="rounded-xl p-6 flex flex-col items-center text-center"
        style={{ backgroundColor: check.pass ? TEAL_BG : RED_BG }}
      >
        {check.pass ? (
          <CheckCircle2 size={30} color={TEAL} className="mb-2" />
        ) : (
          <XCircle size={30} color={RED} className="mb-2" />
        )}
        <p className="font-bold text-[15px] mb-1" style={{ color: check.pass ? TEAL : RED }}>
          {check.pass ? "Good job!" : "Needs work"}
        </p>
        <p className="text-sm" style={{ color: INK }}>
          {check.pass
            ? `We found no issues with: ${check.label.toLowerCase()}.`
            : `Your resume could be improved here: ${check.label.toLowerCase()}.`}
        </p>
      </div>
    </div>
  );
}

export default function CategoryReport({ categoryChecks }) {
  const [expanded, setExpanded] = useState({ content: true });
  const refs = useRef({});

  if (!categoryChecks) return null;

  const categories = Object.keys(categoryChecks).filter((key) => CATEGORY_META[key]);

  const scrollTo = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      refs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const scorePct = (checks) => {
    if (!checks || checks.length === 0) return 0;
    const passCount = checks.filter((c) => c.pass).length;
    return Math.round((passCount / checks.length) * 100);
  };

  return (
    <div className="grid md:grid-cols-[240px_1fr] gap-6">
      {/* Sidebar */}
      <div className="hidden md:block">
        <div className="hover-lift bg-white rounded-2xl p-4 sticky top-20" style={{ border: `1px solid ${BORDER}` }}>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-2 mb-2" style={{ color: GRAY }}>
            <Sparkles size={13} /> Full Report
          </p>
          {categories.map((key) => {
            const meta = CATEGORY_META[key];
            const checks = categoryChecks[key];
            const pct = scorePct(checks);
            const isOpen = expanded[key];
            return (
              <div key={key} className="mb-1">
                <button
                  onClick={() => { toggle(key); scrollTo(key); }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors hover:bg-gray-50"
                >
                  <span className="flex items-center gap-2 text-sm font-medium" style={{ color: INK }}>
                    <meta.icon size={15} color={TEAL} />
                    {meta.title}
                  </span>
                  <span className="flex items-center gap-1">
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: pct >= 80 ? TEAL_BG : pct >= 50 ? AMBER_BG : RED_BG,
                        color: pct >= 80 ? TEAL : pct >= 50 ? AMBER : RED,
                      }}
                    >
                      {pct}%
                    </span>
                    {isOpen ? <ChevronUp size={14} color={GRAY} /> : <ChevronDown size={14} color={GRAY} />}
                  </span>
                </button>
                {isOpen && (
                  <div className="pl-4 pb-2 space-y-1 animate-fade-in">
                    {checks.map((c) => (
                      <div key={c.label} className="flex items-center gap-2 py-1 text-xs" style={{ color: GRAY }}>
                        {c.pass ? <CheckCircle2 size={12} color={TEAL} /> : <XCircle size={12} color={RED} />}
                        <span className="truncate">{c.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail panels */}
      <div className="space-y-8">
        {categories.map((key) => {
          const meta = CATEGORY_META[key];
          const checks = categoryChecks[key];
          const issueCount = checks.filter((c) => !c.pass).length;
          return (
            <div key={key} ref={(el) => (refs.current[key] = el)} className="scroll-mt-20">
              <div className="flex items-center justify-between mb-3">
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide" style={{ color: INK }}>
                  <meta.icon size={16} color={TEAL} />
                  {meta.title}
                </p>
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: issueCount === 0 ? TEAL_BG : RED_BG,
                    color: issueCount === 0 ? TEAL : RED,
                  }}
                >
                  {issueCount === 0 ? "No issues" : `${issueCount} issue${issueCount > 1 ? "s" : ""} found`}
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: GRAY }}>{meta.intro}</p>
              <div className="space-y-4">
                {checks.map((c) => <CheckDetailCard key={c.label} check={c} />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}