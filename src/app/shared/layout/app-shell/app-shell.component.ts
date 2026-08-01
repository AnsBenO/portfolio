import { Component, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'ui-app-shell',
  imports: [NavigationComponent, RouterOutlet],
  templateUrl: './app-shell.component.html',
})
export class AppShellComponent {
  showAmbient = input(true);
}
