import { Component, computed, inject, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PortfolioProfile } from '../../../../../core/models/portfolio-data.model';
import { PortfolioDataService } from '../../../../../core/services/portfolio-data.service';
import { GlassCardComponent } from '../../../../../shared/ui/glass-card/glass-card.component';
import { IconButtonComponent } from '../../../../../shared/ui/icon-button/icon-button.component';
import { StackComponent } from '../../../../../shared/layout/stack/stack.component';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { ResumePdfService } from '../../../../../core/services/resume-pdf.service';

@Component({
  selector: 'intro-section',
  standalone: true,
  imports: [
    MatIconModule,
    GlassCardComponent,
    IconButtonComponent,
    StackComponent,
    ButtonComponent,
  ],
  templateUrl: './intro-section.component.html',
})
export class IntroSectionComponent {
  private readonly portfolioData = inject(PortfolioDataService);
  private readonly resumeService = inject(ResumePdfService);

  protected readonly basics = this.portfolioData.basics;
  protected readonly profiles = this.portfolioData.profiles;
  protected readonly mailLink = computed(() => {
    const email = this.basics()?.email;
    return email ? `mailto:${email}` : 'mailto:';
  });

  protected svgIconForProfile(profile: PortfolioProfile): string | null {
    const network = profile.network.toLowerCase();

    if (network.includes('github')) {
      return 'brand-github';
    }

    if (network.includes('linkedin')) {
      return 'brand-linkedin';
    }

    return null;
  }

  protected fallbackIconForProfile(profile: PortfolioProfile): string {
    const network = profile.network.toLowerCase();

    if (network.includes('github')) {
      return 'code';
    }

    if (network.includes('linkedin')) {
      return 'groups';
    }

    return 'link';
  }

  protected generateResume() {
    const data = this.portfolioData.getPortfolioData;
    data && this.resumeService.generate(data);
  }
}
