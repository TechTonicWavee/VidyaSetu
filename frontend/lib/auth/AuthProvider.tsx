'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { BACKEND_URL } from '../api/config';
import { apiPost, ApiError } from '../api/client';
import { clearAccessToken, getAccessToken, registerUnauthorizedHandler, setAccessToken } from './tokenStore';

export interface StudentSession {
  universityId: string;
  name: string;
  branch: string | null;
  year: number | null;
  section: string | null;
  avatarUrl: string | null;
}

interface AuthContextValue {
  student: StudentSession | null;
  accessToken: string | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [student, setStudent] = useState<StudentSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const hydrated = useRef(false);

  // [Krrish/auth] localStorage.vs_student is no longer trusted for authentication — every
  // API call now requires a real JWT. This mirror exists only so other pages that
  // still read vs_student for display (name/branch/year/section) keep working;
  // it's kept in sync with the verified session, not the other way around.
  function syncLegacySessionMirror(s: StudentSession | null) {
    if (typeof window === 'undefined') return;
    if (s) {
      localStorage.setItem(
        'vs_student',
        JSON.stringify({
          universityId: s.universityId,
          name: s.name,
          branch: s.branch,
          year: s.year,
          section: s.section,
          loginTime: Date.now(),
        }),
      );
    } else {
      localStorage.removeItem('vs_student');
    }
  }

  const logout = useCallback(async () => {
    try {
      await apiPost('/api/auth/logout');
    } catch {
      // best-effort — clear local state regardless
    }
    clearAccessToken();
    setToken(null);
    setStudent(null);
    syncLegacySessionMirror(null);
    router.push('/login');
  }, [router]);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    registerUnauthorizedHandler(() => {
      setToken(null);
      setStudent(null);
      syncLegacySessionMirror(null);
      router.push('/login');
    });

    (async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, { method: 'POST', credentials: 'include' });
        const json = await res.json();
        if (res.ok && json.success) {
          setAccessToken(json.data.accessToken);
          setToken(json.data.accessToken);
          setStudent(json.data.student);
          syncLegacySessionMirror(json.data.student);
        } else {
          syncLegacySessionMirror(null);
          router.push('/login');
        }
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  return (
    <AuthContext.Provider value={{ student, accessToken: token ?? getAccessToken(), loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { ApiError };
