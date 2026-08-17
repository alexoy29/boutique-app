import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    FormsModule,
    RouterLink
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private router: Router, private userService: UserService) {}

  seConnecter(): void {
    if (this.email && this.password) {
      this.userService.verifierIdentifiants(this.email, this.password).subscribe({
        next: () => this.router.navigate(['/produits']),
        error: () => alert('Email ou mot de passe incorrect.')
      });
    } else {
      alert('Veuillez remplir tous les champs.');
    }
  }
}
