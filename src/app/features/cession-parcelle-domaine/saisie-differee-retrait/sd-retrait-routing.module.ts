import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  EditionSdRetraitComponent
} from './edition-sd-retrait/edition-sd-retrait.component';
import { RetraitProcessusResolver, RetraitResolver, RetraitTransitionResolver } from './sd-retrait-resolver';
import { SdRetraitComponent } from './sd-retrait.component';
import { VueSdRetraitComponent } from './vue-retrait/vue-sd-retrait.component';


const routes: Routes = [{ path: '', component: SdRetraitComponent },
  {path: 'edition', component: EditionSdRetraitComponent,  resolve: {processus: RetraitProcessusResolver}},
   {path: 'edition/:numero/:transition', component: EditionSdRetraitComponent,
    resolve: {retrait: RetraitResolver, transition: RetraitTransitionResolver, processus: RetraitProcessusResolver}},
  {path:'view/:numero', component: VueSdRetraitComponent, resolve: {retrait: RetraitResolver}}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SdRetraitRoutingModule { }
