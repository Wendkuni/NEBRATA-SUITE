import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DestinationParcelleComponent } from './destination-parcelle.component';

const routes: Routes = [{ path: '', component: DestinationParcelleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DestinationParcelleRoutingModule { }
