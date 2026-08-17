import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Produit } from './produit.service';

export interface CreateOrderDto {
  email: string;
  items: {
    productId: number;
    quantity: number;
  }[];
}

export interface OrderItemDto {
  productId: number;
  nom: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderDto {
  id: number;
  createdAt: string;
  total: number;
  email: string;
  items: OrderItemDto[];
}

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private readonly apiUrl = `${environment.apiUrl}/commandes`;

  constructor(private http: HttpClient) {}

  ajouterCommande(email: string, produits: Produit[]): Observable<OrderDto> {
    const quantites = produits.reduce((acc, produit) => {
      acc[produit.id] = (acc[produit.id] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const commande: CreateOrderDto = {
      email,
      items: Object.entries(quantites).map(([productId, quantity]) => ({
        productId: Number(productId),
        quantity
      }))
    };

    return this.http.post<OrderDto>(this.apiUrl, commande);
  }

  getCommandesParUtilisateur(email: string): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.apiUrl}/${encodeURIComponent(email)}`);
  }
}
