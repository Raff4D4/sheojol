'use client';

interface FABProps {
  onClick: () => void;
}

export default function FAB({ onClick }: FABProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Laporkan lokasi baru"
      className="absolute right-4 z-40 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-strong bg-primary text-primary-foreground shadow-neo transition active:translate-y-[3px] active:shadow-none"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
}