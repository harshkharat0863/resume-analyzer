import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  Menu, X, User, ArrowRight, ChevronDown, PenTool, Briefcase, MessageCircle,
  Sparkles, CheckCircle2, LayoutTemplate, FileSearch, Users, GraduationCap, Users2,
} from "lucide-react";
import { TEAL, TEAL_BG, INK, GRAY, BORDER, fontHeading } from "../theme";
import { useAuth } from "../context/AuthContext";

const tools = [
  { to: "/cover-letter", icon: PenTool, label: "Cover Letter Generator", desc: "Write a tailored cover letter" },
  { to: "/job-tracker", icon: Briefcase, label: "Job Tracker", desc: "Organize your applications" },
  { to: "/interview-prep", icon: MessageCircle, label: "Interview Prep", desc: "Practice common questions" },
];

const resumeTools = [
  { to: "/resume-builder", icon: Sparkles, label: "AI Resume Builder", desc: "Helps you land interviews" },
  { to: "/", icon: CheckCircle2, label: "Resume Checker", desc: "Is your resume good enough?" },
  { to: "/resume-templates", icon: LayoutTemplate, label: "Resume Templates", desc: "Free and premium templates" },
  { to: "/resume-examples", icon: FileSearch, label: "Resume Examples", desc: "Browse real examples" },
];

const resumeLearning = [
  { to: "/resume-guide#write", label: "How to write a resume" },
  { to: "/resume-guide#format", label: "Choosing a resume format" },
  { to: "/resume-guide#summary", label: "Writing a resume summary" },
  { to: "/resume-guide#onepage", label: "Fit your experience on one page" },
];

