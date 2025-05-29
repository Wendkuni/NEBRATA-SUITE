import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArrondissementsComponent } from './arrondissements.component';
import {FormPageArrondissementComponent} from '@sycadFeature/data-references-domaine/territoire-ref/arrondissements/form-page-arrondissement/form-page-arrondissement.component';
import {ArrondissementResolver} from '@sycadFeature/data-references-domaine/territoire-ref/arrondissements/arrondissement-resolver';

const routes: Routes = [{ path: '', component: ArrondissementsComponent },
  {path: 'edition', component: FormPageArrondissementComponent, data: {breadcrumd: "edition"}},
  {path: 'edition/:id', component: FormPageArrondissementComponent, resolve: {arrondissement: ArrondissementResolver}, data: {breadcrumd: "edition"}}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArrondissementsRoutingModule { }
