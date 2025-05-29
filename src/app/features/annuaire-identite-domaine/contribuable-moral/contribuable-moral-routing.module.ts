import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ContribuableMoralListComponent} from "@sycadFeature/annuaire-identite-domaine/contribuable-moral/list-contribuable-moral/list-contribuable-moral";
import {ContribuableMoralFormPageComponent} from '@sycadFeature/annuaire-identite-domaine/contribuable-moral/contribuable-moral-form-page/contribuable-moral-form-page.component';
import {ContribuableMoralResolver} from '@sycadFeature/annuaire-identite-domaine/contribuable-moral/contribuable-moral.resolver';


const routes: Routes = [
  { path: '', component: ContribuableMoralListComponent },
  {path: "edition" , component: ContribuableMoralFormPageComponent, data: {breadcrumb: "edition"}},
  {path: "edition/:guid", component: ContribuableMoralFormPageComponent, resolve: {contribuable: ContribuableMoralResolver} , data: {breadcrumb: "edition"}},
  ];
   
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContribuableMoralRoutingModule { }
  