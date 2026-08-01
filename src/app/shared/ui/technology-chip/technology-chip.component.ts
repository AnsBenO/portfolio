import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-technology-chip',
  template: '<span class="technology-chip">{{ label() }}</span>',
})
export class TechnologyChipComponent {
  label = input.required<string>();
}
