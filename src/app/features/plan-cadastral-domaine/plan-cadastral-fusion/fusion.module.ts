import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalWorkflowModule } from '@sycadApp/shared/form-components/processus/global-workflow.module';

import { GenericsFormModule } from '@sycadApp/shared/form-components/generic-form.module';
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
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { EditionPlanCadastralFusionnementComponent } from './edition-plan-cadastral-fusion/edition-fusion.component';
import {PlanCadastralFusionnementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-fusion/fusion.component';
import {
  DomaineFusionProcessusResolver,
  PlanCadastralFusionnementResolver,
  PlanCadastralFusionnementTransitionResolver
} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-fusion/fusion-resolver';
import {PlanCadastralFusionnementRoutingModule} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-fusion/fusion-routing.module';
import { DocumentTypeService } from '@sycadApp/services/data-references/system/document-type.service';
import { VueFusionnementComponent } from './vue-fusion/vue-fusion.component';
import {MatDataTableSharedModule} from '@sycadApp/shared/material-modules/materialDataTableShared.module';
import { PlanCadastralFusionnementService } from '@sycadApp/services/workflow/common/fusionnement.service';
import { CreationParAgentComponent } from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-fusion/edition-plan-cadastral-fusion/creation-par-agent/creation-par-agent.component';
import { SaisieBrouillonParContribuableComponent } from './edition-plan-cadastral-fusion/saisie-brouillon-par-contribuable/saisie-brouillon-par-contribuable.component';
import { SaisieBrouillonParAgentComponent } from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-fusion/edition-plan-cadastral-fusion/saisie-brouillon-par-agent/saisie-brouillon-par-agent.component';
import {CreationParContribuableComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-fusion/edition-plan-cadastral-fusion/creation-par-contribuable/creation-par-contribuable.component';
import {ActeursService} from "@sycadApp/services/data-references/contribuables/acteurs.service";
import {ContribuableService} from "@sycadApp/services/data-references/system/contribuable.service";
import {ParcelleService} from "@sycadApp/services/cession-parcelle/parcelle.service";
import {MandatService} from "@sycadApp/services/workflow/mandat.service";
import {SectionService} from "@sycadApp/services/cession-parcelle/section.service";
import {IlotService} from "@sycadApp/services/cession-parcelle/ilot.service";
import { ValiderFusionComponent } from './edition-plan-cadastral-fusion/valider-fusion/valider-fusion.component';
import { EditionEDMFusionComponent } from './edition-plan-cadastral-fusion/edition-edmfusion/edition-edmfusion.component';
import { AffectationDmComponent } from './edition-plan-cadastral-fusion/affectation-dm/affectation-dm.component';
import { ApprouverTravailFusionComponent } from './edition-plan-cadastral-fusion/approuver-travail-fusion/approuver-travail-fusion.component';
import { EnvoyerPourControleApresFusionComponent } from './edition-plan-cadastral-fusion/envoyer-pour-controle-apres-fusion/envoyer-pour-controle-apres-fusion.component';
import { FusionnerComponent } from './edition-plan-cadastral-fusion/fusionner/fusionner.component';
import { NumerotationFusionComponent } from './edition-plan-cadastral-fusion/numerotation-fusion/numerotation-fusion.component';
import { CycleDeVieParcelleService } from '@sycadApp/services/workflow/cycle-de-vie-parcelle.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalculLiqFusionComponent } from './edition-plan-cadastral-fusion/calcul-liq-fusion/calcul-liq-fusion.component';
import { EnvoieLiqFusionVersSintaxComponent } from './edition-plan-cadastral-fusion/envoie-liq-fusion-vers-sintax/envoie-liq-fusion-vers-sintax.component';
import { SolderLiqFusionComponent } from './edition-plan-cadastral-fusion/solder-liq-fusion/solder-liq-fusion.component';
import { ReglementLiqFusionComponent } from './edition-plan-cadastral-fusion/reglement-liq-fusion/reglement-liq-fusion.component';
import { MatListModule } from '@angular/material/list';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { ContribuablePhysiqueService } from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';
import { ContactContribuableService } from '@sycadApp/services/data-references/system/contact.service';
import { StatusJuridiqueService } from '@sycadApp/services/data-references/system/status-juridique.service';
import { ContribuableMoralService } from '@sycadApp/services/data-references/contribuables/contribuable-moral-service';
import { ContribuableServicesProvidersModule } from '@sycadApp/shared/form-components/annuaire-identite/contribuable-services-providers/contribuable-providers.module';



@NgModule({
  declarations: [PlanCadastralFusionnementComponent,
    EditionPlanCadastralFusionnementComponent,
    CreationParAgentComponent,
    SaisieBrouillonParAgentComponent,
    VueFusionnementComponent,
    CreationParContribuableComponent,
    SaisieBrouillonParContribuableComponent,
    ValiderFusionComponent,
    EditionEDMFusionComponent,
    AffectationDmComponent,
    ApprouverTravailFusionComponent,
    EnvoyerPourControleApresFusionComponent,
    FusionnerComponent,
    NumerotationFusionComponent,
    CalculLiqFusionComponent,
    EnvoieLiqFusionVersSintaxComponent,
    SolderLiqFusionComponent,
    ReglementLiqFusionComponent],
  imports: [
    ContribuableServicesProvidersModule,
    CommonModule,
    PlanCadastralFusionnementRoutingModule,
    GlobalWorkflowModule,
    GenericsFormModule,
    GeneralGlobalSharedModule,
    MatButtonIndicatorSharedModule,
    MatPopupModalSharedModule,
    MatFormControlSharedModule,
    MatDataTableSharedModule,
    MatNativeDateModule,
    MatDividerModule,
    MatMenuModule,
    MatCardModule,
    MatTabsModule,
    FormsModule,
    MatGridListModule,
    MatExpansionModule,
    MatListModule,
    ReactiveFormsModule,
  ],
  providers: [CycleDeVieParcelleService,PlanCadastralFusionnementService, PlanCadastralFusionnementResolver, TransitionService, PlanCadastralFusionnementTransitionResolver, CategoriePieceService,
    BureauService, ServiceAdministratifService, StructureService, CommunesService, DocumentTypeService, DomaineFusionProcessusResolver, ActeursService,
    ParcelleService, MandatService, SectionService, ContribuableService, IlotService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: { }}]

})
export class PlanCadastralFusionnementModule { }
