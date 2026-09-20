'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import Badge from './Badge';
import { ShelterApi, ShelterPayload } from '@/lib/api';
import { AMENITY_LIST, Amenity, Shelter, ShelterType } from '@/types/shelter';

interface ReportModalProps {
  open: boolean;
  defaultLocation: { latitude: number; longitude: number } | null;
  regionLabel: string;
  canSubmit: boolean;
  onClose: () => void;
  onSubmitted: (shelter: Shelter) => void;
}

interface ReportForm {
  name: string;
  type: ShelterType;
  address: string;
  latitude: string;
  longitude: string;
}

const INITIAL_FORM: ReportForm = {
  name: '',
  type: 'verified',
  address: '',
  latitude: '',
  longitude: '',
};

export default function ReportModal({
  open,
  defaultLocation,
  regionLabel,
  canSubmit,
  onClose,
  onSubmitted,
}: ReportModalProps) {
  const [form, setForm] = useState<ReportForm>(INITIAL_FORM);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({
      ...INITIAL_FORM,
      latitude: defaultLocation ? String(defaultLocation.latitude) : '',
      longitude: defaultLocation ? String(defaultLocation.longitude) : '',
    });
    setAmenities([]);
    setSubmitError(false);
  }, [open, defaultLocation]);

  if (!open) return null;

  const updateField = <K extends keyof ReportForm>(key: K, value: ReportForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleAmenity = (amenity: Amenity) => {
    setAmenities((current) =>
      current.includes(amenity) ? current.filter((item) => item !== amenity) : [...current, amenity],
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);
    if (!form.name.trim() || Number.isNaN(latitude) || Number.isNaN(longitude)) return;

    const payload: ShelterPayload = {
      name: form.name.trim(),
      type: form.type,
      region: regionLabel,
      latitude,
      longitude,
      address: form.address.trim() || form.name.trim(),
      capacity: 1,
      facilities: amenities,
      status: 'active',
    };

    const optimistic: Shelter = {
      id: -Date.now(),
      name: payload.name,
      type: form.type,
      latitude,
      longitude,
      region: regionLabel,
      address: payload.address,
      capacity: 1,
      current_occupancy: 0,
      facilities: amenities,
      status: 'active',
      distance: null,
      updated_at: new Date().toISOString(),
    };

    setSubmitting(true);
    setSubmitError(false);
    try {
      const saved = await ShelterApi.create(payload);
      onSubmitted(saved.id ? { ...optimistic, id: saved.id } : optimistic);
      onClose();
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="no-scrollbar flex max-h-[92dvh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-t-2xl border-t-2 border-x-2 border-edge bg-surface p-5 pb-[max(env(safe-area-inset-bottom),20px)] sm:rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight text-content">Laporkan Titik Baru</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup form"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-edge bg-surface-2 text-muted transition active:bg-surface-2"
          >
            ✕
          </button>
        </div>

        <p className="text-sm font-medium text-muted">
          Bantu sesama driver. Titik yang dikirim akan ditinjau sebelum tampil untuk semua.
        </p>

        {submitError ? (
          <p className="rounded-xl border-2 border-danger/40 bg-danger/15 px-4 py-3 text-xs font-bold text-danger">
            Gagal mengirim laporan. Periksa koneksi internet lalu coba lagi.
          </p>
        ) : null}

        {!canSubmit && (
          <div className="flex items-center justify-between rounded-xl border-2 border-warn/40 bg-warn/15 px-4 py-3">
            <p className="text-xs font-bold text-warn">
              Login diperlukan untuk melaporkan lokasi.
            </p>
            <Link
              href="/login"
              className="shrink-0 rounded-lg border-2 border-strong bg-amber-500 px-3 py-1.5 text-xs font-bold text-zinc-950 shadow-neo-sm"
            >
              Masuk
            </Link>
          </div>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-muted">Nama Lokasi</span>
          <input
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Misal: Warkop Pak Udin"
            required
            className="h-11 rounded-xl border border-edge bg-surface-2 px-4 text-sm font-medium text-content placeholder:text-muted focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-muted">Kategori</span>
          <select
            value={form.type}
            onChange={(event) => updateField('type', event.target.value as ShelterType)}
            className="h-11 appearance-none rounded-xl border border-edge bg-surface-2 px-4 text-sm font-bold text-content focus:border-primary"
          >
            <option value="official">🟢 Shelter Resmi</option>
            <option value="verified">🔵 Basecamp / Warkop Terverifikasi</option>
            <option value="warning">🔴 Zona Rawan Garukan</option>
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-muted">Latitude</span>
            <input
              value={form.latitude}
              onChange={(event) => updateField('latitude', event.target.value)}
              inputMode="decimal"
              placeholder="-6.2480"
              required
              className="h-11 rounded-xl border border-edge bg-surface-2 px-4 text-sm font-medium text-content placeholder:text-muted focus:border-primary"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-muted">Longitude</span>
            <input
              value={form.longitude}
              onChange={(event) => updateField('longitude', event.target.value)}
              inputMode="decimal"
              placeholder="106.7100"
              required
              className="h-11 rounded-xl border border-edge bg-surface-2 px-4 text-sm font-medium text-content placeholder:text-muted focus:border-primary"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-muted">Alamat / Petunjuk</span>
          <textarea
            value={form.address}
            onChange={(event) => updateField('address', event.target.value)}
            rows={2}
            placeholder="Patokan lokasi agar mudah ditemukan..."
            className="resize-none rounded-xl border border-edge bg-surface-2 px-4 py-3 text-sm font-medium text-content placeholder:text-muted focus:border-primary"
          />
        </label>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-muted">Fasilitas</span>
          <div className="flex flex-wrap gap-2">
            {AMENITY_LIST.map((amenity) => {
              const active = amenities.includes(amenity);
              return (
                <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)} aria-pressed={active}>
                  <Badge amenity={amenity} active={active} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-edge bg-surface-2 py-3 text-sm font-bold text-muted transition active:bg-surface-2"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting || !canSubmit}
            className={`flex-1 rounded-xl border-2 py-3 text-sm font-bold transition active:translate-y-[2px] active:shadow-none disabled:opacity-50 ${
              canSubmit
                ? 'border-strong bg-primary text-primary-foreground shadow-neo-sm'
                : 'border-edge bg-surface-2 text-muted'
            }`}
          >
            {canSubmit ? (submitting ? 'Mengirim...' : 'Kirim Laporan') : 'Login untuk Kirim'}
          </button>
        </div>
      </form>
    </div>
  );
}