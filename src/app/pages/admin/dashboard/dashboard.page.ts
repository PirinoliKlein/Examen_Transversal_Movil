import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Usuario } from 'src/app/folder/interfaces/usuario';
import { AuthService } from 'src/app/services/firebas/usuarios.service.spec';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  usuarios: any = [];

  constructor(
    private menuController: MenuController,
    private firestore: AngularFirestore,
    private router: Router,
    private authServices: AuthService
  ) { }

  ngOnInit() {
    this.menuController.enable(true);
    this.config();
  }

  config() {
    this.firestore.collection('usuarios').valueChanges().subscribe(aux => {
      this.usuarios = aux;
    });
  }

  
  editarUser(uid:string) {
    this.router.navigate(['/editar-user',uid]);
  }

  logout() {
    
    this.authServices.logout();
    this.router.navigate(['/login']);
  }
}
