import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TypeTitreRecetteComponent } from './type-titre-recette.component';

const routes: Routes = [{ path: '', component: TypeTitreRecetteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeTitreRecetteRoutingModule { }
