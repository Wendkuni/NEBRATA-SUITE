
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalWorkflowModule } from '@sycadApp/shared/form-components/processus/global-workflow.module';

import { GenericsFormModule } from '@sycadApp/shared/form-components/generic-form.module';;
import {GeneralGlobalSharedModule} from '@sycadShared/generalShared.module';
import {MatButtonIndicatorSharedModule} from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import {MatPopupModalSharedModule} from '@sycadApp/shared/material-modules/materialPopupModalShared.module';
import {MatFormControlSharedModule} from '@sycadApp/shared/material-modules/materialFormControlShared.module';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';
import { TransitionService } from '@sycadApp/services/workflow/transition.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { BureauService } from '@sycadApp/services/data-references/organigramme/bureau.service';
import { ServiceAdministratifService } from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import { DestinationParcelleService } from '@sycadApp/services/bornage/destination-parcelle.service';
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';
import { MatDataTableSharedModule } from '@sycadApp/shared/material-modules/materialDataTableShared.module';
import { MatSortModule } from '@angular/material/sort';
import { SectionService } from '@sycadApp/services/cession-parcelle/section.service';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { RemoteAutocompeteModule } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/remote-autocompete.module';

import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { MatListModule } from '@angular/material/list';
import { CessionSourceService } from '@sycadApp/services/impot/cession-source.service';
import { IlotService } from '@sycadApp/services/cession-parcelle/ilot.service';


import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';

import { ContactContribuableService } from '@sycadApp/services/data-references/system/contact.service';
import { StatusJuridiqueService } from '@sycadApp/services/data-references/system/status-juridique.service';
import {ContribuablePhysiqueService} from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';
import {ContribuableMoralService} from '@sycadApp/services/data-references/contribuables/contribuable-moral-service';
import { MandatService } from '@sycadApp/services/workflow/mandat.service';
import { SdDemandeDocument } from './sd-demandedocument.component';
import { SdDemandeDoucmentRoutingModule } from './sd-demandedocument-routing.module';
import { DemandeDocumentProcessusResolver, DemandeDocumentResolver, DemandeDocumentTransitionResolver } from './sd-demandedocument-resolver';
import { VueSdDemandeDocumentComponent } from './vue-demande-document/vue-sd-demande-document.component';
import {EditionSdDemandeDocumentComponent} from '@sycadApp/features/cession-parcelle-domaine/saisie-differee-demande-document/edition-sd-demande-document/edition-sd-demande-document.component';
import {CreationSdDemandeDocumentComponent} from '@sycadApp/features/cession-parcelle-domaine/saisie-differee-demande-document/edition-sd-demande-document/creation/creation-sd-demande-document.component';
import {SaisieSdDemandeDocumentComponent} from '@sycadApp/features/cession-parcelle-domaine/saisie-differee-demande-document/edition-sd-demande-document/saisie/saisie-sd-demande-document.component';
import {SdDemandeDocumentService} from '@sycadApp/services/workflow/sd-demande-document.service';
import { CycleDeVieParcelleService } from '@sycadApp/services/workflow/cycle-de-vie-parcelle.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContribuableServicesProvidersModule } from '@sycadApp/shared/form-components/annuaire-identite/contribuable-services-providers/contribuable-providers.module';
import {
  PopupService
} from "@sycadApp/services/cession-parcelle/popup.service";

@NgModule({
  declarations: [SdDemandeDocument, EditionSdDemandeDocumentComponent,
    CreationSdDemandeDocumentComponent,
    SaisieSdDemandeDocumentComponent,
    VueSdDemandeDocumentComponent],
  imports: [
    ContribuableServicesProvidersModule,
    CommonModule,
    SdDemandeDoucmentRoutingModule,
    GlobalWorkflowModule,
    MatSortModule,
    GenericsFormModule,
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

    RemoteAutocompeteModule,
    MatListModule,
    NgOptionHighlightModule
  ],

  providers: [CycleDeVieParcelleService,SdDemandeDocumentService, DemandeDocumentResolver, TransitionService, DemandeDocumentProcessusResolver, DemandeDocumentTransitionResolver, CategoriePieceService,
     BureauService, ServiceAdministratifService, StructureService, IlotService, SectionService, DestinationParcelleService,
    CessionSourceService, ParcelleService, CommunesService, ActeursService, ArrondissementsService, MandatService, ContribuableService,PopupService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: { }}]
})
export class SdDeamandeDocumentModule { }
