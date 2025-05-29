import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { EditionSdAttributionComponent } from './edition-sd-attribution/edition-sd-attribution.component';
import { AttributionContexteResolver, AttributionProcessusResolver, AttributionResolver, AttributionTransitionResolver } from './sd-attribution-resolver';
import { SdAttributionComponent } from './sd-attribution.component';
import { VueSdAttributionComponent } from './vue-attribution/vue-sd-attribution.component';

const routes: Routes = [{ path: '', component: SdAttributionComponent },
  {path: 'edition', component: EditionSdAttributionComponent,  resolve: {processus: AttributionProcessusResolver, contexteAttribution: AttributionContexteResolver}},
   {path: 'edition/:numero/:transition', component: EditionSdAttributionComponent,
    resolve: {attribution: AttributionResolver, transition: AttributionTransitionResolver, processus: AttributionProcessusResolver}},
  {path:'view/:numero', component: VueSdAttributionComponent, resolve: {attribution: AttributionResolver}}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SdAttributionRoutingModule { }
