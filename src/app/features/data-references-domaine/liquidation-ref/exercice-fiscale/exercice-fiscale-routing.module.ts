import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExerciceFiscaleComponent } from './exercice-fiscale.component';

const routes: Routes = [{ path: '', component: ExerciceFiscaleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExerciceFiscaleRoutingModule { }
