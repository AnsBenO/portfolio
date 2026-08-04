import { Component, inject } from '@angular/core';
import { GridComponent } from '../../../../../shared/layout/grid/grid.component';
import { SectionContainerComponent } from '../../../../../shared/layout/section-container/section-container.component';
import { SectionHeaderComponent } from '../../../../../shared/layout/section-header/section-header.component';
import { PortfolioDataService } from '../../../../../core/services/portfolio-data.service';
import { SkillCategoryComponent } from './skill-category/skill-category.component';

@Component({
  selector: 'skills-section',
  imports: [
    SkillCategoryComponent,
    GridComponent,
    SectionContainerComponent,
    SectionHeaderComponent,
  ],
  templateUrl: './skills-section.component.html',
})
export class SkillsSectionComponent {
  private readonly portfolioData = inject(PortfolioDataService);

  protected readonly skillCategories = this.portfolioData.skillCategories;
}
