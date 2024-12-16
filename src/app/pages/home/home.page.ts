import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/firebas/usuarios.service.spec';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  currentUserUid: string | null = null;
  usuarioLogin?: string;

  constructor(
    private firestore: AngularFirestore, 
    private authService: AuthService,
    private router: Router 
  ) {}

  ngOnInit() {
    this.authService.isLogged().subscribe(user => {
      if (user) {
        this.currentUserUid = user.uid;
        console.log('UID del usuario:', this.currentUserUid);
        this.usuarioLogin = user.email; 
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
          text: 'Hubo un problema al actualizar el tipo de usuario.',
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

  async logout() {
    await this.authService.logout(); 
  }

  async downloadAPK() {
    // Asegúrate de que esta URL sea la correcta para tu APK en Google Drive
    const apkUrl = 'https://drive.google.com/file/d/184p_GHoK99XggxNtRrw7VXCT3jTLxkab/view?usp=drive_link'; 

    if (Capacitor.isNativePlatform()) {
      // Si estás en una plataforma nativa, usa el navegador del dispositivo
      await Browser.open({ url: apkUrl });
    } else {
      // Si estás en una plataforma web, abre el enlace en una nueva pestaña
      window.open(apkUrl, '_blank');
    }
  }
}