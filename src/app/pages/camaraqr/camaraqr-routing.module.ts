import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CamaraqrPage } from './camaraqr.page';

const routes: Routes = [
  {
    path: '',
    component: CamaraqrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CamaraqrPageRoutingModule {}
