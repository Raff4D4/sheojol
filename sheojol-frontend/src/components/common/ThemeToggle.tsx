'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface ThemeToggleProps {
  className?: string;
  label?: string;
  iconOnly?: boolean;
}

export default function ThemeToggle({ className = '', label, iconOnly = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';
  const iconClass = iconOnly ? 'h-5 w-5' : 'h-4 w-4';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={label ?? (isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap')}
      aria-pressed={mounted ? isDark : undefined}
      className={`inline-flex h-10 items-center gap-2 rounded-xl border-2 border-strong bg-surface px-3 text-sm font-bold text-content shadow-neo-sm transition hover:-translate-y-0.5 active:translate-y-[2px] active:shadow-none ${iconOnly ? 'w-10 justify-center !px-0' : ''} ${className}`}
    >
      {mounted ? (
        isDark ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
          </svg>
        )
      ) : (
        <span className={iconClass} />
      )}
      {iconOnly ? null : <span>{mounted ? (isDark ? 'Gelap' : 'Terang') : 'Tema'}</span>}
    </button>
  );
}