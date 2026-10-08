import { Component, inject } from '@angular/core';
import { PortfolioDataService } from '../../../../../core/services/portfolio-data.service';
import { SectionContainerComponent } from '../../../../../shared/layout/section-container/section-container.component';
import { SectionHeaderComponent } from '../../../../../shared/layout/section-header/section-header.component';
import { ContentProjectCard } from './content-project-card/content-project-card.component';
import { LocalizationService } from '../../../../../core/i18n/localization.service';

@Component({
  selector: 'projects-section',
  imports: [SectionContainerComponent, SectionHeaderComponent, ContentProjectCard],
  templateUrl: './projects-section.component.html',
})
export class ProjectsSectionComponent {
  private readonly portfolioData = inject(PortfolioDataService);
  protected readonly localization = inject(LocalizationService);

  protected readonly projects = this.portfolioData.projects;
}
