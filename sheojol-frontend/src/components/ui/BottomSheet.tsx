'use client';

import { useMemo, useRef, useState } from 'react';
import Badge from './Badge';
import ShelterCard from '@/components/shelter/ShelterCard';
import { AMENITY_META } from '@/lib/constants';
import { AMENITY_LIST, Amenity, Shelter } from '@/types/shelter';

type SnapPoint = 'peek' | 'half' | 'full';

const SNAP_OFFSET: Record<SnapPoint, number> = {
  full: 0,
  half: 36,
  peek: 82,
};

interface BottomSheetProps {
  shelters: Shelter[];
  loading: boolean;
  error: string | null;
  isDemo: boolean;
  selectedId: number | null;
  onSelect: (shelter: Shelter) => void;
  initialAmenity?: Amenity | null;
}

export default function BottomSheet({ shelters, loading, error, isDemo, selectedId, onSelect, initialAmenity }: BottomSheetProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Amenity[]>(() =>
    initialAmenity ? [initialAmenity] : [],
  );
  const [snap, setSnap] = useState<SnapPoint>('half');
  const [dragOffset, setDragOffset] = useState<number | null>(null);
  const dragRef = useRef<{ startY: number; startOffset: number } | null>(null);

  const baseOffset = SNAP_OFFSET[snap];
  const currentOffset = dragOffset ?? baseOffset;

  const toggleFilter = (amenity: Amenity) => {
    setFilters((current) =>
      current.includes(amenity) ? current.filter((item) => item !== amenity) : [...current, amenity],
    );
  };

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return shelters.filter((shelter) => {
      const matchesQuery =
        !normalized ||
        shelter.name.toLowerCase().includes(normalized) ||
        shelter.address.toLowerCase().includes(normalized);
      const matchesAmenities = filters.length === 0 || filters.every((amenity) => shelter.facilities.includes(amenity));
      return matchesQuery && matchesAmenities;
    });
  }, [shelters, query, filters]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = { startY: event.clientY, startOffset: currentOffset };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const delta = ((event.clientY - dragRef.current.startY) / window.innerHeight) * 100;
    setDragOffset(Math.min(88, Math.max(-5, dragRef.current.startOffset + delta)));
  };

  const finishDrag = () => {
    dragRef.current = null;
    const value = dragOffset ?? baseOffset;
    setSnap(value > 60 ? 'peek' : value > 10 ? 'half' : 'full');
    setDragOffset(null);
  };

  return (
    <section
      className="absolute inset-x-0 bottom-0 z-30 flex h-[84dvh] flex-col rounded-t-2xl border-t-2 border-x-2 border-edge bg-surface shadow-[0_-4px_0_0_rgb(var(--strong)/0.55)] will-change-transform"
      style={{
        transform: `translateY(${currentOffset}%)`,
        transitionProperty: dragOffset === null ? 'transform' : 'none',
        transitionDuration: '300ms',
        transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
      }}
    >
      <div
        className="touch-none cursor-grab select-none active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        <div className="mx-auto mt-3 mb-2 h-1.5 w-12 rounded-full bg-edge" />
      </div>

      <div className="px-5 pb-2">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight text-content">Shelter terdekat</h2>
          <span className="rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
            {filtered.length} titik
          </span>
        </div>

        <div className="relative mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari shelter atau warkop..."
            className="h-11 w-full rounded-xl border border-edge bg-surface-2 pl-10 pr-4 text-sm font-medium text-content placeholder:text-muted focus:border-primary"
          />
        </div>

        <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto pb-1">
          {AMENITY_LIST.map((amenity) => {
            const active = filters.includes(amenity);
            const meta = AMENITY_META[amenity];
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleFilter(amenity)}
                aria-pressed={active}
                className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border-2 px-3.5 text-xs font-bold transition active:translate-y-[2px] active:shadow-none ${
                  active
                    ? 'border-strong bg-primary text-primary-foreground shadow-neo-sm'
                    : 'border-edge bg-surface-2 text-muted hover:border-muted'
                }`}
              >
                <span className="text-sm leading-none">{meta.icon}</span>
                <span>{meta.short}</span>
              </button>
            );
          })}
        </div>

        {error ? (
          <p className="mb-3 rounded-xl border border-warn/40 bg-warn/15 px-3 py-2 text-xs font-semibold text-warn">
            {error}
          </p>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(env(safe-area-inset-bottom),88px)]">
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="h-24 animate-pulse rounded-xl bg-surface-2 motion-reduce:animate-none" />
            ))}
          </div>
        ) : null}

        {!loading && filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <span className="text-3xl">🔎</span>
            <p className="text-sm font-semibold text-content">Belum ada titik yang cocok</p>
            <p className="text-xs text-muted">Ubah kata kunci atau filter fasilitas.</p>
          </div>
        ) : null}

        <ul className="space-y-3">
          {filtered.map((shelter) => {
            const selected = shelter.id === selectedId;
            return (
              <li key={shelter.id}>
                <ShelterCard shelter={shelter} selected={selected} onSelect={onSelect} />
              </li>
            );
          })}
        </ul>

        {isDemo ? (
          <p className="mt-4 rounded-xl border border-edge bg-surface-2 px-3 py-2 text-center text-[11px] font-medium text-muted">
            Data contoh lokal — aktifkan backend Laravel untuk data asli.
          </p>
        ) : null}
      </div>
    </section>
  );
}