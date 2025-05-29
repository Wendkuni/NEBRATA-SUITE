import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { TypeImmeubleComponent } from './type-immeuble.component';

const routes: Routes = [{ path: '', component:TypeImmeubleComponent }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeImmeubleRoutingModule { }
