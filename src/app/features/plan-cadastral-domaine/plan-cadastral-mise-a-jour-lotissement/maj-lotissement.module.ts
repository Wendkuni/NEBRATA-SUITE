import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanCadastralMiseAJourLotissementRoutingModule } from './maj-lotissement-routing.module';
import { PlanCadastralMiseAJourLotissementComponent } from './maj-lotissement.component';
import { EditionPlanCadastralMiseAJourLotissementComponent } from './edition-maj-lotissement/edition-maj-lotissement.component';
import { SaisieBrouilonParAgentComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-mise-a-jour-lotissement/edition-maj-lotissement/saisie-par-agent/saisie-brouilon-par-agent.component';

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
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import {CreationParAgentComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-mise-a-jour-lotissement/edition-maj-lotissement/creation-par-agent/creation-par-agent.component';
import { DocumentTypeService } from '@sycadApp/services/data-references/system/document-type.service';
import { VueMiseAJourLotissementComponent } from './vue-mise-a-jour-lotissement/vue-mise-a-jour-lotissement.component';
import {MatDataTableSharedModule} from '@sycadApp/shared/material-modules/materialDataTableShared.module';
import { PlanCadastralMiseAjourLotissementService } from '@sycadApp/services/workflow/common/maj-lotissement.service';
import { MajLotissementResolver, MajLotissementTransitionResolver, MajLotisssementProcessusResolver} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-mise-a-jour-lotissement/maj-lotissement.resolver';
import { CreationParActeurComponent } from './edition-maj-lotissement/creation-par-acteur/creation-par-acteur.component';
import { SaisieParActeurComponent } from './edition-maj-lotissement/saisie-par-acteur/saisie-par-acteur.component';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import {ContribuableService} from '@sycadApp/services/data-references/system/contribuable.service';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {MandatService} from '@sycadApp/services/workflow/mandat.service';
import {SectionService} from '@sycadApp/services/cession-parcelle/section.service';
import {IlotService} from '@sycadApp/services/cession-parcelle/ilot.service';
import {ProfessionService} from '@sycadApp/services/data-references/system/profession.service';
import {ContribuablePhysiqueService} from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';
import {ContribuableMoralService} from '@sycadApp/services/data-references/contribuables/contribuable-moral-service';
import {ContactContribuableService} from '@sycadApp/services/data-references/system/contact.service';
import {StatusJuridiqueService} from '@sycadApp/services/data-references/system/status-juridique.service';
import {DestinationParcelleService} from '@sycadApp/services/bornage/destination-parcelle.service';
import {QuartierService} from '@sycadApp/services/data-references/territoire/quartier.service';
import {LocaliteService} from '@sycadApp/services/data-references/territoire/localite.service';
import {ArrondissementZoneService} from '@sycadApp/services/data-references/territoire/arrondissement-zone.service';
import { ValiderMajLotissementComponent } from './edition-maj-lotissement/valider-maj-lotissement/valider-maj-lotissement.component';
import { AnnulerMajLotissementComponent } from './edition-maj-lotissement/annuler-maj-lotissement/annuler-maj-lotissement.component';
import { NumerotationMajLotissementComponent } from './edition-maj-lotissement/numerotion-maj-lotissement/numerotation-maj-lotissement.component';

import { AffectationDmajComponent } from './edition-maj-lotissement/affectation-dmaj/affectation-dmaj.component';
import { MiseAJourPlanComponent } from './edition-maj-lotissement/mise-ajour-plan/mise-ajour-plan.component';
import { EnvoyerPourControleApresMajComponent } from './edition-maj-lotissement/envoyer-pour-controle-apres-maj/envoyer-pour-controle-apres-maj.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import { ChoixProcessusComponent } from './choix-processus/choix-processus.component';



@NgModule({

  declarations: [PlanCadastralMiseAJourLotissementComponent, EditionPlanCadastralMiseAJourLotissementComponent, CreationParAgentComponent, SaisieBrouilonParAgentComponent, VueMiseAJourLotissementComponent, CreationParActeurComponent, SaisieParActeurComponent,
    AnnulerMajLotissementComponent,ChoixProcessusComponent, ValiderMajLotissementComponent, NumerotationMajLotissementComponent, AffectationDmajComponent, MiseAJourPlanComponent, EnvoyerPourControleApresMajComponent],

  imports: [
    CommonModule,
    PlanCadastralMiseAJourLotissementRoutingModule,
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
    ReactiveFormsModule
  ],
  providers: [MajLotissementResolver,
    PlanCadastralMiseAjourLotissementService, TransitionService,
    MajLotissementTransitionResolver, MajLotisssementProcessusResolver, CategoriePieceService,
    BureauService, ServiceAdministratifService, StructureService, CommunesService, DocumentTypeService,
    ActeursService, ContribuableService, ParcelleService, MandatService, SectionService, IlotService,
    ProfessionService, ContribuablePhysiqueService, ContribuableMoralService, ContactContribuableService,
    StatusJuridiqueService, DestinationParcelleService, QuartierService, LocaliteService, ArrondissementZoneService,ArrondissementsService,

    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: { }}
  ]
})
export class PlanCadastralMiseAJourLotissementModule { }
