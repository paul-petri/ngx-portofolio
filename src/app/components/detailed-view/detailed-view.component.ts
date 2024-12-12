import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FilterType } from 'src/app/models/filter-type.enum';
import { Stock } from 'src/app/models/stock';
import { AppStore } from 'src/app/services/app.store';
import { FormsModule } from '@angular/forms';
import { GeneralInfo } from 'src/app/models/general-info';

declare var gtag: any;

@Component({
  selector: 'app-detailed-view',
  standalone: true,
  templateUrl: './detailed-view.component.html',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailedViewComponent {
  @Input() marketCap = 0;

  readonly filterType = FilterType;

  sortByBuy = signal(false);
  ddVisible = signal(false);
  selectedFilter = signal(FilterType.ALL);
  detailedStocks = signal(new Array<Stock>());
  generalInfo = signal<GeneralInfo>({
    totalToBuy: 0,
    totalOver: 0,
    noOwnings: 0,
  });

  filterSrocks = computed(() => {
    const filter = this.selectedFilter();
    const stocks = this.detailedStocks();

    if (this.sortByBuy()) {
      stocks.sort((a, b) => b.toBuy! - a.toBuy!);
    } else {
      stocks.sort((a, b) => b.betProc! - a.betProc!);
    }

    if (filter === FilterType.ALL) {
      return stocks;
    }

    return stocks.filter((stock: Stock) =>
      filter === FilterType.TO_BUY ? stock.toBuy! > 0 : stock.toBuy! < 0
    );
  });

  appState = inject(AppStore);

  constructor() {
    effect(
      () => {
        if (this.appState.$stocks()) {
          this.setStocks();
        }
      },
      { allowSignalWrites: true }
    );
  }

  toggleDD(): void {
    this.ddVisible.set(!this.ddVisible());
    gtag('event', 'DETAILED_VIEW', {
      event_category: 'BUTTON_CLICK',
      event_label: 'DETAILED_VIEW',
      value: 'DETAILED VIEW CLICKED',
    });
  }

  selectFilter(filter: FilterType): void {
    this.selectedFilter.set(filter);
    this.toggleDD();
  }

  private setStocks(): void {
    this.detailedStocks.set([]);
    let newStocks = new Array<Stock>();

    this.appState.$stocks()?.forEach((stock: Stock) => {
      const value = this.getStockBuyValue(
        stock,
        this.appState.$betIndex().get(stock.symbol)?.proc || 1
      );

      const clone = { ...stock };
      clone.toBuy = value;

      newStocks.push(clone);
    });

    this.detailedStocks.set(newStocks);
    // this.addNonExistingStocks();
    this.setGeneralInfo();
  }

  private addNonExistingStocks(): void {
    let newStocks: Stock[] = [];

    for (let key of this.appState.$betIndex().keys()) {
      const exists = this.appState
        .$stocks()
        ?.some((stock: Stock) => stock.symbol === key);

      if (!exists) {
        const bet = this.appState.$betIndex().get(key)!;
        newStocks.push({
          name: bet.name,
          symbol: bet.symbol,
          qty: 0,
          toBuy: this.getStockBuyValue(bet as any, bet.proc),
          value: 0,
          proc: 0,
          type: bet.type,
          betProc: bet.proc,
        });
      }
    }
    this.detailedStocks.update((stocks) => stocks.concat(newStocks));
  }

  private getStockBuyValue(stock: Stock, betProc: number): number {
    if (!stock.value || !stock.cProc) {
      return (betProc / 100) * this.marketCap;
    }

    const toBuyProc = betProc - stock.cProc;
    const toBuy = (toBuyProc * stock.value) / stock.cProc;

    return toBuy + (toBuy * stock.betProc!) / 100;
  }

  private setGeneralInfo(): void {
    let totalToBuy = 0;
    let totalOver = 0;
    let noOwnings = 0;

    this.detailedStocks().forEach((stock: Stock) => {
      if (stock.qty! === 0) {
        noOwnings++;
      }

      if (stock.toBuy! > 0) {
        totalToBuy += stock.toBuy!;
      } else {
        totalOver += stock.toBuy!;
      }
    });

    this.generalInfo.set({ totalToBuy, totalOver, noOwnings });
  }
}
