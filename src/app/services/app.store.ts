import { Injectable, inject, signal, effect } from '@angular/core';
import { Portofolio } from '../models/portofolio';
import { Message } from '../models/message';
import { Command } from '../models/commands';
import { BaseStock, Stock } from '../models/stock';
import { StorageService } from './storage.service';
import { User } from '../models/login';
import { Router } from '@angular/router';
import { BET20map } from '../data/bet20map';
import { StockType } from '../models/stock-type';
import { myPortofolio } from '../data/mine';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AppStore {
  private storage = inject(StorageService);
  private toastr = inject(ToastrService);

  private websocket!: WebSocket;
  private evaluationIDX = 16;

  private readonly state = {
    $loading: signal<boolean>(true),
    $user: signal<User | undefined>(undefined),
    $stocks: signal<Array<Stock> | undefined>(undefined),
    $loginError: signal<string>(''),
    $betIndex: signal<Map<string, BaseStock>>(BET20map),
  };

  readonly $user = this.state.$user.asReadonly();
  readonly $stocks = this.state.$stocks.asReadonly();
  readonly $loginError = this.state.$loginError.asReadonly();
  readonly $betIndex = this.state.$betIndex.asReadonly();

  constructor(private router: Router) {
    this.initIndex();
    this.initWebSocket();
    this.onLoginChanges();
    this.checkStocks();
  }

  checkStocks(): void {
    if (!this.$stocks()?.values() && this.storage.getPorfotolio()) {
      this.state.$stocks.set(this.storage.getPorfotolio());
      this.router.navigate(['portofolio']);
    }
  }

  logOut(): void {
    this.storage.clearData();
    this.setUser(undefined);
    this.state.$stocks.set(undefined);
    this.router.navigate(['/login']);
  }

  getStocks(): Array<Stock> | undefined {
    return this.$stocks();
  }

  getPortofolio(): void {
    this.websocket.send(
      JSON.stringify({ cmd: Command.PORTOFOLIO, prm: { data: null } })
    );
  }

  setUser(user: User | undefined): void {
    this.state.$user.set(user);
  }

  setBetIndex(betIndex: Map<string, BaseStock>): void {
    this.state.$betIndex.set(betIndex);
    this.storage.saveBetIndex(betIndex);
    this.updateStocksOnBetIndexChange();
  }

  setLoginError(error: string): void {
    this.state.$loginError.set(error);
  }

  logIn(): void {
    this.sendMessage({
      cmd: 'login',
      prm: {
        coduser: this.$user()?.user,
        parola: this.$user()?.password,
        demo: this.$user()?.demo || false,
      },
    });
  }

  mapMessageToLogin(message: any): User {
    return {
      user: message.prm.coduser,
      password: message.prm.parola,
      demo: message.prm.demo,
    };
  }

  mapCSVToStocks(csv: File): void {
    const myPortofolio: Array<Stock> = [];
    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result;
      const lines = text?.toString().split('\n');
      for (const { idx, line } of lines!.map((line, idx) => ({ idx, line }))) {
        const data = line.split('\t');
        if (idx === 1) {
          this.evaluationIDX = data.indexOf('eval');
          if (this.evaluationIDX === -1) {
            this.toastr.error('CSV invalid', 'Eroare');
            return;
          }
        } else if (idx > 1) {
          const betStock = this.$betIndex().get(data[0]);
          if (betStock) {
            myPortofolio.push({
              symbol: data[0],
              name: betStock.name,
              proc: 1,
              qty: Number(data[2]),
              value: Number(data[this.evaluationIDX]),
              type: StockType.BET,
              betProc: betStock.proc,
            });
          }
        }
      }

      myPortofolio.sort(
        (a: Stock, b: Stock) => (b.betProc || 0) - (a.betProc || 0)
      );

      this.state.$stocks.set(myPortofolio);
      this.storage.savePortofolio(myPortofolio);
    };
    reader.readAsText(csv);
  }

  mapPortofolio(data: Portofolio): void {
    const myPortofolio: Array<Stock> = [];

    data.Symbol.forEach((symbol: string, idx: number) => {
      const betStock = this.$betIndex().get(symbol);
      if (betStock) {
        myPortofolio.push({
          symbol,
          name: betStock.name,
          proc: 1,
          qty: data.Quantity[idx],
          value: data.MarketPrice[idx] * data.Quantity[idx],
          type: StockType.BET,
          betProc: betStock.proc,
        });
      }
    });
    this.state.$stocks.set(myPortofolio);
    this.router.navigate(['/portofolio']);
  }

  private updateStocksOnBetIndexChange(): void {
    const newStocks = new Array<Stock>();
    this.$stocks()?.forEach((stock: Stock) => {
      const betStock = this.$betIndex().get(stock.symbol);
      if (betStock && !betStock.hidden) {
        newStocks.push({
          symbol: stock.symbol,
          name: betStock.name,
          proc: 1,
          qty: stock.qty,
          value: stock.value,
          type: StockType.BET,
          betProc: betStock.proc,
        });
      }
    });
    this.state.$stocks.set(newStocks);
    this.storage.savePortofolio(newStocks);
  }

  private onLoginChanges(): void {
    effect(
      () => {
        if (this.$user()?.user && this.$user()?.password) {
          if (this.$user()?.demo) {
            this.logInDemo();
            return;
          }
          this.logIn();
        }
      },
      { allowSignalWrites: true }
    );
  }

  private initIndex(): void {
    // Load BET index from JSON (runtime), with fallback to embedded data
    this.storage.loadBetIndexFromJson().subscribe({
      next: (betIndex) => {
        const filteredIndex = new Map(
          Array.from(betIndex.entries()).filter(([_, stock]) => !stock.hidden)
        );
        this.state.$betIndex.set(filteredIndex);
      },
      error: (err) => {
        console.error('Failed to load BET index:', err);
        // Fallback to stored index or embedded BET20map
        const storedIndex = this.storage.getBetIndex();
        if (storedIndex) {
          const filteredIndex = new Map(
            Array.from(storedIndex.entries()).filter(([_, stock]) => !stock.hidden)
          );
          this.state.$betIndex.set(filteredIndex);
        }
      }
    });
  }

  private initWebSocket(): void {
    this.websocket = new WebSocket('wss://api.tradeville.ro', ['apitv']);
    this.websocket.onopen = () => this.onConnectionOpen();
    this.websocket.onerror = () => console.log('eroare la conectare');
    this.websocket.onmessage = (e: any) => this.onMessageReceived(e);
  }

  private sendMessage(msg: object) {
    if (this.websocket.readyState != 1) {
      this.state.$loginError.set('no server connection');
      return;
    }
    this.websocket.send(JSON.stringify(msg));
  }

  private onMessageReceived(response: Message<any> | undefined) {
    if (!response?.data) return;

    let message: Message<any> | undefined;

    try {
      message = JSON.parse(response.data);
    } catch (e) {}

    console.log('--- socket message ---');
    console.log(response);
    console.log(message);

    if (message?.cmd === Command.LOGIN) {
      if (!message.err) {
        this.storage.saveUser(this.mapMessageToLogin(message));
        this.getPortofolio();
      } else {
        this.state.$loginError.set(message.err);
      }
    }

    if (message?.cmd === Command.PORTOFOLIO) {
      this.mapPortofolio(message.data);
    }
  }

  private onConnectionOpen(): void {
    this.storage.loadUser().subscribe((login: User | undefined) => {
      if (login) {
        this.setUser(login);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  private async logInDemo(): Promise<any> {
    this.storage.saveUser(this.$user()!);
    const betPortofilio = new Array<Stock>();

    if (this.$stocks()?.values()) {
      return;
    }

    myPortofolio.forEach((stock: Stock) => {
      const betStock = this.$betIndex().get(stock.symbol);
      if (betStock) {
        betPortofilio.push({
          symbol: stock.symbol,
          name: betStock.name,
          proc: 1,
          qty: stock.qty,
          value: stock.value,
          type: StockType.BET,
          betProc: betStock.proc,
        });
      }
    });
    this.state.$stocks.set(betPortofilio);
    this.router.navigate(['/portofolio']);
  }
}
