import { Component, computed, input } from '@angular/core';

type StackGap = '2' | '3' | '4' | '6';

const GAP_CLASS: Record<StackGap, string> = {
  '2': 'gap-2',
  '3': 'gap-3',
  '4': 'gap-4',
  '6': 'gap-6',
};

@Component({
  selector: 'ui-stack',
  template: '<div [class]="stackClass()"><ng-content></ng-content></div>',
})
export class StackComponent {
  gap = input<StackGap>('4');

  protected readonly stackClass = computed(() => {
    return ['flex', 'flex-col', GAP_CLASS[this.gap()]].join(' ');
  });
}
