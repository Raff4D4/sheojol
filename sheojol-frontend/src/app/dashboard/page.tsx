'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import FAB from '@/components/common/FAB';
import Header from '@/components/common/Header';
import BottomSheet from '@/components/ui/BottomSheet';
import ReportModal from '@/components/ui/ReportModal';
import { useAuth } from '@/context/AuthContext';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useShelters } from '@/hooks/useShelters';
import { AMENITY_META, SHELTER_TYPE_COLORS, SHELTER_TYPE_LABELS } from '@/lib/constants';
import { googleMapsNavigationUrl } from '@/lib/maps';
import { getRegion, REGIONS } from '@/lib/regions';
import { AMENITY_LIST, Amenity, RegionKey, Shelter, ShelterType } from '@/types/shelter';

const MapContainer = dynamic(() => import('@/components/map/MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-3 bg-bg">
      <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary border-t-transparent motion-reduce:animate-none" />
      <p className="text-xs font-black uppercase tracking-widest text-muted">Memuat peta</p>
    </div>
  ),
});

const TYPE_CHIP: Record<ShelterType, string> = {
  official: 'border-primary/40 bg-primary/15 text-primary',
  verified: 'border-accent/40 bg-accent/15 text-accent',
  warning: 'border-danger/40 bg-danger/15 text-danger',
};

const TYPE_PILL: Record<ShelterType | 'all', string> = {
  all: 'border-emerald-500 bg-emerald-500 text-zinc-950',
  official: 'border-emerald-500 bg-emerald-500 text-zinc-950',
  verified: 'border-cyan-500 bg-cyan-500 text-zinc-950',
  warning: 'border-red-500 bg-red-500 text-zinc-950',
};

