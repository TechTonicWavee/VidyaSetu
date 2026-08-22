"use client";

import { useState, type FocusEvent } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { setAccessToken } from "../../lib/auth/tokenStore";
import {
  User, BookOpen, Building2, Heart, Settings,
  Eye, EyeOff, GraduationCap, BrainCircuit,
  LayoutDashboard, UserCheck, ShieldCheck, ArrowLeft,
  Loader2, CheckCircle2, AlertCircle, Sun, Moon,
} from "lucide-react";

const portals = [
  {
    id: "student",
    label: "Student",
    sub: "Access your academics, skills & career tools",
    icon: GraduationCap,
    accentColor: "var(--lp-accent)",
    iconBg: "var(--lp-accent-light)",
    iconColor: "var(--lp-accent)",
    gradient: "var(--lp-accent)",
    path: "/student",
    loginTitle: "Student Login",
    loginSub: "Enter your student credentials to access your dashboard",
    placeholder: "e.g. 2300970100001",
    others: [
      { label: "Faculty Portal", id: "faculty" },
      { label: "Dean Portal", id: "dean" },
    ],
  },
  {
    id: "faculty",
    label: "Faculty",
    sub: "Manage classes, analytics & student performance",
    icon: BookOpen,
    accentColor: "var(--lp-accent)",
    iconBg: "var(--lp-accent-light)",
    iconColor: "var(--lp-accent)",
    gradient: "var(--lp-accent)",
    path: "/faculty",
    loginTitle: "Faculty Login",
    loginSub: "Enter your faculty credentials to access your dashboard",
    placeholder: "pushpendra.kumar@college.edu.in",
    others: [
      { label: "Student Portal", id: "student" },
      { label: "Dean Portal", id: "dean" },
    ],
  },
  {
    id: "dean",
    label: "Dean",
    sub: "Department insights, forecasting & policy tools",
    icon: Building2,
    accentColor: "var(--lp-accent)",
    iconBg: "var(--lp-accent-light)",
    iconColor: "var(--lp-accent)",
    gradient: "var(--lp-accent)",
    path: "/dean",
    loginTitle: "Dean Login",
    loginSub: "Enter your credentials to access the Dean portal",
    placeholder: "dean@college.edu.in",
    others: [
      { label: "Faculty Portal", id: "faculty" },
      { label: "Admin Portal", id: "admin" },
    ],
  },
  {
    id: "admin",
    label: "Admin",
    sub: "System configuration, users & SPI settings",
    icon: ShieldCheck,
    accentColor: "var(--lp-accent)",
    iconBg: "var(--lp-accent-light)",
    iconColor: "var(--lp-accent)",
    gradient: "var(--lp-accent)",
    path: "/admin",
    loginTitle: "Admin Login",
    loginSub: "Enter admin credentials to access the system dashboard",
    placeholder: "admin@college.edu.in",
    others: [
      { label: "Dean Portal", id: "dean" },
      { label: "Faculty Portal", id: "faculty" },
    ],
  },
];

// ── Student-specific: 3-state auth flow ──────────────────────────────────────

interface LoginError {
  type: string;
  message: string;
  link?: string;
  linkText?: string;
}

