import {Component, inject} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { StorageService } from './services/storage.service';

declare const gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  storage = inject(StorageService);

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

        this.storage.checkVersion();
  }
}
