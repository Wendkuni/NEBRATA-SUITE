import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionIndexationComponent } from './gestion-indexation.component';

const routes: Routes = [{ path: '', component: GestionIndexationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionIndexationRoutingModule { }
