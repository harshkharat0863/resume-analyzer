import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import CategoryReport from "../components/CategoryReport";
import { getResult } from "../utils/resultsStore";
import { useAuth } from "../context/AuthContext";
import { getHistory } from "../authApi";
import { getSkillResource } from "../utils/skillResources";
import { Share2 } from "lucide-react";
import {
  Paperclip, Download, RotateCw, Check, X, ListChecks, ShieldCheck,
  Layers, Tags, Lightbulb, FileQuestion, TrendingUp,
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

function Gauge({ score }) {
  const color = score >= 75 ? TEAL : score >= 50 ? AMBER : RED;
  return (
    <div className="relative w-full flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-48">
        <path d="M20,100 A80,80 0 0,1 180,100" fill="none" stroke="#EDEFF2" strokeWidth="16" strokeLinecap="round" pathLength="100" />
        <path
          d="M20,100 A80,80 0 0,1 180,100" fill="none" stroke={color} strokeWidth="16"
          strokeLinecap="round" pathLength="100"
          strokeDasharray={`${score} 100`}
          style={{ transition: "stroke-dasharray 1s ease-out" }}
        />
      </svg>
      <div className="absolute top-[44px] flex flex-col items-center">
        <span className="text-3xl font-bold" style={{ color: INK }}>{Math.round(score)}</span>
        <span className="text-[11px]" style={{ color: GRAY }}>out of 100</span>
      </div>
    </div>
  );
}

function CheckRow({ label, ok }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b last:border-0" style={{ borderColor: BORDER }}>
      <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: ok ? TEAL_BG : RED_BG, color: ok ? TEAL : RED }}>
        {ok ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
      </span>
      <span className="text-sm" style={{ color: INK }}>{label}</span>
    </div>
  );
}

function ATSRow({ label, pass }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: BORDER }}>
      <span className="text-sm" style={{ color: INK }}>{label}</span>
      <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1" style={{ backgroundColor: pass ? TEAL_BG : RED_BG, color: pass ? TEAL : RED }}>
        {pass ? <Check size={11} strokeWidth={3} /> : <X size={11} strokeWidth={3} />}
        {pass ? "Pass" : "Check"}
      </span>
    </div>
  );
}

function handleDownload(result, filename) {
  const doc = new jsPDF();
  const TEAL = [15, 157, 119];
  const INK = [19, 27, 46];
  const GRAY = [107, 114, 128];
  const RED = [225, 73, 60];
  const pageWidth = 210;
  let y = 45;

  doc.setFillColor(...TEAL);
  doc.rect(0, 0, pageWidth, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Resume Analysis Report", 15, 19);

  doc.setTextColor(...GRAY);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Resume: ${filename}`, 15, y);
  y += 6;
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, y);
  y += 12;

  doc.setTextColor(...INK);
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text(`Match Score: ${Math.round(result.match_percentage)}%`, 15, y);
  y += 12;

  doc.setFontSize(12);
  doc.setTextColor(...TEAL);
  doc.text("Matched Skills", 15, y);
  y += 7;
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "normal");
  if (result.matched_skills.length > 0) {
    result.matched_skills.forEach((s) => {
      doc.text(`- ${s}`, 20, y);
      y += 6;
    });
  } else {
    doc.text("None found.", 20, y);
    y += 6;
  }
  y += 6;

  doc.setFontSize(12);
  doc.setTextColor(...RED);
  doc.setFont("helvetica", "bold");
  doc.text("Missing Skills", 15, y);
  y += 7;
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "normal");
  if (result.missing_skills.length > 0) {
    result.missing_skills.forEach((s) => {
      doc.text(`- ${s}`, 20, y);
      y += 6;
    });
  } else {
    doc.text("None — great coverage!", 20, y);
    y += 6;
  }
  y += 6;

  if (y > 250) { doc.addPage(); y = 20; }

  doc.setFontSize(12);
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.text("Suggestions", 15, y);
  y += 7;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  result.suggestions.forEach((s, i) => {
    if (y > 270) { doc.addPage(); y = 20; }
    const lines = doc.splitTextToSize(`${i + 1}. ${s}`, 175);
    doc.text(lines, 20, y);
    y += lines.length * 6 + 3;
  });

  doc.save("resume-analysis-report.pdf");
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, token } = useAuth();

  const [dbResult, setDbResult] = useState(null);
  const [checkedDb, setCheckedDb] = useState(false);

  useEffect(() => {
    if (location.state?.result || !id || !user || !token) {
      setCheckedDb(true);
      return;
    }
    getHistory(token)
      .then((history) => {
        const match = history.find((h) => h.id === id);
        if (match) setDbResult(match);
      })
      .finally(() => setCheckedDb(true));
  }, [id, user, token, location.state]);

  const stored = id ? getResult(id) : null;
  const result = location.state?.result || dbResult?.result || stored?.result;
  const filename = location.state?.filename || dbResult?.filename || stored?.filename || "your-resume.pdf";
  const sectionsFound = result?.sections_detected || [];

  if (!result && !checkedDb) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F6F7F9" }}>
        <span className="w-8 h-8 border-4 border-gray-200 border-t-[#0F9D77] rounded-full animate-spin" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-5 animate-fade-in" style={{ backgroundColor: BG, fontFamily: "'Inter', sans-serif" }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: TEAL_BG }}>
          <FileQuestion size={28} color={TEAL} strokeWidth={1.8} />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: INK }}>No results yet</h2>
        <p className="text-sm mb-6" style={{ color: GRAY }}>Upload a resume and job description first to see your analysis.</p>
        <button onClick={() => navigate("/")} className="hover-lift px-6 py-3 rounded-xl font-semibold text-white" style={{ backgroundColor: TEAL }}>
          Go back home
        </button>
      </div>
    );
  }

  const score = Math.round(result.match_percentage);
  const scoreLabel = score >= 75 ? "Strong Match" : score >= 50 ? "Moderate Match" : "Weak Match";
  const scoreLabelColor = score >= 75 ? TEAL : score >= 50 ? AMBER : RED;
  const scoreLabelBg = score >= 75 ? TEAL_BG : score >= 50 ? AMBER_BG : RED_BG;

  const wordCount = result.resume_skills?.length > 0;
  const hasNumbers = result.suggestions?.some((s) => s.includes("numbers") || s.includes("quantif"));
  const hasActionVerbs = result.suggestions?.some((s) => s.includes("action"));
  const goodLength = !result.suggestions?.some((s) => s.includes("short") || s.includes("long"));

  const atsChecks = [
    { label: "File format is ATS-readable (PDF/DOCX)", pass: true },
    { label: "Skills section detected", pass: wordCount },
    { label: "Adequate resume length", pass: goodLength },
    { label: "Uses quantified achievements", pass: !hasNumbers },
    { label: "Uses strong action verbs", pass: !hasActionVerbs },
    { label: "Relevant keywords present", pass: result.matched_skills.length > 0 },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: BG, fontFamily: "'Inter', sans-serif" }}>
      <div className="bg-white border-b px-5 py-4" style={{ borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: TEAL_BG }}>
              <Paperclip size={15} color={TEAL} />
            </div>
            <div>
              <p className="text-xs" style={{ color: GRAY }}>Results for</p>
              <p className="text-sm font-semibold" style={{ color: INK }}>{filename}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => handleDownload(result, filename)} className="hover-lift flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: BORDER, color: INK }}>
              <Download size={15} />
              Download Report
            </button>
            <button onClick={() => navigate("/")} className="hover-lift flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: TEAL }}>
              <RotateCw size={14} />
              Check Another
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 pt-8 space-y-6">
        <div className="hover-lift bg-white rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 animate-fade-in-up" style={{ border: `1px solid ${BORDER}` }}>
          <Gauge score={result.match_percentage} />
          <div className="flex-1 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-2" style={{ backgroundColor: scoreLabelBg, color: scoreLabelColor }}>
              <TrendingUp size={12} strokeWidth={2.5} />
              {scoreLabel}
            </span>
            <h2 className="text-2xl font-bold mb-1" style={{ color: INK }}>Your resume matches {score}% of this job</h2>
            <p className="text-sm" style={{ color: GRAY }}>
              {score >= 75
                ? "Great fit! Your resume covers most of what this role requires."
                : score >= 50
                ? "Decent match — a few key skills are missing. Check the suggestions below."
                : "Your resume needs work for this role. Focus on the missing skills and suggestions below."}
            </p>
            <div className="flex gap-6 mt-4 justify-center md:justify-start">
              <div>
                <p className="text-xl font-bold" style={{ color: TEAL }}>{result.matched_skills.length}</p>
                <p className="text-xs" style={{ color: GRAY }}>Skills matched</p>
              </div>
              <div>
                <p className="text-xl font-bold" style={{ color: RED }}>{result.missing_skills.length}</p>
                <p className="text-xs" style={{ color: GRAY }}>Skills missing</p>
              </div>
              <div>
                <p className="text-xl font-bold" style={{ color: INK }}>{result.resume_skills.length}</p>
                <p className="text-xs" style={{ color: GRAY }}>Total skills found</p>
              </div>
            </div>
          </div>
        </div>

        <CategoryReport categoryChecks={result.category_checks} />

        <div className="grid md:grid-cols-2 gap-6">
          <div className="hover-lift bg-white rounded-2xl p-6 animate-fade-in-up" style={{ border: `1px solid ${BORDER}`, animationDelay: "80ms" }}>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: GRAY }}>
              <ListChecks size={14} /> Skills Check
            </p>
            {result.matched_skills.map((s) => (
              <CheckRow key={s} label={s} ok={true} />
            ))}
            {result.missing_skills.map((s) => {
              const resource = getSkillResource(s);
              return (
                <div key={s} className="flex items-center justify-between gap-3 py-2.5 border-b last:border-0" style={{ borderColor: BORDER }}>
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: RED_BG, color: RED }}>
                      <X size={12} strokeWidth={3} />
                    </span>
                    <span className="text-sm" style={{ color: INK }}>{s}</span>
                  </div>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold flex-shrink-0 hover:underline" style={{ color: TEAL }}>
                    Learn →
                  </a>
                </div>
              );
            })}
          </div>

          <div className="hover-lift bg-white rounded-2xl p-6 animate-fade-in-up" style={{ border: `1px solid ${BORDER}`, animationDelay: "140ms" }}>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: GRAY }}>
              <ShieldCheck size={14} /> ATS Compatibility Check
            </p>
            {atsChecks.map((check) => (
              <ATSRow key={check.label} label={check.label} pass={check.pass} />
            ))}
          </div>
        </div>

        <div className="hover-lift bg-white rounded-2xl p-6 animate-fade-in-up" style={{ border: `1px solid ${BORDER}`, animationDelay: "180ms" }}>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: GRAY }}>
            <Layers size={14} /> Resume Sections Detected
          </p>
          <div className="flex flex-wrap gap-2">
            {["header", "summary", "experience", "education", "skills", "projects", "certifications"].map((sec) => {
              const found = sectionsFound.includes(sec);
              const label = sec === "header" ? "Contact Info" : sec.charAt(0).toUpperCase() + sec.slice(1);
              return (
                <span key={sec} className="text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5" style={{ backgroundColor: found ? TEAL_BG : BG, color: found ? TEAL : "#B0B7C3", border: `1px solid ${found ? TEAL : BORDER}` }}>
                  {found ? <Check size={12} strokeWidth={3} /> : <span style={{ fontSize: 10 }}>○</span>}
                  {label}
                </span>
              );
            })}
          </div>
        </div>

        <div className="hover-lift bg-white rounded-2xl p-6 animate-fade-in-up" style={{ border: `1px solid ${BORDER}`, animationDelay: "220ms" }}>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: GRAY }}>
            <Tags size={14} /> All Skills Found in Your Resume ({result.resume_skills.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {result.resume_skills.map((s) => (
              <span key={s} className="text-sm px-3 py-1.5 rounded-full" style={{ backgroundColor: result.matched_skills.includes(s) ? TEAL_BG : BG, color: result.matched_skills.includes(s) ? TEAL : GRAY, border: `1px solid ${result.matched_skills.includes(s) ? TEAL : BORDER}` }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="hover-lift bg-white rounded-2xl p-6 animate-fade-in-up" style={{ border: `1px solid ${BORDER}`, animationDelay: "260ms" }}>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: GRAY }}>
            <Lightbulb size={14} /> Suggestions to Improve Your Resume
          </p>
          <div className="space-y-3">
            {result.suggestions.map((s, i) => (
              <div key={i} className="flex gap-3 rounded-xl p-4 text-sm" style={{ backgroundColor: BG, color: INK }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white" style={{ backgroundColor: TEAL }}>
                  {i + 1}
                </span>
                <p className="leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in-up" style={{ backgroundColor: INK, animationDelay: "300ms" }}>
          <div>
            <h3 className="font-bold text-white text-[15px] mb-1">Save your full report</h3>
            <p className="text-sm" style={{ color: "#9CA3AF" }}>Download a PDF report with your score, skills, and all suggestions.</p>
          </div>
          <button onClick={() => handleDownload(result, filename)} className="hover-lift flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white flex-shrink-0" style={{ backgroundColor: TEAL }}>
            <Download size={16} />
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}