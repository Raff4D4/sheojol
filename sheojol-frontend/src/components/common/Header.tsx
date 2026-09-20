'use client';

import Link from 'next/link';
import { REGIONS } from '@/lib/regions';
import { RegionKey } from '@/types/shelter';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  region: RegionKey;
  onRegionChange: (region: RegionKey) => void;
}

export default function Header({ region, onRegionChange }: HeaderProps) {
  const { user, isAuthenticated } = useAuth();

  const initials = user
    ? user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('')
    : '';

  return (
    <header className="absolute inset-x-0 top-0 z-40 px-4 pt-[max(env(safe-area-inset-top),12px)]">
      <div className="relative flex items-center justify-between gap-2">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-2xl border-2 border-strong/70 bg-white/85 py-1 pr-3.5 pl-1 shadow-neo backdrop-blur-md dark:border-strong dark:bg-slate-950/80"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-xs font-black text-primary-foreground">
            SJ
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-extrabold tracking-tight text-content">SheoJol</span>
            <span className="block text-[10px] font-medium text-muted">Shelter Ojol Tangerang</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={region}
              onChange={(event) => onRegionChange(event.target.value as RegionKey)}
              aria-label="Pilih wilayah"
              className="h-10 appearance-none rounded-xl border-2 border-strong bg-surface py-2 pl-3 pr-9 text-sm font-bold text-content shadow-neo-sm"
            >
              {REGIONS.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {isAuthenticated && user ? (
            <Link
              href="/account"
              aria-label="Buka akun"
              title="Akun saya"
              className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-strong bg-surface-2 text-sm font-extrabold text-primary shadow-neo-sm"
            >
              {initials}
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex h-10 items-center gap-1 rounded-xl border-2 border-strong bg-primary px-3.5 text-sm font-bold text-primary-foreground shadow-neo-sm transition active:translate-y-[2px] active:shadow-none"
            >
              Masuk
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}