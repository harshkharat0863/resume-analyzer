import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const TEAL = "#0F9D77";
const GRAY = "#6B7280";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#111827", fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-5xl mx-auto px-5 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: TEAL, fontFamily: "'Manrope', sans-serif" }}>R</div>
              <span className="font-bold text-white text-[15px]" style={{ fontFamily: "'Manrope', sans-serif" }}>ResumeCheck</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: GRAY }}>
              Free AI-powered resume analyzer. Check your resume against any job description instantly.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-white">Tools</p>
            <div className="space-y-2.5">
              {["Resume Checker", "Skill Gap Analysis", "ATS Check", "Resume Tips"].map((item) => (
                <Link key={item} to="/" className="block text-sm no-underline transition-colors hover:text-white" style={{ color: GRAY }}>
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-white">Pages</p>
            <div className="space-y-2.5">
              <Link to="/" className="block text-sm no-underline transition-colors hover:text-white" style={{ color: GRAY }}>Home</Link>
              <Link to="/about" className="block text-sm no-underline transition-colors hover:text-white" style={{ color: GRAY }}>How it Works</Link>
              <Link to="/pricing" className="block text-sm no-underline transition-colors hover:text-white" style={{ color: GRAY }}>Pricing</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-white">Resources</p>
            <div className="space-y-2.5">
              {["Resume Tips", "ATS Guide", "Skills Guide", "Interview Prep"].map((item) => (
                <p key={item} className="text-sm cursor-default" style={{ color: GRAY }}>{item}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: `1px solid #1F2937` }}>
          <p className="flex items-center gap-1.5 text-xs" style={{ color: GRAY }}>
            <Shield size={13} />
            © 2026 ResumeCheck. Free resume analysis tool. No data stored.
          </p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <p key={item} className="text-xs cursor-pointer transition-colors hover:text-white" style={{ color: GRAY }}>{item}</p>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}