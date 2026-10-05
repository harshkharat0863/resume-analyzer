import { useNavigate } from "react-router-dom";
import { LayoutTemplate, Check } from "lucide-react";
import { TEAL, TEAL_BG, INK, GRAY, BORDER, BG } from "../theme";

const templates = [
  {
    id: "minimal",
    name: "Minimal",
    desc: "Clean and simple. Great for tech and startup roles.",
    accent: TEAL,
    layout: "left-align",
    free: true,
  },
  {
    id: "classic",
    name: "Classic",
    desc: "Traditional format. Ideal for corporate and finance roles.",
    accent: "#131B2E",
    layout: "centered",
    free: true,
  },
  {
    id: "modern",
    name: "Modern",
    desc: "Bold accent color with sidebar. Great for design and marketing.",
    accent: "#3B82F6",
    layout: "sidebar",
    free: false,
  },
  {
    id: "compact",
    name: "Compact",
    desc: "Fits more content per page. Good for senior/experienced roles.",
    accent: "#D97706",
    layout: "compact",
    free: false,
  },
];

function TemplatePreview({ template }) {
  if (template.layout === "sidebar") {
    return (
      <div className="w-full h-full flex rounded-lg overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        <div className="w-1/3 h-full p-2" style={{ backgroundColor: template.accent }}>
          <div className="w-6 h-6 rounded-full /30 mb-2" style={{ backgroundColor: "var(--bg-card)" }} />
          <div className="h-1 w-full /40 rounded mb-1" style={{ backgroundColor: "var(--bg-card)" }} />
          <div className="h-1 w-2/3 /40 rounded" style={{ backgroundColor: "var(--bg-card)" }} />
        </div>
        <div className="flex-1 p-2 space-y-1.5">
          <div className="h-1.5 w-1/2 rounded" style={{ backgroundColor: template.accent }} />
          <div className="h-1 w-full rounded" style={{ backgroundColor: "var(--track)" }} />
          <div className="h-1 w-full rounded" style={{ backgroundColor: "var(--track)" }} />
          <div className="h-1 w-3/4 rounded" style={{ backgroundColor: "var(--track)" }} />
        </div>
      </div>
    );
  }
  if (template.layout === "centered") {
    return (
      <div className="w-full h-full rounded-lg p-3 flex flex-col items-center" style={{ border: `1px solid ${BORDER}` }}>
        <div className="h-2 w-1/2 rounded mb-1" style={{ backgroundColor: template.accent }} />
        <div className="h-1 w-1/3 rounded mb-3" style={{ backgroundColor: "var(--track)" }} />
        <div className="w-full h-px mb-2" style={{ backgroundColor: "var(--track)" }} />
        <div className="h-1 w-full rounded mb-1" style={{ backgroundColor: "var(--track)" }} />
        <div className="h-1 w-full rounded mb-1" style={{ backgroundColor: "var(--track)" }} />
        <div className="h-1 w-2/3 rounded" style={{ backgroundColor: "var(--track)" }} />
      </div>
    );
  }
  if (template.layout === "compact") {
    return (
      <div className="w-full h-full rounded-lg p-2 space-y-1" style={{ border: `1px solid ${BORDER}` }}>
        <div className="h-1.5 w-2/5 rounded" style={{ backgroundColor: template.accent }} />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-0.5 w-full rounded" style={{ backgroundColor: "var(--track)" }} />
        ))}
      </div>
    );
  }
  return (
    <div className="w-full h-full rounded-lg p-3 space-y-1.5" style={{ border: `1px solid ${BORDER}` }}>
      <div className="h-2 w-1/2 rounded" style={{ backgroundColor: template.accent }} />
      <div className="h-1 w-1/3 rounded mb-2" style={{ backgroundColor: "var(--track)" }} />
      <div className="h-1 w-full rounded" style={{ backgroundColor: "var(--track)" }} />
      <div className="h-1 w-full rounded" style={{ backgroundColor: "var(--track)" }} />
      <div className="h-1 w-3/4 rounded" style={{ backgroundColor: "var(--track)" }} />
    </div>
  );
}

export default function ResumeTemplates() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: BG, fontFamily: "'Inter', sans-serif" }} className="min-h-screen pb-20">
      <div className="text-center py-14 px-5 animate-fade-in-up" style={{ backgroundColor: "var(--bg-card)", borderBottom: `1px solid ${BORDER}` }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: TEAL_BG }}>
          <LayoutTemplate size={22} color={TEAL} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: INK }}>
          Resume Templates
        </h1>
        <p className="text-[15px] max-w-md mx-auto" style={{ color: GRAY }}>
          Pick a style, then build your resume with it in the AI Resume Builder.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-5 pt-10">
        <div className="grid sm:grid-cols-2 gap-5">
          {templates.map((t, i) => (
            <div
              key={t.id}
              className="hover-lift rounded-2xl p-5 animate-fade-in-up"
              style={{ backgroundColor: "var(--bg-card)", border: `1px solid ${BORDER}`, animationDelay: `${i * 60}ms` }}
            >
              <div className="h-44 mb-4">
                <TemplatePreview template={t} />
              </div>
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-[15px]" style={{ color: INK }}>{t.name}</p>
                {t.free ? (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: TEAL_BG, color: TEAL }}>FREE</span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#FEF3C7", color: "#D97706" }}>PRO</span>
                )}
              </div>
              <p className="text-xs mb-4" style={{ color: GRAY }}>{t.desc}</p>
              <button
                onClick={() => navigate("/resume-builder")}
                className="hover-lift w-full py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  backgroundColor: t.free ? TEAL : "transparent",
                  color: t.free ? "#fff" : TEAL,
                  border: t.free ? "none" : `2px solid ${TEAL}`,
                }}
              >
                {t.free ? "Use This Template" : "Upgrade to Use"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}