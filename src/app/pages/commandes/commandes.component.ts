import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommandeService, OrderDto } from '../../services/commande.service';
import { UserService, Utilisateur } from '../../services/user.service';

@Component({
  selector: 'app-commandes',
  templateUrl: './commandes.component.html',
  imports: [NgFor, DatePipe, CurrencyPipe, RouterModule],
})
export class CommandesComponent implements OnInit {
  commandes: OrderDto[] = [];
  utilisateur: Utilisateur | null = null;

  constructor(private commandeService: CommandeService, private userService: UserService) {}

  ngOnInit(): void {
    this.utilisateur = this.userService.getUtilisateur();

    if (this.utilisateur?.email) {
      this.commandeService.getCommandesParUtilisateur(this.utilisateur.email).subscribe({
        next: commandes => this.commandes = commandes,
        error: () => alert('Impossible de charger vos commandes.')
      });
    }
  }
}
