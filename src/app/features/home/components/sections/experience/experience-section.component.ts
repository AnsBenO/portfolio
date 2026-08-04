import { Component, inject } from '@angular/core';
import { ExperienceCardComponent } from './experience-card/experience-card.component';
import { SectionContainerComponent } from '../../../../../shared/layout/section-container/section-container.component';
import { SectionHeaderComponent } from '../../../../../shared/layout/section-header/section-header.component';
import { PortfolioDataService } from '../../../../../core/services/portfolio-data.service';

@Component({
  selector: 'experience-section',
  imports: [ExperienceCardComponent, SectionContainerComponent, SectionHeaderComponent],
  templateUrl: './experience-section.component.html',
})
export class ExperienceSectionComponent {
  private readonly portfolioData = inject(PortfolioDataService);

  protected readonly experienceHighlights = this.portfolioData.experienceEntries;
}
