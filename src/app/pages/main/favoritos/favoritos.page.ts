import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

interface Producto {
  nombre: string;
  precio: number;
  imagen: string;
  bloqueado?: boolean;
}

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {
  favoritos: Producto[] = [];

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    // Suscribirse a los favoritos desde Firebase
    this.firebaseService.obtenerFavoritos().subscribe(favoritos => {
      this.favoritos = favoritos;
    });
  }

  quitarDeFavoritos(producto: Producto) {
    this.firebaseService.eliminarFavorito(producto).then(() => {
      this.favoritos = this.favoritos.filter(fav => fav.nombre !== producto.nombre);
    }).catch(error => {
      console.error("Error al quitar de favoritos: ", error);
    });
  }
}
