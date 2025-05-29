import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditionExonerationComponent } from './edition-exoneration/edition-exoneration.component';
import { ExonerationProcessusResolver, ExonerationResolver, ExonerationTransitionResolver } from './exoneration-resolver';

import { ExonerationComponent } from './exoneration.component';
import { VueExonerationComponent } from './vue-exoneration/vue-exoneration.component';

const routes: Routes = [
  { path: '', component: ExonerationComponent },
   {path: 'edition', component: EditionExonerationComponent, resolve: {processus: ExonerationProcessusResolver}},
  {path: 'edition/:numero/:transition',component: EditionExonerationComponent, resolve: {exonerationDossier: ExonerationResolver, transition: ExonerationTransitionResolver,
  processus: ExonerationProcessusResolver}},
{path:'view/:numero',component: VueExonerationComponent, resolve: {exonerationDossier: ExonerationResolver}}];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExonerationRoutingModule { }
