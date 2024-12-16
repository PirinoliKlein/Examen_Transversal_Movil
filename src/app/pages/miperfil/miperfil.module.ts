import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MiperfilPageRoutingModule } from './miperfil-routing.module';
import { MiperfilPage } from './miperfil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MiperfilPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MiperfilPage]
})
export class MiperfilPageModule {}