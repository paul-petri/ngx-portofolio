import { Component, computed, effect, inject, signal } from '@angular/core';
import { BET20map } from 'src/app/data/bet20map';
import { Stock } from 'src/app/models/stock';
import { AppStore } from 'src/app/services/app.store';
import { StocksComponent } from '../stocks/stocks.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxFileDropModule, NgxFileDropEntry } from 'ngx-file-drop';
import { DetailedViewComponent } from '../detailed-view/detailed-view.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  standalone: true,
  imports: [StocksComponent, NgxChartsModule, NgxFileDropModule, DetailedViewComponent, HeaderComponent],
  selector: 'app-portofolio',
  templateUrl: './portofolio.component.html',
  styleUrl: './portofolio.component.scss',
})
export class PortofolioComponent {
  dataset = new Array<any>();
  marketCap = 0;
  chartView = true;
  appState = inject(AppStore);
  loading = true;

  constructor() {
    effect(
      () => {
        if (this.appState.$stocks()) {
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

  dropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.parseCSV(file);
        });
      }
    }
  }

  parseCSV(file: File): void {
    this.appState.mapCSVToStocks(file);
  }

  private setChartData(): void {
   
    this.setStockProcentPerMarket(this.appState.$stocks()!);

    let newStocks = new Array<Stock>();

    this.appState.$stocks()?.forEach((stock: Stock) => {
      const value = this.getStockBuyValue(
        stock,
        BET20map.get(stock.symbol)?.proc || 1
      );

      this.dataset.push({
        name: stock.symbol,
        value,
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
        newStocks.push({
          name: bet.name,
          symbol: bet.symbol,
          qty: 0,
          toBuy: this.getStockBuyValue(bet, bet.proc),
          value: 0,
          proc: 0,
          type: bet.type,
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
