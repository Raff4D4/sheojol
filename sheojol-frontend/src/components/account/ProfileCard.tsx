'use client';

import { ReactNode } from 'react';
import ThemeToggle from '@/components/common/ThemeToggle';
import { useAuth } from '@/context/AuthContext';

export type AccountTab = 'reports' | 'favorites' | 'profile' | 'security';

interface ProfileCardProps {
  activeTab: AccountTab;
  onTabChange: (tab: AccountTab) => void;
  reportCount: number;
  favoriteCount: number;
  tabsOnMobile?: boolean;
}

const TAB_ICONS: Record<AccountTab, ReactNode> = {
  reports: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  favorites: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  profile: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  security: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
};

const TAB_LABELS: Record<AccountTab, string> = {
  reports: 'Laporan Saya',
  favorites: 'Shelter Favorit',
  profile: 'Edit Profil',
  security: 'Keamanan & Password',
};

function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function StatCounter({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border-2 border-edge bg-surface-2 p-3 transition duration-200 hover:-translate-y-1 hover:border-primary">
      <p className="text-2xl font-black tracking-tight text-content">{value}</p>
      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-muted">{label}</p>
    </div>
  );
}

export default function ProfileCard({ activeTab, onTabChange, reportCount, favoriteCount, tabsOnMobile = true }: ProfileCardProps) {
  const { user } = useAuth();
  const tabs = Object.keys(TAB_LABELS) as AccountTab[];

  return (
    <div className="flex flex-col gap-5 rounded-2xl border-2 border-edge bg-surface p-5 shadow-neo">
      <div className="flex items-center gap-3">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-strong bg-primary text-lg font-black text-primary-foreground shadow-neo-sm">
          {user ? initialsOf(user.name) : ''}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-extrabold text-content">{user?.name}</p>
          <p className="truncate text-sm font-medium text-muted">{user?.email}</p>
          <span className="mt-1 inline-block rounded-full border border-edge bg-surface-2 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted">
            {user?.role === 'admin' ? 'Admin' : 'Driver'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCounter label="Total Laporan" value={reportCount} />
        <StatCounter label="Total Favorit" value={favoriteCount} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2.5 rounded-xl border-2 border-edge bg-surface-2 px-3 py-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted">Kendaraan</p>
            <p className="truncate text-xs font-extrabold text-content">{user?.vehicle ?? 'Belum diisi'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl border-2 border-edge bg-surface-2 px-3 py-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted">Aplikasi</p>
            <p className="truncate text-xs font-extrabold text-content">{user?.app ?? 'Belum diisi'}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-edge bg-surface-2 px-3 py-2.5">
        <span className="text-xs font-bold uppercase tracking-widest text-muted">Tema Tampilan</span>
        <ThemeToggle className="h-9 !px-3 !text-xs" label="Ganti tema" />
      </div>

      <nav className={`no-scrollbar gap-2 px-1 lg:flex lg:flex-col ${tabsOnMobile ? '-mx-1 flex overflow-x-auto' : 'hidden -mx-0'}`}>
        {tabs.map((tab) => {
          const active = tab === activeTab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              aria-pressed={active}
              className={`inline-flex shrink-0 items-center gap-2.5 rounded-xl border-2 px-3.5 py-2.5 text-sm font-bold transition active:translate-y-[2px] active:shadow-none ${
                active
                  ? 'border-strong bg-primary text-primary-foreground shadow-neo-sm'
                  : 'border-edge bg-surface-2 text-muted hover:border-muted hover:text-content'
              }`}
            >
              {TAB_ICONS[tab]}
              <span className="whitespace-nowrap">{TAB_LABELS[tab]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}