import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormPackageImpotComponent } from './form-package-impot/form-package-impot.component';
import { PackageImpotResolver } from './package-impot-resolver';

import { PackageImpotComponent } from './package-impot.component';


const routes: Routes = [
  { path: '', component: PackageImpotComponent },
  {path: 'edition', component: FormPackageImpotComponent, data: {breadcrumb: "création pakackage impôt"} },
  {path: 'edition/:id', component: FormPackageImpotComponent, resolve: {packageImpot: PackageImpotResolver},
  data: {breadcrumb: "modification package impôt"}
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackageImpotRoutingModule { }
