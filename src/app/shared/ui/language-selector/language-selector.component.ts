import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { isLocale, Locale, LocalizationService } from '../../../core/i18n/localization.service';

@Component({
  selector: 'ui-language-selector',
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <button
      mat-stroked-button
      type="button"
      class="language-trigger"
      [matMenuTriggerFor]="languageMenu"
      [attr.aria-label]="localization.text('a11y.changeLanguage')"
      [attr.title]="localization.text('a11y.changeLanguage')"
    >
      <mat-icon aria-hidden="true">translate</mat-icon>
      <span>{{ localization.locale().toUpperCase() }}</span>
    </button>

    <mat-menu #languageMenu="matMenu" class="glass-menu-panel">
      @for (option of localization.localeOptions; track option.code) {
        <button
          mat-menu-item
          type="button"
          role="menuitemradio"
          [attr.aria-checked]="localization.locale() === option.code"
          (click)="selectLocale(option.code)"
        >
          <mat-icon aria-hidden="true">
            {{ localization.locale() === option.code ? 'check' : 'translate' }}
          </mat-icon>
          <span>{{ option.label }}</span>
          <span class="language-code">{{ option.code.toUpperCase() }}</span>
        </button>
      }
    </mat-menu>
  `,
  styles: `
    .language-trigger {
      min-width: 0;
      padding-inline: 0.5rem;
      gap: 0.25rem;
      border-color: rgba(var(--border-rgb), 0.45);
      color: hsl(var(--text-1));
      background: rgba(var(--surface-strong-rgb), 0.3);
    }

    .language-trigger mat-icon {
      margin: 0;
    }

    .language-code {
      margin-inline-start: auto;
      padding-inline-start: 1.5rem;
      color: hsl(var(--text-2));
      font-size: 0.75rem;
    }
  `,
})
export class LanguageSelectorComponent {
  protected readonly localization = inject(LocalizationService);

  protected selectLocale(locale: Locale): void {
    if (isLocale(locale)) {
      this.localization.setLocale(locale);
    }
  }
}
