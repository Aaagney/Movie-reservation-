import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const [tab, setTab] = useState("signin"); // 'signin' | 'register'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  function switchTab(nextTab) {
    setTab(nextTab);
    setError("");
    setInfo("");
  }

  function redirectAfterAuth(user) {
    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/films");
    }
  }

  async function handleSignIn(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(email, password);
      redirectAfterAuth(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await register(name, email, password, role);
      redirectAfterAuth(user);
    } catch (err) {
      // Backend returns this exact message when the email is already registered
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-vault-bg px-4">
      <div className="w-full max-w-md bg-vault-panel border border-vault-border rounded-2xl p-8 shadow-2xl">
        <h1 className="font-serif text-3xl text-white mb-6">
          {tab === "signin" ? "Sign In" : "Create Account"}
        </h1>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-0 border border-vault-border rounded-lg overflow-hidden mb-6">
          <button
            type="button"
            onClick={() => switchTab("signin")}
            className={`py-2.5 text-sm font-semibold transition-colors ${
              tab === "signin"
                ? "bg-vault-gold text-black"
                : "bg-transparent text-vault-muted hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchTab("register")}
            className={`py-2.5 text-sm font-semibold transition-colors ${
              tab === "register"
                ? "bg-vault-gold text-black"
                : "bg-transparent text-vault-muted hover:text-white"
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-300 bg-red-950/40 border border-red-900 rounded-lg px-4 py-3">
            {error}
          </div>
        )}
        {info && (
          <div className="mb-4 text-sm text-emerald-300 bg-emerald-950/40 border border-emerald-900 rounded-lg px-4 py-3">
            {info}
          </div>
        )}

        {tab === "signin" ? (
          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="label-eyebrow block mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-vault-input border border-vault-border rounded-lg px-4 py-3 text-white placeholder-vault-muted focus:outline-none focus:border-vault-gold transition-colors"
              />
            </div>

            <div>
              <label className="label-eyebrow block mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-vault-input border border-vault-border rounded-lg px-4 py-3 text-white placeholder-vault-muted focus:outline-none focus:border-vault-gold transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-vault-gold hover:bg-vault-goldDark disabled:opacity-60 text-black font-semibold py-3 rounded-lg transition-colors"
            >
              {submitting ? "Signing In..." : "Sign In"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/films")}
              className="w-full text-center text-sm text-vault-muted hover:text-white transition-colors"
            >
              Cancel
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="label-eyebrow block mb-2">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-vault-input border border-vault-border rounded-lg px-4 py-3 text-white placeholder-vault-muted focus:outline-none focus:border-vault-gold transition-colors"
              />
            </div>

            <div>
              <label className="label-eyebrow block mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-vault-input border border-vault-border rounded-lg px-4 py-3 text-white placeholder-vault-muted focus:outline-none focus:border-vault-gold transition-colors"
              />
            </div>

            <div>
              <label className="label-eyebrow block mb-2">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-vault-input border border-vault-border rounded-lg px-4 py-3 text-white placeholder-vault-muted focus:outline-none focus:border-vault-gold transition-colors"
              />
            </div>

            <div>
              <label className="label-eyebrow block mb-2">Account Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("member")}
                  className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    role === "member"
                      ? "bg-vault-gold text-black"
                      : "bg-vault-input border border-vault-border text-vault-muted hover:text-white"
                  }`}
                >
                  Member
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    role === "admin"
                      ? "bg-vault-gold text-black"
                      : "bg-vault-input border border-vault-border text-vault-muted hover:text-white"
                  }`}
                >
                  Administrator
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-vault-gold hover:bg-vault-goldDark disabled:opacity-60 text-black font-semibold py-3 rounded-lg transition-colors"
            >
              {submitting ? "Creating Account..." : "Create Account"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/films")}
              className="w-full text-center text-sm text-vault-muted hover:text-white transition-colors"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
