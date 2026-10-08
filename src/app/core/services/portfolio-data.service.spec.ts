import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LocalizationService } from '../i18n/localization.service';
import { PortfolioData } from '../models/portfolio-data.model';
import { PortfolioDataService } from './portfolio-data.service';

describe('PortfolioDataService', () => {
  let httpTesting: HttpTestingController;
  let localization: LocalizationService;
  let portfolioData: PortfolioDataService;

  beforeEach(() => {
    localStorage.removeItem('ui-locale');
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpTesting = TestBed.inject(HttpTestingController);
    localization = TestBed.inject(LocalizationService);
    portfolioData = TestBed.inject(PortfolioDataService);
    TestBed.flushEffects();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('loads data for the selected locale when the language changes', () => {
    httpTesting.expectOne('data.json').flush(createPortfolioData('English'));
    expect(portfolioData.basics()?.role).toBe('English');

    localization.setLocale('fr');
    TestBed.flushEffects();

    expect(portfolioData.basics()).toBeNull();
    httpTesting.expectOne('data.fr.json').flush(createPortfolioData('Français'));

    expect(portfolioData.basics()?.role).toBe('Français');
    expect(portfolioData.status()).toBe('ready');
  });
});

function createPortfolioData(role: string): PortfolioData {
  return {
    basics: {
      name: 'Portfolio',
      title: role,
      role,
      phone: '',
      email: '',
      location: { city: '', country: '' },
      profiles: [],
      summary: '',
    },
    work: [],
    education: [],
    training: [],
    skills: {
      programmingLanguages: [],
      backend: [],
      frontend: [],
      databases: [],
      devOpsAndTools: [],
      projectManagement: [],
      architectureAndDesign: [],
      maintenanceAndTriaging: [],
    },
    languages: [],
  };
}
