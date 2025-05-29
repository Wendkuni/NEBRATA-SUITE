import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecteurActiviteComponent } from './secteur-activite.component';

const routes: Routes = [{ path: '', component: SecteurActiviteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecteurActiviteRoutingModule { }
