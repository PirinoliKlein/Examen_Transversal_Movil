import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/firebas/usuarios.service.spec';
import Swal from 'sweetalert2';
import { IonicModule } from '@ionic/angular';
import { Usuario } from 'src/app/folder/interfaces/usuario';

@Component({
  selector: 'app-restablecer',
  templateUrl: '/restablecer.page.html',
  styleUrls: ['/restablecer.page.scss'],
})
export class RestablecerPage implements OnInit {

  resetPasswordForm: FormGroup;
  emailValue: string = '';
  passValue: string = '';
  
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private firestore: AngularFirestore,
    private authService: AuthService
    
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, 
    );
  }

  ngOnInit() {}

  async recoveryPassword() {
    try {
      let timerInterval: any;
     await this.authService.recoveryPassword(this.emailValue);

      Swal.fire({
        title: "Procesando!",
        html: "Enviando correo...",
        timer: 2000,
        timerProgressBar: true,
        heightAuto:false,
        didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getPopup()!.querySelector("b");
          timerInterval = setInterval(() => {
            timer!.textContent = `${Swal.getTimerLeft()}`;
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        }
      }).then((result) => {
        
        if (result.dismiss === Swal.DismissReason.timer) {
          

          Swal.fire({
            title: 'Éxito!',
            text: 'Correo enviado correctamente!',
            icon: 'success',
            confirmButtonText: 'OK',
            heightAuto: false
          });
        }
      });
    } catch (error) {
      
    }
  }
    
  
}










