import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {}

  async onLogin() {
    try {
      await this.firebaseService.loginUsuario(this.email, this.password);

      const usuarioData = await this.firebaseService.getUsuarioDataOnce();

      if (usuarioData && usuarioData.master === 'jefa') {
        // Redirect to master page if the user has "master: jefa"
        this.router.navigate(['/main/master']);
      } else {
        // Redirect to main home page otherwise
        this.router.navigate(['/main/home']);
      }
    } catch (error) {
      this.errorMessage = 'Correo o contraseña incorrectos';
    }
  }

  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
