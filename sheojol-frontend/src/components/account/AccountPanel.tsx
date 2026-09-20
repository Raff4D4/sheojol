'use client';

import { FormEvent, useEffect, useState } from 'react';
import Badge from '@/components/ui/Badge';
import { AccountTab } from '@/components/account/ProfileCard';
import { useAuth } from '@/context/AuthContext';
import { apiErrorMessage } from '@/lib/api';
import { SHELTER_TYPE_COLORS, SHELTER_TYPE_LABELS } from '@/lib/constants';
import { googleMapsNavigationUrl } from '@/lib/maps';
import { AMENITY_LIST, Amenity, Shelter } from '@/types/shelter';
import { AuthUser, PasswordChangePayload } from '@/types/auth';

const VEHICLE_OPTIONS = ['Motor', 'Mobil'];
const APP_OPTIONS = ['Grab', 'Gojek', 'Maxim', 'Lainnya'];

const TAB_META: Record<AccountTab, { title: string; hint: string }> = {
  reports: { title: 'Laporan Saya', hint: 'Titik yang pernah kamu laporkan ke peta' },
  favorites: { title: 'Shelter Favorit', hint: 'Tersimpan untuk akses cepat saat bertugas' },
  profile: { title: 'Edit Profil', hint: 'Data driver dan kendaraan kamu' },
  security: { title: 'Keamanan & Password', hint: 'Ganti password secara berkala' },
};

interface AccountPanelProps {
  activeTab: AccountTab;
  contributions: Shelter[];
  favorites: Shelter[];
  ready: boolean;
  onRemoveFavorite: (id: number) => Promise<void>;
  onSaveProfile: (payload: Partial<Pick<AuthUser, 'name' | 'phone' | 'vehicle' | 'app'>>) => Promise<void>;
  onSavePassword: (payload: PasswordChangePayload) => Promise<void>;
}

function PanelHeader({ tab }: { tab: AccountTab }) {
  const meta = TAB_META[tab];
  return (
    <div className="mb-4">
      <h2 className="text-lg font-extrabold tracking-tight text-content">{meta.title}</h2>
      <p className="mt-0.5 text-xs font-medium text-muted">{meta.hint}</p>
    </div>
  );
}

function ShelterRow({ shelter, children }: { shelter: Shelter; children?: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border-2 border-edge bg-surface-2 p-3.5">
      <span
        className="h-3.5 w-3.5 shrink-0 rounded-full"
        style={{ background: SHELTER_TYPE_COLORS[shelter.type] }}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-content">{shelter.name}</p>
        <p className="truncate text-xs font-medium text-muted">
          {shelter.region} • {SHELTER_TYPE_LABELS[shelter.type]}
        </p>
      </div>
      {children}
    </li>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="h-16 animate-pulse rounded-xl bg-surface-2 motion-reduce:animate-none" />
      ))}
    </div>
  );
}

function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-edge bg-surface-2 p-6 text-center">
      <p className="text-sm font-bold text-content">{title}</p>
      <p className="mt-1 text-xs font-medium text-muted">{hint}</p>
    </div>
  );
}

type ReportFilter = 'all' | 'approved' | 'pending';

export type AccountTabContentProps = {
  contributions: Shelter[];
  favorites: Shelter[];
  ready: boolean;
  onRemoveFavorite: (id: number) => Promise<void>;
  onSaveProfile: (payload: Partial<Pick<AuthUser, 'name' | 'phone' | 'vehicle' | 'app'>>) => Promise<void>;
  onSavePassword: (payload: PasswordChangePayload) => Promise<void>;
};

