"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, BookOpen, Building2, Heart, Settings,
  Eye, EyeOff, GraduationCap, BrainCircuit,
  LayoutDashboard, UserCheck, ShieldCheck, ArrowLeft,
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
    placeholder: "student@college.edu.in",
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

export default function LoginPage() {
  const router = useRouter();
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const portal = portals.find((p) => p.id === selectedPortal);

  const handleLogin = () => {
    if (portal) router.push(portal.path);
  };

  // ── Portal Selection Screen ──────────────────────────────
  if (!selectedPortal) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-8 py-5 flex items-center gap-4 shadow-sm">
          {/* KIET Logo */}
          <img
            src="/kiet_logo.png"
            alt="KIET"
            className="h-12 w-auto flex-shrink-0 object-contain"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          {/* Divider */}
          <div className="h-10 w-px bg-gray-200 flex-shrink-0" />
          {/* EA Badge + Title */}
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
          {/* Heading */}
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

          {/* Portal Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {portals.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 p-7 flex flex-col items-center text-center group"
                >
                  {/* Icon */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                    style={{ background: p.iconBg }}
                  >
                    <Icon size={28} color={p.iconColor} strokeWidth={1.75} />
                  </div>

                  <p className="font-bold text-gray-900 text-lg mb-1">{p.label}</p>
                  <p className="text-gray-400 text-xs mb-6 leading-relaxed">{p.sub}</p>

                  <button
                    onClick={() => { setSelectedPortal(p.id); setEmail(""); setPassword(""); }}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-150"
                    style={{
                      borderColor: p.accentColor,
                      color: p.accentColor,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = p.accentColor;
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = p.accentColor;
                    }}
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

  // ── Individual Login Screen ──────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center font-sans px-4 py-10"
      style={{ background: "linear-gradient(135deg,#f8fafc 0%,#f1f5f9 50%,#e8edf5 100%)" }}
    >
      <div className="w-full max-w-md animate-fade-in">
        {/* Top bar inside card */}
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

        {/* Form area */}
        <div className="bg-white rounded-b-2xl shadow-xl px-8 py-7">
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={portal.placeholder}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition"
              style={{ "--tw-ring-color": portal.accentColor }}
              onFocus={(e) => { e.currentTarget.style.borderColor = portal.accentColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${portal.accentColor}22`; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition pr-12"
                onFocus={(e) => { e.currentTarget.style.borderColor = portal.accentColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${portal.accentColor}22`; }}
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

          {/* Sign In Button */}
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all duration-150 mb-5"
            style={{ background: portal.gradient }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            {portal.loginTitle.replace("Login", "Sign In")}
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
                      onClick={() => { setSelectedPortal(o.id); setEmail(""); setPassword(""); }}
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

        {/* Back button */}
        <button
          onClick={() => setSelectedPortal(null)}
          className="mt-5 flex items-center gap-1.5 mx-auto text-xs text-gray-400 hover:text-gray-600 transition"
        >
          <ArrowLeft size={13} /> Back to Portal Selection
        </button>
      </div>
    </div>
  );
}

