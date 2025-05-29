import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditionSdAffectationComponent } from './edition-sd-affectation/edition-sd-affectation.component';
import { AffectationProcessusResolver, AffectationResolver, AffectationTransitionResolver } from './sd-affectation-resolver';
import { SdAffectationComponent } from './sd-affectation.component';
import { VueSdAffectationComponent } from './vue-affectation/vue-sd-affectation.component';


const routes: Routes = [{ path: '', component: SdAffectationComponent },
  {path: 'edition', component: EditionSdAffectationComponent,  resolve: {processus: AffectationProcessusResolver}},
   {path: 'edition/:numero/:transition', component: EditionSdAffectationComponent,
    resolve: {affectation: AffectationResolver, transition: AffectationTransitionResolver, processus: AffectationProcessusResolver}},
  {path:'view/:numero', component: VueSdAffectationComponent, resolve: {affectation: AffectationResolver}}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SdAffectationRoutingModule { }
