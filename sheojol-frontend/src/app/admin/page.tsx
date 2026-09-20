'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddDriverModal from '@/components/admin/AddDriverModal';
import DriverTable from '@/components/admin/DriverTable';
import ResetPasswordModal from '@/components/admin/ResetPasswordModal';
import AdminHeader from '@/app/admin/components/AdminHeader';
import AdminSidebar, { AdminSection } from '@/app/admin/components/AdminSidebar';
import { SortState } from '@/app/admin/components/DataTable';
import ReportVerification from '@/app/admin/components/ReportVerification';
import ShelterModal from '@/app/admin/components/ShelterModal';
import ShelterTable from '@/app/admin/components/ShelterTable';
import { RequireAdmin } from '@/components/common/RequireAuth';
import { useAuth } from '@/context/AuthContext';
import {
  AdminApi,
  AdminDashboard,
  AdminDriver,
  AdminDriverPage,
  AdminDriverPayload,
  AdminShelterPayload,
  apiErrorMessage,
} from '@/lib/api';
import { REGIONS } from '@/lib/regions';
import { Shelter } from '@/types/shelter';

function KpiCard({
  label,
  value,
  hint,
  color,
  onClick,
}: {
  label: string;
  value: number | string;
  hint: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border-2 border-edge bg-surface p-4 text-left shadow-neo-sm transition duration-200 hover:-translate-y-1 hover:border-strong hover:shadow-neo"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
          <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color }}>
            {label}
          </p>
        </div>
        {onClick ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 text-muted transition group-hover:translate-x-0.5 group-hover:text-content"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        ) : null}
      </div>
      <p className="mt-2 text-3xl font-black tracking-tight text-content">{value}</p>
      <p className="mt-1 text-[11px] font-medium text-muted">{hint}</p>
    </button>
  );
}

