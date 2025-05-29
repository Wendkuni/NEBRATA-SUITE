import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  MotifRejetComponent
} from "@sycadFeature/data-references-domaine/generique-ref/motif-rejet/motif-rejet.component";
import {
  MotifRejetResolver
} from "@sycadFeature/data-references-domaine/generique-ref/motif-rejet/motif-rejet-resolver";
import {
  MotifRejetFormComponent
} from "@sycadFeature/data-references-domaine/generique-ref/motif-rejet/motif-rejet-form/motif-rejet-form.component";




const routes: Routes = [
  { path: '', component: MotifRejetComponent },
  { path: "edition", component: MotifRejetFormComponent},
  { path: "edition/:id", component: MotifRejetFormComponent, resolve: { processus: MotifRejetResolver}, data: {breadcrumb: "edition"}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MotifRejetRoutingModule { }
