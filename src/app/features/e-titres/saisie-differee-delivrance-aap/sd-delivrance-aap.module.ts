import { EditionSdDelivranceAapComponent } from './edition-sd-delivrance/edition-sd-delivrance-aap.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SdDelivranceAap } from './sd-delivrance-aap.component';
import { SdDelivranceAapRoutingModule } from './sd-delivrance-aap-routing.module';
import { SdDelivranceAapService } from '@sycadApp/services/workflow/sd-delivrance-aap.service';
import { SdDelivranceAapProcessusResolver, SdDelivranceAapResolver, SdDelivranceAapTransitionResolver } from './sd-delivrance-aap-resolver';
import { GlobalWorkflowModule } from '@sycadApp/shared/form-components/processus/global-workflow.module';
import { MatSortModule } from '@angular/material/sort';
import { GeneralGlobalSharedModule } from '@sycadApp/shared/generalShared.module';
import { MatDataTableSharedModule } from '@sycadApp/shared/material-modules/materialDataTableShared.module';
import { MatButtonIndicatorSharedModule } from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import { MatPopupModalSharedModule } from '@sycadApp/shared/material-modules/materialPopupModalShared.module';
import { MatFormControlSharedModule } from '@sycadApp/shared/material-modules/materialFormControlShared.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { RemoteAutocompeteModule } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/remote-autocompete.module';
import { MatListModule } from '@angular/material/list';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { ActeursService } from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { StructureService } from '@sycadApp/services/data-references/organigramme/structure.service';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { SectionService } from '@sycadApp/services/cession-parcelle/section.service';
import { IlotService } from '@sycadApp/services/cession-parcelle/ilot.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { MandatService } from '@sycadApp/services/workflow/mandat.service';
import { TransitionService } from '@sycadApp/services/workflow/transition.service';
import { QuittanceFormComponent } from './quittance-form/quittance-form.component';
import { DestinationParcelleService } from '@sycadApp/services/bornage/destination-parcelle.service';
import { VueSdDelivranceAAPComponent } from './vue-delivrance-aap/vue-sd-delivrance-aap.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  ArchiverSdDelivranceAapComponent
} from "@sycadFeature/e-titres/saisie-differee-delivrance-aap/edition-sd-delivrance/archiver-sd-delivrance-aap/archiver-sd-delivrance-aap.component";
import {
  ValiderSdDelivranceAapComponent
} from "@sycadFeature/e-titres/saisie-differee-delivrance-aap/edition-sd-delivrance/valider-sd-delivrance-aap/valider-sd-delivrance-aap.component";
import { BureauService } from '@sycadApp/services/data-references/organigramme/bureau.service';
import { ServiceAdministratifService } from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';
import { UserProfilAttributionService } from '@sycadApp/services/data-references/system/user-profil-attribution.service';
import { SdAttributionService } from '@sycadApp/services/workflow/sd-attribution.service';
import { ContribuableServicesProvidersModule } from '@sycadApp/shared/form-components/annuaire-identite/contribuable-services-providers/contribuable-providers.module';
import {
  PopupService
} from "@sycadApp/services/cession-parcelle/popup.service";
import { CreationSdDelivranceAapParContribuableComponent } from './edition-sd-delivrance/creation-par-contribuable/creation-sd-delivrance-aap-par-contribuable.component';
import { CreationSdDelivranceAapParAgentComponent } from './edition-sd-delivrance/creation-par-agent/creation-sd-delivrance-aap-par-agent.component';
import { SaisieParAgentSdDelivranceAapComponent } from './edition-sd-delivrance/saisie-par-agent/saisie-sd-delivrance-aap-par-agent.component';
import { SaisieParContribuableSdDelivranceAapComponent } from './edition-sd-delivrance/saisie-par-contribuable/saisie-sd-delivrance-aap-par-contribuable.component';
import { RetirerTitreSdDelivranceAapComponent } from './edition-sd-delivrance/retirer-titre-sd-delivrance-aap/retirer-titre-sd-delivrance-aap.component';
import { AjoutMAndatSdDelivranceAapComponent } from './edition-sd-delivrance/ajout-mandat/ajout-mandat-sd-delivrance-aap.component';
import { DataStoreService } from '@sycadApp/services/data-references/system/data-store.service';
import { ParcelleInexistanteComponent } from '@sycadApp/shared/form-components/plan-cadastral/parcelle-inexistante/parcelle-inexistante.component';
import { GenericsFormModule } from '@sycadApp/shared/form-components/generic-form.module';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';

@NgModule({
  declarations: [
    SdDelivranceAap,
    VueSdDelivranceAAPComponent,
    SaisieParAgentSdDelivranceAapComponent,
    SaisieParContribuableSdDelivranceAapComponent,
    CreationSdDelivranceAapParAgentComponent,
    CreationSdDelivranceAapParContribuableComponent,
    EditionSdDelivranceAapComponent,
    QuittanceFormComponent,
    AjoutMAndatSdDelivranceAapComponent,
    ArchiverSdDelivranceAapComponent,
    RetirerTitreSdDelivranceAapComponent,
    ValiderSdDelivranceAapComponent,

  ],
  imports: [
    ContribuableServicesProvidersModule,
    CommonModule,
    SdDelivranceAapRoutingModule,
    GlobalWorkflowModule,
    MatSortModule,
    GeneralGlobalSharedModule,
    MatDataTableSharedModule,
    MatButtonIndicatorSharedModule,
    MatPopupModalSharedModule,
    MatFormControlSharedModule,
    MatNativeDateModule,
    MatDividerModule,
    MatMenuModule,
    MatCardModule,
    MatTabsModule,
    FormsModule,
    MatGridListModule,
    MatExpansionModule,
    ReactiveFormsModule,
    GenericsFormModule,
    RemoteAutocompeteModule,
    MatListModule,
    NgOptionHighlightModule,
 
  ],
  exports: [
    SdDelivranceAap,

  ],
  providers: [
    UserProfilAttributionService,
    SdAttributionService,
    SdDelivranceAapService,
    SdDelivranceAapResolver,
    ActeursService,
    CategoriePieceService,
    ParcelleService,
    CommunesService,
    SectionService,
    IlotService,
    SdDelivranceAapProcessusResolver,
    AppConfirmService,
    MandatService,
    SdDelivranceAapTransitionResolver,
    TransitionService,
    BureauService,
    ServiceAdministratifService,
    StructureService,
    ContribuableService,
    DestinationParcelleService,
    DataStoreService,
    PopupService,
    ArrondissementsService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: { }}
  ]
})
export class SdDelivranceAapModule { }
