import {inject, Injectable, InjectionToken, PLATFORM_ID} from '@angular/core';
import {Observable, of} from 'rxjs';
import {User} from '../models/login';

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
}
