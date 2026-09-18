import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { History, FileText, Trash2, ArrowRight, LogIn } from "lucide-react";
import { getAllResults, deleteResult } from "../utils/resultsStore";
import { useAuth } from "../context/AuthContext";
import { getHistory, deleteHistory } from "../authApi";

const TEAL = "#0F9D77";
const TEAL_BG = "#E7F7F1";
const AMBER = "#D97706";
const RED = "#E1493C";
const INK = "#131B2E";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const BG = "#F6F7F9";

export default function ResumeHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      getHistory(token)
        .then((data) => setHistory(data))
        .finally(() => setLoading(false));
    } else {
      setHistory(getAllResults());
      setLoading(false);
    }
  }, [user, token]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (user && token) {
      await deleteHistory(token, id);
      setHistory(await getHistory(token));
    } else {
      deleteResult(id);
      setHistory(getAllResults());
    }
  };

  const scoreColor = (score) => (score >= 75 ? TEAL : score >= 50 ? AMBER : RED);

  return (
    <div style={{ backgroundColor: BG, fontFamily: "'Inter', sans-serif" }} className="min-h-screen pb-20">
      <div className="text-center py-14 px-5 animate-fade-in-up" style={{ backgroundColor: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: TEAL_BG }}>
          <History size={22} color={TEAL} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: INK }}>
          Resume History
        </h1>
        <p className="text-[15px] max-w-md mx-auto" style={{ color: GRAY }}>
          {user ? "Saved permanently to your account." : "Saved locally in this browser only."}
        </p>

        {!user && (
          <button
            onClick={() => navigate("/signin")}
            className="hover-lift inline-flex items-center gap-1.5 mt-4 text-sm font-semibold px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: TEAL }}
          >
            <LogIn size={14} />
            Sign in to save permanently
          </button>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-10">
        {loading ? (
          <div className="flex justify-center py-16">
            <span className="w-8 h-8 border-4 border-gray-200 border-t-[#0F9D77] rounded-full animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-16">
            <FileText size={32} color={BORDER} className="mx-auto mb-3" />
            <p className="text-sm mb-4" style={{ color: GRAY }}>No analyses yet.</p>
            <button onClick={() => navigate("/")} className="hover-lift px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: TEAL }}>
              Analyze a Resume
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((h, i) => (
              <div
                key={h.id}
                onClick={() => navigate(`/results/${h.id}`, { state: { result: h.result, filename: h.filename } })}
                className="hover-lift bg-white rounded-2xl p-5 flex items-center justify-between gap-4 cursor-pointer animate-fade-in-up"
                style={{ border: `1px solid ${BORDER}`, animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                    style={{ backgroundColor: `${scoreColor(h.result.match_percentage)}20`, color: scoreColor(h.result.match_percentage) }}
                  >
                    {Math.round(h.result.match_percentage)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: INK }}>{h.filename}</p>
                    <p className="text-xs" style={{ color: GRAY }}>
                      {new Date(h.date || h.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={(e) => handleDelete(h.id, e)} className="p-2 rounded-lg transition-colors hover:bg-red-50">
                    <Trash2 size={15} color={RED} />
                  </button>
                  <ArrowRight size={16} color={GRAY} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}