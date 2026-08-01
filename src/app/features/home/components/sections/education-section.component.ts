import { Component, inject } from '@angular/core';
import { PortfolioDataService } from '../../../../core/services/portfolio-data.service';
import { SectionContainerComponent } from '../../../../shared/layout/section-container/section-container.component';
import { SectionHeaderComponent } from '../../../../shared/layout/section-header/section-header.component';

@Component({
  selector: 'education-section',
  imports: [SectionContainerComponent, SectionHeaderComponent],
  template: `
    <section id="education" class="section-screen section-anchor">
      <ui-section-container [glass]="true" rounded="3xl" spacing="lg">
        <ui-section-header
          eyebrow="Education"
          title="Academic Background"
          subtitle="Formal studies and qualifications that shaped my engineering foundation."
        ></ui-section-header>

        <div class="mt-6 grid gap-4">
          @for (item of education(); track item.institution + item.startDate) {
            <article class="glass-card rounded-3xl p-5 sm:p-6">
              <p class="eyebrow">{{ formatDateRange(item.startDate, item.endDate) }}</p>
              <h3 class="mt-1 text-lg font-semibold text-[hsl(var(--text-1))]">
                {{ item.institution }}
              </h3>
              <p class="text-sm text-[hsl(var(--text-2))]">{{ item.location }}</p>
              <p class="mt-3 text-sm leading-relaxed text-[hsl(var(--text-2))]">
                {{ item.studyType }}
              </p>
            </article>
          }
        </div>
      </ui-section-container>
    </section>
  `,
})
export class EducationSectionComponent {
  private readonly portfolioData = inject(PortfolioDataService);

  protected readonly education = this.portfolioData.education;

  protected formatDateRange(start: string, end: string): string {
    return `${this.formatDate(start)} - ${this.formatDate(end)}`;
  }

  private formatDate(value: string): string {
    if (value.toLowerCase() === 'current') {
      return 'Present';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(date);
  }
}
