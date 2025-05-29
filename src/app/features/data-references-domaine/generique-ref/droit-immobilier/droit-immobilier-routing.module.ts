import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DroitImmobilierComponent } from './droit-immobilier.component';
import {
  FormDroitImmobilierComponent
} from "@sycadFeature/data-references-domaine/generique-ref/droit-immobilier/form-droit-immobilier/form-droit-immobilier.component";
import {
  DroitImmobilierResolver
} from "@sycadFeature/data-references-domaine/generique-ref/droit-immobilier/droit-immobilier-resolver";


const routes: Routes = [
  { path: '', component: DroitImmobilierComponent },
  { path: "edition", component: FormDroitImmobilierComponent},
  { path: "edition/:id", component: FormDroitImmobilierComponent, resolve: { processus: DroitImmobilierResolver}, data: {breadcrumb: "edition"}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DroitImmobilierRoutingModule { }
