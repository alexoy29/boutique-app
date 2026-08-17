import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Produit, ProduitService } from '../../services/produit.service';
import { CommandeService } from '../../services/commande.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./produits.component.scss']
})
export class ProduitsComponent implements OnInit {
  produits: Produit[] = [];
  panier: Produit[] = [];
  showToast = false;

  constructor(
    private produitService: ProduitService,
    private commandeService: CommandeService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.produitService.getProduits().subscribe({
      next: data => this.produits = data,
      error: () => alert('Impossible de charger les produits depuis l API.')
    });
  }

  ajouterAuPanier(produit: Produit): void {
    this.panier.push(produit);
    this.afficherToast();
  }

  get total(): number {
    return this.panier.reduce((acc, p) => acc + p.prix, 0);
  }

  afficherToast(): void {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 2000);
  }

  validerCommande(): void {
    if (this.panier.length === 0) {
      alert('Votre panier est vide.');
      return;
    }

    const utilisateur = this.userService.getUtilisateur();
    if (!utilisateur?.email) {
      alert('Veuillez vous connecter avant de valider une commande.');
      return;
    }

    this.commandeService.ajouterCommande(utilisateur.email, this.panier).subscribe({
      next: () => {
        this.panier = [];
        alert('Commande enregistree !');
      },
      error: (error) => alert(error.error || 'Impossible d enregistrer la commande.')
    });
  }
}
