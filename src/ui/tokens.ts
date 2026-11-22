/** Dark Roast tokens, copied from the approved design system (docs/design/02-design-system.html). */
export const themes = {
  espresso: {
    bg: '#1d1612', surface: '#2a201b', surface2: '#342822', ink: '#f2e8dc', mute: '#a39283',
    line: '#3b2f28', accent: '#e2a56b', onAccent: '#2a1a0e', soft: '#3a2b21', ok: '#9bb58a', warn: '#d98a6a',
  },
  cream: {
    bg: '#f6f0e7', surface: '#ebe2d5', surface2: '#e1d6c6', ink: '#33281f', mute: '#85766a',
    line: '#ddd2c2', accent: '#b5683f', onAccent: '#fff8f0', soft: '#ead7c6', ok: '#6f8a5c', warn: '#b4543a',
  },
} as const;
export type ThemeName = keyof typeof themes;
export const radius = { pill: 26, card: 20 };
