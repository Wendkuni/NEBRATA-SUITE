import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigWorkflowComponent } from './config-workflow.component';
import { ConfigWorkflowResolver } from './config-workflow-resolver';
import { FormConfigProcessusComponent } from './form-config-processus/form-config-processus.component';
import { ConfigProcessusComponent } from './config-processus/config-processus.component';

const routes: Routes = [
  { path: '', component: ConfigWorkflowComponent },
  { path: "edition/:code", component: FormConfigProcessusComponent, resolve: { processus: ConfigWorkflowResolver}, data: {breadcrumb: "edition"}},
  { path: "consultation/:code", component: ConfigProcessusComponent, resolve: { processus: ConfigWorkflowResolver}}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigWorkflowRoutingModule { }
