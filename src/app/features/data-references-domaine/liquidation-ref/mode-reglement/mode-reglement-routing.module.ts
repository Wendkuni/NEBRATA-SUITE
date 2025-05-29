import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModeReglementComponent } from './mode-reglement.component';

const routes: Routes = [{ path: '', component: ModeReglementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModeReglementRoutingModule { }
