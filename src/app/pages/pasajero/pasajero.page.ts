import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/firebas/usuarios.service.spec';
import { UsuariosService } from 'src/app/services/firebas/usuarios.service'; 
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-pasajero',
  templateUrl: './pasajero.page.html',
  styleUrls: ['./pasajero.page.scss'],
})
export class PasajeroPage implements OnInit {
  currentUserUid: string | null = null;
  viajes: any = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private usuariosService: UsuariosService,
    private firestore: AngularFirestore 
  ) {}

  ngOnInit() {
    this.authService.isLogged().subscribe(user => {
      if (user) {
        this.currentUserUid = user.uid; 
        console.log('UID del usuario:', this.currentUserUid);
        this.loadViajes();
      }
    });
  }

  loadViajes() {
    this.firestore.collection('viajes').get()
      .toPromise()
      .then((querySnapshot: any) => { 
        if (querySnapshot && querySnapshot.docs) {
          this.viajes = querySnapshot.docs.map((doc: any) => { 
            const data = doc.data();
            if (data && typeof data === 'object') {
              return { id: doc.id, ...data }; 
            } else {
              console.error('El documento no contiene datos válidos:', doc.id);
              return { id: doc.id };  
            }
          });
          console.log('Viajes disponibles:', this.viajes); 
        } else {
          console.log('No se encontraron viajes.');
        }
      })
      .catch((error: any) => { 
        console.error('Error al obtener viajes:', error);
      });
  }

  verDetalleViaje(aux: any) {
    this.router.navigate(['detalle-viaje', aux.id]);
  }
  
  async changeUserType(tipoNuevo: string) {
    if (this.currentUserUid) {
      try {
        await this.usuariosService.changeUserType(this.currentUserUid, tipoNuevo); 
        console.log('Tipo de usuario actualizado a:', tipoNuevo);
      } catch (error) {
        console.error('Error al cambiar tipo de usuario:', error);
      }
    }
  }
}
