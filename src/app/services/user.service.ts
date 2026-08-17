import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Utilisateur {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
}

export interface RegisterRequest extends Utilisateur {
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly sessionDurationMs = 60 * 60 * 1000;
  private readonly sessionExpiresAtKey = 'sessionExpiresAt';
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private utilisateurSubject = new BehaviorSubject<Utilisateur | null>(null);
  private expirationTimer?: ReturnType<typeof setTimeout>;
  utilisateur$ = this.utilisateurSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const stored = localStorage.getItem('utilisateur');

    if (stored && this.sessionIsValid()) {
      this.utilisateurSubject.next(JSON.parse(stored));
      this.startExpirationTimer();
    } else {
      this.clearUtilisateur(false);
    }
  }

  setUtilisateur(utilisateur: Utilisateur): void {
    const expiresAt = Date.now() + this.sessionDurationMs;

    localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem(this.sessionExpiresAtKey, expiresAt.toString());
    this.utilisateurSubject.next(utilisateur);
    this.startExpirationTimer();
  }

  clearUtilisateur(redirectToLogin = true): void {
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
      this.expirationTimer = undefined;
    }

    localStorage.removeItem('utilisateur');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem(this.sessionExpiresAtKey);
    this.utilisateurSubject.next(null);

    if (redirectToLogin) {
      this.router.navigate(['/login']);
    }
  }

  enregistrerUtilisateur(utilisateur: RegisterRequest) {
    return this.http.post<Utilisateur>(`${this.apiUrl}/register`, utilisateur).pipe(
      tap(user => this.setUtilisateur(user))
    );
  }

  verifierIdentifiants(email: string, password: string)  {
    return this.http.post<Utilisateur>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(user => this.setUtilisateur(user))
    );
  }

  getUtilisateur(): Utilisateur | null {
    if (!this.sessionIsValid()) {
      this.clearUtilisateur();
      return null;
    }

    return this.utilisateurSubject.value;
  }

  private sessionIsValid(): boolean {
    const expiresAt = Number(localStorage.getItem(this.sessionExpiresAtKey));
    return Boolean(expiresAt && Date.now() < expiresAt);
  }

  private startExpirationTimer(): void {
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
    }

    const expiresAt = Number(localStorage.getItem(this.sessionExpiresAtKey));
    const remainingTime = expiresAt - Date.now();

    if (remainingTime <= 0) {
      this.clearUtilisateur();
      return;
    }

    this.expirationTimer = setTimeout(() => {
      this.clearUtilisateur();
      alert('Votre session a expire. Veuillez vous reconnecter.');
    }, remainingTime);
  }
}
