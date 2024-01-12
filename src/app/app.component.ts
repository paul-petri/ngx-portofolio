import {Component, inject} from '@angular/core';
import {AppStore} from './services/app.store';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

declare const gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  appStore = inject(AppStore);

  constructor(private router: Router) {
       /** START : Code to Track Page View using gtag.js */
       this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
         gtag('event', 'page_view', {
            page_path: event.urlAfterRedirects
         })
        })
        /** END : Code to Track Page View  using gtag.js */
  }
}
