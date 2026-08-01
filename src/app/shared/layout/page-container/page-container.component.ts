import { Component, computed, input } from '@angular/core';

type MaxWidth = '4xl' | '5xl' | '6xl' | '7xl';
type VerticalSpacing = 'normal' | 'spacious' | 'none';

const MAX_WIDTH_CLASS: Record<MaxWidth, string> = {
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
};

const VERTICAL_SPACING_CLASS: Record<VerticalSpacing, string> = {
  normal: 'gap-6',
  spacious: 'gap-15',
  none: 'gap-0',
};

@Component({
  selector: 'ui-page-container',
  template: '<div [class]="containerClass()"><ng-content></ng-content></div>',
})
export class PageContainerComponent {
  maxWidth = input<MaxWidth>('6xl');
  spacing = input<VerticalSpacing>('normal');

  protected readonly containerClass = computed(() => {
    return [
      'mx-auto',
      'flex',
      'w-full',
      'flex-col',
      MAX_WIDTH_CLASS[this.maxWidth()],
      VERTICAL_SPACING_CLASS[this.spacing()],
    ].join(' ');
  });
}
