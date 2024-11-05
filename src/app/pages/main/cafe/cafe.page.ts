import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // Importa el Router
import { FirebaseService } from 'src/app/services/firebase.service';

// Definimos una interfaz para los productos
interface Producto {
  nombre: string;
  precio: number;
  imagen: string;
  bloqueado?: boolean; // Añadimos la propiedad bloqueado
}

@Component({
  selector: 'app-cafe',
  templateUrl: './cafe.page.html',
  styleUrls: ['./cafe.page.scss'],
})
export class CafePage implements OnInit {
  selectedSegment: string = 'cafes'; // Por defecto, muestra la sección de cafés
  carrito: Producto[] = []; // Añadir la propiedad carrito
  favoritos: Producto[] = []; // Lista de favoritos

  // Lista de productos de cafés
  cafes: Producto[] = [
    { nombre: 'Fresa Crème Frappuccino', precio: 8.00, imagen: 'assets/img/cafes/1FresaCremeFrappuccino.png', bloqueado: false },
    { nombre: 'Pumpkin Spice Frappuccino', precio: 17.00, imagen: 'assets/img/cafes/2PumpkinSpiceFrappuccino.png', bloqueado: false },
    { nombre: 'Black & White Mocha Frappuccino', precio: 20.00, imagen: 'assets/img/cafes/3Black&WhiteMochaFrappuccino.png', bloqueado: false },
    { nombre: 'Ultimate Caramel Frappuccino', precio: 8.00, imagen: 'assets/img/cafes/4UltimateCaramelFrappuccino.png', bloqueado: false },
    { nombre: 'Doble Mocha Frapuccino', precio: 8.00, imagen: 'assets/img/cafes/5DobleMochaFrapuccino.png', bloqueado: false },
    { nombre: 'Café Americano', precio: 9.00, imagen: 'assets/img/cafes/6Americano.png', bloqueado: false },
    { nombre: 'Latte', precio: 8.00, imagen: 'assets/img/cafes/7Latte.png', bloqueado: false },
    { nombre: 'Vainilla Latte', precio: 10.00, imagen: 'assets/img/cafes/8VainillaLatte.png', bloqueado: false },
    { nombre: 'Caramel Macchiato', precio: 8.00, imagen: 'assets/img/cafes/9CaramelMacchiato.png', bloqueado: false },
    { nombre: 'Mocha café', precio: 11.00, imagen: 'assets/img/cafes/10Mochacafe.png', bloqueado: false },
    { nombre: 'Manjar blanco Latte', precio: 8.00, imagen: 'assets/img/cafes/11ManjarblancoLatte.png', bloqueado: false },
    { nombre: 'Algarrobina Latte', precio: 12.00, imagen: 'assets/img/cafes/12AlgarrobinaLatte.png', bloqueado: false }
  ];

  // Lista de productos de pasteles
  pasteles: Producto[] = [
    { nombre: 'Pastel de Café', precio: 30.00, imagen: 'assets/img/Pasteles/Pastel de Cafe.png', bloqueado: false },
    { nombre: 'Pastel de Chocolate', precio: 40.00, imagen: 'assets/img/Pasteles/Pastel de Chocolate.png', bloqueado: false },
    { nombre: 'Pastel de Mango', precio: 30.00, imagen: 'assets/img/Pasteles/Pastel de Mango.png', bloqueado: false },
    { nombre: 'Pastel de Vainilla', precio: 45.00, imagen: 'assets/img/Pasteles/Pastel de Vainilla.png', bloqueado: false },
    { nombre: 'Pastel de Zanahoria', precio: 38.00, imagen: 'assets/img/Pasteles/Pastel de Zanahoria.png', bloqueado: false },
    { nombre: 'Tarta de Cereza', precio: 35.00, imagen: 'assets/img/Pasteles/Tarta de Cereza.png', bloqueado: false },
    { nombre: 'Tarta de Fresa', precio: 37.00, imagen: 'assets/img/Pasteles/Tarta de Fresa.png', bloqueado: false },
    { nombre: 'Tarta de Limón', precio: 48.00, imagen: 'assets/img/Pasteles/Tarta de Limon.png', bloqueado: false },
    { nombre: 'Tarta de Manzana', precio: 45.00, imagen: 'assets/img/Pasteles/Tarta de Manzana.png', bloqueado: false },
    { nombre: 'Tarta de Queso', precio: 58.00, imagen: 'assets/img/Pasteles/Tarta de Queso.png', bloqueado: false },
  ];

  // Lista de productos de postres
  postres: Producto[] = [
    { nombre: 'Alfajores', precio: 8.00, imagen: 'assets/img/postres/alfajores.png', bloqueado: false },
    { nombre: 'Buñuelos', precio: 10.00, imagen: 'assets/img/postres/bunuelos.png', bloqueado: false },
    { nombre: 'Galletas', precio: 8.00, imagen: 'assets/img/postres/galletas.png', bloqueado: false },
    { nombre: 'Gelatina', precio: 5.00, imagen: 'assets/img/postres/gelatina.png', bloqueado: false },
    { nombre: 'Gelato', precio: 8.00, imagen: 'assets/img/postres/gelato.png', bloqueado: false },
    { nombre: 'Helado', precio: 3.00, imagen: 'assets/img/postres/helado.png', bloqueado: false },
    { nombre: 'Leche Asada', precio: 7.00, imagen: 'assets/img/postres/lecheasadaj.png', bloqueado: false },
    { nombre: 'Mazamorra Morada', precio: 8.00, imagen: 'assets/img/postres/mazamorra morada.png', bloqueado: false },
    { nombre: 'Milhoja', precio: 5.00, imagen: 'assets/img/postres/milhoja.png', bloqueado: false },
    { nombre: 'Mousse de Chocolate', precio: 8.00, imagen: 'assets/img/postres/mousse de chocolate.png', bloqueado: false },
    { nombre: 'Pie de Manzana', precio: 8.00, imagen: 'assets/img/postres/pie de manzana.png', bloqueado: false },
    { nombre: 'Tarta de Chocolate', precio: 5.00, imagen: 'assets/img/postres/tarta de chocolate.png', bloqueado: false }
  ];

  // Arreglo para mantener el estado de productos seleccionados
  productosSeleccionados: Set<Producto> = new Set();

  productosFavoritos: Set<Producto> = new Set(); // Set para manejar favoritos

  // Agrega el Router en el constructor
  constructor(private router: Router, private firebaseService: FirebaseService) { }

  ngOnInit() { }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value; // Cambia el segmento seleccionado
  }

  agregarAlCarrito(producto: Producto) {
    // Manejar el caso en que localStorage.getItem('carrito') devuelva null
    let carrito = localStorage.getItem('carrito') ? JSON.parse(localStorage.getItem('carrito') as string) : [];
    
    // Añadir el producto al carrito
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Añadir el producto al carrito y actualizar el estado local del carrito
    this.carrito = carrito;

    // Marcar el producto como seleccionado
    this.productosSeleccionados.add(producto);
  }

  agregarAFavoritos(producto: Producto) {
    this.firebaseService.agregarFavorito(producto).then(() => {
      this.productosFavoritos.add(producto); // Actualiza el estado local
    }).catch(error => {
      console.error("Error al agregar a favoritos: ", error);
    });
  }

  isProductoSeleccionado(producto: Producto): boolean {
    return this.productosSeleccionados.has(producto);
  }

  isProductoFavorito(producto: Producto): boolean {
    return this.productosFavoritos.has(producto);
  }

  // Función para navegar a la página del carrito
  irAlCarrito() {
    this.router.navigate(['/main/carrito']); // Cambia a la ruta del carrito
  }

  irAFavoritos() {
    this.router.navigate(['/main/favoritos']); // Navegar a la página de favoritos
  }

}
