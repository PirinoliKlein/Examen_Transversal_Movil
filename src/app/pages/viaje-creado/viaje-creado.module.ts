import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViajeCreadoPageRoutingModule } from './viaje-creado-routing.module';

import { ViajeCreadoPage } from './viaje-creado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViajeCreadoPageRoutingModule
  ],
  declarations: [ViajeCreadoPage]
})
export class ViajeCreadoPageModule {}
