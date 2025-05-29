import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RelationIndivisionComponent } from './relation-indivision.component';

const routes: Routes = [{ path: '', component: RelationIndivisionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelationIndivisionRoutingModule { }
