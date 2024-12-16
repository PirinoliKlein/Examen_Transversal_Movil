import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebas/usuarios.service.spec';
import { MensajesService } from 'src/app/services/mensajes.service';
import { UsuariosService } from 'src/app/services/firebas/usuarios.service';
import { AngularFirestore } from '@angular/fire/compat/firestore'; 

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegisterPage implements OnInit {
  loginForm: FormGroup;
  
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private authService: AuthService,
    private mensajes: MensajesService,
    private usuariosService: UsuariosService,
    private firestore: AngularFirestore
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {}

  async registrarUsuario() {
    if (this.loginForm.invalid) {
      return; 
    }
    try {
      const usuarioFirebase = await this.authService.register(this.loginForm.value.email, this.loginForm.value.pass);
      const user = usuarioFirebase.user;

      if (user) {
        await this.firestore.collection('usuarios').doc(user.uid).set({
          uid: user.uid,
          nombre: 'Nombre usuario',
          email: user.email,
          pass: this.loginForm.value.pass,
          tipo: 'usuario'
        });
        this.router.navigate(['/login'])
        this.mensajes.mensaje('Cuenta creada correctamente!', 'success', 'Éxito!').then(() => {
          
        });
      }
    } catch (error) {
      this.mensajes.mensaje('Error al crear la cuenta de usuario, intentelo nuevamente!', 'error', 'Error!');
    }
  }

  
  async generarUsuariosAleatorios() {
    try {
      const mensaje = await this.usuariosService.generarUsuariosAleatorios();
      this.mensajes.mensaje(mensaje, 'success', 'Éxito!');
    } catch (error) {
      this.mensajes.mensaje('Error al crear usuarios aleatorios, inténtelo nuevamente!', 'error', 'Error!');
    }
  }
}