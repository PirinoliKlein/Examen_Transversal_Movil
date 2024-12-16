import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-detalle-viaje',
  templateUrl: './detalle-viaje.page.html',
  styleUrls: ['./detalle-viaje.page.scss'],
})
export class DetalleViajePage implements OnInit {
  viajeId: string | null = null;
  viaje: any = null;

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.viajeId = this.route.snapshot.paramMap.get('uid'); 
    this.loadViaje();
  }

  loadViaje() {
    if (this.viajeId) {
      this.firestore.collection('viajes').doc(this.viajeId).get()
        .toPromise()
        .then(doc => {
          if (doc && doc.exists) {
            const data = doc.data();
            if (data) { 
              this.viaje = { id: doc.id, ...data }; 
              
            } else {
              console.error('El documento no contiene datos válidos:', this.viajeId);
            }
          } else {
            console.error('No se encontró el viaje con ID:', this.viajeId);
          }
        })
        .catch(error => {
          console.error('Error al obtener el viaje:', error);
        });
    }
  }
}
