import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditionSdMajPlanComponent } from './edition-maj-plan/edition-sd-maj-plan.component';

import { SdMajPlanProcessusResolver, SdMajPlanResolver,SdMajPlanTransitionResolver } from './sd-maj-plan-resolver';
import { SdMajPlanComponent } from './sd-maj-plan.component';
import { VueSdMajPlanComponent } from './vue-sd-maj-plan/vue-sd-maj-plan.component';


const routes: Routes = [
  {path: '', component: SdMajPlanComponent },
  {path: 'edition', component: EditionSdMajPlanComponent, resolve: {processus: SdMajPlanProcessusResolver}},

  {path: 'edition/:numero/:transition', component: EditionSdMajPlanComponent,
    resolve: {sdMaj: SdMajPlanResolver,
      transition: SdMajPlanTransitionResolver, processus: SdMajPlanProcessusResolver }},
  {path: 'view/:numero', component: VueSdMajPlanComponent,
    resolve: {sdMaj: SdMajPlanResolver}}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SdMajRoutingModule { }
