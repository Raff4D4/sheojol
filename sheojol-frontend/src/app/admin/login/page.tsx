'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/common/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { apiErrorMessage } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAdmin) router.replace('/admin');
  }, [loading, isAdmin, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login({ email, password }, true);
      router.replace('/admin');
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'h-12 w-full rounded-xl border border-edge bg-surface-2 px-4 text-sm font-medium text-content placeholder:text-muted focus:border-primary';

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center bg-bg px-5 py-10">
      <div className="absolute right-5 top-[max(env(safe-area-inset-top),16px)]">
        <ThemeToggle label="Ganti tema" />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-strong bg-primary text-2xl font-black text-primary-foreground shadow-neo-sm">
            SJ
          </span>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-content">Portal Admin</h1>
            <p className="mt-1 text-sm font-medium text-muted">Kelola shelter SheoJol Tangerang.</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl border-2 border-edge bg-surface p-6 shadow-neo"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted">Email Admin</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@sheojol.local"
              required
              autoComplete="email"
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className={inputClass}
            />
          </label>

          {error ? (
            <p className="rounded-xl border-2 border-danger/40 bg-danger/15 px-4 py-3 text-xs font-bold text-danger">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 h-12 rounded-xl border-2 border-strong bg-primary text-sm font-bold text-primary-foreground shadow-neo transition active:translate-y-[2px] active:shadow-none disabled:opacity-60"
          >
            {submitting ? 'Memuat...' : 'Masuk Admin'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm font-medium text-muted">
          Bukan admin?{' '}
          <Link href="/login" className="font-bold text-primary underline">
            Login driver
          </Link>
        </div>
      </div>
    </main>
  );
}