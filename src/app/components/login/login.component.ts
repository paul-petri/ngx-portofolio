import { Component, effect, inject } from '@angular/core';
import { AppStore } from 'src/app/services/app.store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  appState = inject(AppStore);

  userName = '';
  password = '';

  loginError = this.appState.$loginError;
  submitted = false;
  shakeIt = false;

  constructor() {
    this.watchLoginError();
  }

  logIn(): void {
    this.submitted = true;

    if (!this.userName || !this.password) {
      this.appState.setLoginError('User and Password required');
      return;
    }

    this.appState.setUser({ user: this.userName, password: this.password });
  }

  logInDemo(): void {
    this.appState.setUser({
      user: '!DemoAPITDV',
      password: 'DemoAPITDV',
      demo: true,
    });
  }

  private watchLoginError(): void {
    effect(() => {
      if (this.appState.$loginError()) {
        this.shakeIt = true;
        setTimeout(() => {
          this.shakeIt = false;
        }, 300);
      }
    });
  }
}
