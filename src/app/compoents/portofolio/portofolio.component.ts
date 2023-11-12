import {Component, effect, inject} from '@angular/core';
import {BET20map} from 'src/app/data/bet20map';
import {Stock} from 'src/app/models/stock';
import {AppStore} from 'src/app/services/app.store';

@Component({
  selector: 'app-portofolio',
  templateUrl: './portofolio.component.html',
  styleUrls: ['./portofolio.component.scss'],
})
export class PortofolioComponent {
  title = 'ng-portofolio';
  dataset = new Array<any>();
  marketCap = 0;
  appState = inject(AppStore);
  loading = true;

  constructor() {
    effect(() => {
      if (this.appState.$stocks()) {
        this.setChartData();
      }
    });
  }

  logOut(): void {
    this.appState.logOut();
  }

  private setChartData(): void {
    this.marketCap =
      this.appState
        .$stocks()
        ?.reduce((sum: number, stock: Stock) => sum + (stock?.value || 0), 0) ||
      0;

    this.setStockProcentPerMarket(this.appState.$stocks()!);

    this.appState.$stocks()?.forEach((stock: Stock) => {
      const value = this.getStockBuyValue(
        stock,
        BET20map.get(stock.symbol)?.proc || 1,
      );
      this.dataset.push({
        name: stock.symbol,
        value,
      });
    });
    this.addNonExistingStocks();

    this.loading = false;
  }

  private addNonExistingStocks(): void {
    for (let key of BET20map.keys()) {
      const exists = this.appState
        .$stocks()
        ?.some((stock: Stock) => stock.symbol === key);

      if (!exists) {
        const bet = BET20map.get(key)!;
        this.dataset.push({
          name: bet.symbol,
          value: this.getStockBuyValue(bet, bet.proc),
        });
      }
    }
  }

  private getStockBuyValue(stock: Stock, betProc: number): number {
    if (!stock.value || !stock.cProc) {
      return (betProc / 100) * this.marketCap;
    }

    const toBuyProc = betProc - stock.cProc;

    return (toBuyProc * stock.value) / stock.cProc;
  }

  private setStockProcentPerMarket(stocks: Array<Stock>): void {
    stocks
      .filter((stock: Stock) => stock.value)
      .forEach((stock: Stock) => {
        stock.cProc = (100 * stock.value!) / this.marketCap;
      });
  }
}
