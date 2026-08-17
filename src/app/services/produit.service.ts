import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Produit {
  id: number;
  nom: string;
  prix: number;
  photoUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private readonly apiUrl = `${environment.apiUrl}/produits`;

  constructor(private http: HttpClient) {}

  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrl);
  }
}
