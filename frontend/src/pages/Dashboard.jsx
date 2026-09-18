import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard, FileText, TrendingUp, Award, Clock, ArrowRight,
  Sparkles, Briefcase, PenTool, User, Mail, Settings as SettingsIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getHistory } from "../authApi";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const TEAL = "#0F9D77";
const TEAL_BG = "#E7F7F1";
const AMBER = "#D97706";
const RED = "#E1493C";
const INK = "#131B2E";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const BG = "#F6F7F9";

const quickActions = [
  { to: "/", icon: FileText, label: "Analyze Resume", desc: "Check a new resume" },
  { to: "/resume-builder", icon: Sparkles, label: "Resume Builder", desc: "Build from scratch" },
  { to: "/cover-letter", icon: PenTool, label: "Cover Letter", desc: "Generate one" },
  { to: "/job-tracker", icon: Briefcase, label: "Job Tracker", desc: "Track applications" },
];

function scoreColor(score) {
  return score >= 75 ? TEAL : score >= 50 ? AMBER : RED;
}

export default function Dashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) {
      navigate("/signin");
      return;
    }
    getHistory(token)
      .then(setHistory)
      .finally(() => setLoading(false));
  }, [user, token, navigate]);

  if (!user) return null;

  const totalAnalyses = history.length;
  const avgScore = totalAnalyses > 0
    ? Math.round(history.reduce((sum, h) => sum + h.result.match_percentage, 0) / totalAnalyses)
    : 0;
  const bestScore = totalAnalyses > 0
    ? Math.round(Math.max(...history.map((h) => h.result.match_percentage)))
    : 0;
  const recent = history.slice(0, 5);

  return (
    <div style={{ backgroundColor: BG, fontFamily: "'Inter', sans-serif" }} className="min-h-screen pb-20">
      {/* Header */}
      <div className="py-10 px-5" style={{ backgroundColor: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
            style={{ backgroundColor: TEAL, fontFamily: "'Manrope', sans-serif" }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="flex items-center gap-1.5 text-xs mb-1" style={{ color: GRAY }}>
              <LayoutDashboard size={13} /> Your Dashboard
            </p>
            <h1 className="text-2xl font-bold" style={{ color: INK }}>Welcome back, {user.name.split(" ")[0]}</h1>
            <p className="flex items-center gap-1.5 text-sm mt-0.5" style={{ color: GRAY }}>
              <Mail size={13} /> {user.email}
            </p>
          </div>
          <button
            onClick={() => navigate("/settings")}
            className="hover-lift flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg bg-white flex-shrink-0"
            style={{ border: `1px solid ${BORDER}`, color: INK }}
          >
            <SettingsIcon size={14} />
            Settings
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 pt-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="hover-lift bg-white rounded-2xl p-5 animate-fade-in-up" style={{ border: `1px solid ${BORDER}` }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: TEAL_BG }}>
              <FileText size={16} color={TEAL} />
            </div>
            <p className="text-2xl font-bold" style={{ color: INK, fontFamily: "'Manrope', sans-serif" }}>{totalAnalyses}</p>
            <p className="text-xs" style={{ color: GRAY }}>Resumes analyzed</p>
          </div>
          <div className="hover-lift bg-white rounded-2xl p-5 animate-fade-in-up" style={{ border: `1px solid ${BORDER}`, animationDelay: "60ms" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: TEAL_BG }}>
              <TrendingUp size={16} color={TEAL} />
            </div>
            <p className="text-2xl font-bold" style={{ color: INK, fontFamily: "'Manrope', sans-serif" }}>{avgScore}%</p>
            <p className="text-xs" style={{ color: GRAY }}>Average match score</p>
          </div>
          <div className="hover-lift bg-white rounded-2xl p-5 animate-fade-in-up" style={{ border: `1px solid ${BORDER}`, animationDelay: "120ms" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: TEAL_BG }}>
              <Award size={16} color={TEAL} />
            </div>
            <p className="text-2xl font-bold" style={{ color: INK, fontFamily: "'Manrope', sans-serif" }}>{bestScore}%</p>
            <p className="text-xs" style={{ color: GRAY }}>Best match score</p>
          </div>
        </div>

        {/* Score trend chart */}
        {history.length > 1 && (
          <div className="hover-lift bg-white rounded-2xl p-6 animate-fade-in-up" style={{ border: `1px solid ${BORDER}`, animationDelay: "140ms" }}>
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: GRAY }}>
              <TrendingUp size={13} /> Score Trend
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={[...history].reverse().map((h, i) => ({
                  name: `#${i + 1}`,
                  score: Math.round(h.result.match_percentage),
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: GRAY }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: GRAY }} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: `1px solid ${BORDER}`, fontSize: 12 }}
                  formatter={(value) => [`${value}%`, "Match Score"]}
                />
                <Line type="monotone" dataKey="score" stroke={TEAL} strokeWidth={2.5} dot={{ fill: TEAL, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Quick actions */}
        <div className="hover-lift bg-white rounded-2xl p-6 animate-fade-in-up" style={{ border: `1px solid ${BORDER}`, animationDelay: "160ms" }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: GRAY }}>Quick Actions</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="hover-lift flex flex-col items-center text-center p-4 rounded-xl no-underline"
                style={{ backgroundColor: BG, border: `1px solid ${BORDER}` }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: TEAL_BG }}>
                  <action.icon size={16} color={TEAL} />
                </div>
                <p className="text-xs font-semibold" style={{ color: INK }}>{action.label}</p>
                <p className="text-[10px] mt-0.5" style={{ color: GRAY }}>{action.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="hover-lift bg-white rounded-2xl p-6 animate-fade-in-up" style={{ border: `1px solid ${BORDER}`, animationDelay: "220ms" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: GRAY }}>
              <Clock size={13} /> Recent Activity
            </p>
            {totalAnalyses > 0 && (
              <Link to="/resume-history" className="text-xs font-semibold" style={{ color: TEAL }}>
                View all →
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <span className="w-6 h-6 border-4 border-gray-200 border-t-[#0F9D77] rounded-full animate-spin" />
            </div>
          ) : recent.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm mb-4" style={{ color: GRAY }}>No resumes analyzed yet.</p>
              <button
                onClick={() => navigate("/")}
                className="hover-lift px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: TEAL }}
              >
                Analyze Your First Resume
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {recent.map((h) => (
                <div
                  key={h.id}
                  onClick={() => navigate(`/results/${h.id}`, { state: { result: h.result, filename: h.filename } })}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl cursor-pointer transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs"
                      style={{ backgroundColor: `${scoreColor(h.result.match_percentage)}20`, color: scoreColor(h.result.match_percentage) }}
                    >
                      {Math.round(h.result.match_percentage)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: INK }}>{h.filename}</p>
                      <p className="text-xs" style={{ color: GRAY }}>{new Date(h.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <ArrowRight size={14} color={GRAY} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account info */}
        <div className="hover-lift bg-white rounded-2xl p-6 animate-fade-in-up" style={{ border: `1px solid ${BORDER}`, animationDelay: "260ms" }}>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: GRAY }}>
            <User size={13} /> Account Details
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs mb-1" style={{ color: GRAY }}>Full Name</p>
              <p className="text-sm font-medium" style={{ color: INK }}>{user.name}</p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: GRAY }}>Email</p>
              <p className="text-sm font-medium" style={{ color: INK }}>{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}