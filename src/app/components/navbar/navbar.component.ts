import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NgIf} from '@angular/common';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [
    NgIf
  ]
})
export class NavbarComponent implements OnInit {
  utilisateur: any;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.utilisateur$.subscribe(user => {
      this.utilisateur = user;
    });
  }

  deconnecter() {
    this.userService.clearUtilisateur();
    this.router.navigate(['/login']);
  }
}
