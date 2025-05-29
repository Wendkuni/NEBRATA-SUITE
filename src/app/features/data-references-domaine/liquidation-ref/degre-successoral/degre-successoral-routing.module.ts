import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DegreSuccessoralComponent } from './degre-successoral.component';

const routes: Routes = [{ path: '', component: DegreSuccessoralComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DegreSuccessoralRoutingModule { }
