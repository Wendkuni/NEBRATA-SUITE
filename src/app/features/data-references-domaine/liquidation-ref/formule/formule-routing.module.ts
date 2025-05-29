import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormuleComponent } from './formule.component';

const routes: Routes = [{ path: '', component: FormuleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormuleRoutingModule { }
