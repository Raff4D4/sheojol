'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AdminDriverPayload, apiErrorMessage } from '@/lib/api';

interface AddDriverModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: AdminDriverPayload) => Promise<void>;
}

const inputClass =
  'h-11 w-full rounded-xl border border-edge bg-surface-2 px-3.5 text-sm font-medium text-content placeholder:text-muted transition focus:border-primary';

const labelClass = 'text-[11px] font-bold uppercase tracking-widest text-muted';

type DriverForm = Record<keyof AdminDriverPayload, string>;

const EMPTY_FORM: DriverForm = {
  name: '',
  email: '',
  phone: '',
  vehicle_type: '',
  app_type: '',
  password: '',
};

export default function AddDriverModal({ open, onClose, onSave }: AddDriverModalProps) {
  const [form, setForm] = useState<DriverForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setForm(EMPTY_FORM);
  }, [open]);

  if (!open) return null;

  const update = (field: keyof DriverForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSaving(true);
    const payload: AdminDriverPayload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      vehicle_type: form.vehicle_type.trim() || null,
      app_type: form.app_type.trim() || null,
      password: form.password,
    };
    try {
      await onSave(payload);
    } catch (err) {
      setError(apiErrorMessage(err));
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
          <h2 className="text-lg font-extrabold tracking-tight text-content">Tambah Driver</h2>
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
          <span className={labelClass}>Nama Lengkap</span>
          <input
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            placeholder="Misal: Budi Santoso"
            required
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
            placeholder="budi@email.com"
            required
            className={inputClass}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>No. HP</span>
            <input
              value={form.phone}
              onChange={(event) => update('phone', event.target.value)}
              inputMode="tel"
              placeholder="0812xxxx"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => update('password', event.target.value)}
              placeholder="Minimal 6 karakter"
              required
              minLength={6}
              className={inputClass}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Jenis Kendaraan</span>
            <select
              value={form.vehicle_type}
              onChange={(event) => update('vehicle_type', event.target.value)}
              className={inputClass}
            >
              <option value="">Pilih kendaraan</option>
              <option value="motor">Motor</option>
              <option value="mobil">Mobil</option>
              <option value="bentor">Bentor</option>
              <option value="sepeda">Sepeda</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Aplikasi Ojol</span>
            <select
              value={form.app_type}
              onChange={(event) => update('app_type', event.target.value)}
              className={inputClass}
            >
              <option value="">Pilih aplikasi</option>
              <option value="gojek">Gojek</option>
              <option value="grab">Grab</option>
              <option value="maxim">Maxim</option>
              <option value="in-driver">In-Driver</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </label>
        </div>

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
            {saving ? 'Menyimpan...' : 'Tambah Driver'}
          </button>
        </div>
      </form>
    </div>
  );
}