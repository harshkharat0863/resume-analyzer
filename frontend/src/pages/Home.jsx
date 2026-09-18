import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeResume } from "../api";
import { saveResult } from "../utils/resultsStore";
import { useAuth } from "../context/AuthContext";
import { saveHistory } from "../authApi";
import {
  FileText, Target, CheckCircle2, ListChecks, FileDown, Zap,
  Upload, ArrowRight, ClipboardCheck, PenLine, Flag, Layers, Scale, Search,
} from "lucide-react";

const TEAL = "#0F9D77";
const TEAL_BG = "#E7F7F1";
const RED = "#E1493C";
const RED_BG = "#FDECEB";
const INK = "#131B2E";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const BG = "#F6F7F9";
const DARK = "#0D1117";

const featureCards = [
  {
    icon: ClipboardCheck,
    title: "ATS essentials",
    items: ["File format and size", "ATS-friendly design", "Professional formatting", "Header structure", "Resume file name", "Dates consistency"],
  },
  {
    icon: PenLine,
    title: "Content",
    items: ["ATS parse rate", "Quantifying impact", "Action verbs usage", "Spelling and grammar", "Bullet length", "Keyword density"],
  },
  {
    icon: Flag,
    title: "Recruiter red flags",
    items: ["Resume credibility", "Interview risk signals", "Peer benchmarking", "LinkedIn profile match"],
  },
  {
    icon: Layers,
    title: "Resume sections",
    items: ["Essential sections", "Contact information", "Section order"],
  },
  {
    icon: Target,
    title: "Job tailoring",
    items: ["Hard skills match", "Soft skills match", "Action verbs", "Tailored job title"],
  },
  {
    icon: Scale,
    title: "Seniority & impact",
    items: ["Career progression", "Skills evidence", "Leadership signals"],
  },
];

const features = [
  {
    icon: Target,
    title: "Skill Match Score",
    desc: "See exactly how well your resume matches the job description with a clear percentage score.",
  },
  {
    icon: CheckCircle2,
    title: "ATS Compatibility",
    desc: "Check if your resume will pass Applicant Tracking Systems used by most companies.",
  },
  {
    icon: Zap,
    title: "Smart Suggestions",
    desc: "Get personalized tips to improve your resume and increase your chances of getting hired.",
  },
  {
    icon: ListChecks,
    title: "Skills Gap Analysis",
    desc: "Find out exactly which skills you're missing and which ones you already have covered.",
  },
  {
    icon: FileDown,
    title: "PDF Report",
    desc: "Download a full analysis report you can refer back to while updating your resume.",
  },
  {
    icon: FileText,
    title: "Instant Results",
    desc: "No waiting, no sign-up required. Upload and get your analysis in under 30 seconds.",
  },
];

const toolTabs = ["Resume Checker", "Skill Gap Analysis", "ATS Check", "Resume Tips", "Job Tailoring"];

const alternatingSection = [
  {
    title: "Get an ATS understanding check",
    desc: "Part of the resume checker score is based on the parsability rate of your resume. We look for skills and keywords connected to the job and industry you're applying for, readable contact information, date format, links, file type, and length. Then we give you suggestions on how to improve.",
    icon: Search,
    mockup: ["Contact information ✓", "Skills section ✓", "Work experience ✓", "Education ✓", "File format ✓"],
    imgLeft: false,
  },
  {
    title: "Tailor your resume to a job description",
    desc: "Paste the job you're applying for and our checker will give you job-specific resume tailoring suggestions. It will identify exactly which skills and keywords you already have or are missing from your resume. Additionally, it will generate an application-ready tailored subtitle and suggest action verbs for your bullet points to be more effective.",
    icon: Target,
    mockup: ["Python ✓ Match", "SQL ✓ Match", "AWS ✗ Missing", "React ✓ Match", "Docker ✗ Missing"],
    imgLeft: true,
  },
  {
    title: "Pass the hiring manager check",
    desc: "ATS is just the first step of the recruitment process. Your resume will be judged by a HR manager next and they look for an entirely different set of things. Our checker will analyze your resume for any red flags, such as ambiguity, unintentional age bias, interview risks, leadership signals, skills evidence, and role experience relevance.",
    icon: CheckCircle2,
    mockup: ["Resume credibility ✓", "Leadership signals ✓", "Skills evidence ✓", "Career progression ✓"],
    imgLeft: false,
  },
];

