import { useNavigate } from "react-router-dom";
import {
  FileText, Search, Brain, BarChart3, Lightbulb, FileOutput, ArrowRight,
} from "lucide-react";

const TEAL = "#0F9D77";
const TEAL_BG = "#E7F7F1";
const INK = "#131B2E";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const BG = "#F6F7F9";

const steps = [
  {
    icon: FileText,
    title: "Text Extraction",
    desc: "We read your PDF or DOCX file and extract all the raw text from every page, cleaning up formatting so we can analyze the actual content.",
    tech: "pdfplumber · python-docx",
  },
  {
    icon: Search,
    title: "Skill Detection",
    desc: "We scan your resume text against a curated database of 100+ professional skills across programming, data, cloud, web, design, and soft skills.",
    tech: "spaCy · keyword matching",
  },
  {
    icon: Brain,
    title: "Semantic Matching",
    desc: "We convert every skill into a meaning fingerprint (embedding) so similar skills match even if phrased differently — 'ML' matches 'Machine Learning'.",
    tech: "sentence-transformers · cosine similarity",
  },
  {
    icon: BarChart3,
    title: "Gap Analysis",
    desc: "We compare your resume skills against the skills required by the job description and calculate your match percentage and missing skills.",
    tech: "scikit-learn · custom scoring",
  },
  {
    icon: Lightbulb,
    title: "Suggestions",
    desc: "Based on your gaps, resume length, use of action verbs, and quantified achievements, we generate specific actionable improvement tips.",
    tech: "rule-based NLP engine",
  },
  {
    icon: FileOutput,
    title: "Report Generation",
    desc: "All results are compiled into a clean report you can download as a PDF and refer to while editing your resume.",
    tech: "jsPDF · FastAPI",
  },
];

const faqs = [
  { q: "Is my resume data stored anywhere?", a: "No. Your resume is processed in memory and immediately discarded after analysis. We never save, store, or share your data." },
  { q: "What file types are supported?", a: "We support PDF (.pdf) and Word documents (.docx, .doc). For best results, use a single-column PDF without tables or complex formatting." },
  { q: "How accurate is the skill matching?", a: "We use semantic (meaning-based) matching, not just keyword search, so similar phrases match correctly. Accuracy depends on how detailed your resume and job description are." },
  { q: "Do I need to sign up or pay anything?", a: "No. The tool is completely free and requires no account or sign-up." },
  { q: "What is an ATS?", a: "ATS stands for Applicant Tracking System — software most companies use to automatically filter resumes before a human sees them. Our checker flags common issues that cause resumes to be rejected by ATS." },
];

const techStack = [
  "FastAPI", "spaCy", "sentence-transformers", "pdfplumber",
  "React", "Vite", "Tailwind CSS", "Python 3.10+",
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: BG, fontFamily: "'Inter', sans-serif" }}>
      {/* Hero */}
      <div className="py-16 text-center animate-fade-in-up" style={{ backgroundColor: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-2xl mx-auto px-5">
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-5 tracking-wide" style={{ backgroundColor: TEAL_BG, color: TEAL }}>
            HOW IT WORKS
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4" style={{ color: INK }}>
            Built on real NLP, not just keyword search
          </h1>
          <p className="text-[15px] leading-relaxed" style={{ color: GRAY }}>
            Most resume checkers just count matching words. Ours uses semantic
            embeddings and a full NLP pipeline to understand meaning — so your
            results are actually useful.
          </p>
        </div>
      </div>

      {/* Pipeline steps */}
      <div className="max-w-3xl mx-auto px-5 py-16">
        <h2 className="text-xl font-bold mb-8 text-center" style={{ color: INK }}>
          Under the hood — the analysis pipeline
        </h2>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="hover-lift bg-white rounded-2xl p-6 flex gap-5 animate-fade-in-up"
              style={{ border: `1px solid ${BORDER}`, animationDelay: `${i * 60}ms` }}
            >
              <div className="flex-shrink-0 flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: TEAL_BG }}>
                  <step.icon size={19} color={TEAL} strokeWidth={2.2} />
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 min-h-[16px]" style={{ backgroundColor: BORDER }} />
                )}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h3 className="font-semibold text-[15px]" style={{ color: INK }}>{step.title}</h3>
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: TEAL_BG, color: TEAL }}>
                    {step.tech}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: GRAY }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="py-16" style={{ backgroundColor: "#fff", borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="text-xl font-bold mb-8 text-center" style={{ color: INK }}>
            Tech stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {techStack.map((t) => (
              <div
                key={t}
                className="hover-lift rounded-xl p-4 text-center cursor-default"
                style={{ backgroundColor: BG, border: `1px solid ${BORDER}` }}
              >
                <p className="text-sm font-semibold" style={{ color: INK, fontFamily: "'Manrope', sans-serif" }}>{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto px-5 py-16">
        <h2 className="text-xl font-bold mb-8 text-center" style={{ color: INK }}>
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.q} className="hover-lift bg-white rounded-2xl p-5" style={{ border: `1px solid ${BORDER}` }}>
              <p className="font-semibold text-[14px] mb-1.5" style={{ color: INK }}>{faq.q}</p>
              <p className="text-sm leading-relaxed" style={{ color: GRAY }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 text-center" style={{ backgroundColor: INK }}>
        <h2 className="text-2xl font-bold text-white mb-3">Ready to analyze your resume?</h2>
        <p className="text-sm mb-6" style={{ color: "#9CA3AF" }}>Free, instant, no sign-up required.</p>
        <button
          onClick={() => navigate("/")}
          className="hover-lift inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white"
          style={{ backgroundColor: TEAL }}
        >
          Check My Resume
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}