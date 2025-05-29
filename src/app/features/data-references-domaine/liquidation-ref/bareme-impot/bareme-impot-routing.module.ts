import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaremeImpotResolver } from './bareme-impot-resolver';

import { BaremeImpotComponent } from './bareme-impot.component';
import { FormBaremeImpotComponent } from './form-bareme-impot/form-bareme-impot.component';

const routes: Routes = [{ path: '', component: BaremeImpotComponent },
  {path: 'edition', component: FormBaremeImpotComponent, data: {breadcrumb: "création bareme impôt"}},
  {path: 'edition/:id', component: FormBaremeImpotComponent, resolve: {baremeImpot: BaremeImpotResolver},
  data: {breadcrumb: "edition bareme impôt"}}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaremeImpotRoutingModule { }
