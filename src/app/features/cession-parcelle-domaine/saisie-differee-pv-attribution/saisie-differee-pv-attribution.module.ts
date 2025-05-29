
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
import { MatDataTableSharedModule } from '@sycadApp/shared/material-modules/materialDataTableShared.module';
import { MatSortModule } from '@angular/material/sort';
import { SectionService } from '@sycadApp/services/cession-parcelle/section.service';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { MatListModule } from '@angular/material/list';
import { IlotService } from '@sycadApp/services/cession-parcelle/ilot.service';
import { RemoteAutocompeteModule } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/remote-autocompete.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SaisieDiffereePvAttributionComponent } from './saisie-differee-pv-attribution.component';
import { EditionSaisieAttributionComponent } from './edition-saisie-attribution/edition-saisie-attribution.component';
import { VueSaisieAttributionComponent } from './vue-saisie-attribution/vue-saisie-attribution.component';
import { CreationSaisiePvAttributionComponent } from './edition-saisie-attribution/creation/creation-saisie-pv-attribution.component';
import { SaisieDiffereePvAttributionRoutingModule } from './saisie-differee-pv-attribution-routing.module';
import { SdEntetePVService } from '@sycadApp/services/workflow/sd-entetePV.service';
import { EntetePVProcessusResolver, EntetePVResolver, EntetePVTransitionResolver } from './saisie-differee-pv-attribution-resolver';
import { SaisiePvAttributionComponent } from './edition-saisie-attribution/saisie/saisie-pv-attribution.component';
import { CessionSourceService } from '@sycadApp/services/impot/cession-source.service';
import { ActeursService } from '@sycadApp/services/data-references/contribuables/acteurs.service';
import {
  DocumentTypeService
} from "@sycadApp/services/data-references/system/document-type.service";
import { 
  ArrondissementsService
} from "@sycadApp/services/data-references/territoire/arrondissements.service";
import {AngularEditorModule} from "@kolkov/angular-editor";
import {
  ArchivagePVAttributionComponent
} from "@sycadFeature/cession-parcelle-domaine/saisie-differee-pv-attribution/edition-saisie-attribution/archivage-pvattribution/archivage-pvattribution.component";



@NgModule({
  declarations: [
    SaisieDiffereePvAttributionComponent,
    EditionSaisieAttributionComponent,
    VueSaisieAttributionComponent,
    CreationSaisiePvAttributionComponent,
    SaisiePvAttributionComponent,
    ArchivagePVAttributionComponent
  ],
  imports: [
    CommonModule,
    SaisieDiffereePvAttributionRoutingModule,
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
    NgOptionHighlightModule,
    AngularEditorModule

  ],

  providers: [SdEntetePVService, EntetePVResolver, TransitionService, EntetePVProcessusResolver, EntetePVTransitionResolver, CategoriePieceService,DocumentTypeService,
    BureauService, ServiceAdministratifService, StructureService,  CommunesService, SectionService, IlotService, CessionSourceService, ActeursService,ArrondissementsService
   ,
   { provide: MatDialogRef, useValue: {} },
   { provide: MAT_DIALOG_DATA, useValue: { }}]

})
export class SaisieDiffereePvAttributionModule { }
