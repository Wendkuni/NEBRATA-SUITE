import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntitesCadastralesComponent } from './entites-cadastrales.component';

const routes: Routes = [{ path: '', component: EntitesCadastralesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntitesCadastralesRoutingModule { }
