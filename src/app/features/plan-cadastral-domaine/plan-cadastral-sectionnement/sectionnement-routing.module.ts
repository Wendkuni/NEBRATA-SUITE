import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransitionResolver } from '@sycadApp/shared/form-components/processus/transition/transition.resolver';
import {PlanCadastralSectionnementProcessusResolver, PlanCadastralSectionnementResolver, PlanCadastralSectionnementTransitionResolver} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/sectionnement.resolver';
import { EditionPlanCadastralComponent } from './edition-plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement.component';
import {PlanCadastralComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/sectionnement.component';
import {VueSectionnementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/vue-sectionnement/vue-sectionnement.component';



const routes: Routes = [
  { path: '', component: PlanCadastralComponent },
  {path: 'edition', component: EditionPlanCadastralComponent,  resolve: {processus:PlanCadastralSectionnementProcessusResolver} },
  {path: 'edition/:numero/:transition', component: EditionPlanCadastralComponent,
    resolve: {planCadastral: PlanCadastralSectionnementResolver,transition:PlanCadastralSectionnementTransitionResolver,processus:PlanCadastralSectionnementProcessusResolver} },
  {path: 'view/:numero', component: VueSectionnementComponent, resolve: {planCadastral: PlanCadastralSectionnementResolver}}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanCadastralRoutingModule { }
