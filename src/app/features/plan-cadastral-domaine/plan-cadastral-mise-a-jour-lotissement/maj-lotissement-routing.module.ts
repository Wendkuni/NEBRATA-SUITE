import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanCadastralMiseAJourLotissementComponent } from './maj-lotissement.component';
import { MajLotissementResolver, MajLotissementTransitionResolver, MajLotisssementProcessusResolver}
from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-mise-a-jour-lotissement/maj-lotissement.resolver';
import { EditionPlanCadastralMiseAJourLotissementComponent } from './edition-maj-lotissement/edition-maj-lotissement.component';
import {VueMiseAJourLotissementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-mise-a-jour-lotissement/vue-mise-a-jour-lotissement/vue-mise-a-jour-lotissement.component';

const routes: Routes = [
  {path: '', component: PlanCadastralMiseAJourLotissementComponent },
  {path: 'edition', component: EditionPlanCadastralMiseAJourLotissementComponent,
    resolve: {processus: MajLotisssementProcessusResolver}},
  {path: 'edition/:numero/:transition', component: EditionPlanCadastralMiseAJourLotissementComponent,
    resolve: {majLotissement: MajLotissementResolver,
      transition: MajLotissementTransitionResolver, processus: MajLotisssementProcessusResolver }},
  {path: 'view/:numero', component: VueMiseAJourLotissementComponent,
    resolve: {majLotissement: MajLotissementResolver}}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanCadastralMiseAJourLotissementRoutingModule { }
