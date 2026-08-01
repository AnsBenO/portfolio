import { Component, inject } from '@angular/core';
import { PortfolioDataService } from '../../../../core/services/portfolio-data.service';
import { SectionContainerComponent } from '../../../../shared/layout/section-container/section-container.component';
import { SectionHeaderComponent } from '../../../../shared/layout/section-header/section-header.component';

@Component({
  selector: 'training-section',
  imports: [SectionContainerComponent, SectionHeaderComponent],
  template: `
    <section id="training" class="section-screen section-anchor">
      <ui-section-container [glass]="true" rounded="3xl" spacing="lg">
        <ui-section-header
          eyebrow="Training"
          title="Certifications and Programs"
          subtitle="Continuous learning through technical and professional programs."
        ></ui-section-header>

        <div class="mt-6 grid gap-4">
          @for (item of training(); track item.name + item.provider) {
            <article class="glass-card rounded-3xl p-5 sm:p-6">
              <p class="eyebrow">{{ trainingDateLabel(item) }}</p>
              <h3 class="mt-1 text-lg font-semibold text-[hsl(var(--text-1))]">{{ item.name }}</h3>
              <p class="text-sm text-[hsl(var(--text-2))]">
                {{ item.provider }}
                @if (item.location) {
                  • {{ item.location }}
                }
              </p>

              @if (item.highlights.length > 0) {
                <ul class="mt-3 space-y-2 text-sm text-[hsl(var(--text-2))]">
                  @for (highlight of item.highlights; track highlight) {
                    <li class="glass-list-item">{{ highlight }}</li>
                  }
                </ul>
              }
            </article>
          }
        </div>
      </ui-section-container>
    </section>
  `,
})
export class TrainingSectionComponent {
  private readonly portfolioData = inject(PortfolioDataService);

  protected readonly training = this.portfolioData.training;

  protected trainingDateLabel(item: {
    date?: string;
    startDate?: string;
    endDate?: string;
  }): string {
    if (item.date) {
      return this.formatDate(item.date);
    }

    return `${this.formatDate(item.startDate)} - ${this.formatDate(item.endDate)}`;
  }

  private formatDate(value?: string): string {
    if (!value) {
      return 'Present';
    }

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
