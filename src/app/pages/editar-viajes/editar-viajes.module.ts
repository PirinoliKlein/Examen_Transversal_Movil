import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarViajesPageRoutingModule } from './editar-viajes-routing.module';

import { EditarViajesPage } from './editar-viajes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarViajesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditarViajesPage]
})
export class EditarViajesPageModule {}
