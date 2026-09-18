import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon, User, Lock, Trash2, ShieldCheck, AlertTriangle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { updateProfile, changePassword, deleteAccount } from "../authApi";

const TEAL = "#0F9D77";
const TEAL_BG = "#E7F7F1";
const RED = "#E1493C";
const RED_BG = "#FDECEB";
const INK = "#131B2E";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const BG = "#F6F7F9";

export default function Settings() {
  const { user, token, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [nameMsg, setNameMsg] = useState("");
  const [nameLoading, setNameLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [passError, setPassError] = useState("");
  const [passLoading, setPassLoading] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  if (!user) {
    navigate("/signin");
    return null;
  }

  const handleNameUpdate = async (e) => {
    e.preventDefault();
    setNameLoading(true);
    setNameMsg("");
    try {
      const updated = await updateProfile(token, name);
      updateUser(updated);
      setNameMsg("Name updated successfully.");
    } catch {
      setNameMsg("Something went wrong.");
    } finally {
      setNameLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassLoading(true);
    setPassMsg("");
    setPassError("");
    try {
      await changePassword(token, currentPassword, newPassword);
      setPassMsg("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPassError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setPassLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteAccount(token);
      logout();
      navigate("/");
    } catch {
      setDeleteLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: BG, fontFamily: "'Inter', sans-serif" }} className="min-h-screen pb-20">
      <div className="text-center py-14 px-5 animate-fade-in-up" style={{ backgroundColor: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: TEAL_BG }}>
          <SettingsIcon size={22} color={TEAL} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: INK }}>
          Account Settings
        </h1>
        <p className="text-[15px] max-w-md mx-auto" style={{ color: GRAY }}>
          Manage your profile, password, and account.
        </p>
      </div>

      <div className="max-w-xl mx-auto px-5 pt-10 space-y-6">
        {/* Profile */}
        <form onSubmit={handleNameUpdate} className="hover-lift bg-white rounded-2xl p-6 animate-fade-in-up" style={{ border: `1px solid ${BORDER}` }}>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: GRAY }}>
            <User size={13} /> Profile
          </p>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: GRAY }}>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl p-3 text-sm focus:outline-none mb-3"
            style={{ border: `1px solid ${BORDER}`, color: INK }}
          />
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: GRAY }}>Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full rounded-xl p-3 text-sm mb-4 opacity-60 cursor-not-allowed"
            style={{ border: `1px solid ${BORDER}`, color: GRAY, backgroundColor: BG }}
          />
          {nameMsg && (
            <p className="text-xs mb-3" style={{ color: nameMsg.includes("wrong") ? RED : TEAL }}>{nameMsg}</p>
          )}
          <button
            type="submit"
            disabled={nameLoading}
            className="hover-lift px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: TEAL }}
          >
            {nameLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Password */}
        <form onSubmit={handlePasswordChange} className="hover-lift bg-white rounded-2xl p-6 animate-fade-in-up" style={{ border: `1px solid ${BORDER}`, animationDelay: "80ms" }}>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: GRAY }}>
            <Lock size={13} /> Change Password
          </p>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: GRAY }}>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full rounded-xl p-3 text-sm focus:outline-none mb-3"
            style={{ border: `1px solid ${BORDER}`, color: INK }}
          />
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: GRAY }}>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-xl p-3 text-sm focus:outline-none mb-4"
            style={{ border: `1px solid ${BORDER}`, color: INK }}
          />
          {passMsg && <p className="text-xs mb-3" style={{ color: TEAL }}>{passMsg}</p>}
          {passError && <p className="text-xs mb-3" style={{ color: RED }}>{passError}</p>}
          <button
            type="submit"
            disabled={passLoading}
            className="hover-lift px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: TEAL }}
          >
            {passLoading ? "Updating..." : "Update Password"}
          </button>
        </form>

        {/* Danger zone */}
        <div className="hover-lift bg-white rounded-2xl p-6 animate-fade-in-up" style={{ border: `1px solid ${RED_BG}`, animationDelay: "160ms" }}>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: RED }}>
            <AlertTriangle size={13} /> Danger Zone
          </p>
          <p className="text-sm mb-4" style={{ color: GRAY }}>
            Deleting your account permanently removes your profile and all saved resume history. This cannot be undone.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{ color: RED, border: `2px solid ${RED}`, backgroundColor: "transparent" }}
            >
              <Trash2 size={15} />
              Delete Account
            </button>
          ) : (
            <div className="rounded-xl p-4 animate-fade-in" style={{ backgroundColor: RED_BG }}>
              <p className="text-sm font-semibold mb-3" style={{ color: RED }}>Are you absolutely sure?</p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                  style={{ backgroundColor: RED }}
                >
                  {deleteLoading ? "Deleting..." : "Yes, delete everything"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-white"
                  style={{ color: INK, border: `1px solid ${BORDER}` }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}