'use client';

import { AMENITY_META } from '@/lib/constants';
import { Amenity } from '@/types/shelter';

interface BadgeProps {
  amenity: Amenity;
  active?: boolean;
}

export default function Badge({ amenity, active = false }: BadgeProps) {
  const meta = AMENITY_META[amenity];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition ${
        active
          ? 'border-2 border-strong bg-primary text-primary-foreground shadow-neo-sm'
          : 'border border-edge bg-surface-2 text-muted'
      }`}
    >
      <span className="text-xs leading-none">{meta.icon}</span>
      <span>{meta.label}</span>
    </span>
  );
}