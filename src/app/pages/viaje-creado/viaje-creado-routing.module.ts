import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViajeCreadoPage } from './viaje-creado.page';

const routes: Routes = [
  {
    path: '',
    component: ViajeCreadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViajeCreadoPageRoutingModule {}
