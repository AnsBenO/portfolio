import { Component, computed, input } from '@angular/core';

type GridColumns = 'one' | 'two' | 'two-wide-right';
type GridGap = '4' | '6' | '8';

const GRID_CLASS: Record<GridColumns, string> = {
  one: 'grid-cols-1',
  two: 'lg:grid-cols-2',
  'two-wide-right': 'lg:grid-cols-[1.1fr_0.9fr]',
};

const GAP_CLASS: Record<GridGap, string> = {
  '4': 'gap-4',
  '6': 'gap-6',
  '8': 'gap-8',
};

@Component({
  selector: 'ui-grid',
  template: '<div [class]="gridClass()"><ng-content></ng-content></div>',
})
export class GridComponent {
  columns = input<GridColumns>('one');
  gap = input<GridGap>('6');

  protected readonly gridClass = computed(() => {
    return ['grid', GAP_CLASS[this.gap()], GRID_CLASS[this.columns()]].join(' ');
  });
}
