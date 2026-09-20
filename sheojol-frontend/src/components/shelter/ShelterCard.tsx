'use client';

import Badge from '@/components/ui/Badge';
import { googleMapsNavigationUrl } from '@/lib/maps';
import { SHELTER_TYPE_COLORS, SHELTER_TYPE_LABELS } from '@/lib/constants';
import { Shelter } from '@/types/shelter';

interface ShelterCardProps {
  shelter: Shelter;
  selected: boolean;
  onSelect: (shelter: Shelter) => void;
}

const TYPE_BADGE_ACTIVE: Record<Shelter['type'], string> = {
  official: 'border-strong bg-primary/15 text-primary',
  verified: 'border-strong bg-accent/15 text-accent',
  warning: 'border-strong bg-danger/15 text-danger',
};

function formatDistance(distance: number | null): string {
  if (distance === null) return '';
  if (distance < 1000) return `${Math.round(distance)} m`;
  return `${(distance / 1000).toFixed(1)} km`;
}

export default function ShelterCard({ shelter, selected, onSelect }: ShelterCardProps) {
  const color = SHELTER_TYPE_COLORS[shelter.type];
  const distance = formatDistance(shelter.distance);
  const label = SHELTER_TYPE_LABELS[shelter.type];

  return (
    <article
      className={`rounded-xl border-2 bg-surface p-3.5 transition ${
        selected ? 'border-primary shadow-neo-brand' : 'border-edge'
      }`}
    >
      <button type="button" onClick={() => onSelect(shelter)} className="flex w-full items-start gap-3 text-left">
        <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="block truncate text-[15px] font-bold text-content">{shelter.name}</span>
            {distance ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/15 px-2 py-0.5 text-[11px] font-bold text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.4}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {distance}
              </span>
            ) : null}
          </span>
          <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="block truncate text-xs font-medium text-muted">{shelter.address}</span>
            <span className={`rounded-full border-2 px-2 py-0.5 text-[10px] font-bold ${TYPE_BADGE_ACTIVE[shelter.type]}`}>
              {label}
            </span>
          </span>
          <span className="mt-1.5 flex flex-wrap gap-1.5">
            {shelter.facilities.length > 0 ? (
              shelter.facilities.map((amenity) => <Badge key={amenity} amenity={amenity} />)
            ) : (
              <span className="text-[11px] font-medium text-muted">Tanpa fasilitas tercatat</span>
            )}
          </span>
        </span>
      </button>
      <a
        href={googleMapsNavigationUrl(shelter.latitude, shelter.longitude)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl border-2 border-strong bg-primary px-4 text-sm font-bold text-primary-foreground shadow-neo-sm transition active:translate-y-[2px] active:shadow-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 11l18-9-9 18-2-7-7-2z" />
        </svg>
        Navigasi Via Google Maps
      </a>
    </article>
  );
}