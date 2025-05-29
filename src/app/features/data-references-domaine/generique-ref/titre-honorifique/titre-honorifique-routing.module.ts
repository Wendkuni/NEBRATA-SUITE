import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TitreHonorifiqueComponent } from './titre-honorifique.component';

const routes: Routes = [{ path: '', component: TitreHonorifiqueComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TitreHonorifiqueRoutingModule { }
