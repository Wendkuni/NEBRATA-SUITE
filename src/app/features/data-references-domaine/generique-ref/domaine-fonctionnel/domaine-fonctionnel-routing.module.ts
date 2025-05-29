import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DomaineFonctionnelComponent } from './domaine-fonctionnel.component';
import {
  FormDomaineFonctionnelComponent
} from "@sycadFeature/data-references-domaine/generique-ref/domaine-fonctionnel/form-domaine-fonctionnel/form-domaine-fonctionnel.component";
import {
  DomaineFonctionnelResolver
} from "@sycadFeature/data-references-domaine/generique-ref/domaine-fonctionnel/domaine-fonctionnel-resolver";


const routes: Routes = [
  { path: '', component: DomaineFonctionnelComponent },
  { path: "edition", component: FormDomaineFonctionnelComponent},
  { path: "edition/:id", component: FormDomaineFonctionnelComponent, resolve: { processus: DomaineFonctionnelResolver}, data: {breadcrumb: "edition"}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DomaineFonctionnelRoutingModule { }
