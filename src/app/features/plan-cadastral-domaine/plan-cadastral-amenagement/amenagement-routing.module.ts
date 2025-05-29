import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PlanCadastralAmenagementProcessusResolver, PlanCadastralAmenagementResolver,
  PlanCadastralAmenagementTransitionResolver} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-amenagement/amenagement-resolver';
import {EditionPlanCadastralAmenagementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-amenagement/edition-plan-cadastral-amenagement/edition-plan-cadastral-amenagement.component';
import {AmenagementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-amenagement/amenagement.component';
import {VueAmenagementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-amenagement/vue-amenagement/vue-amenagement.component';

const routes: Routes = [{ path: '', component: AmenagementComponent },
  {path: 'edition', component: EditionPlanCadastralAmenagementComponent,  resolve: {processus: PlanCadastralAmenagementProcessusResolver}},
   {path: 'edition/:numero/:transition', component: EditionPlanCadastralAmenagementComponent,
    resolve: {planCadastral: PlanCadastralAmenagementResolver, transition: PlanCadastralAmenagementTransitionResolver, processus: PlanCadastralAmenagementProcessusResolver}},
  {path:'view/:numero', component: VueAmenagementComponent, resolve: {planCadastral: PlanCadastralAmenagementResolver}}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AmenagementRoutingModule { }
