import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnglePage } from './angle.page';

const routes: Routes = [
  {
    path: '',
    component: AnglePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnglePageRoutingModule {}
