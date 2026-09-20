'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useShelters } from '@/hooks/useShelters';
import ThemeToggle from '@/components/common/ThemeToggle';
import { AMENITY_META, SHELTER_TYPE_COLORS } from '@/lib/constants';
import { REGIONS } from '@/lib/regions';
import { Amenity, ShelterType } from '@/types/shelter';

const MiniMap = dynamic(() => import('@/components/map/MiniMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full animate-pulse items-center justify-center bg-surface-2 motion-reduce:animate-none">
      <span className="text-xs font-black uppercase tracking-widest text-muted">Memuat peta</span>
    </div>
  ),
});

const TYPE_META: Record<ShelterType, { label: string; dot: string; text: string; border: string; shadow: string }> = {
  official: {
    label: 'Shelter Resmi',
    dot: '#22c55e',
    text: 'text-primary',
    border: 'hover:border-primary',
    shadow: 'hover:shadow-neo-brand',
  },
  verified: {
    label: 'Basecamp & Warkop',
    dot: '#06b6d4',
    text: 'text-accent',
    border: 'hover:border-cyan-500',
    shadow: 'hover:shadow-neo-cyan',
  },
  warning: {
    label: 'Radar Zona Warning',
    dot: '#ef4444',
    text: 'text-danger',
    border: 'hover:border-red-500',
    shadow: 'hover:shadow-neo-brand',
  },
};

const TAG_LISTS: Record<ShelterType, string[]> = {
  official: ['Lolos razia', 'Bebas nongkrong', 'Update berkala'],
  verified: ['Kopi murah', 'Wifi nongkrong', 'Diulas driver'],
  warning: ['Laporan terbaru', 'Hindari atau waspada', 'Perbarui posisi'],
};

