import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Asegúrate de tener esta importación
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Para autenticación de Firebase
import { firstValueFrom } from 'rxjs'; // Para manejar promesas de datos
import { Router } from '@angular/router'; // Importa Router

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  nombre: string | null = null; // Variable para almacenar el nombre del usuario

  constructor(
    private afAuth: AngularFireAuth, // Servicio de autenticación de Firebase
    private firestore: AngularFirestore, // Servicio de Firestore para acceder a la base de datos
    private router: Router // Inyecta el Router
  ) { }

  ngOnInit() {
    this.checkFirstLogin(); // Verificar si es la primera vez que inicia sesión
    this.getUserName(); // Obtener el nombre del usuario
  }

  async getUserName() {
    try {
      // Esperamos a que el usuario esté autenticado
      const user = await this.afAuth.currentUser;

      if (user) {
        const uid = user.uid; // Obtenemos el UID del usuario autenticado

        // Consultamos la base de datos en la colección "Usuarios" con el UID
        const userDoc = this.firestore.collection('Usuarios').doc(uid).get();
        const userData = await firstValueFrom(userDoc); // Convertimos el observable a promesa

        if (userData.exists) {
          const data = userData.data();
          this.nombre = data ? data['nombre'] : 'Usuario'; // Asignamos el nombre del usuario

          // Si ya tenemos el nombre, actualizamos el mensaje de bienvenida
          this.updateWelcomeMessage();
        }
      }
    } catch (error) {
      console.error("Error al obtener el nombre del usuario:", error);
    }
  }

  updateWelcomeMessage() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage && this.nombre) {
      // Cambiamos el contenido del mensaje para que incluya el nombre del usuario
      welcomeMessage.innerHTML = `<h2>Bienvenido, ${this.nombre}</h2>`;
      welcomeMessage.style.display = 'block'; // Asegúrate de que el mensaje esté visible
    }
  }

  checkFirstLogin() {
    // Verificamos si es la primera vez que el usuario inicia sesión
    const firstLogin = sessionStorage.getItem('firstLogin');
    
    if (!firstLogin) {
      // Si es la primera vez, mostramos el mensaje de bienvenida
      this.showWelcomeMessage();
      // Guardamos el estado de que el usuario ya inició sesión una vez
      sessionStorage.setItem('firstLogin', 'true');
    }
  }

  showWelcomeMessage() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
      // Mostramos el mensaje de bienvenida por 3 segundos
      setTimeout(() => {
        welcomeMessage.style.opacity = '0';
        setTimeout(() => {
          welcomeMessage.style.display = 'none'; // Esconde el mensaje después de la animación
        }, 1000); // Esconde el mensaje después de la animación de opacidad
      }, 3000); // El mensaje permanece visible por 3 segundos
    }
  }

  async logout() {
    try {
      await this.afAuth.signOut(); // Cierra la sesión en Firebase
      this.router.navigate(['/login']); // Redirige a la página de inicio de sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

}
