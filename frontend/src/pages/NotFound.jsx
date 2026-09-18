import { useNavigate } from "react-router-dom";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

const TEAL = "#0F9D77";
const TEAL_BG = "#E7F7F1";
const INK = "#131B2E";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const BG = "#F6F7F9";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-5 animate-fade-in"
      style={{ backgroundColor: BG, fontFamily: "'Inter', sans-serif" }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ backgroundColor: TEAL_BG }}
      >
        <FileQuestion size={30} color={TEAL} strokeWidth={1.8} />
      </div>
      <p className="text-6xl font-extrabold mb-2" style={{ color: TEAL, fontFamily: "'Manrope', sans-serif" }}>404</p>
      <h1 className="text-xl font-bold mb-2" style={{ color: INK }}>
        This page doesn't exist
      </h1>
      <p className="text-sm mb-8 max-w-xs" style={{ color: GRAY }}>
        The page you're looking for might have been moved, renamed, or never existed.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="hover-lift flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border bg-white"
          style={{ borderColor: BORDER, color: INK }}
        >
          <ArrowLeft size={16} />
          Go Back
        </button>
        <button
          onClick={() => navigate("/")}
          className="hover-lift flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: TEAL }}
        >
          <Home size={16} />
          Go Home
        </button>
      </div>
    </div>
  );
}