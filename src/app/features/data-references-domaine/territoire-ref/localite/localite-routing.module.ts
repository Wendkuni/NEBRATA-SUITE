import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocaliteComponent } from './localite.component';

const routes: Routes = [{ path: '', component: LocaliteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocaliteRoutingModule { }
