import { Component, inject, input } from '@angular/core';
import { Project } from '../../../../../../core/models/project.model';
import { TechnologyChipComponent } from '../../../../../../shared/ui/technology-chip/technology-chip.component';
import { MatIconModule } from '@angular/material/icon';
import { LocalizationService } from '../../../../../../core/i18n/localization.service';

@Component({
  selector: 'content-project-card',
  imports: [TechnologyChipComponent, MatIconModule],
  templateUrl: './content-project-card.component.html',
})
export class ContentProjectCard {
  project = input.required<Project>();
  protected readonly localization = inject(LocalizationService);

  goToSource() {
    const url = this.project().sourceUrl;
    if (url) {
      window.open(url, '_blank');
    }
  }
}
