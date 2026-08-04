import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { GlassCardComponent } from '../../../../../shared/ui/glass-card/glass-card.component';
import { GridComponent } from '../../../../../shared/layout/grid/grid.component';
import { StackComponent } from '../../../../../shared/layout/stack/stack.component';
import { PortfolioDataService } from '../../../../../core/services/portfolio-data.service';

@Component({
  selector: 'contact-section',
  imports: [ButtonComponent, GlassCardComponent, GridComponent, StackComponent, MatIconModule],
  templateUrl: './contact-section.component.html',
})
export class ContactSectionComponent {
  private readonly portfolioData = inject(PortfolioDataService);

  protected readonly basics = this.portfolioData.basics;
  protected readonly linkedInUrl = computed(
    () =>
      this.portfolioData
        .profiles()
        .find((profile) => profile.network.toLowerCase().includes('linkedin'))?.url ?? null,
  );
  protected readonly mailLink = computed(() => {
    const email = this.basics()?.email;
    return email ? `mailto:${email}` : 'mailto:';
  });
  protected readonly contactMethods = computed(() => {
    const basics = this.basics();

    if (!basics) {
      return [];
    }

    const locationLabel = `${basics.location.city}, ${basics.location.country}`;

    return [
      { label: 'Email', value: basics.email, href: `mailto:${basics.email}`, icon: 'mail' },
      {
        label: 'Location',
        value: locationLabel,
        href: `https://maps.google.com/?q=${encodeURIComponent(locationLabel)}`,
        icon: 'location_on',
      },
    ];
  });
}
