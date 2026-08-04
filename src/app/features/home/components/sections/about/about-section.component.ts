import { Component, inject } from '@angular/core';
import { DividerComponent } from '../../../../../shared/layout/divider/divider.component';
import { GridComponent } from '../../../../../shared/layout/grid/grid.component';
import { StackComponent } from '../../../../../shared/layout/stack/stack.component';
import { GlassCardComponent } from '../../../../../shared/ui/glass-card/glass-card.component';
import { TechnologyChipComponent } from '../../../../../shared/ui/technology-chip/technology-chip.component';
import { PortfolioDataService } from '../../../../../core/services/portfolio-data.service';

@Component({
  selector: 'about-section',
  imports: [
    DividerComponent,
    GridComponent,
    StackComponent,
    GlassCardComponent,
    TechnologyChipComponent,
  ],
  templateUrl: './about-section.component.html',
})
export class AboutSectionComponent {
  private readonly portfolioData = inject(PortfolioDataService);

  protected readonly basics = this.portfolioData.basics;
  protected readonly topTechnologies = this.portfolioData.topTechnologies;
  protected readonly profileFacts = this.portfolioData.aboutFacts;
}
