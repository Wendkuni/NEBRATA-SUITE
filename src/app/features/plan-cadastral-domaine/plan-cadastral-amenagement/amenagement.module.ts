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
import { QuartierService } from '@sycadApp/services/data-references/territoire/quartier.service';
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';
import { ArrondissementZoneService } from '@sycadApp/services/data-references/territoire/arrondissement-zone.service';

import { SectionService } from '@sycadApp/services/cession-parcelle/section.service';
import { MatDataTableSharedModule } from '@sycadApp/shared/material-modules/materialDataTableShared.module';
import { MatSortModule } from '@angular/material/sort';

import {AmenagementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-amenagement/amenagement.component';
import {EditionPlanCadastralAmenagementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-amenagement/edition-plan-cadastral-amenagement/edition-plan-cadastral-amenagement.component';
import {CreationAmenagementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-amenagement/edition-plan-cadastral-amenagement/creation/creation-amenagement.component';
import {SaisieAmenagementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-amenagement/edition-plan-cadastral-amenagement/saisie/saisie-amenagement.component';
import {ValidationSaisieAmenagementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-amenagement/edition-plan-cadastral-amenagement/validation-saisie/validation-saisie-amenagement.component';
import {VueAmenagementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-amenagement/vue-amenagement/vue-amenagement.component';
import {RejetSaisieAmenagementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-amenagement/edition-plan-cadastral-amenagement/rejet-saisie/rejet-saisie-amenagement.component';
import {AmenagementRoutingModule} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-amenagement/amenagement-routing.module';
import {PlanCadastralAmenagementProcessusResolver,
  PlanCadastralAmenagementResolver, PlanCadastralAmenagementTransitionResolver} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-amenagement/amenagement-resolver';
import {ImmatriculationComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-amenagement/edition-plan-cadastral-amenagement/immatriculation/immatriculation.component';
import {ConstructeurDocumentComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-amenagement/edition-plan-cadastral-amenagement/constructeur-document/constructeur-document.component';
import {EnvoyerPourControleValidationComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-amenagement/edition-plan-cadastral-amenagement/envoyer-pour-controle-validation/envoyer-pour-controle-validation.component';
import {CreationParActeurComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-amenagement/edition-plan-cadastral-amenagement/creation-par-acteur/creation-par-acteur.component';
import {CompleterAvantValidationComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-amenagement/edition-plan-cadastral-amenagement/completer-avant-validation/completer-avant-validation.component';
import { AmenagementService } from '@sycadApp/services/workflow/common/amenagement.service';
import { CycleDeVieParcelleService } from '@sycadApp/services/workflow/cycle-de-vie-parcelle.service';


@NgModule({
  declarations: [AmenagementComponent, EditionPlanCadastralAmenagementComponent,
    CreationAmenagementComponent, ValidationSaisieAmenagementComponent, RejetSaisieAmenagementComponent,
    SaisieAmenagementComponent,
    ConstructeurDocumentComponent,
    VueAmenagementComponent,
    ImmatriculationComponent,
    EnvoyerPourControleValidationComponent,
    CompleterAvantValidationComponent,
    CreationParActeurComponent, ],
  imports: [
    CommonModule,
    AmenagementRoutingModule,
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
    ReactiveFormsModule
  ],
  providers: [CycleDeVieParcelleService,AmenagementService, PlanCadastralAmenagementResolver, TransitionService, PlanCadastralAmenagementProcessusResolver, PlanCadastralAmenagementTransitionResolver, CategoriePieceService,
    BureauService, ServiceAdministratifService, StructureService, QuartierService, LocaliteService, SectionService, ArrondissementZoneService, ArrondissementsService, DocumentTypeService, DestinationParcelleService]
})
export class AmenagementModule { }
