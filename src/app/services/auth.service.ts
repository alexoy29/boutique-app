// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  login(email: string, password: string): boolean {
    if (email && password) {
      // En prod : ici on fera un appel HTTP vers .NET
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }
}
