import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatusJuridiqueComponent } from './status-juridique.component';

const routes: Routes = [{ path: '', component: StatusJuridiqueComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatusJuridiqueRoutingModule { }
