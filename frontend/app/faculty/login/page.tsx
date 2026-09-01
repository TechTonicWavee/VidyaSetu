'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Field } from '@/components/shared/ui';
import { apiPost } from '@/lib/shared/api/client';
import { setPendingLoginSession } from '@/lib/shared/auth/tokenStore';
import { GraduationCap } from 'lucide-react';
import { useToast } from '@/components/shared/ToastContext';

export default function FacultyLogin() {
  const { addToast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiPost<any>('/api/auth/faculty-login', { email, password });
      
      setPendingLoginSession({
        accessToken: res.accessToken,
        student: res.student, // Actually faculty session
      });
      
      addToast('Logged in successfully', 'success');
      router.push('/faculty');
    } catch (err: any) {
      addToast(err.message || 'Login failed. Please check your credentials.', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-brand">
          <GraduationCap size={48} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-content">
          Faculty Portal
        </h2>
        <p className="mt-2 text-center text-sm text-muted">
          Sign in to manage your classes and mentees
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-2 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-line">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Field label="Email Address">
              <Input
                type="email"
                placeholder="faculty@kiet.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>

            <Field label="Password">
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Sign In
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted">Need help? </span>
            <a href="mailto:support@kiet.edu" className="font-medium text-brand hover:text-brand-hover transition-colors">
              Contact IT Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
