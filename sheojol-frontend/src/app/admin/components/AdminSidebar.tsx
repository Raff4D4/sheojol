'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/common/ThemeToggle';

export type AdminSection = 'overview' | 'shelters' | 'pending' | 'drivers' | 'settings';

interface AdminSidebarProps {
  open: boolean;
  collapsed: boolean;
  active: AdminSection;
  pendingCount: number;
  onNavigate: (section: AdminSection) => void;
  onClose: () => void;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

const NAV_ITEMS: Array<{ key: AdminSection; label: string; icon: ReactNode }> = [
  {
    key: 'overview',
    label: 'Dashboard',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h4a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 4h4a2 2 0 012 2v5a2 2 0 01-2 2h-4a2 2 0 01-2-2V6a2 2 0 012-2z" />
      </svg>
    ),
  },
  {
    key: 'shelters',
    label: 'Data Shelter',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    key: 'pending',
    label: 'Verifikasi',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    key: 'drivers',
    label: 'Driver',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-5.13a4 4 0 11-8 0 4 4 0 018 0zm6 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    key: 'settings',
    label: 'Pengaturan',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function AdminSidebar({
  open,
  collapsed,
  active,
  pendingCount,
  onNavigate,
  onClose,
  onToggleCollapse,
  onLogout,
}: AdminSidebarProps) {
  const widthClass = collapsed ? 'lg:w-20' : 'lg:w-64';

  const sidebar = (
    <div
      className={`flex h-full flex-col border-r-2 border-edge bg-surface transition-[width] duration-200 ${widthClass}`}
    >
      <div className={`flex items-center gap-3 border-b-2 border-edge p-4 ${collapsed ? 'lg:justify-center' : ''}`}>
        <Link href="/admin" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-strong bg-primary text-xs font-black text-primary-foreground shadow-neo-sm">
            SJ
          </span>
          {!collapsed ? (
            <span className="leading-tight">
              <span className="block text-sm font-extrabold tracking-tight text-content">SheoJol</span>
              <span className="block text-[9px] font-bold uppercase tracking-widest text-muted">Admin Panel</span>
            </span>
          ) : null}
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup menu"
          className="ml-auto rounded-lg p-1.5 text-muted transition hover:bg-surface-2 hover:text-content lg:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Lebarkan sidebar' : 'Sempitkan sidebar'}
          aria-pressed={collapsed}
          className="hidden rounded-lg p-1.5 text-muted transition hover:bg-surface-2 hover:text-content lg:block"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === active;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
              title={collapsed ? item.label : undefined}
              className={`relative flex w-full items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition active:translate-y-[2px] active:shadow-none ${
                collapsed ? 'lg:justify-center lg:px-0' : ''
              } ${
                isActive
                  ? 'border-strong bg-primary text-primary-foreground shadow-neo-sm'
                  : 'border-transparent text-muted hover:bg-surface-2 hover:text-content'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed ? <span className="truncate">{item.label}</span> : null}
              {!collapsed && item.key === 'pending' && pendingCount > 0 ? (
                <span className="ml-auto shrink-0 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-black text-zinc-950">
                  {pendingCount > 99 ? '99+' : pendingCount}
                </span>
              ) : null}
              {collapsed && item.key === 'pending' && pendingCount > 0 ? (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-500" />
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="space-y-1.5 border-t-2 border-edge p-3">
        <Link
          href="/dashboard"
          title={collapsed ? 'Buka Peta Publik' : undefined}
          className={`flex w-full items-center gap-3 rounded-xl border-2 border-edge px-3 py-2.5 text-sm font-bold text-muted transition hover:bg-surface-2 hover:text-content ${
            collapsed ? 'lg:justify-center lg:px-0' : ''
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          {!collapsed ? <span className="truncate">Buka Peta Publik</span> : null}
        </Link>
        <button
          type="button"
          onClick={onLogout}
          title={collapsed ? 'Keluar' : undefined}
          className={`flex w-full items-center gap-3 rounded-xl border-2 border-edge px-3 py-2.5 text-sm font-bold text-danger transition hover:border-danger active:translate-y-[2px] active:shadow-none ${
            collapsed ? 'lg:justify-center lg:px-0' : ''
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed ? <span className="truncate">Keluar</span> : null}
        </button>
        <div className={collapsed ? 'hidden lg:flex lg:justify-center' : ''}>
          <ThemeToggle className="h-9 w-full !px-2.5" label="Ganti tema" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 lg:z-30 lg:w-auto lg:translate-x-0 lg:transition-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebar}
      </div>
      {open ? (
        <div
          aria-hidden
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      ) : null}
    </>
  );
}