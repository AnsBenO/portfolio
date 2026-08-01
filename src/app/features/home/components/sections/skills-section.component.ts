import { Component, inject } from '@angular/core';
import { PortfolioDataService } from '../../../../core/services/portfolio-data.service';
import { SkillCategoryComponent } from '../../../../shared/content/skill-category/skill-category.component';
import { GridComponent } from '../../../../shared/layout/grid/grid.component';
import { SectionContainerComponent } from '../../../../shared/layout/section-container/section-container.component';
import { SectionHeaderComponent } from '../../../../shared/layout/section-header/section-header.component';

@Component({
  selector: 'skills-section',
  imports: [
    SkillCategoryComponent,
    GridComponent,
    SectionContainerComponent,
    SectionHeaderComponent,
  ],
  template: `
    <section id="skills" class="section-screen section-anchor">
      <ui-section-container [glass]="true" rounded="3xl" spacing="lg">
        <ui-section-header
          eyebrow="Capabilities"
          title="Skills Overview"
          subtitle="Cross-functional strengths with depth in frontend architecture."
        ></ui-section-header>
        <div class="mt-6">
          <ui-grid columns="two" gap="6">
            @for (category of skillCategories(); track category.id) {
              <content-skill-category [category]="category"></content-skill-category>
            }
          </ui-grid>
        </div>
      </ui-section-container>
    </section>
  `,
})
export class SkillsSectionComponent {
  private readonly portfolioData = inject(PortfolioDataService);

  protected readonly skillCategories = this.portfolioData.skillCategories;
}
