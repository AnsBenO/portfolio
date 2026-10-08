import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatDrawerContainer, MatSidenavModule } from '@angular/material/sidenav';
import { PortfolioDataService } from '../../../core/services/portfolio-data.service';
import { SectionSpyService } from '../../../core/services/section-spy.service';
import { ThemeToggleComponent } from '../../ui/theme-toggle/theme-toggle.component';
import { LanguageSelectorComponent } from '../../ui/language-selector/language-selector.component';
import { LocalizationService, TranslationKey } from '../../../core/i18n/localization.service';

interface NavLink {
  label: TranslationKey;
  id: string;
  icon: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'nav.home', id: 'home', icon: 'home' },
  { label: 'nav.about', id: 'about', icon: 'badge' },
  { label: 'nav.achievements', id: 'achievements', icon: 'emoji_events' },
  { label: 'nav.experience', id: 'experience', icon: 'timeline' },
  { label: 'nav.projects', id: 'projects', icon: 'code' },
  { label: 'nav.github', id: 'github-statistics', icon: 'brand-github' },
  { label: 'nav.languages', id: 'languages', icon: 'translate' },
  { label: 'nav.contact', id: 'contact', icon: 'alternate_email' },
];

@Component({
  selector: 'ui-navigation',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    ThemeToggleComponent,
    LanguageSelectorComponent,
    MatDrawerContainer,
  ],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  
  protected readonly sectionSpy = inject(SectionSpyService);
  protected readonly localization = inject(LocalizationService);
  private readonly portfolioData = inject(PortfolioDataService);
  protected readonly basics = this.portfolioData.basics;

  drawer!: MatDrawer;

  protected readonly brandInitials = computed(() => {
    const name = this.basics()?.name;

    if (!name) {
      return 'PF';
    }

    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');

    return initials || 'PF';
  });

  protected readonly navLinks = computed(
    () =>
      NAV_LINKS.map((link) => ({
        ...link,
        label: this.localization.text(link.label),
      })),
  );

  protected isActive(sectionId: string): boolean {
    return this.sectionSpy.activeSection() === sectionId;
  }

  protected scrollToSection(sectionId: string, drawer?: MatDrawer): void {
    this.sectionSpy.scrollTo(sectionId);
    drawer?.close();
  }
}
