import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import {ProduitsComponent} from './pages/produits/produits.component';
import {CommandesComponent} from './pages/commandes/commandes.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'produits', component: ProduitsComponent },
  { path: 'commandes', component: CommandesComponent },
  { path: 'register', component: RegisterComponent }
];
