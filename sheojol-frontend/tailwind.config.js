module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        edge: 'rgb(var(--edge) / <alpha-value>)',
        strong: 'rgb(var(--strong) / <alpha-value>)',
        content: 'rgb(var(--content) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'primary-foreground': 'rgb(var(--primary-foreground) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-foreground': 'rgb(var(--accent-foreground) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        'danger-foreground': 'rgb(var(--danger-foreground) / <alpha-value>)',
        warn: 'rgb(var(--warn) / <alpha-value>)',
      },
      boxShadow: {
        neo: 'var(--shadow-neo)',
        'neo-sm': 'var(--shadow-neo-sm)',
        'neo-brand': 'var(--shadow-neo-brand)',
        'neo-cyan': 'var(--shadow-neo-cyan)',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};