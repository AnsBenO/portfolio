import { Component, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Achievement } from '../../../../../../core/models/achievement.model';
import { AchievementDialogComponent } from '../achievement-dialog/achievement-dialog.component';

@Component({
  selector: 'achievement-card',
  imports: [MatIconModule],
  template: `
    <button
      type="button"
      class="achievement-card group glass-card relative flex w-full flex-col gap-3 rounded-3xl p-5 text-left sm:p-6"
      (click)="openDetails()"
    >
      <div class="flex items-center gap-3">
        <span
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--border-1)/0.35)] bg-[rgba(var(--brand-rgb),0.18)] transition-colors duration-300 group-hover:bg-[rgba(var(--brand-rgb),0.28)]"
        >
          <mat-icon class="text-[20px] text-[hsl(var(--brand-1))]">emoji_events</mat-icon>
        </span>
        <p class="eyebrow">{{ achievement().project }}</p>
      </div>

      <h3 class="text-lg font-semibold text-[hsl(var(--text-1))]">{{ achievement().title }}</h3>

      <p class="line-clamp-2 text-sm leading-relaxed text-[hsl(var(--text-2))]">
        {{ achievement().description }}
      </p>

      @if (achievement().impact) {
        <span class="pill-label mt-1 w-fit">Impact</span>
      }
    </button>
  `,
})
export class AchievementCardComponent {
  private readonly dialog = inject(MatDialog);

  achievement = input.required<Achievement>();

  protected openDetails(): void {
    this.dialog.open(AchievementDialogComponent, {
      data: this.achievement(),
      panelClass: 'glass-dialog-panel',
      backdropClass: 'glass-dialog-backdrop',
      maxWidth: '480px',
      autoFocus: 'first-tabbable',
    });
  }
}
