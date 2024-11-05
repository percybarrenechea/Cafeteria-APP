import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importar AngularFirestore
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UtilsService } from 'src/app/services/utils.service';
import { map } from 'rxjs/operators';


interface Producto {
  nombre: string;
  precio: number;
  imagen: string;
  bloqueado?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  
  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth,private utilsService: UtilsService) { }

  // Método para registrar un usuario en Firebase Authentication y guardarlo en Firestore
  async registrarUsuario(email: string, password: string, nombre: string): Promise<void> {
    try {
      // Crear el usuario en Firebase Authentication
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user?.uid; // Obtener el UID del usuario creado por Firebase

      // Guardar los datos del usuario en Firestore en la colección 'usuarios'
      if (uid) {
        await this.firestore.collection('usuarios').doc(uid).set({
          uid: uid,
          nombre: nombre,
          email: email,
          password: password // Puedes cifrar la contraseña si prefieres mayor seguridad
        });
      }

    } catch (error) {
      console.error("Error al registrar el usuario en Firebase: ", error);
      throw error; // Lanza el error para manejarlo en el componente
    }
  }

  // Método para iniciar sesión con Firebase Authentication
  async loginUsuario(email: string, password: string): Promise<void> {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error("Error al iniciar sesión: ", error);
      throw error;
    }
  }

  // Método para cerrar sesión
  async logoutUsuario(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
      throw error;
    }
  }

  // Método para verificar si el usuario está autenticado
  getAuthState(): Observable<any> {
    return this.afAuth.authState;
  }

  // Obtener datos del usuario actual desde Firestore
  getUsuarioData(): Observable<any> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user && user.uid) {
          return this.firestore.collection('usuarios').doc(user.uid).valueChanges();
        } else {
          return [];
        }
      })
    );
  }

  // Method to get user data once from Firestore
  async getUsuarioDataOnce(): Promise<any> {
    const user = await this.afAuth.currentUser;
    if (user) {
      const userDoc = await this.firestore.collection('usuarios').doc(user.uid).get().toPromise();
      return userDoc.exists ? userDoc.data() : null;
    }
    return null;
  }

  // Actualizar nombre y email en Firestore y Firebase Authentication
  async actualizarUsuario(uid: string, nombre: string, email: string): Promise<void> {
    try {
      // Actualizar en Firestore
      await this.firestore.collection('usuarios').doc(uid).update({
        nombre: nombre,
        email: email
      });

      // Actualizar en Firebase Authentication
      const user = await this.afAuth.currentUser;
      if (user) {
        await user.updateEmail(email);
        await user.updateProfile({ displayName: nombre });
      }
    } catch (error) {
      console.error("Error al actualizar el usuario: ", error);
      throw error;
    }
  }

  // Obtener UID del usuario autenticado
  async getUsuarioUID(): Promise<string | null> {
    const user = await this.afAuth.currentUser;
    return user ? user.uid : null;
  }

  // Método para agregar una orden a Firestore
  agregarOrden(orden: any): Promise<any> {
    // Guardar orden en la colección "ordenes"
    return this.firestore.collection('ordenes').add(orden);
  }

  // Método para agregar una orden al historial
  async agregarHistorial(orden: any): Promise<any> {
    const user = await this.afAuth.currentUser;
    const historial = {
      uid: user ? user.uid : null, // Agrega el UID del usuario
      nombre: orden.productos.map((producto: any) => producto.nombre).join(', '), // Concatenar nombres de productos
      precio: orden.total,
      fecha: orden.fecha
    };
    return this.firestore.collection('historial').add(historial);
  }
  
  // Método para obtener la última orden del historial
  obtenerUltimaOrden(): Observable<any[]> {
    return this.firestore.collection('historial', ref => ref.orderBy('fecha', 'desc').limit(1)).valueChanges();
  }

  // Método para obtener todas las órdenes del historial
  async obtenerHistorial(): Promise<Observable<any[]>> {
    const uid = await this.utilsService.getCurrentUserUID();
    console.log("UID del usuario actual:", uid); // Agrega este log para verificar el UID

    if (uid) {
      return this.firestore
        .collection('historial', ref => ref.where('uid', '==', uid).orderBy('fecha', 'desc'))
        .valueChanges();
    } else {
      return of([]); // Devuelve un Observable que emite un array vacío
    }
  }

  // Método para agregar un producto a favoritos en Firebase
  async agregarFavorito(producto: Producto): Promise<void> {
    const user = await this.afAuth.currentUser;
    if (user) {
      const uid = user.uid;
      await this.firestore.collection('favoritos').add({
        uid: uid,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen
      });
    }
  }

  // Método para obtener los productos favoritos del usuario desde Firebase
  obtenerFavoritos(): Observable<Producto[]> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user && user.uid) {
          return this.firestore.collection<Producto>('favoritos', ref => ref.where('uid', '==', user.uid)).valueChanges();
        } else {
          return of([]); // Retorna un array vacío si no hay usuario autenticado
        }
      })
    );
  }

  // Método para eliminar un favorito de Firebase
  async eliminarFavorito(producto: Producto): Promise<void> {
    const user = await this.afAuth.currentUser;
    if (user) {
      const favoritoRef = await this.firestore.collection('favoritos', ref =>
        ref.where('uid', '==', user.uid).where('nombre', '==', producto.nombre)
      ).get().toPromise();

      favoritoRef.forEach(doc => {
        doc.ref.delete();
      });
    }
  }

  // Método para obtener todas las órdenes de Firestore
  obtenerTodasLasOrdenes(): Observable<any[]> {
    return this.firestore
      .collection('historial', ref => ref.orderBy('fecha', 'desc'))
      .valueChanges();
  }

  // Método para obtener todas las órdenes de Firestore con nombre y total
  obtenerTodasLasOrdenesConTotales(): Observable<any[]> {
    return this.firestore
      .collection('ordenes', ref => ref.orderBy('fecha', 'desc'))
      .valueChanges()
      .pipe(
        switchMap(async (ordenes) => {
          const ordenesConNombre = await Promise.all(
            ordenes.map(async (orden: any) => {
              const usuarioData: any = await this.firestore.collection('usuarios').doc(orden.uid).get().toPromise();
              const nombre = usuarioData.exists ? (usuarioData.data() as any).nombre : 'Desconocido';
              return { ...orden, nombre };
            })
          );
          return ordenesConNombre;
        })
      );
  }

  // Método para obtener las órdenes del historial específicas del usuario autenticado
  obtenerOrdenesPorUsuario(): Observable<any[]> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user && user.uid) {
          // Filtrar las órdenes en 'historial' según el UID del usuario autenticado
          return this.firestore
            .collection('historial', ref => ref.where('uid', '==', user.uid).orderBy('fecha', 'desc'))
            .valueChanges();
        } else {
          return of([]); // Devuelve un array vacío si no hay usuario autenticado
        }
      })
    );
  }

}
