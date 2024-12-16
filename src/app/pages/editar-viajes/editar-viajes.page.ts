import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { viajes } from 'src/app/folder/interfaces/Viajes';
import { MensajesService } from 'src/app/services/mensajes.service'; 

@Component({
  selector: 'app-editar-viajes',
  templateUrl: './editar-viajes.page.html',
  styleUrls: ['./editar-viajes.page.scss'],
})
export class EditarViajesPage implements OnInit {
  uid: string = '';
  editViajeForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore,
    private formBuilder: FormBuilder,
    private mensajesService: MensajesService 
  ) {
    this.editViajeForm = this.formBuilder.group({
      pasajeros: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      precio: ['', [Validators.required, Validators.min(1000), Validators.max(10000)]],
      direccion: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.uid = this.activatedRoute.snapshot.paramMap.get('uid') as string;
    this.loadData();
  }

  async loadData() {
    try {
      const viajeDoc = await this.firestore.collection('viajes').doc(this.uid).get().toPromise();
  
      if (viajeDoc && viajeDoc.exists) {
        const viajeData = viajeDoc.data() as viajes;
        this.editViajeForm.patchValue({
          pasajeros: viajeData.pasajeros,
          precio: viajeData.precio,
          direccion: viajeData.direccion,
        });
      } else {
        console.error('El documento del viaje no existe para el UID:', this.uid);
        this.mensajesService.mensaje('El documento del viaje no existe.', 'error', 'Error'); 
      }
    } catch (error) {
      console.error('Error al cargar datos del viaje:', error);
      this.mensajesService.mensaje('Error al cargar datos del viaje.', 'error', 'Error'); 
    }
  }

  async actualizarViaje() {
    if (this.editViajeForm.valid) {
      try {
        const viajeData = await this.firestore.collection('viajes').doc(this.uid).get().toPromise();
  
        if (viajeData && viajeData.exists) {
          const existingData = viajeData.data() as viajes;

          const updatedData = {
            pasajeros: this.editViajeForm.value.pasajeros || existingData.pasajeros,
            precio: this.editViajeForm.value.precio || existingData.precio,
            direccion: this.editViajeForm.value.direccion || existingData.direccion,
          };
  
          await this.firestore.collection('viajes').doc(this.uid).update(updatedData);
          console.log('Datos del viaje actualizados correctamente');
          this.mensajesService.mensaje('Datos del viaje actualizados correctamente', 'success', 'Éxito');
        } else {
          console.error('El documento del viaje no existe para el UID:', this.uid);
          this.mensajesService.mensaje('El documento del viaje no existe.', 'error', 'Error');
        }
      } catch (error) {
        console.error('Error al actualizar los datos del viaje:', error);
        this.mensajesService.mensaje('Error al actualizar los datos del viaje.', 'error', 'Error');
      }
    } else {
      console.warn('Formulario no válido o UID no definido');
      this.mensajesService.mensaje('Formulario no válido. Por favor, revise los campos.', 'error', 'Error');
    }
  }
}
