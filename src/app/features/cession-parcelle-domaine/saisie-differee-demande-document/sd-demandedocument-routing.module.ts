import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemandeDocumentResolver, DemandeDocumentTransitionResolver, DemandeDocumentProcessusResolver } from './sd-demandedocument-resolver';
import { SdDemandeDocument } from './sd-demandedocument.component';
import { VueSdDemandeDocumentComponent } from './vue-demande-document/vue-sd-demande-document.component';
import {EditionSdDemandeDocumentComponent} from '@sycadApp/features/cession-parcelle-domaine/saisie-differee-demande-document/edition-sd-demande-document/edition-sd-demande-document.component';

const routes: Routes = [{ path: '', component: SdDemandeDocument },
  {path: 'edition', component: EditionSdDemandeDocumentComponent,  resolve: {processus: DemandeDocumentProcessusResolver}},
   {path: 'edition/:numero/:transition', component: EditionSdDemandeDocumentComponent,
    resolve: {demandeDocument: DemandeDocumentResolver, transition: DemandeDocumentTransitionResolver, processus: DemandeDocumentProcessusResolver}},
  {path:'view/:numero', component: VueSdDemandeDocumentComponent, resolve: {demandeDocument: DemandeDocumentResolver}}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SdDemandeDoucmentRoutingModule { }
