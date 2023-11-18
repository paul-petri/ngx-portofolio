import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStore } from 'src/app/services/app.store';
import { Stock } from 'src/app/models/stock';

@Component({
  selector: 'app-stocks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StocksComponent {
  appState = inject(AppStore);

  get stocks(): Stock[] | undefined {
    return this.appState.$stocks();
  }
}
