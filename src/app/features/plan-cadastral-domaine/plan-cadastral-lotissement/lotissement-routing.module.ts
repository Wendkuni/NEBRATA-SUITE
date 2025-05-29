import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LotissementComponent } from './lotissement.component';
import {EditionPlanCadastralLotissementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-lotissement/edition-plan-cadastral-lotissement/edition-plan-cadastral-lotissement.component';
import {PlanCadastralLotissementProcessusResolver, PlanCadastralLotissementResolver, PlanCadastralLotissementTransitionResolver} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-lotissement/lotissement-resolver';
import { VueLotissementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-lotissement/vue-lotissement/vue-lotissement.component';

const routes: Routes = [{ path: '', component: LotissementComponent },
  {path: 'edition', component: EditionPlanCadastralLotissementComponent,  resolve: {processus:PlanCadastralLotissementProcessusResolver}},
   {path: 'edition/:numero/:transition', component: EditionPlanCadastralLotissementComponent,
    resolve: {planCadastral: PlanCadastralLotissementResolver, transition: PlanCadastralLotissementTransitionResolver,processus:PlanCadastralLotissementProcessusResolver}},
  {path:'view/:numero', component: VueLotissementComponent, resolve: {planCadastral: PlanCadastralLotissementResolver}}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LotissementRoutingModule { }
