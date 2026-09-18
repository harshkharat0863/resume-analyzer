import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ShieldCheck, ArrowRight } from "lucide-react";
import { signUp, signIn } from "../authApi";
import { useAuth } from "../context/AuthContext";

const TEAL = "#0F9D77";
const TEAL_BG = "#E7F7F1";
const RED = "#E1493C";
const RED_BG = "#FDECEB";
const INK = "#131B2E";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const BG = "#F6F7F9";

export default function SignIn() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(name, email, password);
        setSuccessMsg("Account created! Please sign in to continue.");
        setIsSignUp(false);
        setPassword("");
      } else {
        const data = await signIn(email, password);
        login(data.token, data.user);
        navigate("/");
      }
    } catch (err) {
      const msg = err.response?.data?.detail || "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setSuccessMsg("");
    setError("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10" style={{ backgroundColor: BG, fontFamily: "'Inter', sans-serif" }}>
      <div className="hover-lift bg-white rounded-2xl p-8 w-full max-w-md animate-fade-in-up" style={{ border: `1px solid ${BORDER}`, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
        <div className="text-center mb-8">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-4"
            style={{ backgroundColor: TEAL, fontFamily: "'Manrope', sans-serif" }}
          >
            R
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: INK }}>
            {isSignUp ? "Create account" : "Welcome back"}
          </h1>
          <p className="text-sm" style={{ color: GRAY }}>
            {isSignUp ? "Save your resume history to your account" : "Sign in to see your saved resume history"}
          </p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 mb-5 rounded-xl p-3 text-sm font-medium animate-fade-in" style={{ backgroundColor: TEAL_BG, color: TEAL }}>
            <ShieldCheck size={16} />
            {successMsg}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl p-3 text-sm font-medium animate-fade-in" style={{ backgroundColor: RED_BG, color: RED }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: GRAY }}>Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" color={GRAY} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                  required
                  className="w-full rounded-xl p-3 pl-10 text-sm focus:outline-none"
                  style={{ border: `1px solid ${BORDER}`, color: INK }}
                />
              </div>
            </div>
          )}
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
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: GRAY }}>Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" color={GRAY} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full rounded-xl p-3 pl-10 text-sm focus:outline-none"
                style={{ border: `1px solid ${BORDER}`, color: INK }}
              />
            </div>
            {!isSignUp && (
              <div className="text-right mt-1.5">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs font-medium"
                  style={{ color: TEAL, background: "none", border: "none", cursor: "pointer" }}
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="hover-lift w-full py-3.5 rounded-xl font-semibold text-white mt-2 disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ backgroundColor: TEAL }}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isSignUp ? "Create Account" : "Sign In"}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm" style={{ color: GRAY }}>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={switchMode} className="font-semibold transition-opacity hover:opacity-70" style={{ color: TEAL, background: "none", border: "none", cursor: "pointer" }}>
              {isSignUp ? "Sign In" : "Sign Up Free"}
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <button onClick={() => navigate("/")} className="text-xs" style={{ color: GRAY, background: "none", border: "none", cursor: "pointer" }}>
            Continue as guest — no account needed
          </button>
        </div>

        <div className="mt-6 pt-6 flex items-center justify-center gap-1.5" style={{ borderTop: `1px solid ${BORDER}` }}>
          <ShieldCheck size={13} color={GRAY} />
          <p className="text-xs" style={{ color: GRAY }}>Guests: analyses aren't saved. Accounts: history is saved to your dashboard.</p>
        </div>
      </div>
    </div>
  );
}