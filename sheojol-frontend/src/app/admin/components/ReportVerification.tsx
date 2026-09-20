'use client';

import { Shelter } from '@/types/shelter';
import { SHELTER_TYPE_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/format';

interface ReportVerificationProps {
  shelters: Shelter[];
  loading: boolean;
  error: string | null;
  busyId: number | null;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onRefresh: () => void;
}

export default function ReportVerification({
  shelters,
  loading,
  error,
  busyId,
  onApprove,
  onReject,
  onRefresh,
}: ReportVerificationProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-warn/40 bg-warn/15 px-3 py-1.5 text-[11px] font-bold text-warn">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-warn motion-reduce:animate-none" />
          {shelters.length} menunggu
        </span>
        <button
          onClick={onRefresh}
          className="rounded-lg border-2 border-edge bg-surface-2 px-3 py-1.5 text-[11px] font-bold text-muted transition hover:text-content"
        >
          Muat Ulang
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border-2 border-danger/40 bg-danger/15 px-4 py-3 text-sm font-bold text-danger">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl bg-surface-2 motion-reduce:animate-none" />
          ))}
        </div>
      ) : shelters.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-edge bg-surface-2 p-8 text-center">
          <p className="text-sm font-bold text-content">Antrean kosong.</p>
          <p className="mt-1 text-xs text-muted">Semua laporan driver sudah ditinjau.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {shelters.map((shelter) => {
            const busy = busyId === shelter.id;
            return (
              <li
                key={shelter.id}
                className="flex flex-col gap-3 rounded-2xl border-2 border-edge bg-surface p-4 shadow-neo-sm sm:flex-row sm:items-center"
              >
                <span
                  className="h-3.5 w-3.5 shrink-0 rounded-full"
                  style={{ background: shelter.type === 'official' ? '#22c55e' : shelter.type === 'verified' ? '#06b6d4' : '#ef4444' }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-content">{shelter.name}</p>
                  <p className="mt-0.5 truncate text-[11px] font-medium text-muted">
                    {shelter.region} • {SHELTER_TYPE_LABELS[shelter.type]}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] font-medium text-muted">
                    {shelter.latitude.toFixed(4)}, {shelter.longitude.toFixed(4)} •{' '}
                    {shelter.submitted_by ?? 'Anonim'}
                    {shelter.updated_at ? ` • ${formatDate(shelter.updated_at)}` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => onApprove(shelter.id)}
                    disabled={busy}
                    className="rounded-lg border-2 border-strong bg-primary px-3.5 py-1.5 text-[11px] font-bold text-primary-foreground transition active:translate-y-[2px] active:shadow-none disabled:opacity-50"
                  >
                    {busy ? '…' : 'Setujui'}
                  </button>
                  <button
                    onClick={() => onReject(shelter.id)}
                    disabled={busy}
                    className="rounded-lg border-2 border-edge bg-surface-2 px-3.5 py-1.5 text-[11px] font-bold text-danger transition hover:border-danger active:translate-y-[2px] active:shadow-none disabled:opacity-50"
                  >
                    Tolak
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}