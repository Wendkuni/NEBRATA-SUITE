import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LotissementComponent } from './lotissement.component';
import { EditionPlanCadastralLotissementComponent } from './edition-plan-cadastral-lotissement/edition-plan-cadastral-lotissement.component';
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
import {PlanCadastralLotissementProcessusResolver, PlanCadastralLotissementResolver, PlanCadastralLotissementTransitionResolver} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-lotissement/lotissement-resolver';
import {CreationLotissementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-lotissement/edition-plan-cadastral-lotissement/creation/creation-lotissement.component';
import {ValidationSaisieLotissementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-lotissement/edition-plan-cadastral-lotissement/validation-saisie/validation-saisie-lotissement.component';
import {RejetSaisieLotissementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-lotissement/edition-plan-cadastral-lotissement/rejet-saisie/rejet-saisie-lotissement.component';
import {SaisieLotissementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-lotissement/edition-plan-cadastral-lotissement/saisie/saisie-lotissement.component';
import {LotissementRoutingModule} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-lotissement/lotissement-routing.module';
import { ConstructeurDocumentComponent } from './edition-plan-cadastral-lotissement/constructeur-document/constructeur-document.component';
import { DocumentTypeService } from '@sycadApp/services/data-references/system/document-type.service';
import { VueLotissementComponent } from './vue-lotissement/vue-lotissement.component';
import { ImmatriculationComponent } from './edition-plan-cadastral-lotissement/immatriculation/immatriculation.component';
import { EnvoyerPourControleValidationComponent } from './edition-plan-cadastral-lotissement/envoyer-pour-controle-validation/envoyer-pour-controle-validation.component';
import { CompleterAvantValidationComponent } from './edition-plan-cadastral-lotissement/completer-avant-validation/completer-avant-validation.component';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import { DestinationParcelleService } from '@sycadApp/services/bornage/destination-parcelle.service';
import { QuartierService } from '@sycadApp/services/data-references/territoire/quartier.service';
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';
import { ArrondissementZoneService } from '@sycadApp/services/data-references/territoire/arrondissement-zone.service';

import { SectionService } from '@sycadApp/services/cession-parcelle/section.service';
import { MatDataTableSharedModule } from '@sycadApp/shared/material-modules/materialDataTableShared.module';
import { MatSortModule } from '@angular/material/sort';
import { CreationParActeurComponent } from './edition-plan-cadastral-lotissement/creation-par-acteur/creation-par-acteur.component';
import { LotissementService } from '@sycadApp/services/workflow/common/lotissement.service';


@NgModule({
  declarations: [LotissementComponent, EditionPlanCadastralLotissementComponent,
    CreationLotissementComponent, ValidationSaisieLotissementComponent, RejetSaisieLotissementComponent,
    SaisieLotissementComponent,
    ConstructeurDocumentComponent,
    VueLotissementComponent,
    ImmatriculationComponent,
    EnvoyerPourControleValidationComponent,
    CompleterAvantValidationComponent,
    CreationParActeurComponent, ],
  imports: [
    CommonModule,
    LotissementRoutingModule,
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
  providers: [LotissementService, PlanCadastralLotissementResolver, TransitionService, PlanCadastralLotissementProcessusResolver,PlanCadastralLotissementTransitionResolver, CategoriePieceService,
    BureauService, ServiceAdministratifService, StructureService,QuartierService,LocaliteService,SectionService,ArrondissementZoneService, ArrondissementsService, DocumentTypeService,DestinationParcelleService]
})
export class LotissementModule { }
