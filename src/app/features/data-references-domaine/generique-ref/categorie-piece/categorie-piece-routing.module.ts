import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriePieceComponent } from './categorie-piece.component';

const routes: Routes = [{ path: '', component: CategoriePieceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriePieceRoutingModule { }
