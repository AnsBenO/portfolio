import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, computed, effect, inject, signal } from '@angular/core';
import { isThemePalette, ThemePalette, ThemePreference } from './theme.types';

const THEME_STORAGE_KEY = 'theme-preference';
const PALETTE_STORAGE_KEY = 'theme-palette';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  private readonly preferenceState = signal<ThemePreference>('system');
  private readonly systemDarkState = signal(false);
  private readonly paletteState = signal<ThemePalette>('ocean');

  readonly preference = this.preferenceState.asReadonly();
  readonly palette = this.paletteState.asReadonly();
  readonly currentTheme = computed(() => this.resolveTheme(this.preferenceState()));

  constructor() {
    this.initializeThemeState();

    effect(() => {
      const resolvedTheme = this.currentTheme();
      const htmlElement = this.document.documentElement;

      htmlElement.classList.toggle('dark', resolvedTheme === 'dark');
      htmlElement.dataset['theme'] = resolvedTheme;
      htmlElement.dataset['palette'] = this.paletteState();
      htmlElement.style.colorScheme = resolvedTheme;
    });
  }

  setPreference(preference: ThemePreference): void {
    this.preferenceState.set(preference);

    if (preference === 'system') {
      localStorage.removeItem(THEME_STORAGE_KEY);
      return;
    }

    localStorage.setItem(THEME_STORAGE_KEY, preference);
  }

  setPalette(palette: ThemePalette): void {
    this.paletteState.set(palette);
    localStorage.setItem(PALETTE_STORAGE_KEY, palette);
  }

  private initializeThemeState(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const storedPreference = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedPreference === 'light' || storedPreference === 'dark') {
      this.preferenceState.set(storedPreference);
    }

    const storedPalette = localStorage.getItem(PALETTE_STORAGE_KEY);
    if (isThemePalette(storedPalette)) {
      this.paletteState.set(storedPalette);
    }

    if (typeof window.matchMedia !== 'function') {
      return;
    }

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.systemDarkState.set(darkModeMediaQuery.matches);

    const onDarkModeChange = (event: MediaQueryListEvent) => {
      this.systemDarkState.set(event.matches);
    };

    darkModeMediaQuery.addEventListener('change', onDarkModeChange);
    this.destroyRef.onDestroy(() => {
      darkModeMediaQuery.removeEventListener('change', onDarkModeChange);
    });
  }

  private resolveTheme(preference: ThemePreference): 'light' | 'dark' {
    if (preference === 'system') {
      return this.systemDarkState() ? 'dark' : 'light';
    }

    return preference;
  }
}
