import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BET20map } from 'src/app/data/bet20map';
import { BaseStock, Stock } from 'src/app/models/stock';
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
  private readonly appStore = inject(AppStore);
  private readonly dialogRef = inject(MatDialogRef<IndexModalComponent>);

  protected readonly stocks = signal<BaseStock[]>(this.initializeStocks());
  protected readonly visibleStocks = computed(() =>
    this.stocks().filter((stock) => !stock.hidden)
  );
  protected readonly totalPercentage = computed(() =>
    this.visibleStocks().reduce((acc, curr) => acc + curr.proc, 0)
  );

  private initializeStocks(): BaseStock[] {
    const currentIndex = this.appStore.$betIndex();
    return Array.from(currentIndex.values()).map((stock) => ({
      symbol: stock.symbol,
      proc: stock.proc,
      name: stock.name,
      type: stock.type,
      hidden: stock.hidden ?? false,
    }));
  }

  protected removeStock(symbol: string): void {
    this.stocks.update((stocks) => {
      const stockToHide = stocks.find((stock) => stock.symbol === symbol);
      if (!stockToHide) return stocks;

      stockToHide.hidden = true;
      const updatedStocks = [...stocks];

      // Recalculate percentages only for visible stocks
      const visibleStocks = updatedStocks.filter((s) => !s.hidden);
      const totalProc = visibleStocks.reduce((acc, curr) => acc + curr.proc, 0);

      return updatedStocks.map((stock) => ({
        ...stock,
        proc: !stock.hidden
          ? stock.proc + (stock.proc / totalProc) * stockToHide.proc
          : stock.proc,
      }));
    });
  }

  protected saveIndex(): void {
    const betMap = new Map<string, BaseStock>();
    // Save all stocks including hidden ones
    this.stocks().forEach((stock) => {
      betMap.set(stock.symbol, stock);
    });
    this.appStore.setBetIndex(betMap);
    // Close the modal after saving
    this.dialogRef.close();
  }

  protected resetIndex(): void {
    this.stocks.set(
      Array.from(BET20map.values()).map((stock) => ({
        symbol: stock.symbol,
        proc: stock.proc,
        name: stock.name,
        type: stock.type,
        hidden: false,
      }))
    );
  }
}
