import { Component, inject } from '@angular/core';
import { PortfolioDataService } from '../../../../core/services/portfolio-data.service';
import { DividerComponent } from '../../../../shared/layout/divider/divider.component';
import { GridComponent } from '../../../../shared/layout/grid/grid.component';
import { StackComponent } from '../../../../shared/layout/stack/stack.component';
import { GlassCardComponent } from '../../../../shared/ui/glass-card/glass-card.component';
import { TechnologyChipComponent } from '../../../../shared/ui/technology-chip/technology-chip.component';

@Component({
  selector: 'about-section',
  imports: [
    DividerComponent,
    GridComponent,
    StackComponent,
    GlassCardComponent,
    TechnologyChipComponent,
  ],
  template: `
    <section id="about" class="section-screen section-anchor">
      <ui-glass-card padding="lg" radius="3xl">
        <ui-stack gap="6">
          <div>
            <p class="eyebrow">About Me</p>
            <h2
              class="mt-1 text-2xl font-semibold tracking-tight text-[hsl(var(--text-1))] sm:text-3xl"
            >
              {{ basics()?.title ?? 'Professional Background' }}
            </h2>
          </div>

          <ui-grid columns="two" gap="6">
            <p class="text-sm leading-relaxed text-[hsl(var(--text-2))] sm:text-base">
              {{ basics()?.summary ?? 'Summary loading...' }}
            </p>

            <ul class="space-y-2 text-sm">
              @for (fact of profileFacts(); track fact.label) {
                <li
                  class="flex items-center justify-between rounded-xl border border-[rgba(var(--border-rgb),0.28)] px-3 py-2"
                >
                  <span class="pill-label">{{ fact.label }}</span>
                  <span class="font-medium text-[hsl(var(--text-1))]">{{ fact.value }}</span>
                </li>
              }
            </ul>
          </ui-grid>

          <ui-divider></ui-divider>

          <div>
            <p class="eyebrow">Top Stack</p>
            <div class="mt-3 flex flex-wrap gap-2">
              @for (technology of topTechnologies(); track technology) {
                <ui-technology-chip [label]="technology"></ui-technology-chip>
              }
            </div>
          </div>
        </ui-stack>
      </ui-glass-card>
    </section>
  `,
})
export class AboutSectionComponent {
  private readonly portfolioData = inject(PortfolioDataService);

  protected readonly basics = this.portfolioData.basics;
  protected readonly topTechnologies = this.portfolioData.topTechnologies;
  protected readonly profileFacts = this.portfolioData.aboutFacts;
}
