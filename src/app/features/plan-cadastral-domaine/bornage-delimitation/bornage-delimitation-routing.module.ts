import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BornageDelimitationProcessusResolver, BornageDelimitationResolver, BornageDelimitationTransitionResolver } from './bornage-delimitation-resolver';

import { BornageDelimitationComponent } from './bornage-delimitation.component';
import { EditionBornageDelimitationComponent } from './edition-bornage-delimitation/edition-bornage-delimitation.component';
import { VueBornageDelimitationComponent } from './vue-bornage-delimitation/vue-bornage-delimitation.component';



const routes: Routes = [{ path: '', component: BornageDelimitationComponent },
  {path: 'edition', component: EditionBornageDelimitationComponent,  resolve: {processus: BornageDelimitationProcessusResolver}},
   {path: 'edition/:numero/:transition', component: EditionBornageDelimitationComponent,
    resolve: {bornage: BornageDelimitationResolver, transition: BornageDelimitationTransitionResolver, processus: BornageDelimitationProcessusResolver}},
  {path:'view/:numero', component: VueBornageDelimitationComponent, resolve: {bornage: BornageDelimitationResolver}}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BornageDelimitationRoutingModule { }

