import {Injectable, computed, inject, signal, effect} from '@angular/core';
import {Portofolio} from '../models/portofolio';
import {Message} from '../models/message';
import {Command} from '../models/commands';
import {Stock} from '../models/stock';
import {StorageService} from './storage.service';
import {User} from '../models/login';
import {Router} from '@angular/router';
import {BET20map} from '../data/bet20map';
import {StockType} from '../models/stock-type';

@Injectable({
  providedIn: 'root',
})
export class AppStore {
  private storage = inject(StorageService);
  private websocket!: WebSocket;

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
  }

  private onLoginChanges(): void {
    effect(() => {
      if (this.$user()?.user && this.$user()?.password) {
        this.logIn();
      }
    });
  }

  logOut(): void {
    this.storage.removeUser();
    this.setUser(undefined);
    this.router.navigate(['/login']);
  }

  getStocks(): Array<Stock> | undefined {
    return this.$stocks();
  }

  getPortofolio(): void {
    this.websocket.send(
      JSON.stringify({cmd: Command.PORTOFOLIO, prm: {data: null}}),
    );
  }

  private initWebSocket(): void {
    this.websocket = new WebSocket('wss://api.tradeville.ro', ['apitv']);
    this.websocket.onopen = () => this.onConnectionOpen();
    this.websocket.onerror = () => console.log('eroare la conectare');
    this.websocket.onmessage = (e: any) => this.onMessageReceived(e);
  }

  setUser(user: User | undefined): void {
    this.state.$user.set(user);
  }

  setLoginError(error: string): void {
    this.state.$loginError.set(error);
  }

  sendMessage(msg: object) {
    if (this.websocket.readyState != 1) {
      console.log('no server connection');
      this.state.$loginError.set('no server connection');
      return;
    }
    this.websocket.send(JSON.stringify(msg));
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

  onConnectionOpen(): void {
    this.storage.loadUser().subscribe((login: User | undefined) => {
      if (login) {
        this.setUser(login);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  onMessageReceived(response: Message<any> | undefined) {
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

  mapMeesageToLogin(message: any): User {
    return {
      user: message.prm.coduser,
      password: message.prm.parola,
      demo: message.prm.parola,
    };
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
          value: data.MarketPrice[idx] * data.Quantity[idx],
          type: StockType.BET,
          betProc: betStock.proc,
        });
      }
    });

    this.state.$stocks.set(myPortofolio);
    this.router.navigate(['/portofolio']);
  }
}
