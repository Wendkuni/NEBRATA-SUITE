
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
import { MatDataTableSharedModule } from '@sycadApp/shared/material-modules/materialDataTableShared.module';
import { MatSortModule } from '@angular/material/sort';
import { SectionService } from '@sycadApp/services/cession-parcelle/section.service';
import { SdAttributionComponent } from './sd-attribution.component';
import { EditionSdAttributionComponent } from './edition-sd-attribution/edition-sd-attribution.component';
import { VueSdAttributionComponent } from './vue-attribution/vue-sd-attribution.component';
import { SdAttributionRoutingModule } from './sd-attribution-routing.module';
import { AttributionContexteResolver, AttributionProcessusResolver, AttributionResolver, AttributionTransitionResolver } from './sd-attribution-resolver';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { MatListModule } from '@angular/material/list';
import { CessionSourceService } from '@sycadApp/services/impot/cession-source.service';
import { IlotService } from '@sycadApp/services/cession-parcelle/ilot.service';


import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';
import { SdAttributionService } from '@sycadApp/services/workflow/sd-attribution.service';
import { CreationSdAttributionComponent } from './edition-sd-attribution/creation/creation-sd-attribution.component';
import { SaisieSdAttributionComponent } from './edition-sd-attribution/saisie/saisie-sd-attribution.component';
import { MandatService } from '@sycadApp/services/workflow/mandat.service';
import { RemoteAutocompeteModule } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/remote-autocompete.module';
import { CycleDeVieParcelleService } from '@sycadApp/services/workflow/cycle-de-vie-parcelle.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { AppSettingsService } from '@sycadApp/config/app.settings.service';
import { BlocageSaisieAttributionComponent } from './edition-sd-attribution/blocage/blocage-saisie-attribution.component';
import { SdEntetePVService } from '@sycadApp/services/workflow/sd-entetePV.service';
import { SaisieDiffereeAttributionContexteService } from '@sycadApp/services/workflow/saisie-differee-attribution-contexte.service';
import { ContribuableServicesProvidersModule } from '@sycadApp/shared/form-components/annuaire-identite/contribuable-services-providers/contribuable-providers.module';
import {
  PopupService
} from "@sycadApp/services/cession-parcelle/popup.service";
import {
  DocumentTypeService
} from "@sycadApp/services/data-references/system/document-type.service";
import {
  MotifRejetService
} from "@sycadApp/services/data-references/system/motif-rejet.service";
import {AngularEditorModule} from "@kolkov/angular-editor";
import { QuartierService } from '@sycadApp/services/data-references/territoire/quartier.service';
import { ParcelleInexistanteComponent } from '@sycadApp/shared/form-components/plan-cadastral/parcelle-inexistante/parcelle-inexistante.component';


@NgModule({
  declarations: [SdAttributionComponent, EditionSdAttributionComponent, 
    CreationSdAttributionComponent,
    SaisieSdAttributionComponent,
    VueSdAttributionComponent,
    BlocageSaisieAttributionComponent],
  imports: [
    ContribuableServicesProvidersModule,
    CommonModule,
    SdAttributionRoutingModule,
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

  providers: [SaisieDiffereeAttributionContexteService, CycleDeVieParcelleService,SdAttributionService,AttributionResolver, TransitionService,AttributionProcessusResolver,AttributionTransitionResolver, CategoriePieceService,
    BureauService, ServiceAdministratifService, StructureService, IlotService, SectionService, DestinationParcelleService,DocumentTypeService,
    CessionSourceService, ParcelleService, CommunesService, ActeursService, ArrondissementsService, MandatService,MotifRejetService,
    AppConfirmService, AppSettingsService, SdEntetePVService, AttributionContexteResolver, ContribuableService,PopupService,QuartierService,DestinationParcelleService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: { }}]
})
export class SdAttributionModule { }
