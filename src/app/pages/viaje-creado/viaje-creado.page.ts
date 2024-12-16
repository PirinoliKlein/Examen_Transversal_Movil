import { Component, OnInit } from '@angular/core';
import { ViajeService } from 'src/app/services/firebas/viajes.service';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-viaje-creado',
  templateUrl: './viaje-creado.page.html',
  styleUrls: ['./viaje-creado.page.scss'],
})
export class ViajeCreadoPage implements OnInit {
  viaje: any;
  constructor(private viajeService: ViajeService, private route: ActivatedRoute, private firestore : AngularFirestore) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const viajeId = params['uid'];
      if (viajeId) {
        this.cargarDetallesViaje(viajeId);
      }
    });
  }
  
  async cargarDetallesViaje(viajeId: string) {
    const viajeDoc = await this.firestore.collection('viajes').doc(viajeId).get().toPromise();
  
    
    if (viajeDoc && viajeDoc.exists) {
      this.viaje = viajeDoc.data();
    } else {
      console.error('El viaje no existe');
      
    }
  }
  
}

