import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { IndivisionsComponent } from "@sycadFeature/annuaire-identite-domaine/indivisions/indivisions.component";
import { FormPageIndivisionComponent } from '@sycadFeature/annuaire-identite-domaine/indivisions/form-page/form-page-indivision/form-page-indivision.component';
import { IndivisionsResolver } from '@sycadFeature/annuaire-identite-domaine/indivisions/indivisions.resolver';


const routes: Routes = [
  { path: "", component: IndivisionsComponent },
  { path: "edition", component: FormPageIndivisionComponent,data: { breadcrumb: "edition" } },
  { path: "edition/:guid", component: FormPageIndivisionComponent ,     resolve: { indivision: IndivisionsResolver },data: { breadcrumb: "edition" } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndivisionsRoutingModule {}
