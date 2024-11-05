import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Asegúrate de tener esta importación
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Para autenticación de Firebase
import { Router } from '@angular/router'; // Importa Router
import { jsPDF } from 'jspdf'; // Importar jsPDF

@Component({
  selector: 'app-master',
  templateUrl: './master.page.html',
  styleUrls: ['./master.page.scss'],
})
export class MasterPage implements OnInit {
  selectedSegment: string = 'ordenes'; // Define el segmento predeterminado
  ordenes: any[] = [];
  historialPagos: any[] = [];
  totalGanancias: number = 0;
  ordenesFiltradas: Array<{
    expandido: boolean,
    fecha: Date,
    metodoPago: string,
    precio: number
  }> = [];
  fechasDisponibles: string[] = []; // Para almacenar las fechas únicas
  selectedDate: string = '';
  favoritos: any[] = [];
  productosFrecuencia: { cafes: number; postres: number; pasteles: number } = { cafes: 0, postres: 0, pasteles: 0 };

  constructor(
    private firebaseService: FirebaseService,
    private afAuth: AngularFireAuth, // Servicio de autenticación de Firebase
    private router: Router // Inyecta el Router
  ) { }

  async ngOnInit() {
    this.obtenerOrdenes();
    this.obtenerHistorialPagos();
  }

  // Cambiar el segmento seleccionado
  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  obtenerOrdenes() {
    this.firebaseService.obtenerTodasLasOrdenesConTotales().subscribe((ordenes: any[]) => {
      this.ordenes = ordenes;
      this.totalGanancias = ordenes.reduce((total, orden) => total + (orden.total || 0), 0);
    });
  }

  imprimirPDF() {
    const doc = new jsPDF();
    let y = 10; // Posición inicial en el eje Y

    doc.setFontSize(18);
    doc.text('Lista de Todas las Órdenes', 10, y);
    y += 10;

    doc.setFontSize(12);

    if (this.ordenes.length === 0) {
      doc.text('No hay órdenes para imprimir.', 10, y);
    } else {
      this.ordenes.forEach((orden, index) => {
        doc.text(`Compra ${index + 1}`, 10, y);
        y += 8;
        doc.text(`Fecha: ${orden.fecha.toDate().toLocaleDateString()}`, 10, y);
        y += 8;
        doc.text(`Hora: ${orden.fecha.toDate().toLocaleTimeString()}`, 10, y);
        y += 8;
        doc.text(`Cliente: ${orden.nombre}`, 10, y);
        y += 8;
        doc.text(`Método de Pago: ${orden.metodoPago}`, 10, y);
        y += 8;
        doc.text(`Precio Total: ${orden.total.toFixed(2)}`, 10, y);
        y += 12; // Espacio entre órdenes

        // Si alcanzamos el final de la página, creamos una nueva página
        if (y > 270) {
          doc.addPage();
          y = 10;
        }
      });
    }

    doc.save('todas_las_ordenes.pdf');
  }

  // Extraer fechas únicas de las órdenes
  extraerFechasDisponibles(ordenes: any[]) {
    const fechas = ordenes.map(orden => new Date(orden.fecha.toDate()).toDateString());
    this.fechasDisponibles = Array.from(new Set(fechas)); // Elimina duplicados
  }

  filtrarPorFecha() {
    if (this.selectedDate) {
      const selectedDateObj = new Date(this.selectedDate);
      this.ordenesFiltradas = this.ordenes.filter(orden => {
        const ordenDate = new Date(orden.fecha.toDate());
        return (
          ordenDate.getDate() === selectedDateObj.getDate() &&
          ordenDate.getMonth() === selectedDateObj.getMonth() &&
          ordenDate.getFullYear() === selectedDateObj.getFullYear()
        );
      });
    } else {
      this.ordenesFiltradas = this.ordenes;
    }
  }

  obtenerHistorialPagos() {
    this.firebaseService.obtenerHistorial().then(historialObservable => {
      historialObservable.subscribe((historial: any[]) => {
        this.historialPagos = historial;
        this.totalGanancias = historial.reduce((total, item) => total + item.precio, 0);
      });
    });
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
