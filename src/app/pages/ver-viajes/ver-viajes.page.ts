import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { MenuController, AlertController } from '@ionic/angular';
import { viajes } from 'src/app/folder/interfaces/Viajes';
import { MensajesService } from 'src/app/services/mensajes.service'; // Importa el servicio de mensajes

@Component({
  selector: 'app-ver-viajes',
  templateUrl: './ver-viajes.page.html',
  styleUrls: ['./ver-viajes.page.scss'],
})
export class VerViajesPage implements OnInit {

  viajes: viajes[] = []; 

  constructor(
    private menuController: MenuController,
    private firestore: AngularFirestore,
    private router: Router,
    private alertController: AlertController,
    private mensajesService: MensajesService // Inyecta el servicio de mensajes
  ) { }

  ngOnInit() {
    this.menuController.enable(true);
    this.config();
  }

  config() {
    this.firestore.collection('viajes').snapshotChanges().subscribe(actions => {
      this.viajes = actions.map(action => {
        const data = action.payload.doc.data() as viajes;
        const uid = action.payload.doc.id; 
        return { uid, ...data }; 
      });
    });
  }

  GoeditarViaje(uid: string) {
    this.router.navigate(['/editar-viajes', uid]);
  }

  async eliminarViaje(uid: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.firestore.collection('viajes').doc(uid).delete();
              this.viajes = this.viajes.filter(viaje => viaje.uid !== uid); // Actualiza la lista local
              this.mensajesService.mensaje('Viaje eliminado correctamente.', 'success', 'Éxito'); // Mensaje de éxito
            } catch (error) {
              console.error('Error al eliminar el viaje:', error);
              this.mensajesService.mensaje('Error al eliminar el viaje. Intenta nuevamente.', 'error', 'Error'); // Mensaje de error
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
