'use client';

import type { Map as LeafletMap } from 'leaflet';
import ThemeToggle from '@/components/common/ThemeToggle';

interface MapControlsProps {
  map: LeafletMap;
}

export default function MapControls({ map }: MapControlsProps) {
  return (
    <div className="absolute top-24 right-3 z-[500] flex flex-col gap-2">
      <button
        type="button"
        onClick={() => map.zoomIn()}
        aria-label="Perbesar"
        className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-xl font-bold text-zinc-900 shadow-neo-sm transition active:translate-y-[2px] active:shadow-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600"
      >
        +
      </button>
      <button
        type="button"
        onClick={() => map.zoomOut()}
        aria-label="Perkecil"
        className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-xl font-bold text-zinc-900 shadow-neo-sm transition active:translate-y-[2px] active:shadow-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600"
      >
        −
      </button>
      <ThemeToggle iconOnly label="Ganti tema" className="!border-slate-200 !bg-white !text-zinc-900 dark:!border-slate-700 dark:!bg-slate-800 dark:!text-slate-100" />
    </div>
  );
}