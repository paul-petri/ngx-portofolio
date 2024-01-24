import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { BET20map } from 'src/app/data/bet20map';
import { Stock } from 'src/app/models/stock';
import { AppStore } from 'src/app/services/app.store';

@Component({
  selector: 'app-index-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './index-modal.component.html',
  styleUrl: './index-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexModalComponent {
  stocks = new Array<Stock>();

  appState = inject(AppStore);

  constructor() {
    for (let [_, value] of this.appState.$betIndex()) {
       this.stocks.push({ symbol: value.symbol, proc: value.proc, name: value.name, type: value.type, qty: 0});
    };
  }

  removeStock(index: number): void {
    const removedStock = this.stocks[index];

    this.stocks.splice(index, 1);

    this.recalculate(removedStock);
  }

  saveIndex(): void {
    const betMap = new Map<string, Stock>();

    this.stocks.forEach(stock => {
      betMap.set(stock.symbol, stock);
    });
    this.appState.setBetIndex(betMap);
  } 

  resetIndex(): void {
    this.stocks = [];
    for (let [_, value] of BET20map) {
        this.stocks.push({ symbol: value.symbol, proc: value.proc, name: value.name, type: value.type, qty: 0});
    };
  }

  recalculate(removedStock: Stock): void {
    const totalPercentage = this.stocks.reduce((acc, curr) => acc + curr.proc, 0);;

    this.stocks.forEach(stock => {
        const redistributionShare = stock.proc / totalPercentage;
        stock.proc += redistributionShare * removedStock.proc;
    });
  }
}
