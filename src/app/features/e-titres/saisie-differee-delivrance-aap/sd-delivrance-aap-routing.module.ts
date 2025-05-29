import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SdDelivranceAap } from './sd-delivrance-aap.component';
import { SdDelivranceAapProcessusResolver, SdDelivranceAapResolver, SdDelivranceAapTransitionResolver } from './sd-delivrance-aap-resolver';
import { EditionSdDelivranceAapComponent } from './edition-sd-delivrance/edition-sd-delivrance-aap.component';
import { VueSdDelivranceAAPComponent } from './vue-delivrance-aap/vue-sd-delivrance-aap.component';

const routes: Routes = [{ path: '', component: SdDelivranceAap },
  {path: 'edition', component: EditionSdDelivranceAapComponent,  resolve: {processus: SdDelivranceAapProcessusResolver}},
  {path: 'edition/:numero/:transition', component: EditionSdDelivranceAapComponent, resolve: {delivranceAap: SdDelivranceAapResolver, transition: SdDelivranceAapTransitionResolver, processus: SdDelivranceAapProcessusResolver}},
  {path:'view/:numero', component: VueSdDelivranceAAPComponent, resolve: {delivranceAap: SdDelivranceAapResolver}}
];
  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SdDelivranceAapRoutingModule { }
