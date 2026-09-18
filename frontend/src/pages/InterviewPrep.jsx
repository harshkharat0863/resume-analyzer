import { useState } from "react";
import { MessageCircle, ChevronLeft, ChevronRight, Lightbulb, RotateCcw } from "lucide-react";

const TEAL = "#0F9D77";
const TEAL_BG = "#E7F7F1";
const INK = "#131B2E";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const BG = "#F6F7F9";

const categories = {
  "Behavioral": [
    { q: "Tell me about yourself.", tip: "Keep it to 60-90 seconds. Structure: current role → key experience → why you're excited about this opportunity." },
    { q: "Describe a time you faced a conflict at work and how you handled it.", tip: "Use the STAR method: Situation, Task, Action, Result. Focus on your specific contribution to resolving it." },
    { q: "Tell me about a time you failed. What did you learn?", tip: "Pick a real, moderate failure — not catastrophic, not trivial. Emphasize the lesson and how you applied it afterward." },
    { q: "Why do you want to work here?", tip: "Reference something specific about the company — a product, value, or recent news — not generic praise." },
    { q: "Where do you see yourself in 5 years?", tip: "Show ambition tied to growth within this type of role, not a completely different career path." },
  ],
  "Technical": [
    { q: "Walk me through a recent project you're proud of.", tip: "Focus on your specific role, the technical decisions you made, and the measurable outcome." },
    { q: "How do you approach debugging a difficult issue?", tip: "Mention a systematic process: reproduce, isolate, hypothesize, test, verify — not just 'I use print statements.'" },
    { q: "How do you stay updated with new technologies?", tip: "Name specific resources (newsletters, communities, projects) rather than a vague 'I read blogs.'" },
    { q: "Describe a technical decision you disagreed with. What did you do?", tip: "Show you can disagree respectfully and back your position with data, while still being a team player." },
  ],
  "Situational": [
    { q: "How do you prioritize tasks when everything feels urgent?", tip: "Mention a concrete framework (e.g. impact vs effort, deadlines, stakeholder input) rather than 'I just do what's needed.'" },
    { q: "How would you handle disagreeing with your manager's decision?", tip: "Emphasize private, respectful pushback with reasoning — then committing once a decision is made." },
    { q: "Describe how you'd onboard yourself into a new team quickly.", tip: "Talk about proactive learning: documentation, 1:1s with teammates, and taking on a small early win." },
  ],
};

export default function InterviewPrep() {
  const [category, setCategory] = useState("Behavioral");
  const [index, setIndex] = useState(0);
  const [showTip, setShowTip] = useState(false);

  const questions = categories[category];
  const current = questions[index];

  const goNext = () => {
    setShowTip(false);
    setIndex((i) => (i + 1) % questions.length);
  };

  const goPrev = () => {
    setShowTip(false);
    setIndex((i) => (i - 1 + questions.length) % questions.length);
  };

  const switchCategory = (cat) => {
    setCategory(cat);
    setIndex(0);
    setShowTip(false);
  };

  return (
    <div style={{ backgroundColor: BG, fontFamily: "'Inter', sans-serif" }} className="min-h-screen pb-20">
      <div className="text-center py-14 px-5 animate-fade-in-up" style={{ backgroundColor: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: TEAL_BG }}>
          <MessageCircle size={22} color={TEAL} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: INK }}>
          Interview Prep
        </h1>
        <p className="text-[15px] max-w-md mx-auto" style={{ color: GRAY }}>
          Practice common interview questions, one at a time, with tips on how to answer well.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-10">
        {/* Category tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {Object.keys(categories).map((cat) => (
            <button
              key={cat}
              onClick={() => switchCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: category === cat ? TEAL : "#fff",
                color: category === cat ? "#fff" : GRAY,
                border: `1px solid ${category === cat ? TEAL : BORDER}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Question card */}
        <div key={`${category}-${index}`} className="hover-lift bg-white rounded-2xl p-8 text-center animate-fade-in" style={{ border: `1px solid ${BORDER}` }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: GRAY }}>
            Question {index + 1} of {questions.length}
          </p>
          <h2 className="text-xl md:text-2xl font-bold mb-6 leading-snug" style={{ color: INK, fontFamily: "'Manrope', sans-serif" }}>
            {current.q}
          </h2>

          {!showTip ? (
            <button
              onClick={() => setShowTip(true)}
              className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: TEAL_BG, color: TEAL }}
            >
              <Lightbulb size={15} />
              Show tip
            </button>
          ) : (
            <div className="animate-fade-in text-left rounded-xl p-4 text-sm leading-relaxed flex gap-3" style={{ backgroundColor: BG, color: INK }}>
              <Lightbulb size={16} color={TEAL} className="flex-shrink-0 mt-0.5" />
              {current.tip}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button onClick={goPrev} className="hover-lift flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium bg-white" style={{ border: `1px solid ${BORDER}`, color: INK }}>
            <ChevronLeft size={16} />
            Previous
          </button>
          <button onClick={() => switchCategory(category)} className="p-2 rounded-xl transition-colors hover:bg-gray-100">
            <RotateCcw size={16} color={GRAY} />
          </button>
          <button onClick={goNext} className="hover-lift flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: TEAL }}>
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}