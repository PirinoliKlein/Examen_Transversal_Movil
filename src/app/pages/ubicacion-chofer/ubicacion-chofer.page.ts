import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/firebas/usuarios.service.spec';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/firebas/usuarios.service'; // Asegúrate de que esta ruta sea correcta

@Component({
  selector: 'app-ubicacion-chofer',
  templateUrl: './ubicacion-chofer.page.html',
  styleUrls: ['./ubicacion-chofer.page.scss'],
})
export class UbicacionChoferPage implements OnInit {
  currentUserUid: string | null = null;
  usuarios: any = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private usuariosService: UsuariosService // Inyectar UsuariosService
  ) { }

  ngOnInit() {
    this.authService.isLogged().subscribe(user => {
      if (user) {
        this.currentUserUid = user.uid; 
        console.log('UID del usuario:', this.currentUserUid);
      } else {
        console.log('No hay usuario autenticado');
      }
    });
  }

  async changeUserType(tipoNuevo: string) {
    if (this.currentUserUid) {
      await this.usuariosService.changeUserType(this.currentUserUid, tipoNuevo);
    } 
  }
}
