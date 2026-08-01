import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeService } from '../../../core/theme/theme.service';
import { ThemePreference } from '../../../core/theme/theme.types';

@Component({
  selector: 'ui-theme-toggle',
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    @if (compact()) {
      <button
        mat-icon-button
        [matMenuTriggerFor]="themeMenu"
        class="glass-ghost-button"
        aria-label="Toggle theme"
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
      <button mat-menu-item (click)="setThemePreference('system')">
        <mat-icon>settings_suggest</mat-icon>
        <span>System</span>
      </button>
      <button mat-menu-item (click)="setThemePreference('light')">
        <mat-icon>light_mode</mat-icon>
        <span>Light</span>
      </button>
      <button mat-menu-item (click)="setThemePreference('dark')">
        <mat-icon>dark_mode</mat-icon>
        <span>Dark</span>
      </button>
    </mat-menu>
  `,
})
export class ThemeToggleComponent {
  compact = input(false);
  protected readonly theme = inject(ThemeService);

  protected setThemePreference(preference: ThemePreference): void {
    this.theme.setPreference(preference);
  }
}
