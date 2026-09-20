'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AccountModal from '@/components/account/AccountModal';
import AccountPanel from '@/components/account/AccountPanel';
import ProfileCard, { AccountTab } from '@/components/account/ProfileCard';
import BottomNav from '@/components/common/BottomNav';
import { RequireAuth } from '@/components/common/RequireAuth';
import { useAccountData } from '@/hooks/useAccountData';
import { useAuth } from '@/context/AuthContext';

export default function AccountPage() {
  const router = useRouter();
  const { logout, isAdmin, user } = useAuth();
  const { contributions, favorites, ready, removeFavorite, saveProfile, savePassword } = useAccountData();
  const [activeTab, setActiveTab] = useState<AccountTab>('profile');
  const [modalOpen, setModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const initials = user
    ? user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('')
    : '';

  const openSheet = (tab: AccountTab) => {
    setActiveTab(tab);
    setModalOpen(true);
  };

  return (
    <RequireAuth>
      <main className="min-h-dvh bg-bg pb-28 lg:pb-12">
        <div className="mx-auto max-w-5xl px-5 pt-[max(env(safe-area-inset-top),20px)]">
          <header className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted">Akun</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-content">Pengaturan Akun</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openSheet(activeTab)}
                aria-label="Buka menu akun"
                className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-edge bg-surface text-lg shadow-neo-sm transition active:translate-y-[2px] active:shadow-none lg:hidden"
              >
                ⚙️
              </button>
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/dashboard"
                  className="hidden h-10 items-center gap-1.5 rounded-xl border-2 border-edge bg-surface px-4 text-sm font-bold text-content shadow-neo-sm transition hover:border-muted active:translate-y-[2px] active:shadow-none lg:inline-flex"
                >
                  Buka Peta
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex h-10 items-center rounded-xl border-2 border-edge bg-surface px-4 text-sm font-bold text-danger shadow-neo-sm transition hover:border-danger active:translate-y-[2px] active:shadow-none"
                >
                  Keluar
                </button>
              </div>
            </div>
          </header>

          <div className="grid items-start gap-5 lg:grid-cols-[320px_1fr]">
            <div className="flex flex-col gap-5">
              <ProfileCard
                activeTab={activeTab}
                onTabChange={setActiveTab}
                reportCount={ready ? contributions.length : 0}
                favoriteCount={ready ? favorites.length : 0}
                tabsOnMobile={false}
              />

              {isAdmin ? (
                <section className="rounded-2xl border-2 border-edge bg-surface p-4 shadow-neo-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-strong bg-primary/10 text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-muted">Hak Akses</p>
                      <p className="text-sm font-extrabold text-content">Pengelolaan & Moderasi</p>
                    </div>
                  </div>
                  <Link
                    href="/admin"
                    className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-strong bg-primary px-4 text-sm font-extrabold text-primary-foreground shadow-neo-sm transition hover:-translate-y-0.5 active:translate-y-[2px] active:shadow-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Akses Admin Panel
                  </Link>
                  <p className="mt-2 text-center text-[10px] font-medium text-muted">
                    Masuk sebagai {initials || user?.email}
                  </p>
                </section>
              ) : null}
            </div>

            <div className="hidden lg:block">
              <AccountPanel
                activeTab={activeTab}
                contributions={contributions}
                favorites={favorites}
                ready={ready}
                onRemoveFavorite={removeFavorite}
                onSaveProfile={saveProfile}
                onSavePassword={savePassword}
              />
            </div>
          </div>
        </div>

        <BottomNav />
        <AccountModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          contributions={contributions}
          favorites={favorites}
          ready={ready}
          onRemoveFavorite={removeFavorite}
          onSaveProfile={saveProfile}
          onSavePassword={savePassword}
        />
      </main>
    </RequireAuth>
  );
}