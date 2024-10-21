import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/firebas/usuarios.service.spec';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  currentUserUid: string | null = null;
  usuarioLogin?: string;
  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  ngOnInit() {
    this.authService.isLogged().subscribe(user => { // Ajusta este método según tu servicio
      if (user) {
        this.currentUserUid = user.uid; // Captura el UID del usuario actual
        console.log('UID del usuario:', this.currentUserUid);
      } else {
        console.log('No hay usuario autenticado');
      }
    });
  }

  async changeUserType(tipoNuevo: string) {
    if (this.currentUserUid) {
      try {
        await this.firestore.collection('usuarios').doc(this.currentUserUid).update({ tipo: tipoNuevo });
        console.log('Tipo de usuario actualizado a:', tipoNuevo);
      } catch (error) {
        console.error('Error al actualizar el tipo de usuario:', error);
        Swal.fire({
          title: 'Error!',
          text: 'No se pudo cambiar el tipo de usuario.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'No se pudo obtener el UID del usuario.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }
}
