import { FormProfilesComponent } from './form-profiles/form-profiles.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilesComponent } from './profiles.component';
import { ProfileResolver } from './profile-resolver';

const routes: Routes = [
                        { path: '', component: ProfilesComponent },
                        { path: "edition", component: FormProfilesComponent,data: { breadcrumb: "edition" }},
                        { path: "edition/:id", component: FormProfilesComponent, resolve :{profile:ProfileResolver} ,data: { breadcrumb: "edition" }}
                      ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilesRoutingModule { }
