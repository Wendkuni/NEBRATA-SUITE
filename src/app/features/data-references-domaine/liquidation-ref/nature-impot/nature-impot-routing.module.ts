import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NatureImpotComponent } from './nature-impot.component';

const routes: Routes = [{ path: '', component: NatureImpotComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NatureImpotRoutingModule { }
