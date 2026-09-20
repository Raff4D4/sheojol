'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-bg">
      <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary border-t-transparent motion-reduce:animate-none" />
      <p className="text-xs font-black uppercase tracking-widest text-muted">SheoJol</p>
    </div>
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/login');
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) return <FullScreenLoader />;

  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) router.replace('/admin/login');
  }, [loading, isAdmin, router]);

  if (loading || !isAdmin) return <FullScreenLoader />;

  return <>{children}</>;
}