import { Component, computed, input } from '@angular/core';

type SectionSpacing = 'md' | 'lg' | 'xl';

const SPACING_CLASS: Record<SectionSpacing, string> = {
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
  xl: 'p-8 sm:p-10',
};

@Component({
  selector: 'ui-section-container',
  template: '<section [class]="sectionClass()"><ng-content></ng-content></section>',
})
export class SectionContainerComponent {
  glass = input(false);
  rounded = input<'2xl' | '3xl'>('3xl');
  spacing = input<SectionSpacing>('lg');

  protected readonly sectionClass = computed(() => {
    const roundedClass = this.rounded() === '2xl' ? 'rounded-2xl' : 'rounded-3xl';

    return [roundedClass, SPACING_CLASS[this.spacing()], this.glass() ? 'glass-panel' : '']
      .filter(Boolean)
      .join(' ');
  });
}
