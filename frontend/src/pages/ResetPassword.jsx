import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { resetPassword } from "../authApi";

const TEAL = "#0F9D77";
const TEAL_BG = "#E7F7F1";
const RED = "#E1493C";
const RED_BG = "#FDECEB";
const INK = "#131B2E";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const BG = "#F6F7F9";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10" style={{ backgroundColor: BG, fontFamily: "'Inter', sans-serif" }}>
      <div className="hover-lift bg-white rounded-2xl p-8 w-full max-w-md animate-fade-in-up" style={{ border: `1px solid ${BORDER}`, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
        <div className="text-center mb-6">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: TEAL_BG }}>
            <Lock size={20} color={TEAL} />
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: INK }}>Reset Password</h1>
          <p className="text-sm" style={{ color: GRAY }}>Paste your reset token and choose a new password.</p>
        </div>

        {success ? (
          <div className="text-center py-6 animate-fade-in">
            <ShieldCheck size={40} color={TEAL} className="mx-auto mb-3" />
            <p className="text-sm font-semibold" style={{ color: INK }}>Password updated!</p>
            <p className="text-xs mt-1" style={{ color: GRAY }}>Redirecting you to sign in...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: GRAY }}>Reset Token</label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your token here"
                required
                className="w-full rounded-xl p-3 text-sm focus:outline-none"
                style={{ border: `1px solid ${BORDER}`, color: INK }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: GRAY }}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full rounded-xl p-3 text-sm focus:outline-none"
                style={{ border: `1px solid ${BORDER}`, color: INK }}
              />
            </div>

            {error && (
              <div className="rounded-xl p-3 text-sm" style={{ backgroundColor: RED_BG, color: RED }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="hover-lift w-full py-3.5 rounded-xl font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ backgroundColor: TEAL }}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>Update Password <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}