function StudentLoginForm({ portal, onSwitchPortal, portals: allPortals }: { portal: (typeof portals)[number]; onSwitchPortal: (id: string) => void; portals: typeof portals }) {
  const router = useRouter();

  // 'login' | 'forgot' | 'reset'
  const [authState, setAuthState] = useState("login");

  // Login state
  const [universityId, setUniversityId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<LoginError | null>(null); // { type: 'red'|'blue', message, link? }

  // Forgot state
  const [forgotId, setForgotId] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");

  // Reset state
  const [verifiedId, setVerifiedId] = useState("");
  const [verifiedName, setVerifiedName] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  // Password rule checks
  const rule8 = newPass.length >= 8;
  const ruleNum = /\d/.test(newPass);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLogin = async () => {
    setLoginError(null);
    if (!universityId.trim() || !password.trim()) {
      setLoginError({ type: "red", message: "Please fill in all fields." });
      return;
    }
    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ universityId: universityId.trim(), password }),
      });
      const data = await res.json();
      if (data.success) {
        setAccessToken(data.data.accessToken);
        router.push("/student");
      } else if (data.error?.code === "FORM_INCOMPLETE") {
        setLoginError({
          type: "blue",
          message: "Please complete your profile form first.",
          link: "/form/login",
          linkText: "Go to profile form →",
        });
      } else {
        setLoginError({ type: "red", message: data.error?.message || "Login failed." });
      }
    } catch {
      setLoginError({ type: "red", message: "Network error. Please try again." });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    setForgotError("");
    if (!forgotId.trim() || !forgotEmail.trim()) {
      setForgotError("Please fill in all fields.");
      return;
    }
    setForgotLoading(true);
    try {
      const res = await fetch("/api/auth/verify-dob", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ universityId: forgotId.trim(), email: forgotEmail.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setVerifiedId(data.universityId || forgotId.trim());
        setVerifiedName(data.name || "");
        setAuthState("reset");
      } else {
        setForgotError(data.error || "Verification failed.");
      }
    } catch {
      setForgotError("Network error. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setResetError("");
    if (!rule8 || !ruleNum) {
      setResetError("Password does not meet requirements.");
      return;
    }
    if (newPass !== confirmPass) {
      setResetError("Passwords do not match.");
      return;
    }
    setResetLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ universityId: verifiedId, password: newPass }),
      });
      const data = await res.json();
      if (data.success) {
        setResetSuccess(true);
        setTimeout(() => {
          setAuthState("login");
          setResetSuccess(false);
          setNewPass(""); setConfirmPass("");
          setForgotId(""); setForgotEmail("");
          setVerifiedId(""); setVerifiedName("");
        }, 2000);
      } else {
        setResetError(data.error || "Reset failed.");
      }
    } catch {
      setResetError("Network error. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const accentColor = portal.accentColor;

  const inputFocusHandlers = {
    onFocus: (e: FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = accentColor;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor}22`;
    },
    onBlur: (e: FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = "#e5e7eb";
      e.currentTarget.style.boxShadow = "none";
    },
  };

  return (
    <div className="w-full max-w-md animate-fade-in">

      {/* ── Header bar ── */}
      <div
        className="rounded-t-2xl px-8 py-6 text-white text-center"
        style={{ background: portal.gradient }}
      >
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <portal.icon size={24} color="#fff" strokeWidth={1.75} />
          </div>
        </div>
        <h1 className="text-xl font-bold mb-1">
          {authState === "login"
            ? portal.loginTitle
            : authState === "forgot"
            ? "Reset Your Password"
            : "Set New Password"}
        </h1>
        <p className="text-white/75 text-xs">
          {authState === "login"
            ? portal.loginSub
            : authState === "forgot"
            ? "Verify your identity to reset password"
            : `Identity verified! Hi ${verifiedName}`}
        </p>
      </div>

      {/* ── Form area ── */}
      <div className="bg-surface rounded-b-2xl border border-line border-t-0 p-8 shadow-sm">

        {/* STATE 1 — Login */}
        {authState === "login" && (
          <>
            {/* University ID */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-content mb-1.5">
                University ID
              </label>
              <input
                type="text"
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder={portal.placeholder}
                className="w-full px-4 py-3 rounded-xl border border-line text-sm text-content bg-surface placeholder-muted focus:outline-none transition-colors"
                {...inputFocusHandlers}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-content mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border border-line text-sm text-content bg-surface placeholder-muted focus:outline-none transition-colors pr-12"
                  {...inputFocusHandlers}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-content transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {loginError && (
              <div
                className={`mb-4 rounded-xl px-4 py-3 text-sm flex flex-col gap-1 ${
                  loginError.type === "blue"
                    ? "bg-info-soft text-info border border-info"
                    : "bg-danger-soft text-danger border border-danger"
                }`}
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <AlertCircle size={14} />
                  {loginError.message}
                </span>
                {loginError.link && (
                  <a
                    href={loginError.link}
                    className="text-info underline font-medium text-xs ml-5"
                  >
                    {loginError.linkText}
                  </a>
                )}
              </div>
            )}

            {/* Forgot password link */}
            <div className="flex justify-end mb-5">
              <button
                type="button"
                onClick={() => { setAuthState("forgot"); setLoginError(null); }}
                className="text-xs font-medium hover:underline"
                style={{ color: accentColor }}
              >
                Forgot Password?
              </button>
            </div>

            {/* Login button */}
            <button
              onClick={handleLogin}
              disabled={loginLoading}
              className="btn-primary w-full justify-center mb-5"
              style={{ background: portal.gradient }}
            >
              {loginLoading ? (
                <><Loader2 size={16} className="animate-spin" /> Signing in...</>
              ) : (
                "Student Sign In"
              )}
            </button>

            {/* Other portals */}
            {portal.others.length > 0 && (
              <>
                <p className="text-center text-xs text-gray-400 mb-3">Access other portals:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {portal.others.map((o) => {
                    const op = portals.find((p) => p.id === o.id);
                    return (
                      <button
                        key={o.id}
                        onClick={() => onSwitchPortal(o.id)}
                        className="text-xs font-semibold hover:underline transition"
                        style={{ color: op?.accentColor }}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {/* STATE 2 — Forgot Password */}
        {authState === "forgot" && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-content mb-1.5">
                University ID
              </label>
              <input
                type="text"
                value={forgotId}
                onChange={(e) => setForgotId(e.target.value)}
                placeholder="e.g. 2300970100001"
                className="w-full px-4 py-3 rounded-xl border border-line text-sm text-content bg-surface placeholder-muted focus:outline-none transition-colors"
                {...inputFocusHandlers}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-content mb-1.5">
                Official KIET Email
              </label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="e.g. priyanshu.2428cse771@kiet.edu"
                className="w-full px-4 py-3 rounded-xl border border-line text-sm text-content bg-surface placeholder-muted focus:outline-none transition-colors"
                {...inputFocusHandlers}
              />
            </div>

            {forgotError && (
              <div className="mb-4 rounded-xl px-4 py-3 text-sm bg-danger-soft text-danger border border-danger flex items-center gap-1.5 font-medium">
                <AlertCircle size={14} /> {forgotError}
              </div>
            )}

            <button
              onClick={handleVerifyEmail}
              disabled={forgotLoading}
              className="btn-primary w-full justify-center mb-5"
              style={{ background: portal.gradient }}
            >
              {forgotLoading ? (
                <><Loader2 size={16} className="animate-spin" /> Verifying...</>
              ) : (
                "Verify Identity"
              )}
            </button>

            <button
              type="button"
              onClick={() => { setAuthState("login"); setForgotError(""); }}
              className="w-full text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 transition"
            >
              <ArrowLeft size={12} /> Back to Login
            </button>
          </>
        )}

        {/* STATE 3 — Set New Password */}
        {authState === "reset" && (
          <>
            {resetSuccess ? (
              <div className="flex flex-col items-center py-6 gap-3">
                <div className="w-14 h-14 rounded-full bg-success-soft flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-success" />
                </div>
                <p className="text-success font-semibold text-sm">Password reset successfully!</p>
                <p className="text-muted text-xs">Redirecting to login...</p>
              </div>
            ) : (
              <>
                {/* Identity verified banner */}
                <div className="mb-5 rounded-xl px-4 py-3 bg-success-soft border border-success flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                  <p className="text-success text-sm font-medium">
                    Identity verified! Hi {verifiedName}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-content mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full px-4 py-3 rounded-xl border border-line text-sm text-content bg-surface placeholder-muted focus:outline-none transition-colors pr-12"
                      {...inputFocusHandlers}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-content transition-colors"
                    >
                      {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Live password rules */}
                <div className="mb-4 space-y-1.5">
                  <RuleItem met={rule8} text="At least 8 characters" />
                  <RuleItem met={ruleNum} text="At least one number" />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-content mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Repeat your new password"
                    className="w-full px-4 py-3 rounded-xl border border-line text-sm text-content bg-surface placeholder-muted focus:outline-none transition-colors"
                    {...inputFocusHandlers}
                  />
                </div>

                {resetError && (
                  <div className="mb-4 rounded-xl px-4 py-3 text-sm bg-danger-soft text-danger border border-danger flex items-center gap-1.5 font-medium">
                    <AlertCircle size={14} /> {resetError}
                  </div>
                )}

                <button
                  onClick={handleResetPassword}
                  disabled={resetLoading}
                  className="btn-primary w-full justify-center mb-4"
                  style={{ background: portal.gradient }}
                >
                  {resetLoading ? (
                    <><Loader2 size={16} className="animate-spin" /> Resetting...</>
                  ) : (
                    "Reset Password"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { setAuthState("login"); setResetError(""); }}
                  className="w-full text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 transition"
                >
                  <ArrowLeft size={12} /> Back to Login
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function RuleItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 text-xs ${met ? "text-success" : "text-muted"}`}>
      <CheckCircle2 size={13} className={met ? "text-success" : "text-line-strong"} />
      {text}
    </div>
  );
}

