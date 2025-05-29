import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuartierComponent } from './quartier.component';

const routes: Routes = [{ path: '', component: QuartierComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuartierRoutingModule { }
