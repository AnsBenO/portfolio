import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { PortfolioDataService } from '../../../core/services/portfolio-data.service';
import { SectionSpyService } from '../../../core/services/section-spy.service';
import { ThemeToggleComponent } from '../../ui/theme-toggle/theme-toggle.component';

interface NavLink {
  label: string;
  id: string;
  icon: string;
}

@Component({
  selector: 'ui-navigation',
  imports: [MatButtonModule, MatIconModule, MatSidenavModule, ThemeToggleComponent],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  protected readonly sectionSpy = inject(SectionSpyService);
  private readonly portfolioData = inject(PortfolioDataService);

  protected readonly basics = this.portfolioData.basics;
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

  protected readonly navLinks: NavLink[] = [
    { label: 'Home', id: 'home', icon: 'home' },
    { label: 'About', id: 'about', icon: 'badge' },
    { label: 'Experience', id: 'experience', icon: 'timeline' },
    { label: 'Education', id: 'education', icon: 'school' },
    { label: 'Training', id: 'training', icon: 'menu_book' },
    { label: 'Skills', id: 'skills', icon: 'psychology' },
    { label: 'Languages', id: 'languages', icon: 'translate' },
    { label: 'Contact', id: 'contact', icon: 'alternate_email' },
  ];

  protected isActive(sectionId: string): boolean {
    return this.sectionSpy.activeSection() === sectionId;
  }

  protected scrollToSection(sectionId: string, drawer?: MatDrawer): void {
    this.sectionSpy.scrollTo(sectionId);
    drawer?.close();
  }
}
