import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CamaraqrPageRoutingModule } from './camaraqr-routing.module';

import { CamaraqrPage } from './camaraqr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CamaraqrPageRoutingModule
  ],
  declarations: [CamaraqrPage]
})
export class CamaraqrPageModule {}
