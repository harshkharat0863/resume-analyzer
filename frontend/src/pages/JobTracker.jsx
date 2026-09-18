import { useState, useEffect } from "react";
import { Briefcase, Plus, X, Building2, Calendar, Trash2, FileText, Link2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getHistory } from "../authApi";
import { getAllResults } from "../utils/resultsStore";

const TEAL = "#0F9D77";
const TEAL_BG = "#E7F7F1";
const AMBER = "#D97706";
const AMBER_BG = "#FEF3C7";
const RED = "#E1493C";
const RED_BG = "#FDECEB";
const BLUE = "#3B82F6";
const BLUE_BG = "#EFF6FF";
const INK = "#131B2E";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const BG = "#F6F7F9";

const STATUSES = [
  { key: "applied", label: "Applied", color: BLUE, bg: BLUE_BG },
  { key: "interview", label: "Interview", color: AMBER, bg: AMBER_BG },
  { key: "offer", label: "Offer", color: TEAL, bg: TEAL_BG },
  { key: "rejected", label: "Rejected", color: RED, bg: RED_BG },
];

function scoreColor(score) {
  return score >= 75 ? TEAL : score >= 50 ? AMBER : RED;
}

export default function JobTracker() {
  const { user, token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [linkedResumeId, setLinkedResumeId] = useState("");
  const [resumeOptions, setResumeOptions] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("resumecheck_jobs");
    if (saved) {
      try { setJobs(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("resumecheck_jobs", JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    if (user && token) {
      getHistory(token).then((data) =>
        setResumeOptions(data.map((h) => ({ id: h.id, filename: h.filename, score: h.result.match_percentage })))
      );
    } else {
      const local = getAllResults();
      setResumeOptions(local.map((h) => ({ id: h.id, filename: h.filename, score: h.result.match_percentage })));
    }
  }, [user, token]);

  const addJob = (e) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;
    const linked = resumeOptions.find((r) => r.id === linkedResumeId);
    const newJob = {
      id: Date.now(),
      company: company.trim(),
      role: role.trim(),
      status: "applied",
      date: new Date().toLocaleDateString(),
      resumeId: linkedResumeId || null,
      resumeFilename: linked?.filename || null,
      resumeScore: linked?.score || null,
    };
    setJobs([newJob, ...jobs]);
    setCompany("");
    setRole("");
    setLinkedResumeId("");
    setShowForm(false);
  };

  const updateStatus = (id, status) => {
    setJobs(jobs.map((j) => (j.id === id ? { ...j, status } : j)));
  };

  const deleteJob = (id) => {
    setJobs(jobs.filter((j) => j.id !== id));
  };

  const countByStatus = (key) => jobs.filter((j) => j.status === key).length;

  return (
    <div style={{ backgroundColor: BG, fontFamily: "'Inter', sans-serif" }} className="min-h-screen pb-20">
      <div className="text-center py-14 px-5 animate-fade-in-up" style={{ backgroundColor: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: TEAL_BG }}>
          <Briefcase size={22} color={TEAL} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: INK }}>
          Job Application Tracker
        </h1>
        <p className="text-[15px] max-w-md mx-auto" style={{ color: GRAY }}>
          Keep every application organized, and link each one to the resume you used.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-5 pt-10">
        {/* Status summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {STATUSES.map((s) => (
            <div key={s.key} className="hover-lift bg-white rounded-2xl p-4 text-center" style={{ border: `1px solid ${BORDER}` }}>
              <p className="text-2xl font-bold" style={{ color: s.color, fontFamily: "'Manrope', sans-serif" }}>{countByStatus(s.key)}</p>
              <p className="text-xs font-medium" style={{ color: GRAY }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Add button / form */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="hover-lift w-full mb-6 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-white"
            style={{ backgroundColor: TEAL }}
          >
            <Plus size={18} />
            Add Application
          </button>
        ) : (
          <form onSubmit={addJob} className="bg-white rounded-2xl p-5 mb-6 animate-fade-in-up" style={{ border: `1px solid ${BORDER}` }}>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-semibold" style={{ color: INK }}>New Application</p>
              <button type="button" onClick={() => setShowForm(false)}>
                <X size={18} color={GRAY} />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-3 mb-3">
              <input
                type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                placeholder="Company name" autoFocus
                className="rounded-xl p-3 text-sm focus:outline-none"
                style={{ border: `1px solid ${BORDER}`, color: INK }}
              />
              <input
                type="text" value={role} onChange={(e) => setRole(e.target.value)}
                placeholder="Job title"
                className="rounded-xl p-3 text-sm focus:outline-none"
                style={{ border: `1px solid ${BORDER}`, color: INK }}
              />
            </div>

            <div className="mb-3">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: GRAY }}>
                <Link2 size={12} /> Link a resume analysis (optional)
              </label>
              <select
                value={linkedResumeId}
                onChange={(e) => setLinkedResumeId(e.target.value)}
                className="w-full rounded-xl p-3 text-sm focus:outline-none bg-white"
                style={{ border: `1px solid ${BORDER}`, color: INK }}
              >
                <option value="">None — don't link a resume</option>
                {resumeOptions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.filename} — {Math.round(r.score)}% match
                  </option>
                ))}
              </select>
              {resumeOptions.length === 0 && (
                <p className="text-xs mt-1" style={{ color: GRAY }}>No saved analyses yet — analyze a resume first to link one here.</p>
              )}
            </div>

            <button type="submit" className="hover-lift w-full py-3 rounded-xl font-semibold text-white text-sm" style={{ backgroundColor: TEAL }}>
              Add to Tracker
            </button>
          </form>
        )}

        {/* Job list */}
        {jobs.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase size={32} color={BORDER} className="mx-auto mb-3" />
            <p className="text-sm" style={{ color: GRAY }}>No applications yet. Add your first one above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job, i) => {
              const statusInfo = STATUSES.find((s) => s.key === job.status);
              return (
                <div
                  key={job.id}
                  className="hover-lift bg-white rounded-2xl p-5 flex flex-col gap-3 animate-fade-in-up"
                  style={{ border: `1px solid ${BORDER}`, animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-[15px]" style={{ color: INK }}>{job.role}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 text-xs" style={{ color: GRAY }}>
                          <Building2 size={12} /> {job.company}
                        </span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: GRAY }}>
                          <Calendar size={12} /> {job.date}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {STATUSES.map((s) => (
                        <button
                          key={s.key}
                          onClick={() => updateStatus(job.id, s.key)}
                          className="text-xs font-medium px-3 py-1.5 rounded-full transition-all"
                          style={{
                            backgroundColor: job.status === s.key ? s.bg : "transparent",
                            color: job.status === s.key ? s.color : GRAY,
                            border: `1px solid ${job.status === s.key ? s.color : BORDER}`,
                          }}
                        >
                          {s.label}
                        </button>
                      ))}
                      <button onClick={() => deleteJob(job.id)} className="p-1.5 rounded-lg transition-colors hover:bg-red-50">
                        <Trash2 size={15} color={RED} />
                      </button>
                    </div>
                  </div>

                  {job.resumeFilename && (
                    <div
                      className="flex items-center gap-2 p-2.5 rounded-xl text-xs"
                      style={{ backgroundColor: BG, border: `1px solid ${BORDER}` }}
                    >
                      <FileText size={13} color={GRAY} />
                      <span style={{ color: INK }}>{job.resumeFilename}</span>
                      <span
                        className="ml-auto font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${scoreColor(job.resumeScore)}20`, color: scoreColor(job.resumeScore) }}
                      >
                        {Math.round(job.resumeScore)}% match
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}