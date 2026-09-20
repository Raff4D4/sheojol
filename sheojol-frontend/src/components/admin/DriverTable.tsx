'use client';

import DataTable, { DataColumn, SortState } from '@/app/admin/components/DataTable';
import { AdminDriver, AdminDriverPage } from '@/lib/api';
import { formatDate } from '@/lib/format';

interface DriverTableProps {
  drivers: AdminDriver[];
  meta?: AdminDriverPage['meta'];
  loading: boolean;
  error: string | null;
  busyId: number | null;
  search: string;
  sort: SortState | null;
  onSearch: (query: string) => void;
  onSortChange: (sort: SortState | null) => void;
  onPageChange: (page: number) => void;
  onCreate: () => void;
  onResetPassword: (driver: AdminDriver) => void;
}

const COLUMNS: DataColumn<AdminDriver>[] = [
  { key: 'name', label: 'Driver', sortable: true },
  { key: 'phone', label: 'No. HP' },
  { key: 'vehicle', label: 'Kendaraan' },
  { key: 'app', label: 'Aplikasi' },
  { key: 'reports', label: 'Laporan', sortable: true, align: 'center' },
  { key: 'joined', label: 'Bergabung', sortable: true, align: 'right' },
  { key: 'actions', label: 'Aksi', align: 'right' },
];

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

function Avatar({ name }: { name: string }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-strong bg-primary text-xs font-black text-primary-foreground">
      {initials(name)}
    </span>
  );
}

export default function DriverTable({
  drivers,
  meta,
  loading,
  error,
  busyId,
  search,
  sort,
  onSearch,
  onSortChange,
  onPageChange,
  onCreate,
  onResetPassword,
}: DriverTableProps) {
  const total = meta?.total ?? 0;
  const lastPage = Math.max(1, meta?.last_page ?? 1);
  const currentPage = meta?.current_page ?? 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-primary/40 bg-primary/15 px-3 py-1.5 text-[11px] font-bold text-primary">
          {total} driver terdaftar
        </span>
        <button
          onClick={onCreate}
          className="rounded-lg border-2 border-strong bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground shadow-neo-sm transition hover:-translate-y-0.5 active:translate-y-[2px] active:shadow-none"
        >
          + Tambah Driver
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border-2 border-danger/40 bg-danger/15 px-4 py-3 text-sm font-bold text-danger">{error}</div>
      ) : null}

      <div className="relative">
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
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Cari nama atau email driver..."
          className="h-11 w-full rounded-xl border border-edge bg-surface-2 pl-10 pr-4 text-sm font-medium text-content placeholder:text-muted transition focus:border-primary"
        />
      </div>

      <div className="hidden lg:block">
        <DataTable
          columns={COLUMNS}
          rows={drivers}
          rowKey={(driver) => driver.id}
          loading={loading}
          sort={sort}
          onSortChange={onSortChange}
          emptyTitle="Belum ada driver."
          emptyHint="Coba ubah kata kunci pencarian atau tambah driver baru."
          renderRow={(driver) => (
            <tr className="border-b border-edge/60 transition last:border-0 hover:bg-surface-2/40">
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <Avatar name={driver.name} />
                  <div>
                    <p className="font-bold text-content">{driver.name}</p>
                    <p className="text-[11px] text-muted">{driver.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5 text-[13px] font-medium text-content">{driver.phone ?? '—'}</td>
              <td className="px-4 py-3.5 text-[13px] font-medium text-content">{driver.vehicle ?? '—'}</td>
              <td className="px-4 py-3.5 text-[13px] font-medium text-content">{driver.app ?? '—'}</td>
              <td className="px-4 py-3.5 text-center">
                <span className="inline-flex rounded-full border-2 border-accent/40 bg-accent/15 px-2.5 py-1 text-[10px] font-bold text-accent">
                  {driver.shelters_count} titik
                </span>
              </td>
              <td className="px-4 py-3.5 text-right text-[12px] text-muted">{formatDate(driver.joined_at)}</td>
              <td className="px-4 py-3.5 text-right">
                <button
                  onClick={() => onResetPassword(driver)}
                  disabled={busyId === driver.id}
                  className="rounded-lg border-2 border-edge bg-surface-2 px-3 py-1.5 text-[11px] font-bold text-muted transition hover:border-primary hover:text-primary disabled:opacity-50"
                >
                  {busyId === driver.id ? 'Memproses...' : 'Reset Password'}
                </button>
              </td>
            </tr>
          )}
        />
      </div>

      <div className="flex flex-col gap-3 lg:hidden">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={`load-${index}`} className="h-32 animate-pulse rounded-2xl bg-surface-2 motion-reduce:animate-none" />
          ))
        ) : drivers.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-edge bg-surface-2 p-6 text-center">
            <p className="text-sm font-bold text-content">Belum ada driver.</p>
            <p className="mt-1 text-xs text-muted">Coba ubah kata kunci pencarian atau tambah driver baru.</p>
          </div>
        ) : (
          drivers.map((driver) => (
            <div key={driver.id} className="rounded-2xl border-2 border-edge bg-surface p-4 shadow-neo-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={driver.name} />
                  <div className="min-w-0">
                    <p className="truncate font-bold text-content">{driver.name}</p>
                    <p className="truncate text-[11px] text-muted">{driver.email}</p>
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center rounded-full border-2 border-accent/40 bg-accent/15 px-2.5 py-1 text-[10px] font-bold text-accent">
                  {driver.shelters_count} titik
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                <div>
                  <p className="font-bold uppercase tracking-widest text-muted">No. HP</p>
                  <p className="mt-0.5 font-semibold text-content">{driver.phone ?? '—'}</p>
                </div>
                <div>
                  <p className="font-bold uppercase tracking-widest text-muted">Kendaraan</p>
                  <p className="mt-0.5 font-semibold text-content">{driver.vehicle ?? '—'}</p>
                </div>
                <div>
                  <p className="font-bold uppercase tracking-widest text-muted">Aplikasi</p>
                  <p className="mt-0.5 font-semibold text-content">{driver.app ?? '—'}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-[11px] font-medium text-muted">Bergabung {formatDate(driver.joined_at)}</p>
                <button
                  onClick={() => onResetPassword(driver)}
                  disabled={busyId === driver.id}
                  className="rounded-lg border-2 border-edge bg-surface-2 px-3 py-1.5 text-[11px] font-bold text-muted transition hover:border-primary hover:text-primary disabled:opacity-50"
                >
                  {busyId === driver.id ? 'Memproses...' : 'Reset Password'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {meta ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-medium text-muted">
            Halaman {currentPage} dari {lastPage} • {total} item
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1 || loading}
              className="flex h-9 items-center gap-1 rounded-lg border-2 border-edge bg-surface-2 px-3 text-xs font-bold text-content transition hover:border-muted disabled:opacity-40"
            >
              ← Sebelumnya
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= lastPage || loading}
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