export function ReportsTab({
  contributions,
  ready,
  bare = false,
}: {
  contributions: Shelter[];
  ready: boolean;
  bare?: boolean;
}) {
  const [filter, setFilter] = useState<ReportFilter>('all');

  const filtered = contributions.filter((shelter) => {
    if (filter === 'approved') return shelter.is_approved;
    if (filter === 'pending') return !shelter.is_approved;
    return true;
  });

  const counts = {
    all: contributions.length,
    approved: contributions.filter((shelter) => shelter.is_approved).length,
    pending: contributions.filter((shelter) => !shelter.is_approved).length,
  };

  if (!ready) {
    return (
      <div>
        <PanelHeader tab="reports" />
        <SkeletonList />
      </div>
    );
  }

  return (
    <div>
      <PanelHeader tab="reports" />
      {!bare ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {(['all', 'approved', 'pending'] as ReportFilter[]).map((key) => {
            const labels = { all: 'Semua', approved: 'Disetujui', pending: 'Menunggu' };
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 text-xs font-bold transition active:translate-y-[2px] active:shadow-none ${
                  active
                    ? 'border-strong bg-primary text-primary-foreground shadow-neo-sm'
                    : 'border-edge bg-surface-2 text-muted hover:border-muted hover:text-content'
                }`}
              >
                {labels[key]}
                <span className={active ? 'opacity-80' : 'opacity-60'}>({counts[key]})</span>
              </button>
            );
          })}
        </div>
      ) : null}
      {filtered.length === 0 ? (
        <EmptyState
          title={contributions.length === 0 ? 'Belum ada laporan' : 'Tidak ada laporan pada filter ini'}
          hint={contributions.length === 0 ? 'Ketuk tombol + di peta untuk menambah shelter.' : 'Coba ganti filter di atas.'}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((shelter) => (
            <ShelterRow key={shelter.id} shelter={shelter}>
              {shelter.is_approved ? (
                <span className="shrink-0 rounded-full border border-primary/40 bg-primary/15 px-2.5 py-1 text-[10px] font-bold text-primary">
                  Disetujui
                </span>
              ) : (
                <span className="shrink-0 rounded-full border border-warn/40 bg-warn/15 px-2.5 py-1 text-[10px] font-bold text-warn">
                  Menunggu
                </span>
              )}
              <a
                href={googleMapsNavigationUrl(shelter.latitude, shelter.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-lg border-2 border-strong bg-primary px-2.5 py-1.5 text-[11px] font-bold text-primary-foreground transition active:translate-y-[2px] active:shadow-none"
              >
                Navigasi
              </a>
            </ShelterRow>
          ))}
        </ul>
      )}
    </div>
  );
}

export function FavoritesTab({
  favorites,
  ready,
  onRemoveFavorite,
}: {
  favorites: Shelter[];
  ready: boolean;
  onRemoveFavorite: (id: number) => Promise<void>;
}) {
  const [removingId, setRemovingId] = useState<number | null>(null);

  if (!ready) {
    return (
      <div>
        <PanelHeader tab="favorites" />
        <SkeletonList />
      </div>
    );
  }

  const handleRemove = async (id: number) => {
    setRemovingId(id);
    try {
      await onRemoveFavorite(id);
    } finally {
      setRemovingId(null);
    }
  };

  if (favorites.length === 0) {
    return (
      <div>
        <PanelHeader tab="favorites" />
        <EmptyState title="Belum ada shelter favorit" hint="Simpan titik dari peta untuk akses cepat." />
      </div>
    );
  }

  return (
    <div>
      <PanelHeader tab="favorites" />
      <ul className="flex flex-col gap-3">
        {favorites.map((shelter) => (
          <ShelterRow key={shelter.id} shelter={shelter}>
            <a
              href={googleMapsNavigationUrl(shelter.latitude, shelter.longitude)}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-lg border-2 border-strong bg-primary px-2.5 py-1.5 text-[11px] font-bold text-primary-foreground transition active:translate-y-[2px] active:shadow-none"
            >
              Navigasi
            </a>
            <button
              type="button"
              onClick={() => handleRemove(shelter.id)}
              disabled={removingId === shelter.id}
              aria-label={`Hapus ${shelter.name} dari favorit`}
              className="shrink-0 rounded-lg border-2 border-edge bg-surface px-2.5 py-1.5 text-[11px] font-bold text-danger transition hover:border-danger active:translate-y-[2px] disabled:opacity-50"
            >
              {removingId === shelter.id ? '…' : 'Hapus'}
            </button>
          </ShelterRow>
        ))}
      </ul>
    </div>
  );
}

export function ProfileTab({
  onSave,
}: {
  onSave: (payload: Partial<Pick<AuthUser, 'name' | 'phone' | 'vehicle' | 'app'>>) => Promise<void>;
}) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicle, setVehicle] = useState(VEHICLE_OPTIONS[0]);
  const [app, setApp] = useState(APP_OPTIONS[1]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setPhone(user.phone ?? '');
    setVehicle(user.vehicle ?? VEHICLE_OPTIONS[0]);
    setApp(user.app ?? APP_OPTIONS[1]);
  }, [user]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = 'Nama minimal 2 karakter.';
    const digits = phone.replace(/\D/g, '');
    if (digits.length > 0 && (digits.length < 8 || digits.length > 15)) next.phone = 'No. HP harus 8–15 digit angka.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({ name: name.trim(), phone: phone.trim(), vehicle, app });
      setFeedback({ tone: 'success', message: 'Profil berhasil diperbarui.' });
    } catch (err) {
      setFeedback({ tone: 'error', message: apiErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const fieldClass = (key: string) =>
    `h-11 w-full rounded-xl border bg-surface-2 px-4 text-sm font-medium text-content placeholder:text-muted focus:border-primary ${
      errors[key] ? 'border-danger' : 'border-edge'
    }`;

  return (
    <div>
      <PanelHeader tab="profile" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-muted">Nama Lengkap</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nama panggilan"
            required
            autoComplete="name"
            className={fieldClass('name')}
          />
          {errors.name ? <span className="text-[11px] font-bold text-danger">{errors.name}</span> : null}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-muted">No. HP</span>
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="08xxxxxxxxxx"
            autoComplete="tel"
            className={fieldClass('phone')}
          />
          {errors.phone ? <span className="text-[11px] font-bold text-danger">{errors.phone}</span> : null}
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-muted">Jenis Kendaraan</span>
            <select
              value={vehicle}
              onChange={(event) => setVehicle(event.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-edge bg-surface-2 px-4 text-sm font-bold text-content focus:border-primary"
            >
              {VEHICLE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-muted">Aplikasi Ojol</span>
            <select
              value={app}
              onChange={(event) => setApp(event.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-edge bg-surface-2 px-4 text-sm font-bold text-content focus:border-primary"
            >
              {APP_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-muted">Fasilitas Favorit</span>
          <div className="flex flex-wrap gap-2">
            {AMENITY_LIST.map((amenity) => {
              const active = amenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() =>
                    setAmenities((current) =>
                      current.includes(amenity) ? current.filter((item) => item !== amenity) : [...current, amenity],
                    )
                  }
                  aria-pressed={active}
                >
                  <Badge amenity={amenity} active={active} />
                </button>
              );
            })}
          </div>
        </div>

        {feedback ? (
          <p
            className={`rounded-xl border-2 px-4 py-3 text-xs font-bold ${
              feedback.tone === 'success'
                ? 'border-primary/40 bg-primary/15 text-primary'
                : 'border-danger/40 bg-danger/15 text-danger'
            }`}
          >
            {feedback.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="h-11 rounded-xl border-2 border-strong bg-primary text-sm font-bold text-primary-foreground shadow-neo-sm transition active:translate-y-[2px] active:shadow-none disabled:opacity-60"
        >
          {saving ? 'Menyimpan...' : 'Simpan Profil'}
        </button>
      </form>
    </div>
  );
}

export function SecurityTab({ onSave }: { onSave: (payload: PasswordChangePayload) => Promise<void> }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!currentPassword) next.current = 'Password saat ini wajib diisi.';
    if (password.length < 8) next.password = 'Password baru minimal 8 karakter.';
    if (passwordConfirmation !== password) next.confirm = 'Konfirmasi password tidak cocok.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({ current_password: currentPassword, password, password_confirmation: passwordConfirmation });
      setCurrentPassword('');
      setPassword('');
      setPasswordConfirmation('');
      setFeedback({ tone: 'success', message: 'Password berhasil diganti.' });
    } catch (err) {
      setFeedback({ tone: 'error', message: apiErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const fieldClass = (key: string) =>
    `h-11 w-full rounded-xl border bg-surface-2 px-4 text-sm font-medium text-content placeholder:text-muted focus:border-primary ${
      errors[key] ? 'border-danger' : 'border-edge'
    }`;

  return (
    <div>
      <PanelHeader tab="security" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-muted">Password Saat Ini</span>
          <input
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            required
            autoComplete="current-password"
            className={fieldClass('current')}
          />
          {errors.current ? <span className="text-[11px] font-bold text-danger">{errors.current}</span> : null}
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-muted">Password Baru</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Minimal 8 karakter"
            className={fieldClass('password')}
          />
          {errors.password ? <span className="text-[11px] font-bold text-danger">{errors.password}</span> : null}
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-muted">Ulangi Password Baru</span>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            required
            autoComplete="new-password"
            className={fieldClass('confirm')}
          />
          {errors.confirm ? <span className="text-[11px] font-bold text-danger">{errors.confirm}</span> : null}
        </label>

        {feedback ? (
          <p
            className={`rounded-xl border-2 px-4 py-3 text-xs font-bold ${
              feedback.tone === 'success'
                ? 'border-primary/40 bg-primary/15 text-primary'
                : 'border-danger/40 bg-danger/15 text-danger'
            }`}
          >
            {feedback.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="h-11 rounded-xl border-2 border-strong bg-primary text-sm font-bold text-primary-foreground shadow-neo-sm transition active:translate-y-[2px] active:shadow-none disabled:opacity-60"
        >
          {saving ? 'Menyimpan...' : 'Ganti Password'}
        </button>
      </form>
    </div>
  );
}

export default function AccountPanel({
  activeTab,
  contributions,
  favorites,
  ready,
  onRemoveFavorite,
  onSaveProfile,
  onSavePassword,
}: AccountPanelProps) {
  return (
    <div className="rounded-2xl border-2 border-edge bg-surface p-5 shadow-neo">
      {activeTab === 'reports' ? <ReportsTab contributions={contributions} ready={ready} /> : null}
      {activeTab === 'favorites' ? (
        <FavoritesTab favorites={favorites} ready={ready} onRemoveFavorite={onRemoveFavorite} />
      ) : null}
      {activeTab === 'profile' ? <ProfileTab onSave={onSaveProfile} /> : null}
      {activeTab === 'security' ? <SecurityTab onSave={onSavePassword} /> : null}
    </div>
  );
}