function MockupCard({ items }) {
  return (
    <div
      className="hover-lift rounded-2xl p-5 shadow-xl"
      style={{ backgroundColor: "#fff", border: `1px solid ${BORDER}`, minWidth: 220 }}
    >
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 py-1.5 border-b last:border-0" style={{ borderColor: BORDER }}>
          <span style={{ color: item.includes("✓") ? TEAL : RED, fontSize: 12 }}>
            {item.includes("✓") ? "✓" : "✕"}
          </span>
          <span className="text-xs" style={{ color: INK }}>
            {item.replace("✓", "").replace("✗", "").trim()}
          </span>
          {item.includes("Match") && (
            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: TEAL_BG, color: TEAL }}>Match</span>
          )}
          {item.includes("Missing") && (
            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: RED_BG, color: RED }}>Missing</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const { user, token } = useAuth();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    const validTypes = [".pdf", ".docx", ".doc"];
    const isValid = validTypes.some((ext) => selectedFile.name.toLowerCase().endsWith(ext));
    if (!isValid) { setError("Please upload a PDF or DOCX file."); return; }
    setFile(selectedFile);
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!file) { setError("Please upload a resume file."); return; }
    if (!jobDescription.trim()) { setError("Please paste a job description."); return; }
    setLoading(true);
    try {
      const data = await analyzeResume(file, jobDescription);

      if (user && token) {
        // Logged in — save permanently to MongoDB
        const saved = await saveHistory(token, file.name, data);
        navigate(`/results/${saved.id}`, { state: { result: data, filename: file.name } });
      } else {
        // Guest — save temporarily to browser only
        const id = saveResult(data, file.name);
        navigate(`/results/${id}`, { state: { result: data, filename: file.name } });
      }
    } catch (err) {
      console.error(err);
      setError("Couldn't reach the analysis server. Make sure it's running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(135deg, #f0fdf8 0%, #e8f4fd 50%, #f3e8ff 100%)" }}>
        <div className="max-w-6xl mx-auto px-5 py-16 grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="animate-fade-in-up">
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-5 tracking-wide" style={{ backgroundColor: TEAL_BG, color: TEAL }}>
              FREE RESUME CHECKER
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight" style={{ color: INK }}>
              Is your resume<br />good enough?
            </h1>
            <p className="text-[15px] mb-8 leading-relaxed" style={{ color: GRAY }}>
              A free and fast AI resume checker doing crucial checks to ensure your resume's content, layout and design is technically compatible with applicant tracking systems and gets you interview callbacks.
            </p>

            {/* Upload form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 space-y-4" style={{ border: `1px solid ${BORDER}`, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                className="rounded-xl p-6 text-center cursor-pointer transition-colors"
                style={{ border: `2px dashed ${dragActive ? TEAL : BORDER}`, backgroundColor: dragActive ? TEAL_BG : "#FAFBFC" }}
              >
                <input ref={fileInputRef} type="file" accept=".pdf,.docx,.doc" onChange={(e) => handleFile(e.target.files[0])} className="hidden" />
                <Upload size={24} color={dragActive ? TEAL : GRAY} strokeWidth={1.8} className="mx-auto mb-1 transition-colors" />
                {!file ? (
                  <>
                    <p className="text-sm font-medium" style={{ color: INK }}>Drop your resume here or <span style={{ color: TEAL }}>choose a file</span></p>
                    <p className="text-xs mt-1" style={{ color: GRAY }}>PDF & DOCX only · Max 5MB</p>
                  </>
                ) : (
                  <p className="text-sm font-semibold" style={{ color: TEAL }}>✓ {file.name}</p>
                )}
              </div>

              <textarea
                rows={3}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full rounded-xl p-3 text-sm focus:outline-none resize-none"
                style={{ border: `1px solid ${BORDER}`, color: INK }}
              />

              {error && <p className="text-sm rounded-lg p-2" style={{ backgroundColor: RED_BG, color: RED }}>{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="hover-lift w-full py-3.5 rounded-xl font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ backgroundColor: TEAL }}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Upload Your Resume
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
              <p className="text-xs text-center" style={{ color: GRAY }}>
                {user ? "✓ Signed in — your analysis will be saved to your account." : "🔒 We never share your data with 3rd parties."}
              </p>
            </form>
          </div>

          {/* Right — live preview mockup */}
          <div className="hidden md:flex items-center justify-center animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            <div className="relative">
              <div className="hover-lift rounded-2xl shadow-2xl p-5 w-80" style={{ backgroundColor: "#fff", border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-xs ml-2 font-medium" style={{ color: GRAY }}>Resume Score</span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-20 h-20">
                    <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
                      <circle cx="40" cy="40" r="30" fill="none" stroke="#EDEFF2" strokeWidth="8" />
                      <circle cx="40" cy="40" r="30" fill="none" stroke={TEAL} strokeWidth="8" strokeLinecap="round" strokeDasharray="170 188" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold" style={{ color: INK }}>92</span>
                      <span className="text-[9px]" style={{ color: GRAY }}>/100</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    {[["CONTENT", "90%", TEAL], ["FORMAT", "84%", "#3B82F6"], ["STYLE", "40%", RED], ["SECTIONS", "40%", RED], ["SKILLS", "70%", "#D97706"]].map(([label, val, col]) => (
                      <div key={label} className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] w-16" style={{ color: GRAY }}>{label}</span>
                        <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: "#EDEFF2" }}>
                          <div className="h-1.5 rounded-full" style={{ width: val, backgroundColor: col }} />
                        </div>
                        <span className="text-[10px]" style={{ color: col }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  {["ATS Parse Rate ✓", "Quantifying Impact ✓", "Repetition ✓", "Spelling & Grammar ✓"].map((item) => (
                    <div key={item} className="flex items-center gap-1.5 text-[11px]" style={{ color: INK }}>
                      <span style={{ color: TEAL }}>✓</span> {item.replace("✓", "")}
                    </div>
                  ))}
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 rounded-xl p-3 shadow-lg" style={{ backgroundColor: "#fff", border: `1px solid ${BORDER}` }}>
                <p className="text-xs font-bold" style={{ color: TEAL }}>8 Issues Found</p>
                <p className="text-[10px]" style={{ color: GRAY }}>Click to review</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── DARK FEATURES SECTION ── */}
      <div style={{ backgroundColor: DARK }} className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The AI-powered Resume Checker goes<br />beyond typos and punctuation
            </h2>
            <p className="text-[14px] max-w-2xl mx-auto leading-relaxed" style={{ color: "#9CA3AF" }}>
              We've built various AI models to check your resume against what both ATS software and human recruiters look for. The tool checks for crucial things across different categories on your resume.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {featureCards.map((card) => (
              <div key={card.title} className="hover-lift rounded-2xl p-5" style={{ backgroundColor: "#161B22", border: "1px solid #21262D" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: TEAL_BG }}>
                  <card.icon size={19} color={TEAL} strokeWidth={2.2} />
                </div>
                <h3 className="font-semibold text-white mb-3">{card.title}</h3>
                <div className="space-y-1.5">
                  {card.items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs" style={{ color: "#9CA3AF" }}>
                      <span style={{ color: TEAL }}>✓</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ALTERNATING SECTIONS ── */}
      {alternatingSection.map((section, i) => (
        <div key={i} className="py-16 px-5" style={{ backgroundColor: i % 2 === 0 ? "#fff" : BG, borderTop: `1px solid ${BORDER}` }}>
          <div className={`max-w-5xl mx-auto flex flex-col ${section.imgLeft ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-12`}>
            {/* Text */}
            <div className="flex-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: TEAL_BG }}>
                <section.icon size={19} color={TEAL} strokeWidth={2.2} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: INK }}>{section.title}</h2>
              <p className="text-[15px] leading-relaxed" style={{ color: GRAY }}>{section.desc}</p>
            </div>
            {/* Mockup */}
            <div className="flex-1 flex justify-center">
              <MockupCard items={section.mockup} />
            </div>
          </div>
        </div>
      ))}

      {/* ── FEATURES GRID ── */}
      <div className="py-16 px-5" style={{ backgroundColor: "#fff", borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: INK }}>
              Everything you need to land the interview
            </h2>
            <p className="text-sm" style={{ color: GRAY }}>
              A complete resume analysis in one place
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="hover-lift rounded-2xl p-5 cursor-default"
                style={{ backgroundColor: BG, border: `1px solid ${BORDER}` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: TEAL_BG }}
                >
                  <f.icon size={19} color={TEAL} strokeWidth={2.2} />
                </div>
                <h3 className="font-semibold text-[14px] mb-1" style={{ color: INK }}>
                  {f.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: GRAY }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TOOLS DARK SECTION ── */}
      <div style={{ backgroundColor: DARK }} className="py-20 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Put your resume score to work
          </h2>
          <p className="text-sm mb-8" style={{ color: "#9CA3AF" }}>
            Checking is step one. ResumeCheck covers the rest of what you need to land the job.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {toolTabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: activeTab === i ? TEAL : "#1F2937",
                  color: activeTab === i ? "#fff" : "#9CA3AF",
                  border: "none",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="rounded-2xl p-8 text-left animate-fade-in" key={activeTab} style={{ backgroundColor: "#161B22", border: "1px solid #21262D" }}>
            {activeTab === 0 && (
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg mb-2">Resume Checker</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#9CA3AF" }}>Upload your resume and instantly see your match score, ATS compatibility, skill gaps, and actionable suggestions to improve your chances.</p>
                  <ul className="space-y-2">
                    {["Instant skill match score", "ATS compatibility check", "Missing skills detection", "Improvement suggestions"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "#9CA3AF" }}>
                        <span style={{ color: TEAL }}>✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1">
                  <MockupCard items={["Match Score: 75% ✓", "Python ✓ Match", "SQL ✓ Match", "AWS ✗ Missing", "Docker ✗ Missing"]} />
                </div>
              </div>
            )}
            {activeTab === 1 && (
              <div>
                <h3 className="font-bold text-white text-lg mb-2">Skill Gap Analysis</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>See exactly which skills from the job description you have and which ones you're missing — with semantic matching that understands synonyms.</p>
              </div>
            )}
            {activeTab === 2 && (
              <div>
                <h3 className="font-bold text-white text-lg mb-2">ATS Check</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>Find out if your resume will pass the Applicant Tracking System filters most companies use before a human ever sees it.</p>
              </div>
            )}
            {activeTab === 3 && (
              <div>
                <h3 className="font-bold text-white text-lg mb-2">Resume Tips</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>Get personalized, actionable tips based on your specific resume — from quantifying achievements to using stronger action verbs.</p>
              </div>
            )}
            {activeTab === 4 && (
              <div>
                <h3 className="font-bold text-white text-lg mb-2">Job Tailoring</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>Paste any job description and get specific suggestions for tailoring your resume to that exact role — keywords, skills, and phrasing.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── BOTTOM CTA ── */}
      <div className="py-16 text-center px-5" style={{ backgroundColor: TEAL }}>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Get your resume score now
        </h2>
        <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.8)" }}>
          Upload your resume and you'll get a personalized report with an actionable tasklist.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="hover-lift px-8 py-3.5 rounded-xl font-semibold inline-flex items-center gap-2"
          style={{ backgroundColor: "#fff", color: TEAL }}
        >
          Upload Your Resume
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}