import {inject, Injectable, InjectionToken, PLATFORM_ID} from '@angular/core';
import {Observable, of} from 'rxjs';
import {User} from '../models/login';
import { Stock } from '../models/stock';

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'window local storage object',
  {
    providedIn: 'root',
    factory: () => {
      return inject(PLATFORM_ID) === 'browser'
        ? window.localStorage
        : ({} as Storage);
    },
  },
);

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  storage = inject(LOCAL_STORAGE);

  loadUser(): Observable<User | undefined> {
    const user = this.storage.getItem('user');
    return of(user ? (JSON.parse(user) as User) : undefined);
  }

  saveUser(login: User) {
    this.storage.setItem('user', JSON.stringify(login));
  }

  removeUser(): void {
    this.storage.removeItem('user');
  }

  clearData(): void {
    this.storage.removeItem('user');
    this.storage.removeItem('stocks');
  }

  savePortofolio(stocks: Array<Stock>): void {
    this.storage.setItem('stocks', JSON.stringify(stocks));
  }

  getPorfotolio(): Array<Stock> | undefined {
    const stocks = this.storage.getItem('stocks');
    return stocks ? (JSON.parse(stocks) as Array<Stock>) : undefined;
  }
}
