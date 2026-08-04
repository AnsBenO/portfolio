import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TechnologyChipComponent } from '../../../../../../shared/ui/technology-chip/technology-chip.component';
import { Project } from '../../../../../../core/models/project.model';

@Component({
  selector: 'content-project-card',
  imports: [MatIconModule, TechnologyChipComponent],
  template: `
    <article class="glass-card rounded-3xl p-5 sm:p-6">
      @if (project().thumbnailUrl) {
        <div class="mb-5 overflow-hidden rounded-2xl border border-[rgba(var(--border-rgb),0.35)]">
          <img
            [src]="project().thumbnailUrl"
            [alt]="project().title + ' thumbnail'"
            loading="lazy"
            class="h-44 w-full object-cover object-center sm:h-52"
          />
        </div>
      }

      <div class="flex items-start justify-between gap-4">
        <div>
          @if (project().category) {
            <p class="eyebrow">{{ project().category }}</p>
          }
          <h3 class="mt-1 text-xl font-semibold tracking-tight text-[hsl(var(--text-1))]">
            {{ project().title }}
          </h3>
          @if (project().summary) {
            <p class="mt-2 text-sm text-[hsl(var(--text-2))]">{{ project().summary }}</p>
          }
        </div>
        @if (project().featured) {
          <span class="featured-pill">Featured</span>
        }
      </div>

      @if (project().description) {
        <p class="mt-4 text-sm leading-relaxed text-[hsl(var(--text-2))]">
          {{ project().description }}
        </p>
      }

      @if (project().technologies.length > 0) {
        <div class="mt-4 flex flex-wrap gap-2">
          @for (technology of project().technologies; track technology) {
            <ui-technology-chip [label]="technology"></ui-technology-chip>
          }
        </div>
      }

      <div class="mt-5 flex flex-wrap gap-2">
        @if (project().liveUrl) {
          <a
            class="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-[hsl(var(--text-1))] hover:bg-[rgba(var(--surface-strong-rgb),0.52)]"
            [href]="project().liveUrl"
            target="_blank"
            rel="noreferrer"
          >
            Live
            <mat-icon class="h-4! w-4! text-base!">north_east</mat-icon>
          </a>
        }
        @if (project().sourceUrl) {
          <a
            class="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-[hsl(var(--text-1))] hover:bg-[rgba(var(--surface-strong-rgb),0.52)]"
            [href]="project().sourceUrl"
            target="_blank"
            rel="noreferrer"
          >
            Source
            <mat-icon class="h-4! w-4! text-base!">code</mat-icon>
          </a>
        }
      </div>
    </article>
  `,
})
export class ProjectCardComponent {
  project = input.required<Project>();
}
