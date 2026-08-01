import { Component, computed, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

type ButtonVariant = 'primary' | 'secondary';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'glass-cta-button',
  secondary: 'glass-ghost-button',
};

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, NgTemplateOutlet],
  template: `
    <ng-template #content>
      <span class="inline-flex items-center justify-center align-middle gap-2 leading-none">
        <ng-content></ng-content>
      </span>
    </ng-template>

    @if (useRouterLink()) {
      <a matButton [class]="buttonClass()" [routerLink]="link()">
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </a>
    } @else if (useHref()) {
      <a
        matButton
        [class]="buttonClass()"
        [attr.href]="link()"
        [attr.target]="external() ? '_blank' : null"
      >
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </a>
    } @else {
      <button matButton [attr.type]="type()" [class]="buttonClass()">
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </button>
    }
  `,
})
export class ButtonComponent {
  type = input<'button' | 'submit'>('button');
  variant = input<ButtonVariant>('primary');
  link = input<string | null>(null);
  external = input(false);

  protected readonly buttonClass = computed(() => {
    return ['glass-button', VARIANT_CLASS[this.variant()]].join(' ');
  });
  protected readonly isHashLink = computed(() => this.link()?.startsWith('#') ?? false);
  protected readonly useRouterLink = computed(
    () => Boolean(this.link()) && !this.external() && !this.isHashLink(),
  );
  protected readonly useHref = computed(
    () => Boolean(this.link()) && (this.external() || this.isHashLink()),
  );
}
