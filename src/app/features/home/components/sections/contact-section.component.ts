import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PortfolioDataService } from '../../../../core/services/portfolio-data.service';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { GlassCardComponent } from '../../../../shared/ui/glass-card/glass-card.component';
import { GridComponent } from '../../../../shared/layout/grid/grid.component';
import { StackComponent } from '../../../../shared/layout/stack/stack.component';

@Component({
  selector: 'contact-section',
  imports: [ButtonComponent, GlassCardComponent, GridComponent, StackComponent, MatIconModule],
  template: `
    <section id="contact" class="section-screen section-anchor">
      <ui-glass-card padding="lg" radius="3xl">
        <ui-stack gap="6">
          <div>
            <p class="eyebrow">Contact</p>
            <h2
              class="mt-1 text-2xl font-semibold tracking-tight text-[hsl(var(--text-1))] sm:text-3xl"
            >
              Let's connect
            </h2>
            <p class="mt-2 text-sm text-[hsl(var(--text-2))]">
              Reach out through email or social profiles for collaboration opportunities.
            </p>
          </div>

          <ui-grid columns="two" gap="6">
            <ul class="space-y-3">
              @for (item of contactMethods(); track item.label) {
                <li class="glass-list-item flex items-center justify-between gap-3">
                  <span class="inline-flex items-center gap-2 pill-label">
                    <mat-icon class="text-base">{{ item.icon }}</mat-icon>
                    {{ item.label }}
                  </span>
                  <a
                    [href]="item.href"
                    class="inline-flex items-center gap-2 font-medium text-[hsl(var(--text-1))]"
                  >
                    <mat-icon class="text-base">open_in_new</mat-icon>
                    {{ item.value }}
                  </a>
                </li>
              }
            </ul>

            <div class="flex flex-wrap items-start gap-2">
              <ui-button variant="primary" [link]="mailLink()" [external]="true" icon="mail"
                >Start a Conversation</ui-button
              >
              @if (linkedInUrl()) {
                <ui-button
                  variant="secondary"
                  [link]="linkedInUrl()"
                  [external]="true"
                  icon="groups"
                  >LinkedIn</ui-button
                >
              }
            </div>
          </ui-grid>
        </ui-stack>
      </ui-glass-card>
    </section>
  `,
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

    const phoneDigits = basics.phone.replace(/\s+/g, '');
    const locationLabel = `${basics.location.city}, ${basics.location.country}`;

    return [
      { label: 'Email', value: basics.email, href: `mailto:${basics.email}`, icon: 'mail' },
      { label: 'Phone', value: basics.phone, href: `tel:${phoneDigits}`, icon: 'call' },
      {
        label: 'Location',
        value: locationLabel,
        href: `https://maps.google.com/?q=${encodeURIComponent(locationLabel)}`,
        icon: 'location_on',
      },
    ];
  });
}
