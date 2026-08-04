import { Component, input } from '@angular/core';
import { SkillCategory } from '../../../../../../core/models/skill.model';
import { SkillBadgeComponent } from '../../../../../../shared/ui/skill-badge/skill-badge.component';

@Component({
  selector: 'content-skill-category',
  imports: [SkillBadgeComponent],
  template: `
    <article class="glass-card rounded-3xl p-5 sm:p-6">
      <h3 class="mt-1 text-lg font-semibold text-[hsl(var(--text-1))]">{{ category().title }}</h3>
      <p class="mt-2 text-sm text-[hsl(var(--text-2))]">{{ category().summary }}</p>

      <div class="mt-4 grid gap-3">
        @for (item of category().skills; track item.name) {
          <ui-skill-badge [name]="item.name" [level]="item.level"></ui-skill-badge>
        }
      </div>
    </article>
  `,
})
export class SkillCategoryComponent {
  category = input.required<SkillCategory>();
}
