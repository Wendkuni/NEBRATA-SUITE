import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanCadastralFusionnementComponent } from './fusion.component';
import { EditionPlanCadastralFusionnementComponent } from './edition-plan-cadastral-fusion/edition-fusion.component';
import {
  PlanCadastralFusionnementTransitionResolver,
  PlanCadastralFusionnementResolver,
  DomaineFusionProcessusResolver
} from './fusion-resolver';
import {VueFusionnementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-fusion/vue-fusion/vue-fusion.component';

const routes: Routes = [{ path: '', component: PlanCadastralFusionnementComponent },
  {path: 'edition', component: EditionPlanCadastralFusionnementComponent, resolve: {processus: DomaineFusionProcessusResolver}},
  {path: 'edition/:numero/:transition', component: EditionPlanCadastralFusionnementComponent, resolve: {fusion: PlanCadastralFusionnementResolver,
      transition: PlanCadastralFusionnementTransitionResolver, processus: DomaineFusionProcessusResolver }},
  {path:'view/:numero', component: VueFusionnementComponent, resolve: {fusion: PlanCadastralFusionnementResolver}}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanCadastralFusionnementRoutingModule { }
