import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BureauComponent } from './bureau.component';
import {FormPagesBureauComponent} from "@sycadFeature/data-references-domaine/organigramme-ref/bureau/form-pages-bureau/form-pages-bureau.component";
import {BureauResolver} from "@sycadFeature/data-references-domaine/organigramme-ref/bureau/bureau-resolver";

const routes: Routes = [{ path: '', component: BureauComponent },
  {path: 'edition', component: FormPagesBureauComponent , data: {breadcrumb: "edition"}},
  {path: 'edition/:id', component: FormPagesBureauComponent, resolve: {bureau: BureauResolver}, data: {breadcrumb: "edition"}}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BureauRoutingModule { }
