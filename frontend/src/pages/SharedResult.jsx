import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Share2, CheckCircle2, TrendingUp, FileQuestion, ArrowRight } from "lucide-react";
import { getSharedResult } from "../authApi";

const TEAL = "#0F9D77";
const TEAL_BG = "#E7F7F1";
const AMBER = "#D97706";
const RED = "#E1493C";
const INK = "#131B2E";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const BG = "#F6F7F9";

function scoreColor(score) {
  return score >= 75 ? TEAL : score >= 50 ? AMBER : RED;
}

export default function SharedResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSharedResult(id)
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BG }}>
        <span className="w-8 h-8 border-4 border-gray-200 border-t-[#0F9D77] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-5" style={{ backgroundColor: BG, fontFamily: "'Inter', sans-serif" }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: TEAL_BG }}>
          <FileQuestion size={28} color={TEAL} strokeWidth={1.8} />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: INK }}>Shared result not found</h2>
        <p className="text-sm mb-6" style={{ color: GRAY }}>This link may be broken or the result was deleted.</p>
        <button onClick={() => navigate("/")} className="hover-lift px-6 py-3 rounded-xl font-semibold text-white" style={{ backgroundColor: TEAL }}>
          Go to ResumeCheck
        </button>
      </div>
    );
  }

  const score = Math.round(data.match_percentage);
  const color = scoreColor(score);

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10" style={{ backgroundColor: BG, fontFamily: "'Inter', sans-serif" }}>
      <div className="hover-lift bg-white rounded-2xl p-8 w-full max-w-md animate-fade-in-up" style={{ border: `1px solid ${BORDER}`, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-2 justify-center mb-6">
          <Share2 size={14} color={GRAY} />
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: GRAY }}>Shared Resume Score</p>
        </div>

        <div className="text-center mb-6">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg viewBox="0 0 120 120" className="w-32 h-32 -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#EDEFF2" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="52" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 52}
                strokeDashoffset={2 * Math.PI * 52 * (1 - score / 100)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold" style={{ color }}>{score}%</span>
            </div>
          </div>
          <p className="text-sm font-semibold" style={{ color: INK }}>{data.filename}</p>
          <p className="text-xs mt-1" style={{ color: GRAY }}>
            Analyzed {new Date(data.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: BG }}>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: GRAY }}>
            <CheckCircle2 size={12} /> Key Strengths ({data.matched_skills.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.matched_skills.slice(0, 10).map((s) => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: TEAL_BG, color: TEAL }}>{s}</span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 justify-center text-xs mb-6" style={{ color: GRAY }}>
          <TrendingUp size={13} />
          {data.missing_skills_count} skill{data.missing_skills_count !== 1 ? "s" : ""} still being developed
        </div>

        <button
          onClick={() => navigate("/")}
          className="hover-lift w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm"
          style={{ backgroundColor: TEAL }}
        >
          Check Your Own Resume
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}