import { useState } from "react";
import jsPDF from "jspdf";
import { Sparkles, Plus, Trash2, Download } from "lucide-react";

const TEAL = "#0F9D77";
const TEAL_BG = "#E7F7F1";
const INK = "#131B2E";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const BG = "#F6F7F9";

const emptyExp = () => ({ id: Date.now() + Math.random(), title: "", company: "", duration: "", details: "" });
const emptyEdu = () => ({ id: Date.now() + Math.random(), degree: "", school: "", year: "" });

export default function ResumeBuilder() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState([emptyExp()]);
  const [education, setEducation] = useState([emptyEdu()]);

  const updateExp = (id, field, value) =>
    setExperience(experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  const updateEdu = (id, field, value) =>
    setEducation(education.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  const addExp = () => setExperience([...experience, emptyExp()]);
  const removeExp = (id) => setExperience(experience.filter((e) => e.id !== id));
  const addEdu = () => setEducation([...education, emptyEdu()]);
  const removeEdu = (id) => setEducation(education.filter((e) => e.id !== id));

  const handleDownload = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(19, 27, 46);
    doc.text(name || "Your Name", 15, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(15, 157, 119);
    doc.text(title || "Your Job Title", 15, y);
    y += 7;

    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text([email, phone].filter(Boolean).join("  ·  "), 15, y);
    y += 10;

    doc.setDrawColor(229, 231, 235);
    doc.line(15, y, 195, y);
    y += 8;

    if (summary) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(19, 27, 46);
      doc.text("SUMMARY", 15, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      const lines = doc.splitTextToSize(summary, 180);
      doc.text(lines, 15, y);
      y += lines.length * 5 + 8;
    }

    if (experience.some((e) => e.title || e.company)) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(19, 27, 46);
      doc.text("EXPERIENCE", 15, y);
      y += 7;
      experience.forEach((exp) => {
        if (!exp.title && !exp.company) return;
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(19, 27, 46);
        doc.text(`${exp.title || "Job Title"} — ${exp.company || "Company"}`, 15, y);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(107, 114, 128);
        doc.text(exp.duration || "", 195, y, { align: "right" });
        y += 5;
        if (exp.details) {
          doc.setFontSize(9.5);
          doc.setTextColor(60, 60, 60);
          const lines = doc.splitTextToSize(exp.details, 180);
          doc.text(lines, 15, y);
          y += lines.length * 5;
        }
        y += 6;
      });
      y += 2;
    }

    if (education.some((e) => e.degree || e.school)) {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(19, 27, 46);
      doc.text("EDUCATION", 15, y);
      y += 7;
      education.forEach((edu) => {
        if (!edu.degree && !edu.school) return;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(19, 27, 46);
        doc.text(edu.degree || "Degree", 15, y);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(107, 114, 128);
        doc.text(edu.year || "", 195, y, { align: "right" });
        y += 5;
        doc.setFontSize(9.5);
        doc.setTextColor(60, 60, 60);
        doc.text(edu.school || "", 15, y);
        y += 8;
      });
    }

    if (skills) {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(19, 27, 46);
      doc.text("SKILLS", 15, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(60, 60, 60);
      const lines = doc.splitTextToSize(skills, 180);
      doc.text(lines, 15, y);
    }

    doc.save(`${name || "resume"}.pdf`);
  };

  const inputStyle = { border: `1px solid ${BORDER}`, color: INK };

  return (
    <div style={{ backgroundColor: BG, fontFamily: "'Inter', sans-serif" }} className="min-h-screen pb-20">
      <div className="text-center py-14 px-5 animate-fade-in-up" style={{ backgroundColor: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: TEAL_BG }}>
          <Sparkles size={22} color={TEAL} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: INK }}>
          AI Resume Builder
        </h1>
        <p className="text-[15px] max-w-md mx-auto" style={{ color: GRAY }}>
          Fill in your details, preview it live, and download a clean PDF resume.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-5 pt-10 grid md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-4">
          <div className="hover-lift bg-white rounded-2xl p-5 space-y-3 animate-fade-in-up" style={{ border: `1px solid ${BORDER}` }}>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: GRAY }}>Contact Info</p>
            <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl p-3 text-sm focus:outline-none" style={inputStyle} />
            <input placeholder="Job Title (e.g. Python Developer)" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl p-3 text-sm focus:outline-none" style={inputStyle} />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl p-3 text-sm focus:outline-none" style={inputStyle} />
              <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl p-3 text-sm focus:outline-none" style={inputStyle} />
            </div>
          </div>

          <div className="hover-lift bg-white rounded-2xl p-5 space-y-3 animate-fade-in-up" style={{ border: `1px solid ${BORDER}`, animationDelay: "60ms" }}>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: GRAY }}>Summary</p>
            <textarea rows={3} placeholder="2-3 sentences about your experience and goals" value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full rounded-xl p-3 text-sm focus:outline-none resize-none" style={inputStyle} />
          </div>

          <div className="hover-lift bg-white rounded-2xl p-5 space-y-3 animate-fade-in-up" style={{ border: `1px solid ${BORDER}`, animationDelay: "100ms" }}>
            <div className="flex justify-between items-center">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: GRAY }}>Experience</p>
              <button onClick={addExp} className="flex items-center gap-1 text-xs font-medium" style={{ color: TEAL }}>
                <Plus size={14} /> Add
              </button>
            </div>
            {experience.map((exp) => (
              <div key={exp.id} className="p-3 rounded-xl space-y-2" style={{ backgroundColor: BG }}>
                <div className="flex justify-between gap-2">
                  <input placeholder="Job Title" value={exp.title} onChange={(e) => updateExp(exp.id, "title", e.target.value)} className="flex-1 rounded-lg p-2 text-sm focus:outline-none bg-white" style={inputStyle} />
                  <button onClick={() => removeExp(exp.id)}><Trash2 size={15} color="#E1493C" /></button>
                </div>
                <input placeholder="Company" value={exp.company} onChange={(e) => updateExp(exp.id, "company", e.target.value)} className="w-full rounded-lg p-2 text-sm focus:outline-none bg-white" style={inputStyle} />
                <input placeholder="Duration (e.g. 2022 - Present)" value={exp.duration} onChange={(e) => updateExp(exp.id, "duration", e.target.value)} className="w-full rounded-lg p-2 text-sm focus:outline-none bg-white" style={inputStyle} />
                <textarea rows={2} placeholder="Key responsibilities / achievements" value={exp.details} onChange={(e) => updateExp(exp.id, "details", e.target.value)} className="w-full rounded-lg p-2 text-sm focus:outline-none resize-none bg-white" style={inputStyle} />
              </div>
            ))}
          </div>

          <div className="hover-lift bg-white rounded-2xl p-5 space-y-3 animate-fade-in-up" style={{ border: `1px solid ${BORDER}`, animationDelay: "140ms" }}>
            <div className="flex justify-between items-center">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: GRAY }}>Education</p>
              <button onClick={addEdu} className="flex items-center gap-1 text-xs font-medium" style={{ color: TEAL }}>
                <Plus size={14} /> Add
              </button>
            </div>
            {education.map((edu) => (
              <div key={edu.id} className="p-3 rounded-xl space-y-2" style={{ backgroundColor: BG }}>
                <div className="flex justify-between gap-2">
                  <input placeholder="Degree" value={edu.degree} onChange={(e) => updateEdu(edu.id, "degree", e.target.value)} className="flex-1 rounded-lg p-2 text-sm focus:outline-none bg-white" style={inputStyle} />
                  <button onClick={() => removeEdu(edu.id)}><Trash2 size={15} color="#E1493C" /></button>
                </div>
                <input placeholder="School / University" value={edu.school} onChange={(e) => updateEdu(edu.id, "school", e.target.value)} className="w-full rounded-lg p-2 text-sm focus:outline-none bg-white" style={inputStyle} />
                <input placeholder="Year (e.g. 2024)" value={edu.year} onChange={(e) => updateEdu(edu.id, "year", e.target.value)} className="w-full rounded-lg p-2 text-sm focus:outline-none bg-white" style={inputStyle} />
              </div>
            ))}
          </div>

          <div className="hover-lift bg-white rounded-2xl p-5 space-y-3 animate-fade-in-up" style={{ border: `1px solid ${BORDER}`, animationDelay: "180ms" }}>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: GRAY }}>Skills (comma-separated)</p>
            <input placeholder="Python, SQL, AWS, React" value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full rounded-xl p-3 text-sm focus:outline-none" style={inputStyle} />
          </div>
        </div>

        {/* Live preview */}
        <div className="hover-lift bg-white rounded-2xl p-6 h-fit sticky top-20 animate-fade-in-up" style={{ border: `1px solid ${BORDER}`, animationDelay: "60ms" }}>
          <div className="flex justify-between items-center mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: GRAY }}>Live Preview</p>
            <button onClick={handleDownload} className="hover-lift flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg text-white" style={{ backgroundColor: TEAL }}>
              <Download size={13} /> PDF
            </button>
          </div>

          <div className="p-5 rounded-xl" style={{ backgroundColor: "#fff", border: `1px solid ${BORDER}`, minHeight: 400 }}>
            <h2 className="text-xl font-bold" style={{ color: INK, fontFamily: "'Manrope', sans-serif" }}>{name || "Your Name"}</h2>
            <p className="text-sm font-medium mb-1" style={{ color: TEAL }}>{title || "Your Job Title"}</p>
            <p className="text-xs mb-4" style={{ color: GRAY }}>{[email, phone].filter(Boolean).join("  ·  ")}</p>

            {summary && (
              <div className="mb-4">
                <p className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: INK }}>Summary</p>
                <p className="text-xs leading-relaxed" style={{ color: GRAY }}>{summary}</p>
              </div>
            )}

            {experience.some((e) => e.title || e.company) && (
              <div className="mb-4">
                <p className="text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color: INK }}>Experience</p>
                {experience.map((exp) => (exp.title || exp.company) && (
                  <div key={exp.id} className="mb-2">
                    <div className="flex justify-between text-xs font-semibold" style={{ color: INK }}>
                      <span>{exp.title || "Job Title"} — {exp.company || "Company"}</span>
                      <span style={{ color: GRAY, fontWeight: 400 }}>{exp.duration}</span>
                    </div>
                    {exp.details && <p className="text-xs mt-0.5" style={{ color: GRAY }}>{exp.details}</p>}
                  </div>
                ))}
              </div>
            )}

            {education.some((e) => e.degree || e.school) && (
              <div className="mb-4">
                <p className="text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color: INK }}>Education</p>
                {education.map((edu) => (edu.degree || edu.school) && (
                  <div key={edu.id} className="flex justify-between text-xs mb-1">
                    <span style={{ color: INK }}>{edu.degree || "Degree"} · {edu.school || "School"}</span>
                    <span style={{ color: GRAY }}>{edu.year}</span>
                  </div>
                ))}
              </div>
            )}

            {skills && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: INK }}>Skills</p>
                <p className="text-xs" style={{ color: GRAY }}>{skills}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}