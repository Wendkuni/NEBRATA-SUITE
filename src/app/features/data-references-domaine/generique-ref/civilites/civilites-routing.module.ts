import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CivilitesComponent } from './civilites.component';

const routes: Routes = [{ path: '', component: CivilitesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CivilitesRoutingModule { }
