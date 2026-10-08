import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { PortfolioDataService } from './core/services/portfolio-data.service';
import { BrandIconService } from './core/theme/brand-icon.service';

describe('App', () => {
  beforeEach(async () => {
    localStorage.removeItem('ui-locale');
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: BrandIconService, useValue: {} },
        {
          provide: PortfolioDataService,
          useValue: {
            basics: signal({ name: 'Anass Benomar', role: 'Full Stack Developer' }),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render Material language selectors in the desktop rail and mobile header', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const selectors = compiled.querySelectorAll(
      'ui-language-selector button[aria-label="Change language"]',
    );

    expect(selectors).toHaveLength(2);
    expect(selectors.item(0)?.textContent).toContain('translate');
    expect(selectors.item(0)?.textContent).toContain('EN');
  });
});
