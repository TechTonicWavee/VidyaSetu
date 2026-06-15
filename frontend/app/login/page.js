"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, BookOpen, Building2, Heart, Settings,
  Eye, EyeOff, GraduationCap, BrainCircuit,
  LayoutDashboard, UserCheck, ShieldCheck, ArrowLeft,
  Loader2, CheckCircle2, AlertCircle,
} from "lucide-react";

const portals = [
  {
    id: "student",
    label: "Student",
    sub: "Access your academics, skills & career tools",
    icon: GraduationCap,
    accentColor: "#1A56DB",
    iconBg: "#EFF6FF",
    iconColor: "#1A56DB",
    gradient: "#1A56DB",
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
    accentColor: "#4338CA",
    iconBg: "#EEF2FF",
    iconColor: "#4338CA",
    gradient: "#4338CA",
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
    accentColor: "#5B21B6",
    iconBg: "#F5F3FF",
    iconColor: "#5B21B6",
    gradient: "#5B21B6",
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
    id: "parent",
    label: "Parent",
    sub: "View your ward's progress, alerts & reports",
    icon: Heart,
    accentColor: "#D97706",
    iconBg: "#FFFBEB",
    iconColor: "#D97706",
    gradient: "#D97706",
    path: "/parent",
    loginTitle: "Parent Login",
    loginSub: "Enter credentials to view your ward's academic summary",
    placeholder: "parent@example.com",
    others: [
      { label: "Student Portal", id: "student" },
    ],
  },
  {
    id: "admin",
    label: "Admin",
    sub: "System configuration, users & SPI settings",
    icon: ShieldCheck,
    accentColor: "#374151",
    iconBg: "#F9FAFB",
    iconColor: "#374151",
    gradient: "#374151",
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

function StudentLoginForm({ portal, onSwitchPortal, portals: allPortals }) {
  const router = useRouter();

  // 'login' | 'forgot' | 'reset'
  const [authState, setAuthState] = useState("login");

  // Login state
  const [universityId, setUniversityId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null); // { type: 'red'|'blue', message, link? }

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
      const res = await fetch("/api/auth/student-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ universityId: universityId.trim(), password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem(
          "vs_student",
          JSON.stringify({
            universityId: data.student.universityId,
            name: data.student.name,
            branch: data.student.branch,
            year: data.student.year,
            section: data.student.section,
            loginTime: Date.now(),
          })
        );
        router.push("/student");
      } else if (data.status === "form_incomplete") {
        setLoginError({
          type: "blue",
          message: "Please complete your profile form first.",
          link: "/form/login",
          linkText: "Go to profile form →",
        });
      } else {
        setLoginError({ type: "red", message: data.error || "Login failed." });
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
    onFocus: (e) => {
      e.currentTarget.style.borderColor = accentColor;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor}22`;
    },
    onBlur: (e) => {
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
      <div className="bg-white rounded-b-2xl shadow-xl px-8 py-7">

        {/* STATE 1 — Login */}
        {authState === "login" && (
          <>
            {/* University ID */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                University ID
              </label>
              <input
                type="text"
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder={portal.placeholder}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition"
                {...inputFocusHandlers}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition pr-12"
                  {...inputFocusHandlers}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error banner */}
            {loginError && (
              <div
                className={`mb-4 rounded-xl px-4 py-3 text-sm flex flex-col gap-1 ${
                  loginError.type === "blue"
                    ? "bg-blue-50 text-blue-700 border border-blue-100"
                    : "bg-red-50 text-red-600 border border-red-100"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <AlertCircle size={14} />
                  {loginError.message}
                </span>
                {loginError.link && (
                  <a
                    href={loginError.link}
                    className="text-blue-600 underline font-medium text-xs"
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
              className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all duration-150 mb-5 flex items-center justify-center gap-2 disabled:opacity-70"
              style={{ background: portal.gradient }}
              onMouseEnter={(e) => { if (!loginLoading) e.currentTarget.style.opacity = "0.88"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                University ID
              </label>
              <input
                type="text"
                value={forgotId}
                onChange={(e) => setForgotId(e.target.value)}
                placeholder="e.g. 2300970100001"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition"
                {...inputFocusHandlers}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Official KIET Email
              </label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="e.g. priyanshu.2428cse771@kiet.edu"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition bg-white"
                {...inputFocusHandlers}
              />
            </div>

            {forgotError && (
              <div className="mb-4 rounded-xl px-4 py-3 text-sm bg-red-50 text-red-600 border border-red-100 flex items-center gap-1.5">
                <AlertCircle size={14} /> {forgotError}
              </div>
            )}

            <button
              onClick={handleVerifyEmail}
              disabled={forgotLoading}
              className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all duration-150 mb-5 flex items-center justify-center gap-2 disabled:opacity-70"
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
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <p className="text-green-700 font-semibold text-sm">Password reset successfully!</p>
                <p className="text-gray-400 text-xs">Redirecting to login...</p>
              </div>
            ) : (
              <>
                {/* Identity verified banner */}
                <div className="mb-5 rounded-xl px-4 py-3 bg-green-50 border border-green-100 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                  <p className="text-green-700 text-sm font-medium">
                    Identity verified! Hi {verifiedName}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition pr-12"
                      {...inputFocusHandlers}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Repeat your new password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition"
                    {...inputFocusHandlers}
                  />
                </div>

                {resetError && (
                  <div className="mb-4 rounded-xl px-4 py-3 text-sm bg-red-50 text-red-600 border border-red-100 flex items-center gap-1.5">
                    <AlertCircle size={14} /> {resetError}
                  </div>
                )}

                <button
                  onClick={handleResetPassword}
                  disabled={resetLoading}
                  className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all duration-150 mb-4 flex items-center justify-center gap-2 disabled:opacity-70"
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

function RuleItem({ met, text }) {
  return (
    <div className={`flex items-center gap-2 text-xs ${met ? "text-green-600" : "text-gray-400"}`}>
      <CheckCircle2 size={13} className={met ? "text-green-500" : "text-gray-300"} />
      {text}
    </div>
  );
}

// ── Generic login form (faculty / dean / parent / admin — no real auth yet) ──

function GenericLoginForm({ portal, onSwitchPortal, onBack }) {
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

      <div className="bg-white rounded-b-2xl shadow-xl px-8 py-7">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={portal.placeholder}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition"
            onFocus={(e) => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor}22`; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition pr-12"
              onFocus={(e) => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor}22`; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all duration-150 mb-5"
          style={{ background: portal.gradient }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
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
  const [selectedPortal, setSelectedPortal] = useState(null);
  const portal = portals.find((p) => p.id === selectedPortal);

  const switchPortal = (id) => setSelectedPortal(id);
  const goBack = () => setSelectedPortal(null);

  // ── Portal selection screen ───────────────────────────────────────────────
  if (!selectedPortal) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <header className="bg-white border-b border-gray-100 px-8 py-5 flex items-center gap-4 shadow-sm">
          <img
            src="/kiet_logo.png"
            alt="KIET"
            className="h-12 w-auto flex-shrink-0 object-contain"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="h-10 w-px bg-gray-200 flex-shrink-0" />
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#1A56DB,#5B21B6)" }}
          >
            EA
          </div>
          <div>
            <p className="font-bold text-gray-900 text-base leading-tight">Educator Analytics OS</p>
            <p className="text-sm text-gray-400 mt-0.5">CSE Department · KIET Group of Institutions</p>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-14">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider border border-indigo-100">
              <UserCheck size={13} /> Access Portal
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
              Choose Your <span style={{ color: "#4338CA" }}>Portal</span>
            </h1>
            <p className="text-gray-500 text-base max-w-md mx-auto">
              Select your role to access personalised features and tools designed for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {portals.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 p-7 flex flex-col items-center text-center group"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                    style={{ background: p.iconBg }}
                  >
                    <Icon size={28} color={p.iconColor} strokeWidth={1.75} />
                  </div>

                  <p className="font-bold text-gray-900 text-lg mb-1">{p.label}</p>
                  <p className="text-gray-400 text-xs mb-6 leading-relaxed">{p.sub}</p>

                  <button
                    onClick={() => { setSelectedPortal(p.id); }}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-150"
                    style={{ borderColor: p.accentColor, color: p.accentColor }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = p.accentColor; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = p.accentColor; }}
                  >
                    Login
                  </button>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-gray-400 mt-12">
            © 2026 Educator Analytics OS · CSE Department · KIET Group of Institutions
          </p>
        </main>
      </div>
    );
  }

  // ── Individual login screen ───────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center font-sans px-4 py-10"
      style={{ background: "linear-gradient(135deg,#f8fafc 0%,#f1f5f9 50%,#e8edf5 100%)" }}
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
          portals={portals}
          onSwitchPortal={switchPortal}
          onBack={goBack}
        />
      )}

      <button
        onClick={goBack}
        className="mt-5 flex items-center gap-1.5 mx-auto text-xs text-gray-400 hover:text-gray-600 transition"
      >
        <ArrowLeft size={13} /> Back to Portal Selection
      </button>
    </div>
  );
}
