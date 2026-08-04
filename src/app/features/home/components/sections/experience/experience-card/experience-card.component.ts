import { Component, input } from '@angular/core';
import { Experience } from '../../../../../../core/models/experience.model';
import { TechnologyChipComponent } from '../../../../../../shared/ui/technology-chip/technology-chip.component';

@Component({
  selector: 'content-experience-card',
  imports: [TechnologyChipComponent],
  template: `
    <article class="glass-card rounded-3xl p-5 sm:p-6">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="eyebrow">{{ experience().period }}</p>
          <h3 class="mt-1 text-lg font-semibold text-[hsl(var(--text-1))]">
            {{ experience().role }}
          </h3>
          <p class="text-sm text-[hsl(var(--text-2))]">
            {{ experience().company }} • {{ experience().location }}
          </p>
        </div>
      </div>

      <p class="mt-3 text-sm leading-relaxed text-[hsl(var(--text-2))]">
        {{ experience().summary }}
      </p>

      <ul class="mt-3 space-y-2 text-sm text-[hsl(var(--text-2))]">
        @for (item of experience().highlights; track item) {
          <li class="glass-list-item">{{ item }}</li>
        }
      </ul>

      <div class="mt-4 flex flex-wrap gap-2">
        @for (technology of experience().technologies; track technology) {
          <ui-technology-chip [label]="technology"></ui-technology-chip>
        }
      </div>
    </article>
  `,
})
export class ExperienceCardComponent {
  experience = input.required<Experience>();
}
