/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Neobrutalism palette
        cream:   '#FFFBF0',
        'cream-2': '#FFF8E7',
        brutal:  '#0A0A0A',
        'brutal-yellow': '#FFE600',
        'brutal-blue':   '#0047FF',
        'brutal-red':    '#FF2D2D',
        'brutal-green':  '#00C853',
        'brutal-muted':  '#3D3D3D',
        // Keep some zinc for admin
        background: '#FFFBF0',
        foreground: '#0A0A0A',
      },
      fontFamily: {
        sans:  ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono:  ['Space Mono', 'Menlo', 'Monaco', 'monospace'],
        serif: ['Georgia', 'Palatino', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        'brutal':    '4px 4px 0px #0A0A0A',
        'brutal-lg': '6px 6px 0px #0A0A0A',
        'brutal-sm': '2px 2px 0px #0A0A0A',
        'brutal-yellow': '4px 4px 0px #FFE600',
        'brutal-blue':   '4px 4px 0px #0047FF',
        'brutal-red':    '4px 4px 0px #FF2D2D',
        'brutal-pressed-sm': '2px 2px 0px #0A0A0A',
        'none': 'none',
      },
      animation: {
        'marquee': 'marquee 18s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
