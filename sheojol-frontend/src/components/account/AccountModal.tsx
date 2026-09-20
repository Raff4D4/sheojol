'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FavoritesTab,
  ProfileTab,
  ReportsTab,
  SecurityTab,
} from '@/components/account/AccountPanel';
import { AccountTab } from '@/components/account/ProfileCard';
import { AuthUser, PasswordChangePayload } from '@/types/auth';
import { Shelter } from '@/types/shelter';

interface AccountModalProps {
  open: boolean;
  onClose: () => void;
  contributions: Shelter[];
  favorites: Shelter[];
  ready: boolean;
  onRemoveFavorite: (id: number) => Promise<void>;
  onSaveProfile: (payload: Partial<Pick<AuthUser, 'name' | 'phone' | 'vehicle' | 'app'>>) => Promise<void>;
  onSavePassword: (payload: PasswordChangePayload) => Promise<void>;
}

const ACCOUNT_ACTIONS: Array<{
  tab: AccountTab;
  icon: string;
  title: string;
  hint: string;
}> = [
  { tab: 'reports', icon: '📋', title: 'Laporan', hint: 'Titik yang pernah kamu laporkan' },
  { tab: 'favorites', icon: '⭐', title: 'Shelter Favorit', hint: 'Basecamp & warkop tersimpan' },
  { tab: 'profile', icon: '👤', title: 'Edit Profil', hint: 'Data driver dan kendaraan' },
  { tab: 'security', icon: '🔒', title: 'Keamanan & Password', hint: 'Kelola kata sandi akun' },
];

const TAB_TITLES: Record<AccountTab, string> = {
  reports: 'Laporan',
  favorites: 'Shelter Favorit',
  profile: 'Edit Profil',
  security: 'Keamanan & Password',
};

export default function AccountModal({
  open,
  onClose,
  contributions,
  favorites,
  ready,
  onRemoveFavorite,
  onSaveProfile,
  onSavePassword,
}: AccountModalProps) {
  const router = useRouter();
  const [view, setView] = useState<AccountTab | null>(null);

  useEffect(() => {
    if (open) setView(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const goHome = () => {
    onClose();
    router.push('/dashboard');
  };

  const renderBody = () => {
    if (view === 'favorites') {
      return <FavoritesTab favorites={favorites} ready={ready} onRemoveFavorite={onRemoveFavorite} />;
    }
    if (view === 'profile') {
      return <ProfileTab onSave={onSaveProfile} />;
    }
    if (view === 'security') {
      return <SecurityTab onSave={onSavePassword} />;
    }
    return <ReportsTab contributions={contributions} ready={ready} bare />;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 lg:hidden" onClick={onClose}>
      <section
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Menu akun"
        className="absolute inset-x-0 bottom-0 flex max-h-[86dvh] flex-col rounded-t-2xl border-t-2 border-r-2 border-l-2 border-edge bg-surface p-5 pb-[max(env(safe-area-inset-bottom),20px)] shadow-neo"
      >
        <div className="mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full bg-edge" />
        <div className="mb-4 flex shrink-0 items-center justify-between gap-3">
          <div className="min-w-0">
            {view ? (
              <button
                type="button"
                onClick={() => setView(null)}
                className="inline-flex items-center gap-1.5 rounded-lg border-2 border-edge bg-surface-2 px-3 py-1.5 text-xs font-bold text-content transition active:translate-y-[2px] active:shadow-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Menu
              </button>
            ) : (
              <>
                <h2 className="text-lg font-extrabold tracking-tight text-content">Menu Akun</h2>
                <p className="text-xs text-muted">Navigasi cepat pengaturan akun</p>
              </>
            )}
          </div>
          {view ? <h2 className="text-lg font-extrabold tracking-tight text-content">{TAB_TITLES[view]}</h2> : null}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-edge bg-surface-2 text-muted transition hover:text-content"
          >
            ✕
          </button>
        </div>

        {view ? (
          <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
            <div className="rounded-2xl border-2 border-edge bg-surface p-5">{renderBody()}</div>
          </div>
        ) : (
          <nav className="no-scrollbar min-h-0 flex-1 space-y-2.5 overflow-y-auto">
            {ACCOUNT_ACTIONS.map((action) => (
              <button
                key={action.tab}
                type="button"
                onClick={() => setView(action.tab)}
                className="flex w-full items-center gap-3.5 rounded-2xl border-2 border-edge bg-surface-2 p-4 text-left transition active:translate-y-[2px] active:shadow-none"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-edge bg-surface text-xl">
                  {action.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-extrabold text-content">{action.title}</span>
                  <span className="block truncate text-xs font-medium text-muted">{action.hint}</span>
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 shrink-0 text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}

            <button
              type="button"
              onClick={goHome}
              className="flex w-full items-center gap-3.5 rounded-2xl border-2 border-strong bg-primary p-4 text-left shadow-neo-sm transition active:translate-y-[2px] active:shadow-none"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-strong bg-primary-foreground/10 text-xl text-primary-foreground">
                🏠
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold text-primary-foreground">Kembali ke Home</span>
                <span className="block text-xs font-medium text-primary-foreground/80">Langsung ke peta utama</span>
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 shrink-0 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        )}
      </section>
    </div>
  );
}