function SectionHeading({ title, hint, action }: { title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-base font-extrabold tracking-tight text-content">{title}</h2>
        {hint ? <p className="mt-0.5 text-[11px] font-medium text-muted">{hint}</p> : null}
      </div>
      {action}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const [active, setActive] = useState<AdminSection>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [backendOk, setBackendOk] = useState(false);

  const [pending, setPending] = useState<Shelter[]>([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [pendingError, setPendingError] = useState<string | null>(null);

  const [directory, setDirectory] = useState<Shelter[]>([]);
  const [dirLoading, setDirLoading] = useState(false);
  const [dirError, setDirError] = useState<string | null>(null);

  const [drivers, setDrivers] = useState<AdminDriver[]>([]);
  const [driversMeta, setDriversMeta] = useState<AdminDriverPage['meta']>(undefined);
  const [driversLoading, setDriversLoading] = useState(false);
  const [driversError, setDriversError] = useState<string | null>(null);
  const [driversSearch, setDriversSearch] = useState('');
  const [driversPage, setDriversPage] = useState(1);
  const [driversSort, setDriversSort] = useState<SortState | null>({ key: 'joined', direction: 'desc' });
  const [addDriverOpen, setAddDriverOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<AdminDriver | null>(null);

  const [busyId, setBusyId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Shelter | null>(null);
  const [toast, setToast] = useState<{ tone: 'success' | 'error'; message: string } | null>(null);

  const directoryLoaded = useRef(false);
  const driversLoaded = useRef(false);

  const showToast = useCallback((tone: 'success' | 'error', message: string) => {
    setToast({ tone, message });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const refreshDashboard = useCallback(() => {
    AdminApi.dashboard()
      .then((stats) => {
        setDashboard(stats);
        setBackendOk(true);
      })
      .catch(() => setBackendOk(false));
  }, []);

  const refreshPending = useCallback(() => {
    setPendingLoading(true);
    setPendingError(null);
    AdminApi.pending()
      .then(setPending)
      .catch((err) => setPendingError(apiErrorMessage(err)))
      .finally(() => setPendingLoading(false));
  }, []);

  useEffect(() => {
    refreshDashboard();
    refreshPending();
  }, [refreshDashboard, refreshPending]);

  const loadDirectory = useCallback(() => {
    setDirLoading(true);
    setDirError(null);
    AdminApi.shelters()
      .then(setDirectory)
      .catch((err) => setDirError(apiErrorMessage(err)))
      .finally(() => setDirLoading(false));
  }, []);

  useEffect(() => {
    if (active === 'shelters' && !directoryLoaded.current) {
      directoryLoaded.current = true;
      loadDirectory();
    }
  }, [active, loadDirectory]);

  const loadDrivers = useCallback((page = 1, search = '', sortState: SortState | null = null) => {
    setDriversLoading(true);
    setDriversError(null);
    AdminApi.drivers({
      search: search || undefined,
      page,
      sort: sortState?.key,
      direction: sortState?.direction,
    })
      .then((result) => {
        setDrivers(result.data);
        setDriversMeta(result.meta);
      })
      .catch((err) => setDriversError(apiErrorMessage(err)))
      .finally(() => setDriversLoading(false));
  }, []);

  const searchTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const handleDriversSearch = (query: string) => {
    setDriversSearch(query);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => loadDrivers(1, query, driversSort), 350);
  };

  const handleDriversPage = (page: number) => {
    setDriversPage(page);
    loadDrivers(page, driversSearch, driversSort);
  };

  const handleDriversSort = (next: SortState | null) => {
    setDriversSort(next);
    setDriversPage(1);
    loadDrivers(1, driversSearch, next);
  };

  useEffect(() => {
    if (active === 'drivers' && !driversLoaded.current) {
      driversLoaded.current = true;
      loadDrivers(driversPage, driversSearch, driversSort);
    }
  }, [active, loadDrivers, driversPage, driversSearch, driversSort]);

  useEffect(() => {
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, []);

  const handleCreateDriver = async (payload: AdminDriverPayload) => {
    await AdminApi.createDriver(payload);
    setAddDriverOpen(false);
    refreshDashboard();
    loadDrivers(driversPage, driversSearch);
    showToast('success', 'Driver berhasil ditambahkan.');
  };

  const handleResetPassword = async (password: string) => {
    if (!resetTarget) return;
    setBusyId(resetTarget.id);
    try {
      await AdminApi.resetDriverPassword(resetTarget.id, password);
      setResetTarget(null);
      showToast('success', `Password ${resetTarget.name} berhasil direset.`);
    } catch (err) {
      throw err;
    } finally {
      setBusyId(null);
    }
  };

  const handleApprove = async (id: number) => {
    setBusyId(id);
    try {
      const approved = await AdminApi.approve(id);
      setPending((current) => current.filter((item) => item.id !== id));
      refreshDashboard();
      refreshPending();
      showToast('success', `${approved.name} disetujui dan tampil di peta.`);
    } catch (err) {
      showToast('error', apiErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (id: number) => {
    setBusyId(id);
    try {
      await AdminApi.reject(id);
      setPending((current) => current.filter((item) => item.id !== id));
      refreshDashboard();
      refreshPending();
      showToast('success', 'Laporan ditolak dan dihapus.');
    } catch (err) {
      showToast('error', apiErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleStatus = async (shelter: Shelter) => {
    setBusyId(shelter.id);
    const next = shelter.status === 'active' ? 'inactive' : 'active';
    try {
      const updated = await AdminApi.updateShelter(shelter.id, { status: next });
      setDirectory((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      refreshDashboard();
      showToast('success', `${updated.name} kini ${next === 'active' ? 'Aktif' : 'Nonaktif'}.`);
    } catch (err) {
      showToast('error', apiErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: number) => {
    setBusyId(id);
    try {
      await AdminApi.deleteShelter(id);
      setDirectory((current) => current.filter((item) => item.id !== id));
      refreshDashboard();
      refreshPending();
      showToast('success', 'Shelter dihapus dari sistem.');
    } catch (err) {
      showToast('error', apiErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleSave = async (payload: AdminShelterPayload, id: number | null) => {
    const saved = id ? await AdminApi.updateShelter(id, payload) : await AdminApi.storeShelter(payload);
    if (directoryLoaded.current) {
      loadDirectory();
    }
    refreshDashboard();
    refreshPending();
    setModalOpen(false);
    showToast('success', id ? `${saved.name} diperbarui.` : `${saved.name} ditambahkan ke sistem.`);
  };

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (shelter: Shelter) => {
    setEditing(shelter);
    setModalOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/admin/login');
  };

  const pendingCount = dashboard?.pending_total ?? pending.length;

  const nav = (section: AdminSection) => {
    setActive(section);
    setSidebarOpen(false);
  };

  const sectionMeta: Record<AdminSection, { title: string; subtitle: string }> = {
    overview: { title: 'Dashboard Overview', subtitle: 'Ringkasan operasional SheoJol hari ini' },
    shelters: { title: 'Shelter Management', subtitle: 'Kelola seluruh titik shelter di wilayah Tangerang' },
    pending: { title: 'Pending Approvals', subtitle: 'Tinjau laporan driver sebelum tampil di peta publik' },
    drivers: { title: 'Drivers List', subtitle: 'Driver terdaftar dan kontribusi titiknya' },
    settings: { title: 'System Settings', subtitle: 'Informasi sistem dan koneksi backend' },
  };

  const maxRegionCount = useMemo(() => {
    if (!dashboard) return 1;
    return Math.max(1, ...Object.values(dashboard.by_region));
  }, [dashboard]);

  return (
    <RequireAdmin>
      <div className="min-h-dvh bg-bg pb-24 lg:pb-0">
        <AdminSidebar
          open={sidebarOpen}
          collapsed={collapsed}
          active={active}
          pendingCount={pendingCount}
          onNavigate={nav}
          onClose={() => setSidebarOpen(false)}
          onToggleCollapse={() => setCollapsed((current) => !current)}
          onLogout={handleLogout}
        />

        <div className={collapsed ? 'lg:pl-20' : 'lg:pl-64'}>
          <AdminHeader
            title={sectionMeta[active].title}
            subtitle={sectionMeta[active].subtitle}
            connected={backendOk}
            pendingCount={pendingCount}
            onMenuClick={() => setSidebarOpen(true)}
            onNotifyClick={() => nav('pending')}
          />

          <main className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
            {toast ? (
              <div
                className={`mb-4 flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-bold ${
                  toast.tone === 'success'
                    ? 'border-primary/40 bg-primary/15 text-primary'
                    : 'border-danger/40 bg-danger/15 text-danger'
                }`}
                role="status"
              >
                <span>{toast.tone === 'success' ? '✓' : '✕'}</span>
                {toast.message}
              </div>
            ) : null}

            {active === 'overview' ? (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <KpiCard
                    label="Total Shelters"
                    value={dashboard ? dashboard.shelters_total : '…'}
                    hint="Seluruh titik dalam sistem"
                    color="#22c55e"
                    onClick={() => nav('shelters')}
                  />
                  <KpiCard
                    label="Zona Warning"
                    value={dashboard ? dashboard.warning_total : '…'}
                    hint="Rawan garukan aktif"
                    color="#ef4444"
                    onClick={() => nav('shelters')}
                  />
                  <KpiCard
                    label="Warkop Terverifikasi"
                    value={dashboard ? dashboard.verified_total : '…'}
                    hint="Basecamp komunitas"
                    color="#06b6d4"
                    onClick={() => nav('shelters')}
                  />
                  <KpiCard
                    label="Total Drivers"
                    value={dashboard ? dashboard.drivers_total : '…'}
                    hint="Akun terdaftar"
                    color="#8b5cf6"
                    onClick={() => nav('drivers')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <div className="rounded-2xl border-2 border-edge bg-surface p-4">
                    <p className="text-2xl font-black text-content">{dashboard ? dashboard.official_total : '…'}</p>
                    <p className="mt-0.5 text-[11px] font-bold text-muted">Shelter Resmi</p>
                  </div>
                  <div className="rounded-2xl border-2 border-edge bg-surface p-4">
                    <p className="text-2xl font-black text-content">{dashboard ? dashboard.active_total : '…'}</p>
                    <p className="mt-0.5 text-[11px] font-bold text-muted">Titik Aktif</p>
                  </div>
                  <div className="rounded-2xl border-2 border-edge bg-surface p-4">
                    <p className="text-2xl font-black text-content">{dashboard ? dashboard.pending_total : '…'}</p>
                    <p className="mt-0.5 text-[11px] font-bold text-muted">Laporan Pending</p>
                  </div>
                  <div className="rounded-2xl border-2 border-edge bg-surface p-4">
                    <p className="text-2xl font-black text-content">{dashboard ? dashboard.regions_total : '…'}</p>
                    <p className="mt-0.5 text-[11px] font-bold text-muted">Wilayah Jangkauan</p>
                  </div>
                </div>

                <section>
                  <SectionHeading title="Sebaran per Wilayah" hint="Jumlah shelter aktif di tiap area" />
                  <div className="grid gap-2 sm:grid-cols-2">
                    {REGIONS.map((region) => {
                      const count = dashboard?.by_region[region.label] ?? 0;
                      const pct = Math.max(4, Math.round((count / maxRegionCount) * 100));
                      return (
                        <div key={region.key} className="rounded-2xl border-2 border-edge bg-surface p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <p className="text-sm font-bold text-content">{region.label}</p>
                            <p className="text-sm font-black text-primary">{count}</p>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <SectionHeading
                    title="Antrean Terbaru"
                    hint={`${pending.length} laporan menunggu tinjauan`}
                    action={
                      <button
                        onClick={() => nav('pending')}
                        className="rounded-lg border-2 border-edge bg-surface-2 px-3 py-1.5 text-[11px] font-bold text-muted transition hover:text-content"
                      >
                        Lihat Semua
                      </button>
                    }
                  />
                  {pendingLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="h-16 animate-pulse rounded-2xl bg-surface-2 motion-reduce:animate-none" />
                      ))}
                    </div>
                  ) : dashboard && dashboard.recent_pending.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {dashboard.recent_pending.map((shelter) => (
                        <div
                          key={shelter.id}
                          className="flex items-center justify-between gap-3 rounded-2xl border-2 border-edge bg-surface p-4"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-content">{shelter.name}</p>
                            <p className="mt-0.5 text-[11px] font-medium text-muted">
                              {shelter.region} • {shelter.submitted_by ?? 'Anonim'}
                            </p>
                          </div>
                          <div className="flex shrink-0 gap-1.5">
                            <button
                              onClick={() => handleApprove(shelter.id)}
                              disabled={busyId === shelter.id}
                              className="rounded-lg border-2 border-strong bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground transition hover:-translate-y-0.5 disabled:opacity-50"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => handleReject(shelter.id)}
                              disabled={busyId === shelter.id}
                              className="rounded-lg border-2 border-edge bg-surface-2 px-3 py-1.5 text-[11px] font-bold text-danger transition hover:border-danger disabled:opacity-50"
                            >
                              Tolak
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-edge bg-surface-2 p-6 text-center">
                      <p className="text-sm font-bold text-content">Antrean kosong.</p>
                      <p className="mt-1 text-xs text-muted">Semua laporan sudah tertangani.</p>
                    </div>
                  )}
                </section>
              </div>
            ) : null}

            {active === 'shelters' ? (
              <ShelterTable
                shelters={directory}
                loading={dirLoading}
                error={dirError}
                regionCounts={dashboard?.by_region ?? {}}
                busyId={busyId}
                onCreate={openCreate}
                onEdit={openEdit}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ) : null}

            {active === 'pending' ? (
              <ReportVerification
                shelters={pending}
                loading={pendingLoading}
                error={pendingError}
                busyId={busyId}
                onApprove={handleApprove}
                onReject={handleReject}
                onRefresh={refreshPending}
              />
            ) : null}

            {active === 'drivers' ? (
              <DriverTable
                drivers={drivers}
                meta={driversMeta}
                loading={driversLoading}
                error={driversError}
                busyId={busyId}
                search={driversSearch}
                onSearch={handleDriversSearch}
                sort={driversSort}
                onSortChange={handleDriversSort}
                onPageChange={handleDriversPage}
                onCreate={() => setAddDriverOpen(true)}
                onResetPassword={(driver) => setResetTarget(driver)}
              />
            ) : null}

            {active === 'settings' ? (
              <div className="flex flex-col gap-4">
                <section>
                  <SectionHeading title="Status Sistem" hint="Koneksi antara panel admin dan backend API" />
                  <div className="rounded-2xl border-2 border-edge bg-surface p-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-[11px] font-bold ${
                          backendOk ? 'border-primary/40 bg-primary/15 text-primary' : 'border-danger/40 bg-danger/15 text-danger'
                        }`}
                      >
                        <span className="relative flex h-2 w-2">
                          {backendOk ? (
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70 motion-reduce:animate-none" />
                          ) : null}
                          <span className={`relative inline-flex h-2 w-2 rounded-full ${backendOk ? 'bg-primary' : 'bg-danger'}`} />
                        </span>
                        {backendOk ? 'Backend Terhubung' : 'Backend Tidak Terjangkau'}
                      </span>
                      <button
                        onClick={() => {
                          refreshDashboard();
                          refreshPending();
                        }}
                        className="rounded-lg border-2 border-edge bg-surface-2 px-3 py-1.5 text-[11px] font-bold text-muted transition hover:text-content"
                      >
                        Cek Koneksi
                      </button>
                    </div>
                    {!backendOk ? (
                      <p className="mt-3 text-xs font-medium text-muted">
                        Pastikan server backend berjalan di <span className="font-mono text-content">127.0.0.1:8000</span>.
                      </p>
                    ) : null}
                  </div>
                </section>

                <section>
                  <SectionHeading title="Informasi Aplikasi" hint="Versi dan konfigurasi SheoJol" />
                  <div className="divide-y divide-edge overflow-hidden rounded-2xl border-2 border-edge bg-surface">
                    {[
                      { label: 'Aplikasi', value: 'SheoJol — Peta Shelter Ojol' },
                      { label: 'Platform', value: 'Laravel API + Next.js PWA' },
                      { label: 'Role Aktif', value: 'Administrator' },
                      { label: 'Wilayah', value: `${dashboard?.regions_total ?? '…'} area jangkauan` },
                      { label: 'Total Data', value: `${dashboard?.shelters_total ?? '…'} shelter dalam sistem` },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between gap-3 px-5 py-3.5">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted">{row.label}</p>
                        <p className="truncate text-sm font-bold text-content">{row.value}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            ) : null}
          </main>
        </div>

        <ShelterModal open={modalOpen} shelter={editing} onClose={() => setModalOpen(false)} onSave={handleSave} />
        <AddDriverModal open={addDriverOpen} onClose={() => setAddDriverOpen(false)} onSave={handleCreateDriver} />
        <ResetPasswordModal
          open={resetTarget !== null}
          driverName={resetTarget?.name ?? ''}
          onClose={() => setResetTarget(null)}
          onSave={handleResetPassword}
        />
      </div>
    </RequireAdmin>
  );
}