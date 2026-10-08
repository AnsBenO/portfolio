import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.removeItem('theme-preference');
    localStorage.removeItem('theme-palette');
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    localStorage.removeItem('theme-preference');
    localStorage.removeItem('theme-palette');
  });

  it('loads a supported palette preference from local storage', () => {
    localStorage.setItem('theme-palette', 'violet');

    const theme = TestBed.inject(ThemeService);

    expect(theme.palette()).toBe('violet');
  });

  it('ignores an unsupported stored palette', () => {
    localStorage.setItem('theme-palette', 'unsupported');

    const theme = TestBed.inject(ThemeService);

    expect(theme.palette()).toBe('ocean');
  });

  it('persists palette selection independently from theme mode', () => {
    const theme = TestBed.inject(ThemeService);

    theme.setPreference('dark');
    theme.setPalette('forest');

    expect(theme.preference()).toBe('dark');
    expect(theme.currentTheme()).toBe('dark');
    expect(theme.palette()).toBe('forest');
    expect(localStorage.getItem('theme-preference')).toBe('dark');
    expect(localStorage.getItem('theme-palette')).toBe('forest');
  });
});
