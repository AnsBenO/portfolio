import { Component, inject } from '@angular/core';
import { PortfolioDataService } from '../../../../core/services/portfolio-data.service';
import { SectionContainerComponent } from '../../../../shared/layout/section-container/section-container.component';
import { SectionHeaderComponent } from '../../../../shared/layout/section-header/section-header.component';

@Component({
  selector: 'languages-section',
  imports: [SectionContainerComponent, SectionHeaderComponent],
  template: `
    <section id="languages" class="section-screen section-anchor">
      <ui-section-container [glass]="true" rounded="3xl" spacing="lg">
        <ui-section-header
          eyebrow="Languages"
          title="Communication"
          subtitle="Spoken languages and professional fluency levels."
        ></ui-section-header>

        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          @for (item of languages(); track item.language) {
            <article class="glass-card rounded-3xl p-5 sm:p-6">
              <h3 class="text-lg font-semibold text-[hsl(var(--text-1))]">{{ item.language }}</h3>
              <p class="mt-2 text-sm text-[hsl(var(--text-2))]">{{ item.fluency }}</p>
            </article>
          }
        </div>
      </ui-section-container>
    </section>
  `,
})
export class LanguagesSectionComponent {
  private readonly portfolioData = inject(PortfolioDataService);

  protected readonly languages = this.portfolioData.languages;
}
