import { Component, computed, input } from '@angular/core';

type GlassPadding = 'md' | 'lg';
type GlassRadius = '2xl' | '3xl';

const PADDING_CLASS: Record<GlassPadding, string> = {
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
};

@Component({
  selector: 'ui-glass-card',
  template: '<article [class]="cardClass()"><ng-content></ng-content></article>',
})
export class GlassCardComponent {
  padding = input<GlassPadding>('lg');
  radius = input<GlassRadius>('3xl');

  protected readonly cardClass = computed(() => {
    const radiusClass = this.radius() === '2xl' ? 'rounded-2xl' : 'rounded-3xl';
    return ['glass-card', radiusClass, PADDING_CLASS[this.padding()]].join(' ');
  });
}
