import { Injectable, inject, signal, effect } from '@angular/core';
import { Portofolio } from '../models/portofolio';
import { Message } from '../models/message';
import { Command } from '../models/commands';
import { Stock } from '../models/stock';
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
  };


  readonly $user = this.state.$user.asReadonly();
  readonly $stocks = this.state.$stocks.asReadonly();
  readonly $loginError = this.state.$loginError.asReadonly();

  constructor(private router: Router) {
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

  mapMeesageToLogin(message: any): User {
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
      for(const { idx, line } of lines!.map((line, idx) => ({ idx, line }))) {
        const data = line.split('\t');
        if (idx === 1) {
          this.evaluationIDX = data.indexOf('eval');
          if (this.evaluationIDX === -1) { 
            this.toastr.error('CSV invalid', 'Eroare');
            return;
          }
        } else if (idx > 1) {
          const betStock = BET20map.get(data[0]);
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
      const betStock = BET20map.get(symbol);
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
        this.storage.saveUser(this.mapMeesageToLogin(message));
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
      const betStock = BET20map.get(stock.symbol);
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
