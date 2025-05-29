import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { MandatResolver } from '@sycadApp/features/annuaire-identite-domaine/mandat/mandat-resolver';
import { MandatResolver} from './mandat-resolver';
import { EditionMandatComponent } from './edition-mandat/edition-mandat.component';
import { MandatProcessusResolver, MandatTransitionResolver } from './mandat-resolver';

import { MandatComponent } from './mandat.component';
import { VueMandatComponent } from './vue-mandat/vue-mandat.component';

const routes: Routes = [{ path: '', component: MandatComponent },
{path:'edition', component: EditionMandatComponent, resolve: {processus: MandatProcessusResolver}},
{path:'edition/:numero/:transition',component: EditionMandatComponent, resolve: {mandat:MandatResolver,transition: MandatTransitionResolver, processus: MandatProcessusResolver}},
{path: 'view/:numero', component: VueMandatComponent, resolve: {mandat: MandatResolver}}];




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MandatRoutingModule { }
