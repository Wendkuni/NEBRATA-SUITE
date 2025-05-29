import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  TypeTransitionComponent
} from "@sycadFeature/data-references-domaine/generique-ref/type-transition/type-transition.component";
import {
  FormTypeTransitionComponent
} from "@sycadFeature/data-references-domaine/generique-ref/type-transition/form-type-transition/form-type-transition.component";
import {
  TypeTransitionResolver
} from "@sycadFeature/data-references-domaine/generique-ref/type-transition/type-transition-resolver";



const routes: Routes = [
  { path: '', component: TypeTransitionComponent },
  { path: "edition", component: FormTypeTransitionComponent},
  { path: "edition/:id", component: FormTypeTransitionComponent, resolve: { processus: TypeTransitionResolver}, data: {breadcrumb: "edition"}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeTransitionRoutingModule { }
