import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Usuario } from 'src/app/folder/interfaces/usuario';
import { AuthService } from 'src/app/services/firebas/usuarios.service.spec';
import Swal from 'sweetalert2';
import { IonicModule } from '@ionic/angular';
import { MensajesService } from 'src/app/services/mensajes.service';
@Component({
  selector: 'app-register',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegisterPage implements OnInit {

  loginForm: FormGroup;
  emailValue: string = '';
  passValue: string = '';

  constructor(
    private router:Router,
    private formBuilder:FormBuilder,
    private loadingController: LoadingController,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private mensajes: MensajesService
  ) {
    this.loginForm = this.formBuilder.group({
      email : ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
  }

  async registrarUsuario() {
    const nuevoUsuario: Usuario = {
      email: this.emailValue || '',
      pass: this.passValue || '',
      tipo: 'usuario',
      nombre: '',
      uid: ''
    }
    
    try {
      const usuarioFirebase = await this.authService.register(this.emailValue,this.passValue);
      const user = usuarioFirebase.user;

      if (user) {
        await this.firestore.collection('usuarios').doc(user.uid).set({
          
          uid: user.uid,
          nombre: 'Nombre usuario',
          email: user.email,
          pass: this.passValue,
          tipo: 'usuario'
        });

        Swal.fire({
          title: 'Éxito!',
          text: 'Cuenta creada correctamente!',
          icon: 'success',
          confirmButtonText: 'OK',
          heightAuto: false
        }).then(()=>{
          this.router.navigate(['/login']);
        });

      }
      
      
    
    } catch (error) {
      this.mensajes.mensaje('Error crear la cuentade usuario, intentelo nuevamente!','error','Error!')
      Swal.fire({
      });
    }}
}