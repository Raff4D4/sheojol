'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AdminShelterPayload } from '@/lib/api';
import { AMENITY_META, SHELTER_TYPE_LABELS } from '@/lib/constants';
import { REGIONS } from '@/lib/regions';
import { Amenity, Shelter, ShelterStatus, ShelterType } from '@/types/shelter';

interface ShelterModalProps {
  open: boolean;
  shelter: Shelter | null;
  onClose: () => void;
  onSave: (payload: AdminShelterPayload, id: number | null) => Promise<void>;
}

const STATUS_LABELS: Record<ShelterStatus, string> = {
  active: 'Aktif',
  inactive: 'Nonaktif',
  maintenance: 'Pemeliharaan',
};

const inputClass =
  'h-11 w-full rounded-xl border border-edge bg-surface-2 px-3.5 text-sm font-medium text-content placeholder:text-muted transition focus:border-primary';

const labelClass = 'text-[11px] font-bold uppercase tracking-widest text-muted';

export default function ShelterModal({ open, shelter, onClose, onSave }: ShelterModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<ShelterType>('verified');
  const [region, setRegion] = useState(REGIONS[0]?.label ?? '');
  const [address, setAddress] = useState('');
  const [capacity, setCapacity] = useState('1');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [status, setStatus] = useState<ShelterStatus>('active');
  const [isApproved, setIsApproved] = useState(true);
  const [facilities, setFacilities] = useState<Amenity[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setName(shelter?.name ?? '');
    setType(shelter?.type ?? 'verified');
    setRegion(shelter?.region ?? REGIONS[0]?.label ?? '');
    setAddress(shelter?.address ?? '');
    setCapacity(String(shelter?.capacity ?? 1));
    setLatitude(shelter ? String(shelter.latitude) : '');
    setLongitude(shelter ? String(shelter.longitude) : '');
    setStatus(shelter?.status ?? 'active');
    setIsApproved(shelter?.is_approved ?? true);
    setFacilities(shelter?.facilities ?? []);
  }, [open, shelter]);

  if (!open) return null;

  const toggleAmenity = (amenity: Amenity) => {
    setFacilities((current) =>
      current.includes(amenity) ? current.filter((item) => item !== amenity) : [...current, amenity],
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (!name.trim() || Number.isNaN(lat) || Number.isNaN(lng)) {
      setError('Lengkapi nama, latitude, dan longitude terlebih dahulu.');
      return;
    }

    const payload: AdminShelterPayload = {
      name: name.trim(),
      type,
      region,
      latitude: lat,
      longitude: lng,
      address: address.trim(),
      capacity: Math.max(0, Math.round(Number(capacity) || 0)),
      facilities,
      status,
      is_approved: isApproved,
    };

    setSaving(true);
    try {
      await onSave(payload, shelter?.id ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="no-scrollbar flex max-h-[92dvh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-t-2xl border-t-2 border-x-2 border-edge bg-surface p-5 pb-[max(env(safe-area-inset-bottom),20px)] shadow-neo sm:rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight text-content">
            {shelter ? 'Edit Shelter' : 'Tambah Shelter'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup form"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-edge bg-surface-2 text-muted transition hover:text-content"
          >
            ✕
          </button>
        </div>

        {error ? (
          <div className="rounded-xl border-2 border-danger/40 bg-danger/15 px-3.5 py-2.5 text-sm font-semibold text-danger">
            {error}
          </div>
        ) : null}

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Nama Lokasi</span>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Misal: Shelter Ciledug Timur" required className={inputClass} />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Kategori</span>
            <select value={type} onChange={(event) => setType(event.target.value as ShelterType)} className={inputClass}>
              {(Object.keys(SHELTER_TYPE_LABELS) as ShelterType[]).map((key) => (
                <option key={key} value={key}>
                  {SHELTER_TYPE_LABELS[key]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Wilayah</span>
            <select value={region} onChange={(event) => setRegion(event.target.value)} className={inputClass}>
              {REGIONS.map((item) => (
                <option key={item.key} value={item.label}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Status Operasional</span>
            <select value={status} onChange={(event) => setStatus(event.target.value as ShelterStatus)} className={inputClass}>
              {(Object.keys(STATUS_LABELS) as ShelterStatus[]).map((key) => (
                <option key={key} value={key}>
                  {STATUS_LABELS[key]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Kapasitas (orang)</span>
            <input
              value={capacity}
              onChange={(event) => setCapacity(event.target.value)}
              inputMode="numeric"
              className={inputClass}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Latitude</span>
            <input
              value={latitude}
              onChange={(event) => setLatitude(event.target.value)}
              inputMode="decimal"
              placeholder="-6.2480"
              required
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Longitude</span>
            <input
              value={longitude}
              onChange={(event) => setLongitude(event.target.value)}
              inputMode="decimal"
              placeholder="106.7100"
              required
              className={inputClass}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Alamat / Petunjuk</span>
          <textarea
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            rows={2}
            placeholder="Patokan lokasi agar mudah ditemukan..."
            className="resize-none rounded-xl border border-edge bg-surface-2 px-3.5 py-2.5 text-sm font-medium text-content placeholder:text-muted transition focus:border-primary"
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className={labelClass}>Fasilitas</span>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(AMENITY_META) as Amenity[]).map((amenity) => {
              const active = facilities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-bold transition active:translate-y-[2px] active:shadow-none ${
                    active
                      ? 'border-strong bg-primary text-primary-foreground shadow-neo-sm'
                      : 'border-edge bg-surface-2 text-muted hover:border-muted'
                  }`}
                >
                  <span>{AMENITY_META[amenity].icon}</span>
                  {AMENITY_META[amenity].label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsApproved((current) => !current)}
          className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 transition ${
            isApproved ? 'border-primary/40 bg-primary/10' : 'border-edge bg-surface-2'
          }`}
        >
          <span className="text-sm font-bold text-content">Tampil langsung di peta</span>
          <span
            className={`relative h-6 w-11 rounded-full transition ${isApproved ? 'bg-primary' : 'bg-edge'}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${isApproved ? 'left-[22px]' : 'left-0.5'}`}
            />
          </span>
        </button>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border-2 border-edge bg-surface-2 py-3 text-sm font-bold text-muted transition hover:text-content"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-xl border-2 border-strong bg-primary py-3 text-sm font-bold text-primary-foreground shadow-neo-sm transition active:translate-y-[2px] active:shadow-none disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : shelter ? 'Simpan Perubahan' : 'Tambah Shelter'}
          </button>
        </div>
      </form>
    </div>
  );
}