import { Component, effect, inject } from '@angular/core';
import { Stock } from 'src/app/models/stock';
import { AppStore } from 'src/app/services/app.store';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DetailedViewComponent } from '../detailed-view/detailed-view.component';
import { HeaderComponent } from '../header/header.component';
import { MatDialog } from '@angular/material/dialog';
import { UploadModalComponent } from '../modals/upload-modal/upload-modal.component';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    NgxChartsModule,
    DetailedViewComponent,
    HeaderComponent,
  ],
  selector: 'app-portofolio',
  templateUrl: './portofolio.component.html',
  styleUrl: './portofolio.component.scss',
})
export class PortofolioComponent {
  dataset = new Array<any>();
  marketCap = 0;
  chartView = true;
  loading = true;

  appState = inject(AppStore);
  dialog = inject(MatDialog);

  constructor() {
    effect(
      () => {
        // Trigger recalculation when stocks OR betIndex changes
        const stocks = this.appState.$stocks();
        const betIndex = this.appState.$betIndex();
        if (stocks) {
          this.marketCap =
            this.appState
              .$stocks()
              ?.reduce(
                (sum: number, stock: Stock) => sum + (stock?.value || 0),
                0
              ) || 0;

          this.dataset = [];
          this.setChartData();
        }
      },
      { allowSignalWrites: true }
    );
  }

  stocks(): Array<Stock> {
    return this.appState.$stocks() || [];
  }

  uploadFileModal(): void {
    this.dialog.open(UploadModalComponent);
  }

  private setChartData(): void {
    this.setStockProcentPerMarket(this.appState.$stocks()!);

    let newStocks = new Array<Stock>();

    this.appState.$stocks()?.forEach((stock: Stock) => {
      const value = this.getStockBuyValue(
        stock.symbol,
        this.appState.$betIndex().get(stock.symbol)?.proc || 1
      );

      this.dataset.push({
        name: stock.symbol,
        value: Math.trunc(value),
      });
      const clone = { ...stock };
      clone.toBuy = value;

      newStocks.push(clone);
    });

    this.addNonExistingStocks();
    this.loading = false;
  }

  private addNonExistingStocks(): void {
    let newStocks: Stock[] = [];

    for (let key of this.appState.$betIndex().keys()) {
      const exists = this.appState
        .$stocks()
        ?.some((stock: Stock) => stock.symbol === key);

      if (!exists) {
        const bet = this.appState.$betIndex().get(key)!;
        this.dataset.push({
          name: bet.symbol,
          value: Math.trunc(this.getStockBuyValue(bet.symbol, bet.proc)),
        });
        newStocks.push({
          name: bet.name,
          betProc: bet.proc,
          symbol: bet.symbol,
          qty: 0,
          toBuy: this.getStockBuyValue(bet.symbol, bet.proc),
          value: 0,
          proc: 0,
          type: bet.type,
        });
      }
    }
  }

  private getStockBuyValue(stockSymbol: string, betProc: number): number {
    const stock = this.appState
      .$stocks()
      ?.find((stock: Stock) => stock.symbol === stockSymbol);
    if (!stock?.value || !stock.cProc) {
      return -1 * (betProc / 100) * this.marketCap;
    }

    const toBuyProc = betProc - stock.cProc;
    const toBuy = (toBuyProc * stock.value) / stock.cProc;

    return -1 * (toBuy + (toBuy * stock.betProc!) / 100);
  }

  private setStockProcentPerMarket(stocks: Array<Stock>): void {
    stocks
      .filter((stock: Stock) => stock.value)
      .forEach((stock: Stock) => {
        stock.cProc = (100 * stock.value!) / this.marketCap;
      });
  }
}
