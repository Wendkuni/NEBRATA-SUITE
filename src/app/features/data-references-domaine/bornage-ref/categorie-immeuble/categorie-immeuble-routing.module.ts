import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategorieImmeubleComponent } from './categorie-immeuble.component';

const routes: Routes = [{ path: '', component: CategorieImmeubleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategorieImmeubleRoutingModule { }
