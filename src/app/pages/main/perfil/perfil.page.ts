import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  usuario: any = {};
  editando: boolean = false;

  constructor(private firebaseService: FirebaseService, private afAuth: AngularFireAuth) { }

  ngOnInit() {
    // Obtener los datos del usuario
    this.firebaseService.getUsuarioData().subscribe(data => {
      this.usuario = data;
    });
  }

  // Permitir la edición
  habilitarEdicion() {
    this.editando = true;
  }

  // Guardar los cambios en Firebase
  async guardarCambios() {
    try {
      const uid = (await this.afAuth.currentUser)?.uid;
      if (uid) {
        await this.firebaseService.actualizarUsuario(uid, this.usuario.nombre, this.usuario.email);
        this.editando = false; // Desactivar la edición al guardar
      }
    } catch (error) {
      console.error("Error al guardar cambios: ", error);
    }
  }
}
