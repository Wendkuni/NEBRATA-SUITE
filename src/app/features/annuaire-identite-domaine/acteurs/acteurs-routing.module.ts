import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListActeursComponent } from '@sycadFeature/annuaire-identite-domaine/acteurs/list-acteurs/list-acteurs.component';
import { ActeurFormPageComponent } from '@sycadFeature/annuaire-identite-domaine/acteurs/acteur-form-page/acteur-form-page.component';
import { ActeurResolver } from '@sycadFeature/annuaire-identite-domaine/acteurs/acteur.resolver';

const routes: Routes = [
  { path: '', component: ListActeursComponent},
  {path: "edition", component: ActeurFormPageComponent, data: {breacrumb: "edition"}},
  {path: "edition/:guid", component: ActeurFormPageComponent, resolve: {acteur: ActeurResolver} ,data: {breadcrumb: "edition"}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActeursRoutingModule { }
