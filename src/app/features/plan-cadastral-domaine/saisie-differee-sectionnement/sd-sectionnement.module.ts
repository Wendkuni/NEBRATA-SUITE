import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SdSectionnementRoutingModule } from './sd-sectionnement-routing.module';
import {
  GlobalWorkflowModule
} from "@sycadShared/form-components/processus/global-workflow.module";
import {
  GenericsFormModule
} from "@sycadShared/form-components/generic-form.module";
import {
  GeneralGlobalSharedModule
} from "@sycadShared/generalShared.module";
import {
  MatButtonIndicatorSharedModule
} from "@sycadShared/material-modules/materialButtonIndicatorShared.module";
import {
  MatPopupModalSharedModule
} from "@sycadShared/material-modules/materialPopupModalShared.module";
import {
  MatFormControlSharedModule
} from "@sycadShared/material-modules/materialFormControlShared.module";
import {MatNativeDateModule} from "@angular/material/core";
import {
  MatDataTableSharedModule
} from "@sycadShared/material-modules/materialDataTableShared.module";
import {MatDividerModule} from "@angular/material/divider";
import {MatMenuModule} from "@angular/material/menu";
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {
  FormsModule,
  ReactiveFormsModule
} from "@angular/forms";
import {
  MatGridListModule
} from "@angular/material/grid-list";
import {
  MatExpansionModule
} from "@angular/material/expansion";
import {
  TransitionService
} from "@sycadApp/services/workflow/transition.service";
import {
  CategoriePieceService
} from "@sycadApp/services/data-references/system/categorie-piece.service";
import {
  BureauService
} from "@sycadApp/services/data-references/organigramme/bureau.service";
import {
  ServiceAdministratifService
} from "@sycadApp/services/data-references/organigramme/ServiceAdministratif.service";
import {
  StructureService
} from "@sycadApp/services/data-references/organigramme/structure.service";
import {
  CommunesService
} from "@sycadApp/services/data-references/territoire/communes.service";
import {
  DocumentTypeService
} from "@sycadApp/services/data-references/system/document-type.service";
import {
  ActeursService
} from "@sycadApp/services/data-references/contribuables/acteurs.service";
import {
  ContribuableService
} from "@sycadApp/services/data-references/system/contribuable.service";
import {
  ParcelleService
} from "@sycadApp/services/cession-parcelle/parcelle.service";
import {
  MandatService
} from "@sycadApp/services/workflow/mandat.service";
import {
  SectionService
} from "@sycadApp/services/cession-parcelle/section.service";
import {
  ProfessionService
} from "@sycadApp/services/data-references/system/profession.service";
import {
  ContribuablePhysiqueService
} from "@sycadApp/services/data-references/contribuables/contribuable-physique.service";
import {
  ContactContribuableService
} from "@sycadApp/services/data-references/system/contact.service";
import {
  StatusJuridiqueService
} from "@sycadApp/services/data-references/system/status-juridique.service";

import {
  SdSectionnementProcessusResolver,
  SdSectionnementResolver, SdSectionnementTransitionResolver
} from "@sycadFeature/plan-cadastral-domaine/saisie-differee-sectionnement/sd-sectionnement-resolver";
import {
  SdSectionnementService
} from "@sycadApp/services/workflow/common/sd-sectionnement.service";
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from "@angular/material/dialog";
import {
  SdSectionnementComponent
} from "@sycadFeature/plan-cadastral-domaine/saisie-differee-sectionnement/sd-sectionnement.component";
import {
  VueSdSectionnementComponent
} from "@sycadFeature/plan-cadastral-domaine/saisie-differee-sectionnement/vue-sd-sectionnement/vue-sd-sectionnement.component";
import {
  EditionSdSectionnementComponent
} from "@sycadFeature/plan-cadastral-domaine/saisie-differee-sectionnement/edition-sectionnement/edition-sd-sectionnement.component";
import {
  SaisieSectionnementComponent
} from "@sycadFeature/plan-cadastral-domaine/saisie-differee-sectionnement/edition-sectionnement/saisie-sectionnement/saisie-sectionnement.component";
import {
  SdCreationComponent
} from "@sycadFeature/plan-cadastral-domaine/saisie-differee-sectionnement/edition-sectionnement/sd-creation/sd-creation.component";
import {
  MatPaginatorModule
} from "@angular/material/paginator";
import { ArchiverDocumentComponent } from './edition-sectionnement/archiver-document/archiver-document.component';


@NgModule({
  declarations: [SdSectionnementComponent,
    VueSdSectionnementComponent,
    SaisieSectionnementComponent,
    SdCreationComponent,
    EditionSdSectionnementComponent,
    SaisieSectionnementComponent,
    ArchiverDocumentComponent

  ],
  imports: [
    CommonModule,
    SdSectionnementRoutingModule,
    GlobalWorkflowModule,
    GenericsFormModule,
    GeneralGlobalSharedModule,
    MatButtonIndicatorSharedModule,
    MatPopupModalSharedModule,
    MatFormControlSharedModule,
    MatNativeDateModule,
    MatDataTableSharedModule,
    MatDividerModule,
    MatMenuModule,
    MatCardModule,
    MatTabsModule,
    FormsModule,
    MatGridListModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatPaginatorModule,
  ],
  providers: [
    SdSectionnementResolver,
    SdSectionnementService, TransitionService,
    SdSectionnementTransitionResolver, SdSectionnementProcessusResolver, CategoriePieceService,
    BureauService, ServiceAdministratifService, StructureService, CommunesService, DocumentTypeService,
    ActeursService, ContribuableService, MandatService, SectionService,ParcelleService,
    ProfessionService, ContribuablePhysiqueService, ContactContribuableService,
    StatusJuridiqueService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: { }}
  ]
})
export class SdSectionnementModule { }
