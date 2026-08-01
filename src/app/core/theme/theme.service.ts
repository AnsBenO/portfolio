import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, computed, effect, inject, signal } from '@angular/core';
import { ThemePreference } from './theme.types';

const THEME_STORAGE_KEY = 'theme-preference';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  private readonly preferenceState = signal<ThemePreference>('system');
  private readonly systemDarkState = signal(false);

  readonly preference = this.preferenceState.asReadonly();
  readonly currentTheme = computed(() => this.resolveTheme(this.preferenceState()));

  constructor() {
    this.initializeThemeState();

    effect(() => {
      const resolvedTheme = this.currentTheme();
      const htmlElement = this.document.documentElement;

      htmlElement.classList.toggle('dark', resolvedTheme === 'dark');
      htmlElement.dataset['theme'] = resolvedTheme;
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

  private initializeThemeState(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const storedPreference = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedPreference === 'light' || storedPreference === 'dark') {
      this.preferenceState.set(storedPreference);
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
