import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecuperationCompteComponent } from './recuperation-compte.component';

const routes: Routes = [{ path: '', component: RecuperationCompteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecuperationCompteRoutingModule { }
  