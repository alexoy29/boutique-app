import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  nom = '';
  prenom = '';
  email = '';
  password = '';

  constructor(private router: Router, private userService: UserService) {}

  enregistrer(): void {
    if (this.nom && this.prenom && this.email && this.password) {
      const utilisateur = {
        nom: this.nom,
        prenom: this.prenom,
        email: this.email,
        password: this.password
      };

      this.userService.enregistrerUtilisateur(utilisateur).subscribe({
        next: () => this.router.navigate(['/produits']),
        error: (error) => alert(error.error || 'Impossible de creer le compte.')
      });
    } else {
      alert('Veuillez remplir tous les champs.');
    }
  }
}
