export type ThemePreference = 'light' | 'dark' | 'system';

export const THEME_PALETTES = [
  { id: 'ocean', label: 'Ocean', icon: 'waves' },
  { id: 'forest', label: 'Forest', icon: 'forest' },
  { id: 'violet', label: 'Violet', icon: 'flare' },
] as const;

export type ThemePalette = (typeof THEME_PALETTES)[number]['id'];

export function isThemePalette(value: string | null): value is ThemePalette {
  return THEME_PALETTES.some((palette) => palette.id === value);
}
