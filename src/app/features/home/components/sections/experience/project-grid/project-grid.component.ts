import { Component, input } from '@angular/core';
import { Project } from '../../../../../../core/models/project.model';
import { GridComponent } from '../../../../../../shared/layout/grid/grid.component';
import { ProjectCardComponent } from '../project-card/project-card.component';

@Component({
  selector: 'content-project-grid',
  imports: [GridComponent, ProjectCardComponent],
  template: `
    <ui-grid columns="two" gap="6">
      @for (item of projects(); track item.id) {
        <content-project-card [project]="item"></content-project-card>
      }
    </ui-grid>
  `,
})
export class ProjectGridComponent {
  projects = input<Project[]>([]);
}
