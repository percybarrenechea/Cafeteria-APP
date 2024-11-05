import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { jsPDF } from 'jspdf'; // Importar jsPDF

@Component({
  selector: 'app-boleta',
  templateUrl: './boleta.page.html',
  styleUrls: ['./boleta.page.scss'],
})
export class BoletaPage implements OnInit {
  carrito: any[] = [];
  total: number = 0;
  fecha: string = '';

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  ngOnInit() {
    this.cargarUltimaOrden();
  }

  cargarUltimaOrden() {
    this.firebaseService.obtenerUltimaOrden().subscribe(ordenes => {
      if (ordenes.length > 0) {
        const ultimaOrden = ordenes[0];
        this.carrito = ultimaOrden.productos || [];
        this.total = ultimaOrden.precio;
        this.fecha = ultimaOrden.fecha.toDate().toLocaleDateString();
      }
    });
  }

  volverAlHome() {
    this.router.navigate(['/main/home']);
  }

  // Función para generar y descargar el PDF
  imprimirBoleta() {
    const doc = new jsPDF();
  
    // Obtener el ancho de la página PDF
    const pageWidth = doc.internal.pageSize.getWidth();
  
    // Calcular la posición centrada para el título
    const text = 'Boleta de Compra';
    const textWidth = doc.getTextWidth(text);
    const textX = (pageWidth - textWidth) / 2;
  
    // Añadir el título centrado
    doc.setFontSize(18);
    doc.text(text, textX, 10);
  
    // Añadir detalles de la fecha y total
    doc.setFontSize(12);
    doc.text(`Fecha: ${this.fecha}`, 10, 20);
    doc.text(`Total: S/ ${this.total}`, 10, 30);
  
    let yPosition = 40; // Posición inicial para listar los productos
    this.carrito.forEach((producto, index) => {
      doc.text(`${index + 1}. ${producto.nombre} - S/ ${producto.precio}`, 10, yPosition);
      yPosition += 10; // Añadir espacio entre los productos
    });
  
    doc.save('boleta.pdf'); // Descargar el archivo PDF
  }
  
}
