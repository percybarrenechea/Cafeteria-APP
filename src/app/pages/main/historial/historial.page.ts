import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  historial: any[] = [];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  // Cargar el historial específico del usuario autenticado
  cargarHistorial(): void {
    this.firebaseService.obtenerOrdenesPorUsuario().subscribe(
      (data: any[]) => {
        this.historial = data;
        if (this.historial.length === 0) {
          console.log("No tienes compras anteriores");
        }
      },
      error => {
        console.error("Error al cargar el historial:", error);
      }
    );
  }

  // Método para imprimir un historial en PDF
  imprimirHistorialPDF(orden: any): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    let yPosition = 20;

    doc.setFontSize(18);
    const title = 'Detalle de Compra';
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, yPosition);

    yPosition += 10;
    doc.setFontSize(12);

    // Añadir datos de la orden al PDF
    doc.text(`Nombre: ${orden.nombre}`, margin, yPosition);
    yPosition += 10;
    doc.text(`Precio: S/ ${orden.precio}`, margin, yPosition);
    yPosition += 10;
    doc.text(`Fecha: ${orden.fecha.toDate().toLocaleDateString()}`, margin, yPosition);

    doc.save(`detalle_compra_${orden.nombre}.pdf`);
  }
}
