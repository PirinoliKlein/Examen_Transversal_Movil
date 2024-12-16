import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';
import { Usuario } from 'src/app/folder/interfaces/usuario';
import { AuthService } from 'src/app/services/firebas/usuarios.service.spec';
import { UsuariosService } from 'src/app/services/firebas/usuarios.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GithubAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { MensajesService } from 'src/app/services/mensajes.service'; // Importa el servicio de mensajes

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  emailValue?: string;
  passValue?: string;
  currentUserUid: string | null = null;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private usuariosService: UsuariosService,
    private menuController: MenuController,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private mensajesService: MensajesService // Inyecta el servicio de mensajes
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.menuController.enable(false);
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.firestore.collection('usuarios').doc(user.uid).get().toPromise().then(usuario => {
          const userData = usuario?.data() as Usuario;
          if (userData) {
            if (userData.tipo === 'usuario') {
              this.router.navigate(['/home']);
            } else if (userData.tipo === 'admin') {
              this.router.navigate(['/home-admin']);
            }
          }
        });
      } else {
        this.router.navigate(['/login']);
        this.loginForm.reset();
        this.currentUserUid = null;
      }
    });
  }

  async login() {
    try {
      const loading = await this.loadingController.create({
        message: 'Cargando.....',
        duration: 2000,
      });
      await loading.present();

      const email = this.emailValue;
      const pass = this.passValue;

      const usuarioLogeado = await this.authService.login(email as string, pass as string);
      
      if (usuarioLogeado.user) {
        localStorage.setItem('usuarioLogin', email as string);
        const usuario = await this.firestore.collection('usuarios')
          .doc(usuarioLogeado.user.uid).get().toPromise();
        const userData = usuario?.data() as Usuario;

        if (userData.tipo === 'usuario') {
          this.router.navigate(['/home']);
        } else if (userData.tipo === 'admin') {
          this.router.navigate(['/home-admin']);
        } else if (userData.tipo === 'conductor') {
          this.router.navigate(['/mapa'])
        } else if (userData.tipo === 'pasajero'){
          this.router.navigate(['/pasajero'])
        } else {
          this.router.navigate(['/login'])
        }

        this.mensajesService.mensaje('Inicio de sesión exitoso', 'success', 'Éxito');
      }

      await loading.dismiss();
    } catch (error) {
      this.mensajesService.mensaje('Error en el inicio de sesión', 'error', 'Error'); // Mensaje de error
    }
  }

  async loginWithGitHub() {
    const provider = new GithubAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account' 
    });

    try {
      const result = await this.afAuth.signInWithPopup(provider);
      if (result.user) { 
        this.currentUserUid = result.user.uid; 
        await this.saveUserToFirestore(result.user, 'usuario');
        this.router.navigate(['/home']); 
        this.mensajesService.mensaje('Usuario autenticado con GitHub', 'success', 'Éxito'); 
      } else {
        this.mensajesService.mensaje('No se pudo obtener la información del usuario.', 'error', 'Error'); 
      }
    } catch (error: any) { 
      console.error('Error en la autenticación con GitHub:', error);
      this.mensajesService.mensaje('Error en la autenticación con GitHub', 'error', 'Error'); 
    }
  }
  
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account' 
    });

    try {
      const result = await this.afAuth.signInWithPopup(provider);
      if (result.user) {
        console.log('Usuario autenticado con Google:', result.user);
        await this.saveUserToFirestore(result.user, 'usuario');
        this.router.navigate(['/home']); 
        this.mensajesService.mensaje('Usuario autenticado con Google', 'success', 'Éxito'); 
      } else {
        this.mensajesService.mensaje('No se pudo obtener la información del usuario.', 'error', 'Error'); 
      }
    } catch (error: any) { 
      console.error('Error en la autenticación con Google:', error);
      this.mensajesService.mensaje('Error en la autenticación con Google', 'error', 'Error'); // Mensaje de error
    }
  }



  async saveUserToFirestore(user: any, userType: string) {
    const userRef = this.firestore.collection('usuarios').doc(user.uid);
    const userData = {
      email: user.email,
      nombre: user.displayName,
      tipo: userType,
      uid: user.uid,
    };
    await userRef.set(userData, { merge: true });
  }
}
