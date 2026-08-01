import { inject, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Injectable({ providedIn: 'root' })
export class BrandIconService {
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);

  constructor() {
    this.iconRegistry.addSvgIcon(
      'brand-github',
      this.sanitizer.bypassSecurityTrustResourceUrl('icons/github-mark.svg'),
    );
    this.iconRegistry.addSvgIcon(
      'brand-linkedin',
      this.sanitizer.bypassSecurityTrustResourceUrl('icons/linkedin-mark.svg'),
    );
  }
}
