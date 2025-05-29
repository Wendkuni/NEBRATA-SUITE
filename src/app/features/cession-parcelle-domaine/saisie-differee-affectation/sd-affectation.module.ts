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
import { DocumentTypeService } from '@sycadApp/services/data-references/system/document-type.service';
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


import { SdAffectationRoutingModule } from './sd-affectation-routing.module';
import { SdAffectationComponent } from './sd-affectation.component';


import { SdAffectationService } from '@sycadApp/services/workflow/sd-affectation.service';
import { CreationSdAffectationComponent } from './edition-sd-affectation/creation/creation-sd-affectation.component';
import { EditionSdAffectationComponent } from './edition-sd-affectation/edition-sd-affectation.component';
import { SaisieSdAffectationComponent } from './edition-sd-affectation/saisie/saisie-sd-affectation.component';
import { AffectationResolver, AffectationProcessusResolver, AffectationTransitionResolver } from './sd-affectation-resolver';
import { VueSdAffectationComponent } from './vue-affectation/vue-sd-affectation.component';
import { MandatService } from '@sycadApp/services/workflow/mandat.service';
import { CycleDeVieParcelleService } from '@sycadApp/services/workflow/cycle-de-vie-parcelle.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  PopupService
} from "@sycadApp/services/cession-parcelle/popup.service";



@NgModule({
  declarations: [SdAffectationComponent, EditionSdAffectationComponent,
    CreationSdAffectationComponent,
    SaisieSdAffectationComponent,
    VueSdAffectationComponent],
  imports: [
    CommonModule,
    SdAffectationRoutingModule,
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
  providers: [CycleDeVieParcelleService,SdAffectationService, AffectationResolver, TransitionService, AffectationProcessusResolver, AffectationTransitionResolver, CategoriePieceService,
     BureauService, ServiceAdministratifService, StructureService, IlotService, LocaliteService, SectionService, DocumentTypeService, DestinationParcelleService,
    CessionSourceService, ParcelleService, CommunesService, ActeursService, ContribuableService, ProfessionService, ArrondissementsService,MandatService,PopupService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: { }}]
})
export class SdAffectationModule { }
