import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DomaineMorcellementComponent } from './domaine-morcellement.component';
import {EditionDomaineMorcellementComponent} from '@sycadApp/features/plan-cadastral-domaine/plan-cadastral-morcellement/edition-domaine-morcellement/edition-domaine-morcellement.component';
import {
  DomaineMorcellementProcessusResolver,
  DomaineMorcellementResolver,
  DomaineMorcellementTransitionResolver
} from '@sycadApp/features/plan-cadastral-domaine/plan-cadastral-morcellement/domaine-morcellement-resolver';
import {VueDomaineMorcellementComponent} from '@sycadApp/features/plan-cadastral-domaine/plan-cadastral-morcellement/vue-domaine-morcellement/vue-domaine-morcellement.component';

const routes: Routes = [{ path: '', component: DomaineMorcellementComponent },
  {path: 'edition', component: EditionDomaineMorcellementComponent, resolve: {processus: DomaineMorcellementProcessusResolver}},
  {path: 'edition/:numero/:transition', component: EditionDomaineMorcellementComponent, resolve: {morcellement: DomaineMorcellementResolver,
    transition: DomaineMorcellementTransitionResolver, processus: DomaineMorcellementProcessusResolver }},
  {path:'view/:numero', component: VueDomaineMorcellementComponent, resolve: {morcellement: DomaineMorcellementResolver}}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DomaineMorcellementRoutingModule { }
