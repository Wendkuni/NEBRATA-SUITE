import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendrierFiscaleComponent } from './calendrier-fiscale.component';

const routes: Routes = [{ path: '', component: CalendrierFiscaleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendrierFiscaleRoutingModule { }
