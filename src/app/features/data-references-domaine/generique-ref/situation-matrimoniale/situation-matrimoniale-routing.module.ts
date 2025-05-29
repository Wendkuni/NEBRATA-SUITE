import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SituationMatrimonialeComponent } from './situation-matrimoniale.component';

const routes: Routes = [{ path: '', component: SituationMatrimonialeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SituationMatrimonialeRoutingModule { }
