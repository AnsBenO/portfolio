import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'ui-skill-badge',
  template: `
    <article class="skill-badge">
      <div class="flex items-center justify-between gap-3">
        <span class="font-medium text-[hsl(var(--text-1))]">{{ name() }}</span>
        <span class="text-xs text-[hsl(var(--text-2))]">{{ level() }}%</span>
      </div>
      <div class="mt-2 h-1.5 rounded-full bg-[rgba(var(--border-rgb),0.35)]">
        <div
          [style.width.%]="progress()"
          class="h-full rounded-full bg-[rgba(var(--brand-rgb),0.8)]"
        ></div>
      </div>
    </article>
  `,
})
export class SkillBadgeComponent {
  name = input.required<string>();
  level = input<number>(70);

  protected readonly progress = computed(() => Math.min(100, Math.max(0, this.level())));
}
