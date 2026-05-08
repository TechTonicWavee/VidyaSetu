"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  BookOpen,
  Building2,
  Heart,
  Settings,
  Eye,
  EyeOff,
  ChevronRight,
} from "lucide-react";

const roles = [
  {
    id: "student",
    label: "Student",
    sub: "Enter as Student",
    icon: User,
    color: "#1A56DB",
    border: "border-blue-500",
    bg: "hover:bg-blue-50",
    path: "/dashboard/student",
  },
  {
    id: "faculty",
    label: "Faculty",
    sub: "Enter as Faculty",
    icon: BookOpen,
    color: "#0F766E",
    border: "border-teal-600",
    bg: "hover:bg-teal-50",
    path: "/dashboard/faculty",
  },
  {
    id: "dean",
    label: "Dean",
    sub: "Enter as Dean",
    icon: Building2,
    color: "#5B21B6",
    border: "border-purple-700",
    bg: "hover:bg-purple-50",
    path: "/dashboard/dean",
  },
  {
    id: "parent",
    label: "Parent",
    sub: "Enter as Parent",
    icon: Heart,
    color: "#D97706",
    border: "border-amber-500",
    bg: "hover:bg-amber-50",
    path: "/dashboard/parent",
  },
  {
    id: "admin",
    label: "Admin",
    sub: "Enter as Admin",
    icon: Settings,
    color: "#6B7280",
    border: "border-gray-400",
    bg: "hover:bg-gray-50",
    path: "/dashboard/admin",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hoveredRole, setHoveredRole] = useState(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] font-sans px-4 py-10">
      {/* ─── CENTER PANEL ─── */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8 animate-fade-in">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #1A56DB, #1447C0)" }}
          >
            EA
          </div>
          <span className="font-bold text-navy text-base">
            Educator Analytics OS
          </span>
        </div>

        <h1 className="text-3xl font-bold text-navy mb-1">Welcome back</h1>
        <p className="text-gray-500 text-sm mb-8">Sign in to your dashboard</p>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email address
          </label>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="arman.singh@college.edu.in"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition"
            style={{ "--tw-ring-color": "#1A56DB" }}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="password-input"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent pr-12 transition"
            />
            <button
              id="toggle-password"
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
          id="sign-in-btn"
          className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-150 mb-6 flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(90deg, #1A56DB, #1447C0)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(90deg, #1447C0, #0f3aa8)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(90deg, #1A56DB, #1447C0)")
          }
        >
          Sign In
          <ChevronRight size={16} />
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-100" />
          <p className="text-xs text-gray-400 text-center whitespace-nowrap">
            Demo Mode — Select your role below to preview
          </p>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Role Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {roles.map((role) => (
            <button
              key={role.id}
              id={`role-btn-${role.id}`}
              onClick={() => router.push(role.path)}
              onMouseEnter={() => setHoveredRole(role.id)}
              onMouseLeave={() => setHoveredRole(null)}
              className={`role-btn border-2 text-left ${role.border} ${role.bg} ${
                role.id === "admin" ? "col-span-2 sm:col-span-1" : ""
              }`}
              style={{
                transform:
                  hoveredRole === role.id ? "translateY(-2px)" : "none",
                boxShadow:
                  hoveredRole === role.id
                    ? "0 6px 20px rgba(0,0,0,0.1)"
                    : "none",
                transition: "all 0.15s ease",
              }}
            >
              <role.icon size={20} color={role.color} strokeWidth={2} />
              <p className="font-semibold text-sm text-navy mt-1">
                {role.label}
              </p>
              <p className="text-xs text-gray-400">{role.sub}</p>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          © 2026 Educator Analytics OS · CSE Department
        </p>
      </div>
    </div>
  );
}
