import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParcelleBaremeComponent } from './parcelle-bareme.component';

const routes: Routes = [{ path: '', component: ParcelleBaremeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParcelleBaremeRoutingModule { }
