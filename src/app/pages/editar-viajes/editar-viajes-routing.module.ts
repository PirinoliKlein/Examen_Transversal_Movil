import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarViajesPage } from './editar-viajes.page';

const routes: Routes = [
  {
    path: '',
    component: EditarViajesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarViajesPageRoutingModule {}
