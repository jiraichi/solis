import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnglePageRoutingModule } from './angle-routing.module';

import { AnglePage } from './angle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnglePageRoutingModule
  ],
  declarations: [AnglePage]
})
export class AnglePageModule {}
