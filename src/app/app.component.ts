import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Page } from './folder/interfaces/page';
import { AuthService } from 'src/app/services/firebas/usuarios.service.spec'; // Ajusta la ruta según tu proyecto
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from './folder/interfaces/usuario'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages: Page[] = [];
  public tipoUsuario?: string;
  public emailUsuario?: string;
  public nombreUsuario?: string;

  constructor(private router: Router, private authService: AuthService, private firestore: AngularFirestore) {}

  ngOnInit() {
    this.authService.isLogged().subscribe(async user => {
      if (user) {
        const usuarioDoc = await this.firestore.collection<Usuario>('usuarios').doc(user.uid).get().toPromise();
        const userData = usuarioDoc?.data() as Usuario;

        if (userData) {
          this.tipoUsuario = userData.tipo;
          this.emailUsuario = userData.email;
          this.configSideMenu();
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
  
  configSideMenu() {
    if (this.tipoUsuario === 'admin') {
      this.appPages = [
        { title: 'Dashboard', url: '/admin-dashboard', icon: 'home' },
        { title: 'Administrar usuarios', url: '/editar-user', icon: 'cube' },
        { title: 'Cerrar sesión', url: '/login', icon: 'log-out' }
      ];  
    } else if (this.tipoUsuario === 'usuario') {
      this.appPages = [
        { title: 'Dashboard', url: '/home', icon: 'home' },
        { title: 'Cerrar sesión', url: '/login', icon: 'log-out' }
      ];
    } else if (this.tipoUsuario === 'conductor'){
      this.appPages = [
        { title: 'Dashboard', url: '/home-chofer', icon: 'home' },
        { title: 'Cerrar sesión', url: '/login', icon: 'log-out' }
      ];
      
    }
  }
}
