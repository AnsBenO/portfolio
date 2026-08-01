import { Component, computed, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/theme/theme.service';

type IconButtonSize = 'sm' | 'md';

const SIZE_CLASS: Record<IconButtonSize, string> = {
  sm: 'h-9 w-9 text-sm',
  md: 'h-10 w-10 text-base',
};

@Component({
  selector: 'ui-icon-button',
  imports: [RouterLink, MatIconModule],
  styles: `
    .icon-invert {
      color: white;
    }
  `,
  template: `
    @if (useRouterLink()) {
      <a [class]="buttonClass()" [attr.aria-label]="ariaLabel()" [routerLink]="link()">
        @if (svgIcon()) {
          <mat-icon [svgIcon]="svgIcon()!"></mat-icon>
        } @else {
          <mat-icon>{{ icon() }}</mat-icon>
        }
      </a>
    } @else if (useHref()) {
      <a
        [class]="buttonClass()"
        [attr.aria-label]="ariaLabel()"
        [attr.href]="link()"
        [attr.target]="external() ? '_blank' : null"
      >
        @if (svgIcon()) {
          <mat-icon [svgIcon]="svgIcon()!" [class.icon-invert]="isGithubDarkIcon()"></mat-icon>
        } @else {
          <mat-icon>{{ icon() }}</mat-icon>
        }
      </a>
    } @else {
      <button type="button" [attr.aria-label]="ariaLabel()" [class]="buttonClass()">
        @if (svgIcon()) {
          <mat-icon [svgIcon]="svgIcon()!" [class.icon-invert]="isGithubDarkIcon()"></mat-icon>
        } @else {
          <mat-icon>{{ icon() }}</mat-icon>
        }
      </button>
    }
  `,
})
export class IconButtonComponent {
  private readonly themeService = inject(ThemeService);
  ariaLabel = input.required<string>();
  size = input<IconButtonSize>('md');
  link = input<string | null>(null);
  external = input(false);
  icon = input('link');
  svgIcon = input<string | null>(null);

  protected readonly isGithubDarkIcon = computed(
    () => this.svgIcon() === 'brand-github' && this.themeService.currentTheme() === 'dark',
  );
  protected readonly buttonClass = computed(() => {
    return ['glass-icon-button', SIZE_CLASS[this.size()]].join(' ');
  });

  protected readonly isHashLink = computed(() => this.link()?.startsWith('#') ?? false);
  protected readonly useRouterLink = computed(
    () => Boolean(this.link()) && !this.external() && !this.isHashLink(),
  );
  protected readonly useHref = computed(
    () => Boolean(this.link()) && (this.external() || this.isHashLink()),
  );
}
