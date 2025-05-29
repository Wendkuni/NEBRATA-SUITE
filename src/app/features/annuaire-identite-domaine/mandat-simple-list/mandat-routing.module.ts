import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MandatResolver } from './mandat-resolver';

import { MandatComponent } from './mandat.component';

const routes: Routes = [{ path: '', component: MandatComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MandatRoutingModule { }
