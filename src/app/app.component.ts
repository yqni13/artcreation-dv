import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './common/components/navigation/navigation.component';
import { ThemeOption } from './shared/enums/theme-option.enum';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet, 
    NavigationComponent,
  ]
})
export class AppComponent {
  title = 'art-gallery-FE-only';

  protected theme: string;

  constructor() {
    this.theme = String(ThemeOption.lightMode);
  }
}
