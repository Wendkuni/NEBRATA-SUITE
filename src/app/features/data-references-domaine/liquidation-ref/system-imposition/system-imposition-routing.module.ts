import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SystemImpositionComponent } from './system-imposition.component';

const routes: Routes = [{ path: '', component: SystemImpositionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemImpositionRoutingModule { }
