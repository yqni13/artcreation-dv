import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './common/components/navigation/navigation.component';
import { FooterComponent } from './common/components/footer/footer.component';
import { SnackbarComponent } from './common/components/snackbar/snackbar.component';
import { SnackbarMessageService } from './shared/services/snackbar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    CommonModule,
    RouterOutlet, 
    NavigationComponent,
    SnackbarComponent,
    FooterComponent
  ]
})
export class AppComponent {
  title = 'art-gallery-FE-only';

  constructor(protected snackbarService: SnackbarMessageService) {
    //
  }
}
