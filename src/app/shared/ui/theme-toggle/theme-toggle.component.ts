import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeService } from '../../../core/theme/theme.service';
import { THEME_PALETTES, ThemePalette, ThemePreference } from '../../../core/theme/theme.types';

@Component({
  selector: 'ui-theme-toggle',
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    @if (compact()) {
      <button
        mat-icon-button
        [matMenuTriggerFor]="themeMenu"
        class="glass-ghost-button"
        aria-label="Open appearance settings"
      >
        <mat-icon>contrast</mat-icon>
      </button>
    } @else {
      <button mat-button [matMenuTriggerFor]="themeMenu" class="glass-ghost-button">
        <mat-icon>contrast</mat-icon>
        Theme: {{ theme.currentTheme() }}
      </button>
    }

    <mat-menu #themeMenu="matMenu" class="glass-menu-panel">
      <button
        mat-menu-item
        role="menuitemradio"
        [attr.aria-checked]="theme.preference() === 'system'"
        (click)="setThemePreference('system')"
      >
        <mat-icon>{{ theme.preference() === 'system' ? 'check' : 'settings_suggest' }}</mat-icon>
        <span>System</span>
      </button>
      <button
        mat-menu-item
        role="menuitemradio"
        [attr.aria-checked]="theme.preference() === 'light'"
        (click)="setThemePreference('light')"
      >
        <mat-icon>{{ theme.preference() === 'light' ? 'check' : 'light_mode' }}</mat-icon>
        <span>Light</span>
      </button>
      <button
        mat-menu-item
        role="menuitemradio"
        [attr.aria-checked]="theme.preference() === 'dark'"
        (click)="setThemePreference('dark')"
      >
        <mat-icon>{{ theme.preference() === 'dark' ? 'check' : 'dark_mode' }}</mat-icon>
        <span>Dark</span>
      </button>
      <hr class="mx-3 my-2 border-0 border-t border-[hsl(var(--border-1)/0.35)]" />
      @for (palette of palettes; track palette.id) {
        <button
          mat-menu-item
          role="menuitemradio"
          [attr.aria-checked]="theme.palette() === palette.id"
          (click)="setPalette(palette.id)"
        >
          <mat-icon>{{ theme.palette() === palette.id ? 'check' : palette.icon }}</mat-icon>
          <span>{{ palette.label }} palette</span>
        </button>
      }
    </mat-menu>
  `,
})
export class ThemeToggleComponent {
  compact = input(false);
  protected readonly theme = inject(ThemeService);
  protected readonly palettes = THEME_PALETTES;

  protected setThemePreference(preference: ThemePreference): void {
    this.theme.setPreference(preference);
  }

  protected setPalette(palette: ThemePalette): void {
    this.theme.setPalette(palette);
  }
}
