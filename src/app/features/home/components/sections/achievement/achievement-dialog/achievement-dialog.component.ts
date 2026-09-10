import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Achievement } from '../../../../../../core/models/achievement.model';

@Component({
  selector: 'achievement-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="flex items-start justify-between gap-4 p-6 pb-0">
      <div class="flex items-center gap-3">
        <span
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--border-1)/0.35)] bg-[rgba(var(--brand-rgb),0.18)]"
        >
          <mat-icon class="text-[20px] text-[hsl(var(--brand-1))]">emoji_events</mat-icon>
        </span>
        <div>
          <p class="eyebrow">{{ data.project }}</p>
          <h2 mat-dialog-title class="m-0 text-xl font-semibold text-[hsl(var(--text-1))]">
            {{ data.title }}
          </h2>
        </div>
      </div>
      <button
        type="button"
        mat-icon-button
        aria-label="Close dialog"
        [mat-dialog-close]="true"
      >
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="mt-4 text-sm leading-relaxed text-[hsl(var(--text-2))]">
      <p>{{ data.description }}</p>

      @if (data.impact) {
        <div
          class="mt-4 rounded-2xl border border-[rgba(var(--border-rgb),0.28)] bg-[rgba(var(--surface-strong-rgb),0.38)] p-4"
        >
          <p class="eyebrow">Impact</p>
          <p class="mt-1 text-[hsl(var(--text-1))]">{{ data.impact }}</p>
        </div>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button type="button" mat-button class="glass-ghost-button" [mat-dialog-close]="true">
        Close
      </button>
    </mat-dialog-actions>
  `,
})
export class AchievementDialogComponent {
  protected readonly dialogRef = inject(MatDialogRef<AchievementDialogComponent>);
  protected readonly data: Achievement = inject(MAT_DIALOG_DATA);
}