const DESCRIPTIONS: Record<ShelterType, string> = {
  official: 'Titik resmi yang terverifikasi jelas statusnya, aman untuk mengaso, ngecas HP, dan menunggu order.',
  verified: 'Basecamp dan warkop yang diulas sesama driver: tempat berkumpul yang nyaman dan terpercaya.',
  warning: 'Lokasi rawan garukan atau razia yang dilaporkan driver terbaru, biar kamu bisa memutar rute lebih awal.',
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    setMounted(true);
    const node = ref.current;
    if (!node) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) {
      setReduce(true);
      return;
    }
    const rect = node.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (inViewport) return;
    setShown(false);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: reduce ? '0ms' : `${delay}ms` }}
      className={`${className} ${!mounted || reduce ? '' : 'transition-all duration-500 ease-out'} ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
    >
      {children}
    </div>
  );
}

function PinIcon({ className = '' }: { className?: string }) {
  const color = SHELTER_TYPE_COLORS.official;
  return (
    <span
      className={`relative flex h-8 w-8 items-center justify-center rounded-[50%_50%_50%_5px] border-2 border-strong rotate-45 ${className}`}
      style={{ backgroundColor: color }}
    >
      <span className="h-2.5 w-2.5 rounded-full bg-zinc-950 -rotate-45" />
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14m0 0l-6-6m6 6l-6 6" />
    </svg>
  );
}

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { shelters, loading, error, isDemo } = useShelters();

  const counts = useMemo(() => {
    const official = shelters.filter((shelter) => shelter.type === 'official').length;
    const verified = shelters.filter((shelter) => shelter.type === 'verified').length;
    const warning = shelters.filter((shelter) => shelter.type === 'warning').length;
    const amenityCounts = Object.keys(AMENITY_META) as Amenity[];
    const amenities = amenityCounts.reduce<Record<Amenity, number>>(
      (acc, amenity) => ({ ...acc, [amenity]: shelters.filter((shelter) => shelter.facilities.includes(amenity)).length }),
      {} as Record<Amenity, number>,
    );
    const regionCounts = REGIONS.reduce<Record<string, number>>((acc, region) => {
      acc[region.label] = shelters.filter((shelter) => shelter.region === region.label).length;
      return acc;
    }, {});
    return { official, verified, warning, total: shelters.length, amenities, regionCounts };
  }, [shelters]);

  const numberSkeleton = loading ? (
    <span className="inline-block h-8 w-8 animate-pulse rounded-lg bg-surface-2 motion-reduce:animate-none" />
  ) : null;

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-50 border-b-2 border-edge bg-bg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
          <Link href="/" className="flex items-center gap-3">
            <PinIcon />
            <span className="leading-tight">
              <span className="block text-[17px] font-black tracking-tight text-content">SheoJol</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                Shelter Ojol Tangerang
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <a href="#fitur" className="text-sm font-bold text-muted transition hover:text-content">
              Cara Kerja
            </a>
            <a href="#wilayah" className="text-sm font-bold text-muted transition hover:text-content">
              Wilayah
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle iconOnly label="Ganti tema" />
            {isAuthenticated ? (
              <Link
                href="/account"
                className="hidden h-10 items-center rounded-xl border-2 border-edge bg-surface px-4 text-sm font-bold text-content shadow-neo-sm transition hover:border-muted sm:flex"
              >
                Akun
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden h-10 items-center rounded-xl border-2 border-edge bg-surface px-4 text-sm font-bold text-content shadow-neo-sm transition hover:border-muted sm:flex"
              >
                Masuk
              </Link>
            )}
            <Link
              href="/dashboard"
              className="flex h-10 items-center gap-2 rounded-xl border-2 border-strong bg-primary px-4 text-sm font-extrabold text-primary-foreground shadow-neo-sm transition active:translate-y-[2px] active:shadow-none"
            >
              Buka Peta
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex h-9 items-center gap-2 rounded-full border-2 border-strong bg-primary px-4 text-xs font-extrabold text-primary-foreground shadow-neo-sm">
              <span className="h-2 w-2 rounded-full bg-zinc-950" />
              {loading ? 'Memuat...' : `${counts.total} titik terpetakan`}
            </span>
            <span className="flex h-9 items-center gap-2 rounded-full border border-edge bg-surface px-3.5 text-xs font-bold text-content">
              <span className="h-2 w-2 rounded-full bg-cyan-500" />
              {loading ? '…' : `${counts.verified} basecamp`}
            </span>
            <span className="flex h-9 items-center gap-2 rounded-full border border-edge bg-surface px-3.5 text-xs font-bold text-content">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              {loading ? '…' : `${counts.warning} zona warning`}
            </span>
          </div>

          <h1 className="mt-8 max-w-2xl text-[2.65rem] font-black leading-[1.03] tracking-[-0.04em] text-content sm:text-6xl">
            Navigasi &amp; basecamp <span className="text-primary">teraman</span> driver ojol Tangerang
          </h1>

          <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-muted">
            Peta kolaboratif berisi shelter resmi, basecamp warkop terverifikasi, dan radar zona rawan
            garukan — dirawat oleh sesama driver Tangerang Raya.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="flex h-14 items-center gap-2.5 rounded-xl border-2 border-strong bg-primary px-7 text-base font-extrabold text-primary-foreground shadow-neo transition hover:-translate-y-0.5 hover:shadow-neo-brand active:translate-y-[2px] active:shadow-none"
            >
              Buka Peta
              <ArrowIcon />
            </Link>
            <a
              href="#wilayah"
              className="flex h-14 items-center rounded-xl border-2 border-edge bg-surface px-6 text-base font-bold text-content shadow-neo transition hover:border-muted"
            >
              Lihat Wilayah
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-muted">
            <li>Data live dari server lokal</li>
            <li>Gratis untuk semua driver</li>
            <li>Tanpa iklan</li>
          </ul>

          {error ? (
            <p className="mt-6 max-w-md rounded-xl border-2 border-warn/40 bg-warn/15 px-4 py-3 text-xs font-bold text-warn">
              {error}
            </p>
          ) : null}
        </div>

        <Reveal>
          <div className="relative rounded-2xl border-2 border-edge bg-surface p-2 shadow-neo">
            <div className="flex items-center justify-between px-3 pb-2 pt-1">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-muted">
                Peta langsung
              </span>
              {isDemo ? (
                <span className="rounded-full border border-warn/40 bg-warn/15 px-2.5 py-0.5 text-[10px] font-bold text-warn">
                  Mode contoh
                </span>
              ) : (
                <span className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary motion-reduce:animate-none" />
                  Live
                </span>
              )}
            </div>
            <div className="relative h-[320px] overflow-hidden rounded-xl border-2 border-edge sm:h-[440px]">
              <MiniMap shelters={shelters} />
            </div>
            <div className="no-scrollbar flex gap-3 overflow-x-auto px-3 pt-3 pb-1">
              <span className="flex items-center gap-1.5 whitespace-nowrap text-[11px] font-bold text-content">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                {loading ? '…' : `${counts.official} Resmi`}
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap text-[11px] font-bold text-content">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                {loading ? '…' : `${counts.verified} Basecamp`}
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap text-[11px] font-bold text-content">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                {loading ? '…' : `${counts.warning} Warning`}
              </span>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="fitur" className="border-t-2 border-edge bg-surface/40 py-20">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <h2 className="max-w-2xl text-3xl font-black leading-tight tracking-[-0.03em] text-content sm:text-4xl">
              Tiga lapis perlindungan untuk kerja yang lebih aman
            </h2>
            <p className="mt-3 max-w-xl text-base font-medium text-muted">
              Setiap pin di peta berwarna sesuai fungsinya. Satu kali lihat, langsung paham apakah
              tempat itu aman, nyaman, atau perlu dihindari.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {(Object.keys(TYPE_META) as ShelterType[]).map((type, index) => {
              const meta = TYPE_META[type];
              const count = type === 'official' ? counts.official : type === 'verified' ? counts.verified : counts.warning;
              return (
                <Reveal key={type} delay={index * 90}>
                  <Link
                    href={`/dashboard?type=${type}`}
                    className={`block h-full rounded-2xl border-2 border-edge bg-surface p-6 shadow-neo transition duration-300 hover:-translate-y-1 ${meta.border} ${meta.shadow}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: meta.dot }} />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">
                        {['Layer 01', 'Layer 02', 'Layer 03'][index]}
                      </span>
                    </div>
                    <p className={`mt-6 text-5xl font-black tracking-tight ${meta.text}`}>{numberSkeleton ?? count}</p>
                    <p className="mt-2 text-lg font-extrabold text-content">{meta.label}</p>
                    <p className="mt-3 text-sm font-medium leading-relaxed text-muted">{DESCRIPTIONS[type]}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {TAG_LISTS[type].map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-edge bg-surface-2 px-2 py-1 text-[11px] font-bold text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <h2 className="text-3xl font-black leading-tight tracking-[-0.03em] text-content sm:text-4xl">
              Fasilitas yang paling dicari driver
            </h2>
            <p className="mt-3 max-w-xl text-base font-medium text-muted">
              Cari titik yang punya colokan, toilet bersih, kopi murah, atau parkir yang aman — cukup
              satu ketukan di peta.
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {(Object.keys(AMENITY_META) as Amenity[]).map((amenity, index) => (
              <Reveal key={amenity} delay={index * 70}>
                <Link
                  href={`/dashboard?amenity=${amenity}`}
                  className="flex h-full flex-col gap-4 rounded-2xl border-2 border-edge bg-surface p-5 shadow-neo transition hover:-translate-y-1 hover:border-primary/70 hover:shadow-neo-brand"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-edge bg-surface-2 text-2xl">
                    {AMENITY_META[amenity].icon}
                  </span>
                  <span className="text-sm font-extrabold text-content">{AMENITY_META[amenity].label}</span>
                  <span className="text-xs font-bold text-muted">
                    {loading ? 'Menghitung...' : `${counts.amenities[amenity]} titik menyediakan`}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="wilayah" className="border-t-2 border-edge py-20">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <h2 className="text-3xl font-black leading-tight tracking-[-0.03em] text-content sm:text-4xl">
              Cakupan enam wilayah Tangerang Raya
            </h2>
            <p className="mt-3 max-w-xl text-base font-medium text-muted">
              Ketuk wilayah untuk membuka peta langsung di lokasinya.
            </p>
          </Reveal>

          <div className="mt-10 flex max-w-3xl flex-col gap-3">
            {REGIONS.map((region, index) => (
              <Reveal key={region.key} delay={index * 60}>
                <Link
                  href={`/dashboard?region=${region.key}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl border-2 border-edge bg-surface px-5 py-4 shadow-neo transition hover:border-primary hover:shadow-neo-brand"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-edge bg-surface-2 text-sm font-black text-content">
                      {region.label
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                    <span className="text-base font-extrabold text-content">{region.label}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="text-sm font-bold text-muted">
                      {loading ? '…' : `${counts.regionCounts[region.label] ?? 0} titik`}
                    </span>
                    <span className="text-muted transition group-hover:translate-x-1 group-hover:text-primary">
                      <ArrowIcon />
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border-2 border-strong bg-primary p-8 shadow-neo lg:p-14">
              <svg
                aria-hidden
                className="pointer-events-none absolute -bottom-8 -right-8 h-56 w-56 text-zinc-950/15"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2a6 6 0 00-6 6c0 3.5 6 14 6 14s6-10.5 6-14a6 6 0 00-6-6z"
                />
                <circle cx="12" cy="8" r="2" fill="currentColor" stroke="none" />
              </svg>
              <h2 className="max-w-xl text-3xl font-black leading-tight tracking-[-0.03em] text-primary-foreground sm:text-4xl">
                Temukan titik aman untuk istirahat berikutnya
              </h2>
              <p className="mt-3 max-w-lg text-base font-semibold text-zinc-900/80">
                Buka peta, pilih wilayah, dan langsung navigasi ke shelter terdekat.
              </p>
              <Link
                href="/dashboard"
                className="mt-8 inline-flex h-14 items-center gap-2 rounded-xl border-2 border-zinc-950 bg-zinc-950 px-7 text-base font-extrabold text-primary shadow-neo transition hover:-translate-y-0.5 active:translate-y-[2px] active:shadow-none"
              >
                Lihat Peta Langsung
                <ArrowIcon />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t-2 border-edge py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <PinIcon />
              <span className="text-[17px] font-black tracking-tight text-content">SheoJol</span>
            </div>
            <p className="mt-3 max-w-xs text-xs font-medium leading-relaxed text-muted">
              Shelter Ojol Tangerang — peta kolaboratif untuk driver ojek online.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-muted">
            <Link href="/dashboard" className="transition hover:text-primary">
              Peta
            </Link>
            <Link href="/login" className="transition hover:text-primary">
              Masuk
            </Link>
            <Link href="/register" className="transition hover:text-primary">
              Daftar Driver
            </Link>
            <Link href="/admin/login" className="transition hover:text-primary">
              Portal Admin
            </Link>
          </nav>
        </div>
        {isDemo ? (
          <p className="mx-auto mt-8 max-w-7xl px-5 text-[11px] font-semibold text-warn">
            Data contoh lokal sedang ditampilkan — nyalakan backend Laravel untuk data asli.
          </p>
        ) : null}
        <p className="mx-auto mt-6 max-w-7xl px-5 text-xs font-medium text-muted">
          © 2026 SheoJol. Dibuat untuk sesama driver Tangerang Raya.
        </p>
      </footer>
    </div>
  );
}