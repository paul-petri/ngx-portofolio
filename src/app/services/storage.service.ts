import { inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/login';
import { BaseStock, Stock } from '../models/stock';
import { BET20map } from '../data/bet20map';
import { environment } from '../../environments/environment';

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'window local storage object',
  {
    providedIn: 'root',
    factory: () => {
      return inject(PLATFORM_ID) === 'browser'
        ? window.localStorage
        : ({} as Storage);
    },
  }
);

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  storage = inject(LOCAL_STORAGE);

  checkVersion(): void {
    const currentVersion = environment.appVersion;
    const storedVersion = localStorage.getItem('appVersion');

    if (!currentVersion || currentVersion !== storedVersion) {
      this.updatePortofolio();
    }
  }

  updatePortofolio(): void {
    const betIndex = this.getBetIndex();
    const newIndex = new Map<string, BaseStock>();
    BET20map.forEach((stock: BaseStock) => {
      if (!betIndex.has(stock.symbol)) {
        newIndex.set(stock.symbol, { ...stock, hidden: false });
      } else {
        const betStock = betIndex.get(stock.symbol)!;
        newIndex.set(stock.symbol, { ...stock, hidden: betStock.hidden });
      }
    });

    this.storage.setItem('appVersion', environment.appVersion);
    this.saveBetIndex(newIndex);
  }

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

  savePortofolio(stocks: Array<BaseStock>): void {
    this.storage.setItem('stocks', JSON.stringify(stocks));
  }

  getPorfotolio(): Array<Stock> | undefined {
    const storedStocks = this.storage.getItem('stocks');
    const stocks = storedStocks
      ? this.checkAgainstIndex(JSON.parse(storedStocks))
      : [];
    return stocks;
  }

  saveBetIndex(betIndex: Map<string, BaseStock>): void {
    this.storage.setItem(
      'betIndex',
      JSON.stringify(Array.from(betIndex.entries()))
    );
  }

  getBetIndex(): Map<string, BaseStock> {
    const betIndex = this.storage.getItem('betIndex');
    return betIndex ? new Map(JSON.parse(betIndex)) : BET20map;
  }

  protected checkAgainstIndex(stocks: Array<Stock>): Array<Stock> {
    const betIndex = this.getBetIndex();

    if (!betIndex) {
      return stocks;
    }

    const visibleStockList = new Array<Stock>();
    stocks.forEach((stock: Stock) => {
      const betStock = betIndex.get(stock.symbol);
      if (!betStock?.hidden) {
        visibleStockList.push(stock);
      }
    });

    return visibleStockList;
  }
}
