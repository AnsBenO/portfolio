import { Component, inject } from '@angular/core';
import { BrandIconService } from './core/theme/brand-icon.service';
import { AppShellComponent } from './shared/layout/app-shell/app-shell.component';

@Component({
  selector: 'app-root',
  imports: [AppShellComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly brandIconService = inject(BrandIconService);
}
