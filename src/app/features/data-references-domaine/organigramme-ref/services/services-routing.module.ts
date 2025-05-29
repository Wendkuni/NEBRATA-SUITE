import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicesComponent } from './services.component';
import {FormPagesServicesComponent} from "@sycadFeature/data-references-domaine/organigramme-ref/services/form-pages-services/form-pages-services.component";
import {ServicesResolver} from "@sycadFeature/data-references-domaine/organigramme-ref/services/services-resolver";

const routes: Routes = [{ path: '', component: ServicesComponent },
  {path: "edition", component: FormPagesServicesComponent, data: {breadcrumb: "edition"}},
  {path: "edition/:id", component: FormPagesServicesComponent, resolve : {service: ServicesResolver}, data: {breadcrumb: "edition"}}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
