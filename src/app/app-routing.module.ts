import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PortofolioComponent } from './components/portofolio/portofolio.component';

const routes: Route[] = [
  { path: 'login', component: LoginComponent },
  { path: 'portofolio', component: PortofolioComponent },
  { path: '',   redirectTo: '/portofolio', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
