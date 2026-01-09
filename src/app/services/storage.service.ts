import { inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { User } from '../models/login';
import { BaseStock, Stock } from '../models/stock';
import { BET20map } from '../data/bet20map';
import { environment } from '../../environments/environment';
import { StockType } from '../models/stock-type';

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

interface BetIndexJson {
  lastUpdated: string;
  source: string;
  totalWeight: number;
  companies: Array<{
    symbol: string;
    name: string;
    proc: number;
    type: string;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private http = inject(HttpClient);
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

  /**
   * Loads BET index from JSON file (fetched at runtime)
   * Falls back to embedded BET20map if fetch fails
   * Caches result in localStorage with 24-hour TTL
   */
  loadBetIndexFromJson(): Observable<Map<string, BaseStock>> {
    const cachedIndex = this.storage.getItem('betIndex');
    const cachedTimestamp = this.storage.getItem('betIndexTimestamp');
    const now = new Date().getTime();
    const ONE_DAY = 24 * 60 * 60 * 1000;

    // Check if cached index is still fresh (less than 24 hours old)
    if (cachedIndex && cachedTimestamp) {
      const cacheAge = now - parseInt(cachedTimestamp, 10);
      if (cacheAge < ONE_DAY) {
        console.log('📊 Using cached BET index (age:', Math.round(cacheAge / 1000 / 60), 'minutes)');
        return of(new Map<string, BaseStock>(JSON.parse(cachedIndex)));
      }
    }

    // Fetch fresh data from JSON file
    console.log('📥 Fetching BET index from assets/data/bet-index.json...');
    return this.http.get<BetIndexJson>('assets/data/bet-index.json').pipe(
      map((data: BetIndexJson) => {
        console.log('✅ Loaded BET index:', data.companies.length, 'companies, total weight:', data.totalWeight + '%');
        console.log('📅 Last updated:', data.lastUpdated);

        // Convert JSON to Map<string, BaseStock>
        const betIndex = new Map<string, BaseStock>();
        data.companies.forEach((company) => {
          betIndex.set(company.symbol, {
            symbol: company.symbol,
            name: company.name,
            proc: company.proc,
            type: StockType.BET,
            hidden: false,
          });
        });

        // Cache in localStorage
        this.storage.setItem('betIndex', JSON.stringify(Array.from(betIndex.entries())));
        this.storage.setItem('betIndexTimestamp', now.toString());
        this.storage.setItem('betIndexLastUpdated', data.lastUpdated);

        return betIndex;
      }),
      catchError((error) => {
        console.warn('⚠️  Failed to load BET index from JSON, using embedded fallback:', error.message);
        console.log('📦 Using embedded BET20map with', BET20map.size, 'companies');
        return of(BET20map);
      })
    );
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
