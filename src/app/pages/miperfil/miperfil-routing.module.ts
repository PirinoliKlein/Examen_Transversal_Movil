import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MiperfilPage } from './miperfil.page';

const routes: Routes = [
  {
    path: '',
    component: MiperfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiperfilPageRoutingModule {}