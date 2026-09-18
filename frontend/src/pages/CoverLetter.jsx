import { useState } from "react";
import jsPDF from "jspdf";
import { PenTool, Copy, Download, Check } from "lucide-react";

const TEAL = "#0F9D77";
const TEAL_BG = "#E7F7F1";
const INK = "#131B2E";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const BG = "#F6F7F9";

function generateLetter({ name, role, company, skills, tone }) {
  const skillsList = skills.split(",").map((s) => s.trim()).filter(Boolean);
  const skillsText = skillsList.length > 0
    ? skillsList.slice(0, 3).join(", ")
    : "the relevant skills for this role";

  const openings = {
    Professional: `I am writing to express my interest in the ${role} position at ${company}. With a strong background in ${skillsText}, I am confident in my ability to contribute meaningfully to your team.`,
    Enthusiastic: `I was excited to see the ${role} opening at ${company} — it's exactly the kind of opportunity I've been looking for. My experience with ${skillsText} makes me a great fit for this role.`,
    Formal: `I am pleased to submit my application for the ${role} position at ${company}. My professional background includes substantial experience in ${skillsText}, which I believe aligns well with your requirements.`,
  };

  const body = `Throughout my career, I have developed a strong foundation in ${skillsText}, along with the ability to adapt quickly and deliver results in fast-paced environments. I am particularly drawn to ${company} because of its reputation for innovation and its commitment to excellence, and I would welcome the opportunity to bring my skills to your team.

I am confident that my background and enthusiasm make me a strong candidate for the ${role} role, and I would appreciate the chance to discuss how I can contribute to ${company}'s continued success.`;

  const closings = {
    Professional: `Thank you for considering my application. I look forward to the opportunity to speak with you further.`,
    Enthusiastic: `Thanks so much for taking the time to review my application — I can't wait to hear from you!`,
    Formal: `I appreciate your time and consideration and look forward to the possibility of discussing this opportunity further.`,
  };

  return `Dear Hiring Manager,

${openings[tone]}

${body}

${closings[tone]}

Sincerely,
${name || "[Your Name]"}`;
}

export default function CoverLetter() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [tone, setTone] = useState("Professional");
  const [letter, setLetter] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    setLetter(generateLetter({ name, role, company, skills, tone }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(letter, 170);
    doc.text(lines, 20, 25);
    doc.save("cover-letter.pdf");
  };

  return (
    <div style={{ backgroundColor: BG, fontFamily: "'Inter', sans-serif" }} className="min-h-screen pb-20">
      <div className="text-center py-14 px-5 animate-fade-in-up" style={{ backgroundColor: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: TEAL_BG }}
        >
          <PenTool size={22} color={TEAL} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: INK }}>
          Cover Letter Generator
        </h1>
        <p className="text-[15px] max-w-md mx-auto" style={{ color: GRAY }}>
          Fill in a few details and get a ready-to-edit cover letter in seconds.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-5 pt-10 grid md:grid-cols-2 gap-6">
        {/* Form */}
        <form onSubmit={handleGenerate} className="hover-lift bg-white rounded-2xl p-6 space-y-4 h-fit animate-fade-in-up" style={{ border: `1px solid ${BORDER}` }}>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: GRAY }}>Your Name</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Harshwardhan Kharat" required
              className="w-full rounded-xl p-3 text-sm focus:outline-none"
              style={{ border: `1px solid ${BORDER}`, color: INK }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: GRAY }}>Job Title</label>
            <input
              type="text" value={role} onChange={(e) => setRole(e.target.value)}
              placeholder="Python Developer" required
              className="w-full rounded-xl p-3 text-sm focus:outline-none"
              style={{ border: `1px solid ${BORDER}`, color: INK }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: GRAY }}>Company Name</label>
            <input
              type="text" value={company} onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Corp" required
              className="w-full rounded-xl p-3 text-sm focus:outline-none"
              style={{ border: `1px solid ${BORDER}`, color: INK }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: GRAY }}>Key Skills (comma-separated)</label>
            <input
              type="text" value={skills} onChange={(e) => setSkills(e.target.value)}
              placeholder="Python, SQL, AWS" required
              className="w-full rounded-xl p-3 text-sm focus:outline-none"
              style={{ border: `1px solid ${BORDER}`, color: INK }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: GRAY }}>Tone</label>
            <div className="flex gap-2">
              {["Professional", "Enthusiastic", "Formal"].map((t) => (
                <button
                  key={t} type="button" onClick={() => setTone(t)}
                  className="flex-1 py-2 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: tone === t ? TEAL : BG,
                    color: tone === t ? "#fff" : GRAY,
                    border: `1px solid ${tone === t ? TEAL : BORDER}`,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="hover-lift w-full py-3.5 rounded-xl font-semibold text-white"
            style={{ backgroundColor: TEAL }}
          >
            Generate Cover Letter
          </button>
        </form>

        {/* Preview */}
        <div className="hover-lift bg-white rounded-2xl p-6 animate-fade-in-up" style={{ border: `1px solid ${BORDER}`, animationDelay: "100ms" }}>
          {letter ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: GRAY }}>Preview</p>
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border" style={{ borderColor: BORDER, color: INK }}>
                    {copied ? <Check size={13} color={TEAL} /> : <Copy size={13} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button onClick={handleDownload} className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg text-white" style={{ backgroundColor: TEAL }}>
                    <Download size={13} />
                    PDF
                  </button>
                </div>
              </div>
              <div className="text-sm whitespace-pre-line leading-relaxed p-4 rounded-xl" style={{ backgroundColor: BG, color: INK, maxHeight: 420, overflowY: "auto" }}>
                {letter}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <PenTool size={32} color={BORDER} className="mb-3" />
              <p className="text-sm" style={{ color: GRAY }}>Fill in the form and your cover letter will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}