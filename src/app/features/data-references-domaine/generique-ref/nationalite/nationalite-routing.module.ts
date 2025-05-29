import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NationaliteComponent } from './nationalite.component';

const routes: Routes = [{ path: '', component: NationaliteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NationaliteRoutingModule { }
