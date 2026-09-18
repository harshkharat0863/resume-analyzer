import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, KeyRound, ArrowRight, Copy, Check, AlertTriangle } from "lucide-react";
import { forgotPassword } from "../authApi";

const TEAL = "#0F9D77";
const TEAL_BG = "#E7F7F1";
const AMBER = "#D97706";
const AMBER_BG = "#FEF3C7";
const INK = "#131B2E";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const BG = "#F6F7F9";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setResetToken("");
    try {
      const data = await forgotPassword(email);
      setMessage(data.message);
      if (data.reset_token) setResetToken(data.reset_token);
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resetToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10" style={{ backgroundColor: BG, fontFamily: "'Inter', sans-serif" }}>
      <div className="hover-lift bg-white rounded-2xl p-8 w-full max-w-md animate-fade-in-up" style={{ border: `1px solid ${BORDER}`, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
        <div className="text-center mb-6">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: TEAL_BG }}>
            <KeyRound size={20} color={TEAL} />
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: INK }}>Forgot Password</h1>
          <p className="text-sm" style={{ color: GRAY }}>Enter your email and we'll help you reset it.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: GRAY }}>Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" color={GRAY} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl p-3 pl-10 text-sm focus:outline-none"
                style={{ border: `1px solid ${BORDER}`, color: INK }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="hover-lift w-full py-3.5 rounded-xl font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ backgroundColor: TEAL }}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>Send Reset Link <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        {message && (
          <div className="mt-5 rounded-xl p-3 text-sm animate-fade-in" style={{ backgroundColor: TEAL_BG, color: TEAL }}>
            {message}
          </div>
        )}

        {resetToken && (
          <div className="mt-4 rounded-xl p-4 animate-fade-in" style={{ backgroundColor: AMBER_BG }}>
            <p className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: AMBER }}>
              <AlertTriangle size={13} /> Dev mode — no email service connected
            </p>
            <p className="text-xs mb-3" style={{ color: INK }}>
              In a live app, this token would be emailed to you. For now, copy it below and paste it on the reset page.
            </p>
            <div className="flex items-center gap-2 bg-white rounded-lg p-2 mb-3">
              <code className="text-xs flex-1 truncate" style={{ color: INK }}>{resetToken}</code>
              <button onClick={handleCopy} className="flex-shrink-0">
                {copied ? <Check size={15} color={TEAL} /> : <Copy size={15} color={GRAY} />}
              </button>
            </div>
            <button
              onClick={() => navigate(`/reset-password?token=${resetToken}`)}
              className="hover-lift w-full py-2.5 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: TEAL }}
            >
              Continue to Reset Password
            </button>
          </div>
        )}

        <div className="mt-5 text-center">
          <button onClick={() => navigate("/signin")} className="text-sm font-semibold" style={{ color: TEAL, background: "none", border: "none", cursor: "pointer" }}>
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}