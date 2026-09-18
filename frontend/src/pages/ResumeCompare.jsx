import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GitCompare, ArrowLeftRight, TrendingUp, Check, X, Trophy } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getHistory } from "../authApi";
import { getAllResults } from "../utils/resultsStore";

const TEAL = "#0F9D77";
const TEAL_BG = "#E7F7F1";
const AMBER = "#D97706";
const RED = "#E1493C";
const RED_BG = "#FDECEB";
const INK = "#131B2E";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const BG = "#F6F7F9";

function scoreColor(score) {
  return score >= 75 ? TEAL : score >= 50 ? AMBER : RED;
}

function ScoreCard({ item }) {
  if (!item) {
    return (
      <div className="flex-1 rounded-2xl p-6 flex items-center justify-center text-center" style={{ backgroundColor: BG, border: `2px dashed ${BORDER}`, minHeight: 140 }}>
        <p className="text-sm" style={{ color: GRAY }}>Select a resume to compare</p>
      </div>
    );
  }
  const score = Math.round(item.result.match_percentage);
  return (
    <div className="flex-1 rounded-2xl p-6 text-center" style={{ backgroundColor: "#fff", border: `1px solid ${BORDER}` }}>
      <p className="text-sm font-semibold mb-3 truncate" style={{ color: INK }}>{item.filename}</p>
      <p className="text-4xl font-extrabold mb-1" style={{ color: scoreColor(score), fontFamily: "'Manrope', sans-serif" }}>{score}%</p>
      <p className="text-xs" style={{ color: GRAY }}>Match Score</p>
    </div>
  );
}

export default function ResumeCompare() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [leftId, setLeftId] = useState("");
  const [rightId, setRightId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && token) {
      getHistory(token).then(setHistory).finally(() => setLoading(false));
    } else {
      setHistory(getAllResults());
      setLoading(false);
    }
  }, [user, token]);

  const left = history.find((h) => h.id === leftId);
  const right = history.find((h) => h.id === rightId);

  const winner = left && right
    ? left.result.match_percentage > right.result.match_percentage
      ? "left"
      : left.result.match_percentage < right.result.match_percentage
      ? "right"
      : "tie"
    : null;

  return (
    <div style={{ backgroundColor: BG, fontFamily: "'Inter', sans-serif" }} className="min-h-screen pb-20">
      <div className="text-center py-14 px-5 animate-fade-in-up" style={{ backgroundColor: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: TEAL_BG }}>
          <GitCompare size={22} color={TEAL} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: INK }}>
          Compare Resumes
        </h1>
        <p className="text-[15px] max-w-md mx-auto" style={{ color: GRAY }}>
          Pick two saved analyses and see which one performs better.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-5 pt-10">
        {loading ? (
          <div className="flex justify-center py-16">
            <span className="w-8 h-8 border-4 border-gray-200 border-t-[#0F9D77] rounded-full animate-spin" />
          </div>
        ) : history.length < 2 ? (
          <div className="text-center py-16">
            <GitCompare size={32} color={BORDER} className="mx-auto mb-3" />
            <p className="text-sm mb-4" style={{ color: GRAY }}>
              You need at least 2 saved analyses to compare. {user ? "" : "Sign in to save your history permanently."}
            </p>
            <button onClick={() => navigate("/")} className="hover-lift px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: TEAL }}>
              Analyze a Resume
            </button>
          </div>
        ) : (
          <>
            {/* Selectors */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <select
                value={leftId}
                onChange={(e) => setLeftId(e.target.value)}
                className="w-full rounded-xl p-3 text-sm focus:outline-none bg-white"
                style={{ border: `1px solid ${BORDER}`, color: INK }}
              >
                <option value="">Select first resume...</option>
                {history.map((h) => (
                  <option key={h.id} value={h.id} disabled={h.id === rightId}>
                    {h.filename} — {Math.round(h.result.match_percentage)}%
                  </option>
                ))}
              </select>
              <select
                value={rightId}
                onChange={(e) => setRightId(e.target.value)}
                className="w-full rounded-xl p-3 text-sm focus:outline-none bg-white"
                style={{ border: `1px solid ${BORDER}`, color: INK }}
              >
                <option value="">Select second resume...</option>
                {history.map((h) => (
                  <option key={h.id} value={h.id} disabled={h.id === leftId}>
                    {h.filename} — {Math.round(h.result.match_percentage)}%
                  </option>
                ))}
              </select>
            </div>

            {/* Score comparison */}
            <div className="flex items-center gap-4 mb-6">
              <ScoreCard item={left} />
              <ArrowLeftRight size={20} color={GRAY} className="flex-shrink-0" />
              <ScoreCard item={right} />
            </div>

            {left && right && (
              <>
                {winner !== "tie" && (
                  <div className="hover-lift flex items-center gap-2 justify-center rounded-2xl p-4 mb-6 animate-fade-in" style={{ backgroundColor: TEAL_BG }}>
                    <Trophy size={18} color={TEAL} />
                    <p className="text-sm font-semibold" style={{ color: TEAL }}>
                      {winner === "left" ? left.filename : right.filename} is the stronger match for this comparison
                    </p>
                  </div>
                )}

                {/* Skills comparison */}
                <div className="grid md:grid-cols-2 gap-4 animate-fade-in-up">
                  {[left, right].map((item, idx) => (
                    <div key={idx} className="hover-lift bg-white rounded-2xl p-6" style={{ border: `1px solid ${BORDER}` }}>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-4 truncate" style={{ color: GRAY }}>
                        {item.filename}
                      </p>

                      <p className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: TEAL }}>
                        <Check size={12} /> Matched ({item.result.matched_skills.length})
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {item.result.matched_skills.length > 0 ? item.result.matched_skills.map((s) => (
                          <span key={s} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: TEAL_BG, color: TEAL }}>{s}</span>
                        )) : <p className="text-xs" style={{ color: GRAY }}>None</p>}
                      </div>

                      <p className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: RED }}>
                        <X size={12} /> Missing ({item.result.missing_skills.length})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.result.missing_skills.length > 0 ? item.result.missing_skills.map((s) => (
                          <span key={s} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: RED_BG, color: RED }}>{s}</span>
                        )) : <p className="text-xs" style={{ color: GRAY }}>None</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}