import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Lock, KeyRound } from "lucide-react";
import { login, changePassword } from "~/lib/services";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await login(username, password);
      localStorage.setItem("token", data.token);

      if (!data.passwordChanged) {
        // First time login — ask to change password
        setCurrentPassword(password);
        setShowChangePassword(true);
      } else {
        navigate("/", { replace: true });
      }
    } catch {
      setError("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (newPassword.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    setIsLoading(true);

    try {
      const data = await changePassword(currentPassword, newPassword);
      localStorage.setItem("token", data.token);
      navigate("/", { replace: true });
    } catch {
      setError("Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  if (showChangePassword) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <form onSubmit={handleChangePassword} className="space-y-5">
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2, damping: 15 }}
                className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/20"
              >
                <KeyRound className="w-6 h-6 text-white/70" />
              </motion.div>
            </div>

            <p className="text-white/50 text-xs text-center">
              Set a new password to continue
            </p>

            <div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors text-sm"
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors text-sm"
                autoComplete="new-password"
                required
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400/80 text-xs text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-white/10 hover:bg-white/15 border border-white/10 text-white/80 rounded-xl transition-colors text-sm disabled:opacity-50"
            >
              {isLoading ? "..." : "Set Password"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/", { replace: true })}
              className="w-full py-2 text-white/30 hover:text-white/50 transition-colors text-xs"
            >
              Skip for now
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2, damping: 15 }}
              className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/20"
            >
              <Lock className="w-6 h-6 text-white/70" />
            </motion.div>
          </div>

          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors text-sm"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors text-sm"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400/80 text-xs text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-white/10 hover:bg-white/15 border border-white/10 text-white/80 rounded-xl transition-colors text-sm disabled:opacity-50"
          >
            {isLoading ? "..." : "Enter"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
