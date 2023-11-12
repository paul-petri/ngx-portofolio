import {Component, inject} from '@angular/core';
import {AppStore} from './services/app.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  appStore = inject(AppStore);
}