function DashboardContent() {
  const searchParams = useSearchParams();
  const regionParam = searchParams.get('region') as RegionKey | null;
  const typeParam = searchParams.get('type') as ShelterType | 'all' | null;
  const amenityParam = searchParams.get('amenity') as Amenity | null;

  const [regionKey, setRegionKey] = useState<RegionKey>(() => {
    if (regionParam && REGIONS.some((region) => region.key === regionParam)) return regionParam;
    return 'ciledug';
  });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [desktopQuery, setDesktopQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ShelterType | 'all'>(
    typeParam === 'official' || typeParam === 'verified' || typeParam === 'warning' ? typeParam : 'all',
  );
  const [amenityFilter, setAmenityFilter] = useState<Amenity | null>(
    amenityParam && AMENITY_LIST.includes(amenityParam) ? amenityParam : null,
  );

  const { shelters, loading, error, isDemo, addShelter } = useShelters();
  const geolocation = useGeolocation();
  const { isAuthenticated } = useAuth();

  const region = useMemo(() => getRegion(regionKey), [regionKey]);

  useEffect(() => {
    if (regionParam && REGIONS.some((item) => item.key === regionParam)) {
      setRegionKey(regionParam);
    }
  }, [regionParam]);

  useEffect(() => {
    if (typeParam === 'official' || typeParam === 'verified' || typeParam === 'warning') {
      setTypeFilter(typeParam);
    }
  }, [typeParam]);

  useEffect(() => {
    if (amenityParam && AMENITY_LIST.includes(amenityParam)) {
      setAmenityFilter(amenityParam);
    }
  }, [amenityParam]);

  const handleSelect = useCallback((shelter: Shelter) => {
    setSelectedId((current) => (current === shelter.id ? null : shelter.id));
  }, [setSelectedId]);

  const handleRegionChange = useCallback((key: RegionKey) => {
    setRegionKey(key);
    setSelectedId(null);
  }, [setRegionKey, setSelectedId]);

  const filtered = useMemo(() => {
    const normalized = desktopQuery.trim().toLowerCase();
    return shelters.filter((shelter) => {
      if (typeFilter !== 'all' && shelter.type !== typeFilter) return false;
      if (amenityFilter && !shelter.facilities.includes(amenityFilter)) return false;
      if (!normalized) return true;
      return (
        shelter.name.toLowerCase().includes(normalized) ||
        shelter.address.toLowerCase().includes(normalized) ||
        shelter.region.toLowerCase().includes(normalized)
      );
    });
  }, [shelters, desktopQuery, typeFilter, amenityFilter]);

  const defaultLocation = useMemo(() => {
    if (geolocation.latitude === null || geolocation.longitude === null) return null;
    return { latitude: geolocation.latitude, longitude: geolocation.longitude };
  }, [geolocation.latitude, geolocation.longitude]);

  const pillCounts = useMemo(() => {
    const normalized = desktopQuery.trim().toLowerCase();
    const scoped = shelters.filter((shelter) => {
      if (amenityFilter && !shelter.facilities.includes(amenityFilter)) return false;
      if (!normalized) return true;
      return (
        shelter.name.toLowerCase().includes(normalized) ||
        shelter.address.toLowerCase().includes(normalized) ||
        shelter.region.toLowerCase().includes(normalized)
      );
    });
    return {
      all: scoped.length,
      official: scoped.filter((shelter) => shelter.type === 'official').length,
      verified: scoped.filter((shelter) => shelter.type === 'verified').length,
      warning: scoped.filter((shelter) => shelter.type === 'warning').length,
    };
  }, [shelters, desktopQuery, amenityFilter]);

  return (
    <main className="fixed inset-0 overflow-hidden bg-bg">
      <div className="absolute inset-0 lg:left-[380px]">
        <MapContainer shelters={shelters} region={region} selectedId={selectedId} onSelect={handleSelect} />
      </div>

      <aside className="absolute inset-y-0 left-0 z-30 hidden w-[380px] flex-col border-r-2 border-edge bg-surface lg:flex">
        <div className="flex items-center justify-between gap-3 border-b-2 border-edge px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-strong bg-primary text-xs font-black text-primary-foreground shadow-neo-sm">
              SJ
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-extrabold tracking-tight text-content">SheoJol</span>
              <span className="block text-[10px] font-medium text-muted">Shelter Ojol Tangerang</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setReportOpen(true)}
            className="flex h-9 items-center gap-1.5 rounded-xl border-2 border-strong bg-primary px-3 text-xs font-extrabold text-primary-foreground shadow-neo-sm transition active:translate-y-[2px] active:shadow-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Laporkan
          </button>
        </div>

        <div className="space-y-3 border-b-2 border-edge px-5 py-4">
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
              value={desktopQuery}
              onChange={(event) => setDesktopQuery(event.target.value)}
              placeholder="Cari shelter, warkop, wilayah..."
              className="h-11 w-full rounded-xl border border-edge bg-surface-2 pl-10 pr-4 text-sm font-medium text-content placeholder:text-muted focus:border-primary"
            />
          </div>

          <div className="relative">
            <select
              value={regionKey}
              onChange={(event) => handleRegionChange(event.target.value as RegionKey)}
              aria-label="Pilih wilayah"
              className="h-11 w-full appearance-none rounded-xl border border-edge bg-surface-2 px-4 pr-9 text-sm font-bold text-content focus:border-primary"
            >
              {REGIONS.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <div className="flex gap-2">
            {(['all', 'official', 'verified', 'warning'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setTypeFilter(type)}
                aria-pressed={typeFilter === type}
                className={`flex-1 rounded-xl border-2 px-3 py-2 text-[11px] font-extrabold transition active:translate-y-[2px] active:shadow-none ${
                  typeFilter === type
                    ? `${TYPE_PILL[type]} shadow-neo-sm`
                    : 'border-edge bg-surface-2 text-muted'
                }`}
              >
                {type === 'all'
                  ? `Semua (${pillCounts.all})`
                  : `${SHELTER_TYPE_LABELS[type].split(' ')[0]} (${pillCounts[type]})`}
              </button>
            ))}
          </div>

          {amenityFilter ? (
            <button
              type="button"
              onClick={() => setAmenityFilter(null)}
              aria-label={`Hapus filter ${AMENITY_META[amenityFilter].label}`}
              className="flex w-full items-center gap-2 rounded-xl border-2 border-primary bg-primary/15 px-3 py-2 text-[11px] font-extrabold text-primary transition active:translate-y-[2px] active:shadow-none"
            >
              <span>{AMENITY_META[amenityFilter].icon}</span>
              <span className="flex-1 text-left">{AMENITY_META[amenityFilter].label}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : null}
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-4">
          {error ? (
            <p className="mb-4 rounded-xl border-2 border-warn/40 bg-warn/15 px-4 py-3 text-xs font-bold text-warn">
              {error}
            </p>
          ) : null}

          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3, 4].map((item) => (
                <div key={item} className="h-24 animate-pulse rounded-xl bg-surface-2 motion-reduce:animate-none" />
              ))}
            </div>
          ) : null}

          {!loading && filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <span className="text-3xl">🔎</span>
              <p className="text-sm font-semibold text-content">Belum ada titik yang cocok</p>
              <p className="text-xs text-muted">Ubah kata kunci atau filter kategori.</p>
            </div>
          ) : null}

          <ul className="space-y-3">
            {filtered.map((shelter) => {
              const color = SHELTER_TYPE_COLORS[shelter.type];
              const selected = shelter.id === selectedId;
              return (
                <li
                  key={shelter.id}
                  className={`rounded-xl border-2 bg-surface p-4 transition ${
                    selected ? 'border-primary shadow-neo-brand' : 'border-edge hover:border-muted'
                  }`}
                >
                  <button type="button" onClick={() => handleSelect(shelter)} className="flex w-full items-start gap-3 text-left">
                    <span className="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-[15px] font-bold text-content">{shelter.name}</span>
                        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${TYPE_CHIP[shelter.type]}`}>
                          {SHELTER_TYPE_LABELS[shelter.type].split(' ')[0]}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate text-xs font-medium text-muted">
                        {shelter.region} • {shelter.address}
                      </span>
                      <span className="mt-1.5 flex flex-wrap gap-1.5">
                        {shelter.facilities.length > 0 ? (
                          shelter.facilities.map((amenity) => (
                            <span key={amenity} className="rounded-md border border-edge bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold text-muted">
                              {amenity.split('_').join(' ')}
                            </span>
                          ))
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
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-strong bg-primary py-2 text-xs font-bold text-primary-foreground shadow-neo-sm transition active:translate-y-[2px] active:shadow-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 11l18-9-9 18-2-7-7-2z" />
                    </svg>
                    Navigasi
                  </a>
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
      </aside>

      <div className="lg:hidden">
        <Header region={regionKey} onRegionChange={handleRegionChange} />
        <FAB onClick={() => setReportOpen(true)} />
        <BottomSheet
          shelters={shelters}
          loading={loading}
          error={error}
          isDemo={isDemo}
          selectedId={selectedId}
          onSelect={handleSelect}
          initialAmenity={amenityFilter}
        />
      </div>

      <ReportModal
        open={reportOpen}
        defaultLocation={defaultLocation}
        regionLabel={region.label}
        canSubmit={isAuthenticated}
        onClose={() => setReportOpen(false)}
        onSubmitted={addShelter}
      />
    </main>
  );
}

export default function MapDashboardPage() {
  return (
    <Suspense
      fallback={
        <main className="fixed inset-0 flex flex-col items-center justify-center gap-3 bg-bg">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-strong bg-primary text-xs font-black text-primary-foreground shadow-neo-sm">
            SJ
          </span>
          <p className="text-xs font-black uppercase tracking-widest text-muted">Membuka peta</p>
        </main>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}