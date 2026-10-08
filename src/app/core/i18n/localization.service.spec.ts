import { TestBed } from '@angular/core/testing';
import { LocalizationService } from './localization.service';

describe('LocalizationService', () => {
  beforeEach(() => {
    localStorage.removeItem('ui-locale');
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  });

  it('defaults to English when no supported locale is saved', () => {
    localStorage.setItem('ui-locale', 'de');

    const localization = TestBed.inject(LocalizationService);

    expect(localization.locale()).toBe('en');
    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
  });

  it('persists locale changes and updates document language and direction', () => {
    const localization = TestBed.inject(LocalizationService);

    localization.setLocale('ar');

    expect(localStorage.getItem('ui-locale')).toBe('ar');
    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
    expect(localization.text('nav.home')).toBe('الرئيسية');

    localization.setLocale('fr');

    expect(document.documentElement.lang).toBe('fr');
    expect(document.documentElement.dir).toBe('ltr');
    expect(localization.text('nav.home')).toBe('Accueil');
  });
});
