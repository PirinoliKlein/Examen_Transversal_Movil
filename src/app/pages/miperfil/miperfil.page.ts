import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/firebas/usuarios.service.spec';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-miperfil',
  templateUrl: './miperfil.page.html',
  styleUrls: ['./miperfil.page.scss'],
})
export class MiperfilPage implements OnInit {
  usuario: any = {};
  perfilForm: FormGroup;

  constructor(private authService: AuthService, private firestore: AngularFirestore, private formBuilder: FormBuilder) {
    this.perfilForm = this.formBuilder.group({
      nombre: ['', [this.noNumeros]], // Validación para el nombre (sin números)
      telefono: ['', [Validators.pattern(/^[0-9]*$/), Validators.minLength(10), Validators.maxLength(15)]], // Validaciones opcionales
      direccion: [''] // Sin validación
    });
  }

  ngOnInit() {
    this.cargarPerfil();
  }

  cargarPerfil() {
    this.authService.isLogged().subscribe(user => {
      if (user) {
        const uid = user.uid; 
        this.firestore.collection('usuarios').doc(uid).get().toPromise()
          .then(doc => {
            if (doc && doc.exists) {
              this.usuario = doc.data() || {};
              this.perfilForm.patchValue(this.usuario); // Poblamos el formulario con los datos del usuario
            } else {
              console.error('No se encontró el perfil del usuario');
            }
          })
          .catch(error => {
            console.error('Error al cargar el perfil:', error);
          });
      } else {
        console.error('Usuario no autenticado');
      }
    });
  }

  noNumeros(control: any) {
    const valor = control.value;
    if (valor && /\d/.test(valor)) {
      return { noNumeros: true }; // Retorna un error si hay números
    }
    return null; // Sin errores
  }

  guardarCambios() {
    const formValue = this.perfilForm.value;
    
    // Validar que al menos un campo sea válido para proceder a la actualización
    if (this.perfilForm.get('nombre')?.valid || this.perfilForm.get('telefono')?.valid || (formValue.direccion && formValue.direccion.length > 0)) {
      this.authService.isLogged().subscribe(user => {
        if (user) {
          const uid = user.uid; 
          
          // Crear un objeto solo con los campos que son válidos y tienen valor
          const updatedData: any = {};
          if (this.perfilForm.get('nombre')?.valid) {
            updatedData.nombre = formValue.nombre;
          }
          if (this.perfilForm.get('telefono')?.valid) {
            updatedData.telefono = formValue.telefono;
          }
          if (formValue.direccion) {
            updatedData.direccion = formValue.direccion;
          }
          
          // Actualizar solo los campos que son válidos
          this.firestore.collection('usuarios').doc(uid).update(updatedData)
            .then(() => {
              console.log('Perfil actualizado correctamente');
            })
            .catch(error => {
              console.error('Error al actualizar el perfil:', error);
            });
        }
      });
    } else {
      console.error('Por favor, corrige los errores en el formulario antes de enviar.');
      this.mostrarErrores();
    }
  }

  mostrarErrores() {
    if (this.perfilForm.get('nombre')?.invalid && this.perfilForm.get('nombre')?.value) {
      console.error('El nombre no puede contener números.');
    }
    if (this.perfilForm.get('telefono')?.invalid && this.perfilForm.get('telefono')?.value) {
      console.error('El teléfono debe contener solo números y tener entre 10 y 15 dígitos.');
    }
  }
}
