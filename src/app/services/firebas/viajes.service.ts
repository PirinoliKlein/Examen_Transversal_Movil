import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  constructor(private firestore: AngularFirestore) {}

  // Método para obtener un viaje por su ID (retorna un Observable)
  getViaje(viajeUid: string): Observable<any> {
    return this.firestore.collection('viajes').doc(viajeUid).valueChanges();
  }

  // Método para buscar un viaje por ID y suscribirse dentro del servicio (no recomendado, mejor suscribirse en el componente)
  buscarViajePorId(viajeId: string): Observable<any> {
    return this.firestore.collection('viajes').doc(viajeId).valueChanges();
  }

  // Obtener todos los viajes (retorna un Observable)
  getAllViajes(): Observable<any[]> {
    return this.firestore.collection('viajes').valueChanges();
  }

  // Actualizar un viaje
  updateViaje(uid: string, viajeData: { precio: number | null; pasajeros: number | null }) {
    return this.firestore.collection('viajes').doc(uid).update(viajeData);
  }

  // Eliminar un viaje
  deleteViaje(uid: string) {
    return this.firestore.collection('viajes').doc(uid).delete();
  }

  // Métodos para agregar o modificar información local (si necesitas un estado temporal)
  setViaje(precio: number, pasajeros: number) {
    // Aquí puedes mantener el estado local del viaje, si es necesario
  }
}
