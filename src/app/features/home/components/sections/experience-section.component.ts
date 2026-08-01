import { Component, inject } from '@angular/core';
import { PortfolioDataService } from '../../../../core/services/portfolio-data.service';
import { ExperienceCardComponent } from '../../../../shared/content/experience-card/experience-card.component';
import { SectionContainerComponent } from '../../../../shared/layout/section-container/section-container.component';
import { SectionHeaderComponent } from '../../../../shared/layout/section-header/section-header.component';

@Component({
  selector: 'experience-section',
  imports: [ExperienceCardComponent, SectionContainerComponent, SectionHeaderComponent],
  template: `
    <section id="experience" class="section-screen section-anchor">
      <ui-section-container [glass]="true" rounded="3xl" spacing="lg">
        <ui-section-header
          eyebrow="Career"
          title="Experience Highlights"
          subtitle="Recent roles with measurable product and engineering impact."
        ></ui-section-header>
        <div class="mt-6 grid gap-6">
          @for (item of experienceHighlights(); track item.id) {
            <content-experience-card [experience]="item"></content-experience-card>
          }
        </div>
      </ui-section-container>
    </section>
  `,
})
export class ExperienceSectionComponent {
  private readonly portfolioData = inject(PortfolioDataService);

  protected readonly experienceHighlights = this.portfolioData.experienceEntries;
}
