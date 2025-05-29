import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserProfilComponent } from './user-profil.component';

const routes: Routes = [{ path: '', component: UserProfilComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfilRoutingModule { }
    