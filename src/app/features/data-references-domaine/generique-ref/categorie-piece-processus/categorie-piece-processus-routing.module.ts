import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriePieceProcessusComponent } from './categorie-piece-processus.component';

const routes: Routes = [{ path: '', component: CategoriePieceProcessusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriePieceProcessusRoutingModule { }
