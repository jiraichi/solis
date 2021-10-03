import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationDetailsPage } from './location-details.page';

const routes: Routes = [
  {
    path: '',
    component: LocationDetailsPage
  },
  {
    path: 'angle/:coordinates/:sunPosition',
    loadChildren: () => import('./angle/angle.module').then( m => m.AnglePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationDetailsPageRoutingModule {}
