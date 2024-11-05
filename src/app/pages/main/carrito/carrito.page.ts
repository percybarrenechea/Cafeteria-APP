import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service'; // Importar el servicio de Firebase

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  carrito: any[] = [];
  metodoPago: string = '';
  numeroTarjeta: string = '';
  numeroTelefono: string = '';

  constructor(private router: Router, private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.cargarCarrito();
  }

  cargarCarrito() {
    this.carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    // Asegurarse de que cada producto tenga una cantidad inicial
    this.carrito.forEach(producto => {
      if (!producto.cantidad) {
        producto.cantidad = 1; // Valor por defecto
      }
    });
  }

  eliminarDelCarrito(producto: any) {
    this.carrito = this.carrito.filter(p => p !== producto);
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  aumentarCantidad(producto: any) {
    producto.cantidad++;
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  disminuirCantidad(producto: any) {
    if (producto.cantidad > 1) {
      producto.cantidad--;
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }
  }

  calcularTotal() {
    return this.carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  }

  async pagar() {
    const uid = await this.firebaseService.getUsuarioUID();
    if (!uid) {
      console.error('No se pudo obtener el UID del usuario.');
      return;
    }
  
    const orden = {
      productos: this.carrito,
      metodoPago: this.metodoPago,
      total: this.calcularTotal(),
      numeroTarjeta: this.metodoPago === 'tarjeta' ? this.numeroTarjeta : null,
      numeroTelefono: this.metodoPago !== 'tarjeta' ? this.numeroTelefono : null,
      fecha: new Date(),
      uid: uid  // Agregar UID del usuario autenticado
    };
  
    this.firebaseService.agregarOrden(orden).then(() => {
      console.log('Orden guardada exitosamente en Firebase');
    
      this.firebaseService.agregarHistorial(orden).then(() => {
        console.log('Orden guardada en el historial');
        localStorage.removeItem('carrito');
        this.router.navigate(['/main/boleta']);
      }).catch((error) => {
        console.error('Error al guardar la orden en el historial: ', error);
      });
    
    }).catch((error) => {
      console.error('Error al guardar la orden en Firebase: ', error);
    });
  }
  
}
