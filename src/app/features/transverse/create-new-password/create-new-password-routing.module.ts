import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CreateNewPasswordComponent } from "./create-new-password.component";
import { CreatePasswordResolver } from './create-password.resolver';


const routes: Routes = [
  { path: "", component: CreateNewPasswordComponent, resolve: { items: CreatePasswordResolver } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateNewPasswordRoutingModule {}



