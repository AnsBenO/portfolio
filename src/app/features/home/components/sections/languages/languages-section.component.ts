import { Component, inject } from '@angular/core';
import { SectionContainerComponent } from '../../../../../shared/layout/section-container/section-container.component';
import { SectionHeaderComponent } from '../../../../../shared/layout/section-header/section-header.component';
import { PortfolioDataService } from '../../../../../core/services/portfolio-data.service';

@Component({
  selector: 'languages-section',
  imports: [SectionContainerComponent, SectionHeaderComponent],
  templateUrl: './languages-section.component.html',
})
export class LanguagesSectionComponent {
  private readonly portfolioData = inject(PortfolioDataService);

  protected readonly languages = this.portfolioData.languages;
}
