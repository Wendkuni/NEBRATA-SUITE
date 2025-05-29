import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import {ContribuablePhysiqueComponent} from "@sycadFeature/annuaire-identite-domaine/contribuable-physique/contribuable-physique.component";
import {FormPageContribuablePhysiqueComponent} from "@sycadFeature/annuaire-identite-domaine/contribuable-physique/contribuable-physique-form-page/form-page-contribuable-physique/form-page-contribuable-physique.component";
import {ContribuablePhysiqueResolver} from "@sycadFeature/annuaire-identite-domaine/contribuable-physique/contribuable-physique.resolver";




const routes: Routes = [
  { path: "", component: ContribuablePhysiqueComponent },
  { path: "edition", component: FormPageContribuablePhysiqueComponent,data: { breadcrumb: "edition" } },
  { path: "edition/:guid", component: FormPageContribuablePhysiqueComponent ,     resolve: { contribuablePhysique: ContribuablePhysiqueResolver },data: { breadcrumb: "edition" } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContribuablePhysiqueRoutingModule {}
