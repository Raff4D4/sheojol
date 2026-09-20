'use client';

import { useState } from 'react';
import DataTable, { DataColumn, SortState, useSortableData } from '@/app/admin/components/DataTable';
import { AMENITY_META } from '@/lib/constants';
import { formatDateTime } from '@/lib/format';
import { REGIONS } from '@/lib/regions';
import { Shelter, ShelterStatus, ShelterType } from '@/types/shelter';

interface ShelterTableProps {
  shelters: Shelter[];
  loading: boolean;
  error: string | null;
  regionCounts: Record<string, number>;
  busyId: number | null;
  onCreate: () => void;
  onEdit: (shelter: Shelter) => void;
  onToggleStatus: (shelter: Shelter) => void;
  onDelete: (id: number) => void;
}

const STATUS_LABELS: Record<ShelterStatus, string> = {
  active: 'Aktif',
  inactive: 'Nonaktif',
  maintenance: 'Pemeliharaan',
};

const STATUS_DOT: Record<ShelterStatus, string> = {
  active: 'bg-emerald-500',
  inactive: 'bg-rose-500',
  maintenance: 'bg-amber-500',
};

const TYPE_LABELS: Record<ShelterType, string> = {
  official: 'Official',
  verified: 'Basecamp',
  warning: 'Warning',
};

const TYPE_COLORS: Record<ShelterType, string> = {
  official: '#22c55e',
  verified: '#06b6d4',
  warning: '#ef4444',
};

const PAGE_SIZE = 10;

const COLUMNS: DataColumn<Shelter>[] = [
  { key: 'name', label: 'Lokasi', sortable: true, sortValue: (s) => s.name.toLowerCase() },
  { key: 'region', label: 'Wilayah', sortable: true, sortValue: (s) => s.region.toLowerCase() },
  { key: 'type', label: 'Kategori' },
  { key: 'status', label: 'Status', sortable: true, sortValue: (s) => s.status },
  { key: 'updated', label: 'Diperbarui', sortable: true, sortValue: (s) => s.updated_at ?? '' },
  { key: 'actions', label: 'Aksi', align: 'right' },
];

function TypeBadge({ type }: { type: ShelterType }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-edge px-2 py-0.5 text-[10px] font-bold text-muted">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: TYPE_COLORS[type] }} />
      {TYPE_LABELS[type]}
    </span>
  );
}

function ActionButtons({
  shelter,
  busy,
  confirming,
  onEdit,
  onToggleStatus,
  onDelete,
  onConfirmDelete,
  onCancelDelete,
}: {
  shelter: Shelter;
  busy: boolean;
  confirming: boolean;
  onEdit: (shelter: Shelter) => void;
  onToggleStatus: (shelter: Shelter) => void;
  onDelete: (id: number) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}) {
  const nextStatus: ShelterStatus = shelter.status === 'active' ? 'inactive' : 'active';
  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      <button
        type="button"
        onClick={() => onToggleStatus(shelter)}
        disabled={busy}
        title={`Ubah ke ${STATUS_LABELS[nextStatus]}`}
        className="inline-flex items-center gap-1.5 rounded-lg border-2 border-edge bg-surface-2 px-2.5 py-1.5 text-[11px] font-bold transition hover:border-muted disabled:opacity-50"
      >
        <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[shelter.status]}`} />
        {busy ? '…' : STATUS_LABELS[shelter.status]}
      </button>
      <button
        onClick={() => onEdit(shelter)}
        className="rounded-lg border-2 border-edge bg-surface-2 px-2.5 py-1.5 text-[11px] font-bold text-muted transition hover:text-content"
        title="Edit lengkap"
      >
        ✎
      </button>
      {confirming ? (
        <span className="inline-flex items-center gap-1">
          <button
            onClick={() => onDelete(shelter.id)}
            disabled={busy}
            className="rounded-lg border-2 border-danger bg-danger px-2.5 py-1.5 text-[11px] font-bold text-danger-foreground transition disabled:opacity-50"
          >
            {busy ? '…' : 'Yakin?'}
          </button>
          <button
            onClick={onCancelDelete}
            className="rounded-lg border-2 border-edge bg-surface-2 px-2 py-1.5 text-[11px] font-bold text-muted"
          >
            Batal
          </button>
        </span>
      ) : (
        <button
          onClick={onConfirmDelete}
          className="rounded-lg border-2 border-edge bg-surface-2 px-2.5 py-1.5 text-[11px] font-bold text-danger transition hover:border-danger"
          title="Hapus"
        >
          🗑
        </button>
      )}
    </div>
  );
}

export default function ShelterTable({
  shelters,
  loading,
  error,
  regionCounts,
  busyId,
  onCreate,
  onEdit,
  onToggleStatus,
  onDelete,
}: ShelterTableProps) {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('all');
  const [type, setType] = useState<ShelterType | 'all'>('all');
  const [sort, setSort] = useState<SortState | null>(null);
  const [page, setPage] = useState(1);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const filtered = shelters.filter((shelter) => {
    if (region !== 'all' && shelter.region !== region) return false;
    if (type !== 'all' && shelter.type !== type) return false;
    const normalized = search.trim().toLowerCase();
    if (!normalized) return true;
    return (
      shelter.name.toLowerCase().includes(normalized) ||
      shelter.address.toLowerCase().includes(normalized) ||
      shelter.region.toLowerCase().includes(normalized)
    );
  });

  const sorted = useSortableData(filtered, COLUMNS, sort);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = sorted.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, sorted.length);
  const paged = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const updateFilter = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
    setConfirmingId(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <input
          value={search}
          onChange={(event) => updateFilter(setSearch)(event.target.value)}
          placeholder="Cari nama lokasi..."
          className="col-span-2 h-10 rounded-xl border border-edge bg-surface-2 px-3 text-sm font-medium text-content placeholder:text-muted focus:border-primary"
        />
        <select
          value={region}
          onChange={(event) => updateFilter(setRegion)(event.target.value)}
          aria-label="Filter wilayah"
          className="h-10 appearance-none rounded-xl border border-edge bg-surface-2 px-3 text-sm font-bold text-content focus:border-primary"
        >
          <option value="all">Semua Wilayah</option>
          {REGIONS.map((item) => (
            <option key={item.key} value={item.label}>
              {item.label} ({regionCounts[item.label] ?? 0})
            </option>
          ))}
        </select>
        <button
          onClick={onCreate}
          className="h-10 rounded-xl border-2 border-strong bg-primary px-3 text-sm font-bold text-primary-foreground shadow-neo-sm transition active:translate-y-[2px] active:shadow-none"
        >
          + Tambah
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(['all', 'official', 'verified', 'warning'] as const).map((key) => {
          const active = type === key;
          const labels = { all: 'Semua Kategori', official: 'Official', verified: 'Basecamp', warning: 'Warning' };
          return (
            <button
              key={key}
              onClick={() => {
                setType(key);
                setPage(1);
                setConfirmingId(null);
              }}
              aria-pressed={active}
              className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-[11px] font-bold transition active:translate-y-[2px] active:shadow-none ${
                active
                  ? 'border-strong bg-primary text-primary-foreground shadow-neo-sm'
                  : 'border-edge bg-surface-2 text-muted hover:border-muted hover:text-content'
              }`}
            >
              {key !== 'all' ? (
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: TYPE_COLORS[key] }} />
              ) : null}
              {labels[key]}
            </button>
          );
        })}
      </div>

      {error ? (
        <div className="rounded-xl border-2 border-danger/40 bg-danger/15 px-4 py-3 text-sm font-bold text-danger">
          {error}
        </div>
      ) : null}

      <div className="hidden lg:block">
        <DataTable
          columns={COLUMNS}
          rows={paged}
          rowKey={(shelter) => shelter.id}
          loading={loading}
          sort={sort}
          onSortChange={(next) => {
            setSort(next);
            setPage(1);
          }}
          emptyTitle="Tidak ada shelter sesuai filter."
          emptyHint="Coba ubah pencarian atau filter wilayah."
          renderRow={(shelter) => (
            <tr className="border-b border-edge/60 transition last:border-0 hover:bg-surface-2/40">
              <td className="px-4 py-3">
                <p className="font-bold text-content">{shelter.name}</p>
                <p className="mt-0.5 max-w-[200px] truncate text-[11px] text-muted">{shelter.address}</p>
              </td>
              <td className="px-4 py-3 text-[13px] font-semibold text-content">{shelter.region}</td>
              <td className="px-4 py-3">
                <TypeBadge type={shelter.type} />
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-content">
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[shelter.status]}`} />
                  {STATUS_LABELS[shelter.status]}
                </span>
              </td>
              <td className="px-4 py-3 text-[13px] text-muted">{formatDateTime(shelter.updated_at)}</td>
              <td className="px-4 py-3 text-right">
                <ActionButtons
                  shelter={shelter}
                  busy={busyId === shelter.id}
                  confirming={confirmingId === shelter.id}
                  onEdit={onEdit}
                  onToggleStatus={onToggleStatus}
                  onDelete={onDelete}
                  onConfirmDelete={() => setConfirmingId(shelter.id)}
                  onCancelDelete={() => setConfirmingId(null)}
                />
              </td>
            </tr>
          )}
        />
      </div>

      <div className="flex flex-col gap-3 lg:hidden">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={`load-${index}`} className="h-28 animate-pulse rounded-2xl bg-surface-2 motion-reduce:animate-none" />
          ))
        ) : paged.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-edge bg-surface-2 p-6 text-center">
            <p className="text-sm font-bold text-content">Tidak ada shelter sesuai filter.</p>
            <p className="mt-1 text-xs text-muted">Coba ubah pencarian atau filter wilayah.</p>
          </div>
        ) : (
          paged.map((shelter) => (
            <div key={shelter.id} className="rounded-2xl border-2 border-edge bg-surface p-4 shadow-neo-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-bold text-content">{shelter.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted">{shelter.address}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-edge px-2.5 py-1 text-[10px] font-bold text-content">
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[shelter.status]}`} />
                  {STATUS_LABELS[shelter.status]}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <TypeBadge type={shelter.type} />
                <span className="rounded-full border border-edge bg-surface-2 px-2.5 py-0.5 text-[10px] font-bold text-muted">
                  {shelter.region}
                </span>
                <span className="text-[10px] font-medium text-muted">Diperbarui {formatDateTime(shelter.updated_at)}</span>
              </div>
              {shelter.facilities.length > 0 ? (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {shelter.facilities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-bold text-muted"
                    >
                      {AMENITY_META[amenity].icon}
                      {AMENITY_META[amenity].label}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="mt-3">
                <ActionButtons
                  shelter={shelter}
                  busy={busyId === shelter.id}
                  confirming={confirmingId === shelter.id}
                  onEdit={onEdit}
                  onToggleStatus={onToggleStatus}
                  onDelete={onDelete}
                  onConfirmDelete={() => setConfirmingId(shelter.id)}
                  onCancelDelete={() => setConfirmingId(null)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {sorted.length > PAGE_SIZE ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-medium text-muted">
            Menampilkan {start}–{end} dari {sorted.length} item
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex h-9 items-center gap-1 rounded-lg border-2 border-edge bg-surface-2 px-3 text-xs font-bold text-content transition hover:border-muted disabled:opacity-40"
            >
              ← Sebelumnya
            </button>
            <button
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex h-9 items-center gap-1 rounded-lg border-2 border-edge bg-surface-2 px-3 text-xs font-bold text-content transition hover:border-muted disabled:opacity-40"
            >
              Berikutnya →
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}