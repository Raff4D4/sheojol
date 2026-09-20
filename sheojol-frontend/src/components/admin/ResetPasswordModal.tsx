'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiErrorMessage } from '@/lib/api';

interface ResetPasswordModalProps {
  open: boolean;
  driverName: string;
  onClose: () => void;
  onSave: (password: string) => Promise<void>;
}

const inputClass =
  'h-11 w-full rounded-xl border border-edge bg-surface-2 px-3.5 text-sm font-medium text-content placeholder:text-muted transition focus:border-primary';

const labelClass = 'text-[11px] font-bold uppercase tracking-widest text-muted';

export default function ResetPasswordModal({ open, driverName, onClose, onSave }: ResetPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setPassword('');
    setConfirm('');
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    if (password !== confirm) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }
    setSaving(true);
    try {
      await onSave(password);
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
        className="flex max-h-[92dvh] w-full max-w-md flex-col gap-4 rounded-t-2xl border-t-2 border-x-2 border-edge bg-surface p-5 pb-[max(env(safe-area-inset-bottom),20px)] shadow-neo sm:rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight text-content">Reset Password</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup form"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-edge bg-surface-2 text-muted transition hover:text-content"
          >
            ✕
          </button>
        </div>

        <p className="text-sm font-medium text-muted">Atur ulang password akun driver <span className="font-bold text-content">{driverName}</span>.</p>

        {error ? (
          <div className="rounded-xl border-2 border-danger/40 bg-danger/15 px-3.5 py-2.5 text-sm font-semibold text-danger">
            {error}
          </div>
        ) : null}

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Password Baru</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimal 6 karakter"
            required
            autoFocus
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Konfirmasi Password</span>
          <input
            type="password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            placeholder="Ulangi password baru"
            required
            className={inputClass}
          />
        </label>

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
            {saving ? 'Menyimpan...' : 'Reset Password'}
          </button>
        </div>
      </form>
    </div>
  );
}