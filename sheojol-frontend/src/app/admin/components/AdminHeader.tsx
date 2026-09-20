'use client';

import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/common/ThemeToggle';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  connected: boolean;
  pendingCount: number;
  onMenuClick: () => void;
  onNotifyClick: () => void;
}

export default function AdminHeader({
  title,
  subtitle,
  connected,
  pendingCount,
  onMenuClick,
  onNotifyClick,
}: AdminHeaderProps) {
  const { user } = useAuth();

  const initials = (user?.name ?? 'Admin SheoJol')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 border-b-2 border-edge bg-surface">
      <div className="flex items-center gap-3 px-4 py-3 lg:px-8">
        <button
          onClick={onMenuClick}
          aria-label="Buka menu"
          className="rounded-lg p-2 text-muted transition hover:bg-surface-2 hover:text-content lg:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-extrabold tracking-tight text-content">{title}</h1>
          {subtitle ? <p className="truncate text-[11px] font-medium text-muted">{subtitle}</p> : null}
        </div>

        <div className="hidden items-center gap-2 rounded-full border-2 border-edge bg-surface-2 px-3 py-1.5 text-[11px] font-bold sm:flex">
          <span className="relative flex h-2 w-2">
            {connected ? (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70 motion-reduce:animate-none" />
            ) : null}
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${connected ? 'bg-primary' : 'bg-danger'}`}
            />
          </span>
          <span className={connected ? 'text-primary' : 'text-danger'}>
            {connected ? 'Sistem Aktif' : 'Offline'}
          </span>
        </div>

        <div className="lg:hidden">
          <ThemeToggle className="h-9 !px-2.5" label="Ganti tema" />
        </div>

        <button
          onClick={onNotifyClick}
          aria-label="Notifikasi persetujuan"
          className="relative rounded-lg p-2 text-muted transition hover:bg-surface-2 hover:text-content"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {pendingCount > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-black text-zinc-950">
              {pendingCount > 99 ? '99+' : pendingCount}
            </span>
          ) : null}
        </button>

        <div className="flex items-center gap-2.5 rounded-2xl border-2 border-edge bg-surface-2 px-2.5 py-1.5 pr-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-strong bg-primary text-xs font-black text-primary-foreground">
            {initials || 'A'}
          </span>
          <div className="hidden leading-tight sm:block">
            <p className="text-xs font-bold text-content">{user?.name ?? 'Admin SheoJol'}</p>
            <p className="text-[10px] font-semibold text-primary">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}