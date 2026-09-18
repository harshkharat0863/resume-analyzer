import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search, Home, CheckCircle2, Sparkles, LayoutTemplate, FileSearch, BookOpen,
  PenTool, Briefcase, MessageCircle, Users, Info, DollarSign, History, LogIn, GitCompare,
} from "lucide-react";

const TEAL = "#0F9D77";
const TEAL_BG = "#E7F7F1";
const INK = "#131B2E";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";

const pages = [
  { to: "/", label: "Home", icon: Home, group: "Main" },
  { to: "/about", label: "How it Works", icon: Info, group: "Main" },
  { to: "/pricing", label: "Pricing", icon: DollarSign, group: "Main" },
  { to: "/signin", label: "Sign In", icon: LogIn, group: "Main" },
  { to: "/resume-history", label: "Resume History", icon: History, group: "Main" },
  { to: "/resume-compare", label: "Compare Resumes", icon: GitCompare, group: "Main" },
  { to: "/resume-builder", label: "AI Resume Builder", icon: Sparkles, group: "Resume" },
  { to: "/", label: "Resume Checker", icon: CheckCircle2, group: "Resume" },
  { to: "/resume-templates", label: "Resume Templates", icon: LayoutTemplate, group: "Resume" },
  { to: "/resume-examples", label: "Resume Examples", icon: FileSearch, group: "Resume" },
  { to: "/resume-guide", label: "Resume Writing Guide", icon: BookOpen, group: "Resume" },
  { to: "/cover-letter", label: "Cover Letter Generator", icon: PenTool, group: "Tools" },
  { to: "/job-tracker", label: "Job Tracker", icon: Briefcase, group: "Tools" },
  { to: "/interview-prep", label: "Interview Prep", icon: MessageCircle, group: "Tools" },
  { to: "/organizations", label: "Organizations", icon: Users, group: "Organizations" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const filtered = pages.filter((p) => p.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => setActiveIndex(0), [query]);

  const handleKeyNav = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      navigate(filtered[activeIndex].to);
      setOpen(false);
    }
  };

  if (!open) return null;

  const groups = [...new Set(filtered.map((p) => p.group))];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-5"
      style={{ backgroundColor: "rgba(19,27,46,0.5)" }}
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-2xl overflow-hidden animate-fade-in-up"
        style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}
      >
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <Search size={18} color={GRAY} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyNav}
            placeholder="Search pages... (e.g. cover letter, pricing)"
            className="flex-1 text-sm focus:outline-none"
            style={{ color: INK }}
          />
          <span className="text-[10px] font-medium px-2 py-1 rounded-md" style={{ backgroundColor: "#F3F4F6", color: GRAY }}>
            ESC
          </span>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: GRAY }}>No pages found.</p>
          ) : (
            groups.map((group) => (
              <div key={group} className="mb-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide px-3 py-1" style={{ color: GRAY }}>{group}</p>
                {filtered.filter((p) => p.group === group).map((page) => {
                  const globalIndex = filtered.indexOf(page);
                  const isActive = globalIndex === activeIndex;
                  return (
                    <div
                      key={page.label}
                      onClick={() => { navigate(page.to); setOpen(false); }}
                      onMouseEnter={() => setActiveIndex(globalIndex)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors"
                      style={{ backgroundColor: isActive ? TEAL_BG : "transparent" }}
                    >
                      <page.icon size={16} color={isActive ? TEAL : GRAY} />
                      <span className="text-sm font-medium" style={{ color: isActive ? TEAL : INK }}>{page.label}</span>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}