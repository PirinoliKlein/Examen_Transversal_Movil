import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/folder/interfaces/usuario';  
import { MensajesService } from 'src/app/services/mensajes.service'; // Importa el servicio de mensajes

@Component({
  selector: 'app-editar-user',
  templateUrl: './editar-user.page.html',
  styleUrls: ['./editar-user.page.scss'],
})
export class EditUserPage implements OnInit {
  uid: string = '';
  editUserForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore,
    private formBuilder: FormBuilder,
    private mensajesService: MensajesService 
  ) {
    this.editUserForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required]],
      pass: ['', [Validators.required]],
      tipo: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.uid = this.activatedRoute.snapshot.paramMap.get('uid') as string;
    this.loadData();
  }

  async loadData() {
    try {
      const userDoc = await this.firestore.collection('usuarios').doc(this.uid).get().toPromise();

     
      if (userDoc && userDoc.exists) {
        const userData = userDoc.data() as Usuario; 
        if (userData) {
          this.editUserForm.patchValue({
            email: userData.email,
            nombre: userData.nombre,
            tipo: userData.tipo,
            pass: userData.pass
          });
        } else {
          console.error('No se encontraron datos del usuario');
          this.mensajesService.mensaje('No se encontraron datos del usuario.', 'error', 'Error'); 
        }
      } else {
        console.error('Usuario no encontrado');
        this.mensajesService.mensaje('Usuario no encontrado.', 'error', 'Error'); 
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      this.mensajesService.mensaje('Error al cargar datos del usuario.', 'error', 'Error'); 
    }
  }

  async actualizarUser() {
    if (this.editUserForm.valid) {
      try {
        await this.firestore.collection('usuarios').doc(this.uid).update(this.editUserForm.value);
        console.log('Usuario actualizado correctamente');
        this.mensajesService.mensaje('Usuario actualizado correctamente', 'success', 'Éxito'); 
      } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        this.mensajesService.mensaje('Error al actualizar el usuario.', 'error', 'Error'); 
      }
    } else {
      console.warn('Formulario no válido');
      this.mensajesService.mensaje('Formulario no válido. Por favor, revise los campos.', 'error', 'Error'); 
    }
  }
}
