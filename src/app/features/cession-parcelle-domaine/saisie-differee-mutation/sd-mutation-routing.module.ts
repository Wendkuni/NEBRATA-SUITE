import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  EditionSdMutationComponent
} from './edition-sd-mutation/edition-sd-mutation.component';
import { MutationProcessusResolver, MutationResolver, MutationTransitionResolver } from './sd-muation-resolver';
import { SdMutationComponent } from './sd-mutation.component';
import { VueSdMutationComponent } from './vue-mutation/vue-sd-mutation.component';



const routes: Routes = [{ path: '', component: SdMutationComponent},
  {path: 'edition', component: EditionSdMutationComponent,  resolve: {processus: MutationProcessusResolver}},
   {path: 'edition/:numero/:transition', component: EditionSdMutationComponent,
    resolve: {mutation: MutationResolver, transition: MutationTransitionResolver, processus: MutationProcessusResolver}},
  {path:'view/:numero', component: VueSdMutationComponent, resolve: {mutation:  MutationResolver}}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SdMutationRoutingModule { }