// ── Generic login form (faculty / dean / parent / admin — no real auth yet) ──

function GenericLoginForm({ portal, onSwitchPortal, onBack }: { portal: (typeof portals)[number]; onSwitchPortal: (id: string) => void; onBack: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    if (portal) router.push(portal.path);
  };

  const accentColor = portal.accentColor;

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div
        className="rounded-t-2xl px-8 py-6 text-white text-center"
        style={{ background: portal.gradient }}
      >
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <portal.icon size={24} color="#fff" strokeWidth={1.75} />
          </div>
        </div>
        <h1 className="text-xl font-bold mb-1">{portal.loginTitle}</h1>
        <p className="text-white/75 text-xs">{portal.loginSub}</p>
      </div>

      <div className="bg-surface rounded-b-2xl border border-line border-t-0 p-8 shadow-sm">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-content mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={portal.placeholder}
            className="w-full px-4 py-3 rounded-xl border border-line text-sm text-content bg-surface placeholder-muted focus:outline-none transition-colors"
            onFocus={(e) => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor}22`; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.boxShadow = "none"; }}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-content mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl border border-line text-sm text-content bg-surface placeholder-muted focus:outline-none transition-colors pr-12"
              onFocus={(e) => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor}22`; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.boxShadow = "none"; }}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-content transition-colors"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="btn-primary w-full justify-center mb-5"
          style={{ background: portal.gradient }}
        >
          {portal.loginTitle.replace("Login", "Sign In")}
        </button>

        {portal.others.length > 0 && (
          <>
            <p className="text-center text-xs text-gray-400 mb-3">Access other portals:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {portal.others.map((o) => {
                const op = portals.find((p) => p.id === o.id);
                return (
                  <button
                    key={o.id}
                    onClick={() => onSwitchPortal(o.id)}
                    className="text-xs font-semibold hover:underline transition"
                    style={{ color: op?.accentColor }}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [selectedPortal, setSelectedPortal] = useState<string | null>(null);
  const portal = portals.find((p) => p.id === selectedPortal);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const switchPortal = (id: string) => setSelectedPortal(id);
  const goBack = () => setSelectedPortal(null);

  // ── Portal selection screen ───────────────────────────────────────────────
  if (!selectedPortal) {
    return (
      <div className="landing-page min-h-screen font-sans" data-theme={theme}>
        <header className="px-8 py-5 flex items-center justify-between" style={{ background: 'var(--lp-surface)', borderBottom: '1px solid var(--lp-border)' }}>
          <div className="flex items-center gap-4">
            <img
              src="/kiet_logo.png"
              alt="KIET"
              className="h-12 w-auto flex-shrink-0 object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="h-10 w-px flex-shrink-0" style={{ background: 'var(--lp-border)' }} />
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{ background: "var(--lp-accent)", color: "var(--lp-accent-fg)" }}
            >
              VS
            </div>
            <div>
              <p className="font-bold text-base leading-tight" style={{ color: 'var(--lp-text-primary)' }}>VidyaSetu</p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--lp-text-muted)' }}>CSE Department · KIET Group of Institutions</p>
            </div>
          </div>
          
          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="lp-theme-btn" aria-label="Toggle theme">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-14">
          <div className="text-center mb-12">
            <span className="lp-badge mb-4">
              <UserCheck size={13} /> ACCESS PORTAL
            </span>
            <h1 className="text-4xl font-extrabold mb-3" style={{ color: 'var(--lp-text-primary)' }}>
              Choose Your <span style={{ color: "var(--lp-accent)" }}>Portal</span>
            </h1>
            <p className="text-base max-w-md mx-auto" style={{ color: 'var(--lp-text-secondary)' }}>
              Select your role to access personalised features and tools designed for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {portals.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.id}
                  className="rounded-3xl p-7 flex flex-col items-center text-center group cursor-pointer transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden"
                  style={{ background: 'var(--lp-surface)', border: '1.5px solid var(--lp-border)' }}
                  onClick={() => setSelectedPortal(p.id)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--lp-accent)'; e.currentTarget.style.boxShadow = '0 8px 40px var(--lp-accent-glow)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--lp-border)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                    style={{ background: 'var(--lp-accent-glow)' }} 
                  />
                  
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 relative z-10 transition-transform duration-300 group-hover:scale-110 shadow-sm"
                    style={{ background: p.iconBg, border: '1px solid var(--lp-border-soft)' }}
                  >
                    <Icon size={28} color={p.iconColor} strokeWidth={2} />
                  </div>

                  <p className="font-bold text-lg mb-2 relative z-10 transition-colors" style={{ color: 'var(--lp-text-primary)' }}>{p.label}</p>
                  <p className="text-xs mb-8 leading-relaxed relative z-10 flex-grow flex items-start justify-center" style={{ color: 'var(--lp-text-muted)' }}>{p.sub}</p>

                  <button
                    className="w-full py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-300 relative z-10 group-hover:shadow-md"
                    style={{ borderColor: p.accentColor, color: p.accentColor, background: 'transparent' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = p.accentColor; e.currentTarget.style.color = "var(--lp-accent-fg)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = p.accentColor; }}
                  >
                    Login
                  </button>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs mt-12" style={{ color: 'var(--lp-text-muted)' }}>
            © 2026 VidyaSetu · CSE Department · KIET Group of Institutions
          </p>
        </main>
      </div>
    );
  }

  // ── Individual login screen ───────────────────────────────────────────────
  if (!portal) return null;

  return (
    <div
      className="landing-page min-h-screen flex flex-col items-center justify-center font-sans px-4 py-10"
      data-theme={theme}
    >
      {portal.id === "student" ? (
        <StudentLoginForm
          portal={portal}
          portals={portals}
          onSwitchPortal={switchPortal}
        />
      ) : (
        <GenericLoginForm
          portal={portal}
          onSwitchPortal={switchPortal}
          onBack={goBack}
        />
      )}

      <button
        onClick={goBack}
        className="mt-5 flex items-center gap-1.5 mx-auto text-xs transition-colors"
        style={{ color: 'var(--lp-text-muted)' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--lp-text-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--lp-text-muted)'}
      >
        <ArrowLeft size={13} /> Back to Portal Selection
      </button>
    </div>
  );
}
