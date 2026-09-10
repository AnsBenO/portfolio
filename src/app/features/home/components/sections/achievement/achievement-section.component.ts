import { Component, inject } from '@angular/core';
import { PortfolioDataService } from '../../../../../core/services/portfolio-data.service';
import { SectionContainerComponent } from '../../../../../shared/layout/section-container/section-container.component';
import { SectionHeaderComponent } from '../../../../../shared/layout/section-header/section-header.component';
import { AchievementCardComponent } from './achievement-card/achievement-card.component';

@Component({
  selector: 'achievement-section',
  imports: [SectionContainerComponent, SectionHeaderComponent, AchievementCardComponent],
  templateUrl: './achievement-section.component.html',
})
export class AchievementSectionComponent {
  private readonly portfolioData = inject(PortfolioDataService);

  protected readonly achievements = this.portfolioData.achievements;
}
