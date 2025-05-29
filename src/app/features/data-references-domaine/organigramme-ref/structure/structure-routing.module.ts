import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StructureComponent } from './structure.component';
import {FormPageStructureComponent} from "@sycadFeature/data-references-domaine/organigramme-ref/structure/form-page-structure/form-page-structure.component";
import {StructureResolver} from "@sycadFeature/data-references-domaine/organigramme-ref/structure/structure-resolver";

const routes: Routes = [
  { path: '', component: StructureComponent },
  { path:"edition", component: FormPageStructureComponent, data: {breadcrumb: 'edition'}},
  { path: "edition/:id", component: FormPageStructureComponent, resolve: { structure: StructureResolver}, data: {breadcrumb: "edition"}}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StructureRoutingModule { }
