// Agape Infosys / Qreate Digital Design System - Tailwind CSS Preset (CommonJS)
//
// Usage in your tailwind.config.js:
// module.exports = {
//   presets: [require('./tailwind.preset.cjs')],
//   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
// };

module.exports = {
  theme: {
    extend: {
      colors: {
        ink: '#0c0c0c',
        surface: '#141414',
        box: '#2c2c2c',
        line: '#383838',
        muted: '#828282',
        body: '#d8d8d8',
        headline: '#ffffff',
        accent: '#d90429',
        'accent-soft': 'rgba(217, 4, 41, 0.14)',
        'on-accent': '#ffffff',
      },
      fontFamily: {
        display: ['Akshar', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      letterSpacing: {
        'tight-display': '0.03em',
        'wide-display': '0.12em',
        'wider-display': '0.16em',
        'button': '0.22em',
        'eyebrow': '0.34em',
      },
      maxWidth: {
        content: '1300px',
      },
    },
  },
};
