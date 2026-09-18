import { useNavigate } from "react-router-dom";
import { Check, Sparkles, Minus } from "lucide-react";

const TEAL = "#0F9D77";
const TEAL_BG = "#E7F7F1";
const INK = "#131B2E";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const BG = "#F6F7F9";

const free = [
  "Upload PDF or DOCX resume",
  "Instant skill match score",
  "Matched & missing skills",
  "ATS compatibility check",
  "Basic improvement suggestions",
  "Downloadable PDF report",
];

const pro = [
  "Everything in Free",
  "Unlimited resume checks",
  "Section-aware analysis (Experience, Education, Skills)",
  "Advanced ATS keyword suggestions",
  "AI-powered rewrite suggestions",
  "Priority processing",
  "PDF report with branding",
  "Email support",
];

const faqs = [
  { q: "Is the free plan really free?", a: "Yes — completely free, no credit card required, no sign-up needed. Upload and analyze instantly." },
  { q: "What does Pro add?", a: "Pro gives you deeper analysis, section-by-section feedback, AI-powered suggestions, and a branded PDF report." },
  { q: "Is my resume data safe?", a: "Yes. We never store or share your resume. All analysis happens in memory and is discarded immediately." },
  { q: "Can I cancel Pro anytime?", a: "Yes. No contracts, no lock-in. Cancel anytime from your account settings." },
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: BG, fontFamily: "'Inter', sans-serif" }}>
      <div className="text-center py-16 px-5 animate-fade-in-up" style={{ backgroundColor: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-5 tracking-wide" style={{ backgroundColor: TEAL_BG, color: TEAL }}>
          PRICING
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: INK }}>
          Simple, honest pricing
        </h1>
        <p className="text-[15px] max-w-md mx-auto" style={{ color: GRAY }}>
          Start for free. Upgrade when you need more.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free plan */}
          <div className="hover-lift bg-white rounded-2xl p-8 animate-fade-in-up" style={{ border: `1px solid ${BORDER}` }}>
            <div className="mb-6">
              <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3" style={{ backgroundColor: BG, color: GRAY, border: `1px solid ${BORDER}` }}>
                FREE PLAN
              </span>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-5xl font-extrabold" style={{ color: INK, fontFamily: "'Manrope', sans-serif" }}>₹0</span>
              </div>
              <p className="text-sm" style={{ color: GRAY }}>Forever free · No sign-up needed</p>
            </div>

            <button
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-xl font-semibold text-sm mb-6 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ border: `2px solid ${TEAL}`, color: TEAL, backgroundColor: "transparent" }}
            >
              Get Started Free
            </button>

            <div className="space-y-3">
              {free.map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: TEAL_BG }}>
                    <Check size={10} strokeWidth={3} color={TEAL} />
                  </span>
                  <span className="text-sm" style={{ color: INK }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro plan */}
          <div className="hover-lift rounded-2xl p-8 relative animate-fade-in-up" style={{ backgroundColor: INK, border: `2px solid ${TEAL}`, animationDelay: "100ms" }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs font-semibold px-4 py-1 rounded-full text-white" style={{ backgroundColor: TEAL }}>
              <Sparkles size={12} />
              MOST POPULAR
            </div>

            <div className="mb-6">
              <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3" style={{ backgroundColor: TEAL_BG, color: TEAL }}>
                PRO PLAN
              </span>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-5xl font-extrabold text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>₹663</span>
                <span className="text-sm mb-2" style={{ color: GRAY }}>/mo</span>
              </div>
              <p className="text-sm" style={{ color: GRAY }}>Billed quarterly · Cancel anytime</p>
            </div>

            <button
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-xl font-semibold text-sm mb-6 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: TEAL }}
            >
              Start Pro →
            </button>

            <div className="space-y-3">
              {pro.map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "rgba(15,157,119,0.2)" }}>
                    <Check size={10} strokeWidth={3} color={TEAL} />
                  </span>
                  <span className="text-sm text-white">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature comparison table */}
        <div className="hover-lift mt-12 bg-white rounded-2xl overflow-hidden animate-fade-in-up" style={{ border: `1px solid ${BORDER}`, animationDelay: "180ms" }}>
          <div className="grid grid-cols-3 text-xs font-semibold uppercase tracking-wide px-6 py-3" style={{ backgroundColor: BG, color: GRAY, borderBottom: `1px solid ${BORDER}` }}>
            <span>Feature</span>
            <span className="text-center">Free</span>
            <span className="text-center">Pro</span>
          </div>
          {[
            ["Resume upload", true, true],
            ["Skill match score", true, true],
            ["ATS check", true, true],
            ["Basic suggestions", true, true],
            ["PDF report download", true, true],
            ["Section-aware analysis", false, true],
            ["AI rewrite suggestions", false, true],
            ["Branded PDF report", false, true],
            ["Unlimited checks", false, true],
            ["Priority processing", false, true],
          ].map(([feature, freeVal, proVal]) => (
            <div key={feature} className="grid grid-cols-3 px-6 py-3 text-sm border-b last:border-0" style={{ borderColor: BORDER }}>
              <span style={{ color: INK }}>{feature}</span>
              <span className="flex justify-center">
                {freeVal ? <Check size={16} strokeWidth={2.5} color={TEAL} /> : <Minus size={16} color="#D1D5DB" />}
              </span>
              <span className="flex justify-center">
                {proVal ? <Check size={16} strokeWidth={2.5} color={TEAL} /> : <Minus size={16} color="#D1D5DB" />}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pb-16">
        <h2 className="text-xl font-bold mb-6 text-center" style={{ color: INK }}>
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.q} className="hover-lift bg-white rounded-2xl p-5" style={{ border: `1px solid ${BORDER}` }}>
              <p className="font-semibold text-[14px] mb-1.5" style={{ color: INK }}>{faq.q}</p>
              <p className="text-sm leading-relaxed" style={{ color: GRAY }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="py-16 text-center" style={{ backgroundColor: INK }}>
        <h2 className="text-2xl font-bold text-white mb-3">Start for free today</h2>
        <p className="text-sm mb-6" style={{ color: GRAY }}>No sign-up. No credit card. Just upload and go.</p>
        <button
          onClick={() => navigate("/")}
          className="hover-lift px-8 py-3.5 rounded-xl font-semibold text-white"
          style={{ backgroundColor: TEAL }}
        >
          Check My Resume →
        </button>
      </div>
    </div>
  );
}