const orgUseCases = [
  { to: "/organizations#recruitment", icon: Users, label: "Recruitment", desc: "On-brand resumes that land interviews" },
  { to: "/organizations#education", icon: GraduationCap, label: "Higher Education", desc: "Support more students at scale" },
  { to: "/organizations#coaches", icon: Users2, label: "Career Coaches", desc: "Deliver ATS-friendly resumes faster" },
];

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const toolsRef = useRef(null);
  const resumeRef = useRef(null);
  const orgRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) setToolsOpen(false);
      if (resumeRef.current && !resumeRef.current.contains(e.target)) setResumeOpen(false);
      if (orgRef.current && !orgRef.current.contains(e.target)) setOrgOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => { setMenuOpen(false); setToolsOpen(false); setResumeOpen(false); setOrgOpen(false); };

  return (
    <nav className="w-full bg-white sticky top-0 z-50" style={{ borderBottom: `1px solid ${BORDER}` }}>
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline group" onClick={closeMenu}>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3"
            style={{ backgroundColor: TEAL }}
          >
            R
          </div>
          <span className="font-bold text-[15px]" style={{ color: INK, fontFamily: fontHeading }}>ResumeCheck</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 ml-10">
          <Link
            to="/"
            className="text-sm no-underline"
            style={{ color: location.pathname === "/" ? TEAL : GRAY, fontWeight: location.pathname === "/" ? 600 : 400 }}
          >
            Home
          </Link>

          {/* Resume dropdown */}
          <div ref={resumeRef} className="relative">
            <button
              onClick={() => { setResumeOpen(!resumeOpen); setToolsOpen(false); setOrgOpen(false); }}
              className="flex items-center gap-1 text-sm"
              style={{ color: resumeOpen ? TEAL : GRAY, fontWeight: resumeOpen ? 600 : 400 }}
            >
              Resume
              <ChevronDown size={14} className="transition-transform duration-200" style={{ transform: resumeOpen ? "rotate(180deg)" : "none" }} />
            </button>

            {resumeOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[500px] bg-white rounded-2xl p-4 grid grid-cols-2 gap-4 animate-fade-in-up"
                style={{ border: `1px solid ${BORDER}`, boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}
              >
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide px-2 mb-1" style={{ color: GRAY }}>Tools</p>
                  {resumeTools.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={closeMenu}
                      className="flex items-start gap-3 p-2 rounded-xl no-underline transition-colors hover:bg-gray-50"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: TEAL_BG }}>
                        <item.icon size={15} color={TEAL} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: INK }}>{item.label}</p>
                        <p className="text-xs" style={{ color: GRAY }}>{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div style={{ borderLeft: `1px solid ${BORDER}` }} className="pl-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide px-2 mb-1" style={{ color: GRAY }}>Learning</p>
                  {resumeLearning.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={closeMenu}
                      className="block p-2 rounded-xl text-sm no-underline transition-colors hover:bg-gray-50"
                      style={{ color: TEAL }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tools dropdown */}
          <div ref={toolsRef} className="relative">
            <button
              onClick={() => { setToolsOpen(!toolsOpen); setResumeOpen(false); setOrgOpen(false); }}
              className="flex items-center gap-1 text-sm"
              style={{ color: toolsOpen ? TEAL : GRAY, fontWeight: toolsOpen ? 600 : 400 }}
            >
              Tools
              <ChevronDown size={14} className="transition-transform duration-200" style={{ transform: toolsOpen ? "rotate(180deg)" : "none" }} />
            </button>

            {toolsOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-white rounded-2xl p-2 animate-fade-in-up"
                style={{ border: `1px solid ${BORDER}`, boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}
              >
                {tools.map((tool) => (
                  <Link
                    key={tool.to}
                    to={tool.to}
                    onClick={closeMenu}
                    className="flex items-start gap-3 p-3 rounded-xl no-underline transition-colors hover:bg-gray-50"
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: TEAL_BG }}>
                      <tool.icon size={16} color={TEAL} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: INK }}>{tool.label}</p>
                      <p className="text-xs" style={{ color: GRAY }}>{tool.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Organizations dropdown */}
          <div ref={orgRef} className="relative">
            <button
              onClick={() => { setOrgOpen(!orgOpen); setToolsOpen(false); setResumeOpen(false); }}
              className="flex items-center gap-1 text-sm"
              style={{ color: orgOpen ? TEAL : GRAY, fontWeight: orgOpen ? 600 : 400 }}
            >
              Organizations
              <ChevronDown size={14} className="transition-transform duration-200" style={{ transform: orgOpen ? "rotate(180deg)" : "none" }} />
            </button>

            {orgOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-white rounded-2xl p-4 animate-fade-in-up"
                style={{ border: `1px solid ${BORDER}`, boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wide px-2 mb-1" style={{ color: GRAY }}>Use Cases</p>
                {orgUseCases.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeMenu}
                    className="flex items-start gap-3 p-2 rounded-xl no-underline transition-colors hover:bg-gray-50"
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: TEAL_BG }}>
                      <item.icon size={16} color={TEAL} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: INK }}>{item.label}</p>
                      <p className="text-xs" style={{ color: GRAY }}>{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/about"
            className="text-sm no-underline"
            style={{ color: location.pathname === "/about" ? TEAL : GRAY, fontWeight: location.pathname === "/about" ? 600 : 400 }}
          >
            How it Works
          </Link>
          <Link
            to="/pricing"
            className="text-sm no-underline"
            style={{ color: location.pathname === "/pricing" ? TEAL : GRAY, fontWeight: location.pathname === "/pricing" ? 600 : 400 }}
          >
            Pricing
          </Link>

          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
            className="hidden lg:flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: "#F6F7F9", color: GRAY, border: `1px solid ${BORDER}` }}
          >
            Search
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#fff", border: `1px solid ${BORDER}` }}>
              Ctrl K
            </span>
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="flex items-center gap-1.5 text-sm font-medium no-underline transition-opacity hover:opacity-70" style={{ color: INK }}>
                <User size={15} />
                {user.name.split(" ")[0]}
              </Link>
              <button onClick={logout} className="text-xs font-medium" style={{ color: GRAY, background: "none", border: "none", cursor: "pointer" }}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/signin" className="flex items-center gap-1.5 text-sm font-medium no-underline transition-opacity hover:opacity-70" style={{ color: INK }}>
              <User size={15} />
              Sign In
            </Link>
          )}
          <Link
            to="/"
            className="hover-lift flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-1.5 rounded-lg no-underline"
            style={{ backgroundColor: TEAL }}
          >
            Get Started
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex items-center justify-center w-9 h-9 transition-transform duration-200 active:scale-90"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} color={INK} /> : <Menu size={22} color={INK} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-5 pb-5 pt-2 space-y-1 animate-fade-in-up max-h-[80vh] overflow-y-auto" style={{ borderTop: `1px solid ${BORDER}` }}>
          <Link to="/" onClick={closeMenu} className="block py-2.5 text-sm no-underline font-medium" style={{ color: INK }}>Home</Link>

          <p className="text-xs font-semibold uppercase tracking-wide pt-3 pb-1" style={{ color: GRAY }}>Resume</p>
          {resumeTools.map((item) => (
            <Link key={item.to} to={item.to} onClick={closeMenu} className="flex items-center gap-2 py-2 text-sm no-underline" style={{ color: INK }}>
              <item.icon size={15} color={TEAL} />
              {item.label}
            </Link>
          ))}

          <p className="text-xs font-semibold uppercase tracking-wide pt-3 pb-1" style={{ color: GRAY }}>Tools</p>
          {tools.map((tool) => (
            <Link key={tool.to} to={tool.to} onClick={closeMenu} className="flex items-center gap-2 py-2 text-sm no-underline" style={{ color: INK }}>
              <tool.icon size={15} color={TEAL} />
              {tool.label}
            </Link>
          ))}

          <p className="text-xs font-semibold uppercase tracking-wide pt-3 pb-1" style={{ color: GRAY }}>Organizations</p>
          {orgUseCases.map((item) => (
            <Link key={item.to} to={item.to} onClick={closeMenu} className="flex items-center gap-2 py-2 text-sm no-underline" style={{ color: INK }}>
              <item.icon size={15} color={TEAL} />
              {item.label}
            </Link>
          ))}

          <Link to="/about" onClick={closeMenu} className="block py-2.5 text-sm no-underline" style={{ color: INK }}>How it Works</Link>
          <Link to="/pricing" onClick={closeMenu} className="block py-2.5 text-sm no-underline" style={{ color: INK }}>Pricing</Link>

          {user ? (
            <>
              <Link to="/dashboard" onClick={closeMenu} className="flex items-center gap-1.5 py-2.5 mt-1 text-sm no-underline font-medium" style={{ color: INK }}>
                <User size={15} />
                {user.name.split(" ")[0]}
              </Link>
              <button
                onClick={() => { logout(); closeMenu(); }}
                className="text-sm py-2.5 text-left w-full"
                style={{ color: GRAY, background: "none", border: "none", cursor: "pointer" }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/signin" onClick={closeMenu} className="flex items-center gap-1.5 py-2.5 mt-1 text-sm no-underline font-medium" style={{ color: INK }}>
              <User size={15} />
              Sign In
            </Link>
          )}

          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center justify-center gap-1.5 mt-2 text-sm font-semibold text-white px-4 py-2.5 rounded-lg no-underline"
            style={{ backgroundColor: TEAL }}
          >
            Get Started
            <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </nav>
  );
}