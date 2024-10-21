import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebas/usuarios.service.spec';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from 'src/app/folder/interfaces/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  emailValue?: string;
  passValue?: string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private menuController: MenuController
  ) { 
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.menuController.enable(false);
  }

  async login() {
    try {
      const loading = await this.loadingController.create({
        message: 'Cargando.....',
        duration: 2000
      });

      const email = this.loginForm.value.email; 
      const pass = this.loginForm.value.pass;

      
      const usuarioLogeado = await this.authService.login(email, pass);
      
      if (usuarioLogeado.user) {
        await loading.present();

        const usuarioDoc = await this.firestore.collection('usuarios').doc(usuarioLogeado.user.uid).get().toPromise();
        const userData = usuarioDoc?.data() as Usuario;

        setTimeout(async () => {
          await loading.dismiss();
          if (userData) {
            
            if (userData.tipo === 'admin') {
              this.router.navigate(['/admin-dashboard']);
            } else if (userData.tipo === 'usuario') {
              this.router.navigate(['/home']);
            }
          } else {
            
            Swal.fire({
              title: 'Error!',
              text: 'Usuario no encontrado en la base de datos.',
              icon: 'error',
              confirmButtonText: 'OK',
              heightAuto: false
            });
          }
        }, 2000);
      } 
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Error en las credenciales, intentelo nuevamente!',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false
      });

      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        title: 'Error!',
        text: 'Error en las credenciales, intentelo nuevamente!',
        icon: 'error',
      }); 
       
      this.loginForm.reset(); // Resetea el formulario
    }
  }
}
