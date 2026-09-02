import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-section-header',
  template: `
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        @if (eyebrow()) {
          <p class="eyebrow section-kicker">{{ eyebrow() }}</p>
        }
        <h1 class="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{{ title() }}</h1>
        @if (subtitle()) {
          <p class="mt-2 max-w-2xl text-sm opacity-80 sm:text-base">{{ subtitle() }}</p>
        }
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <ng-content select="[section-actions]"></ng-content>
      </div>
    </div>
  `,
})
export class SectionHeaderComponent {
  eyebrow = input('');
  title = input.required<string>();
  subtitle = input('');
}
