'use client';

import Link from 'next/link';
import { useState } from 'react';
import AccountPanel from '@/components/account/AccountPanel';
import ProfileCard, { AccountTab } from '@/components/account/ProfileCard';
import BottomNav from '@/components/common/BottomNav';
import { RequireAuth } from '@/components/common/RequireAuth';
import { useAccountData } from '@/hooks/useAccountData';

export default function MePage() {
  const { user, contributions, favorites, ready, removeFavorite, saveProfile, savePassword } = useAccountData();
  const [activeTab, setActiveTab] = useState<AccountTab>('reports');

  return (
    <RequireAuth>
      <main className="min-h-dvh bg-bg pb-28 lg:pb-12">
        <div className="mx-auto max-w-5xl px-5 pt-[max(env(safe-area-inset-top),20px)]">
          <header className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted">Saya</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-content">Aktivitas Driver</h1>
            </div>
            <Link
              href="/dashboard"
              className="hidden h-10 items-center gap-1.5 rounded-xl border-2 border-edge bg-surface px-4 text-sm font-bold text-content shadow-neo-sm transition hover:border-muted active:translate-y-[2px] active:shadow-none lg:inline-flex"
            >
              Buka Peta
            </Link>
          </header>

          <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
            <ProfileCard
              activeTab={activeTab}
              onTabChange={setActiveTab}
              reportCount={ready ? contributions.length : 0}
              favoriteCount={ready ? favorites.length : 0}
            />
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

        <BottomNav />
      </main>
    </RequireAuth>
  );
}