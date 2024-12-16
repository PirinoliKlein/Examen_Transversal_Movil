import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import QRCode from 'qrcode';
import { UsuariosService } from 'src/app/services/firebas/usuarios.service';
import { AuthService } from 'src/app/services/firebas/usuarios.service.spec';

@Component({
  selector: 'app-codigoqr',
  templateUrl: './codigoqr.page.html',
  styleUrls: ['./codigoqr.page.scss'],
})
export class CodigoqrPage implements OnInit {
  uidViaje: string = ''; 
  qrCodeDataUrl: string | undefined; 
  currentUserUid: string | null = null;

  constructor(private route: ActivatedRoute, private usuarioservice : UsuariosService, private authservice: AuthService) {}

  ngOnInit() {
    this.authservice.isLogged().subscribe(user => {
      if (user) {
        this.currentUserUid = user.uid; 
      }
    })
   
    this.route.params.subscribe(params => {
      this.uidViaje = params['uid']; 
      this.generarCodigoQR(this.uidViaje); 
    });
  }

  async generarCodigoQR(uid: string) {
    try {
      this.qrCodeDataUrl = await QRCode.toDataURL(uid);  // Genera el código QR con el uid del viaje
    } catch (err) {
      console.error('Error al generar el código QR', err);
    }
  }

  async changeUserType(tipoNuevo: string) {
    if (this.currentUserUid) {
      try {
        await this.usuarioservice.changeUserType(this.currentUserUid, tipoNuevo); 
        console.log('Tipo de usuario actualizado a:', tipoNuevo);
      } catch (error) {
        console.error('Error al cambiar tipo de usuario:', error);
      }
    }
  }
}
