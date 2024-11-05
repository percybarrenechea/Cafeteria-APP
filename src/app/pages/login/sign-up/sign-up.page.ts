import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service'; // Ajusta la ruta según tu estructura
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  email: string = '';
  password: string = '';
  nombre: string = '';

  constructor(private firebaseService: FirebaseService, private router: Router) { }

  ngOnInit() { }

  async registrar(event: Event) {
    event.preventDefault(); // Evita la recarga del formulario
    try {
      // Llamar al servicio para registrar el usuario en Firebase Authentication y Firestore
      await this.firebaseService.registrarUsuario(this.email, this.password, this.nombre);
      console.log('Usuario registrado con éxito');

      // Limpiar los campos del formulario
      this.email = '';
      this.password = '';
      this.nombre = '';

    } catch (error) {
      console.error('Error al registrar usuario:', error);
      // Aquí puedes manejar el error, por ejemplo mostrando una alerta al usuario
    }
  }
}
