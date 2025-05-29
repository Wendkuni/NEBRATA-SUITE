import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContributionFonciereRoutingModule } from './contribution-fonciere-routing.module';
import { ContributionFonciereComponent } from './contribution-fonciere.component';
import { EditionContributionFonciereComponent } from './edition-contribution-fonciere/edition-contribution-fonciere.component';
import { VueContributionFonciereComponent } from './vue-contribution-fonciere/vue-contribution-fonciere.component';
import { ContribuationFonciereProcessusResolver, ContribuationFonciereResolver, ContribuationFonciereTransitionResolver } from './contribution-fonciere-resolver';
import { ContributionFonciereService } from '@sycadApp/services/impot/contribution-fonciere.service';
import { TransitionService } from '@sycadApp/services/workflow/transition.service';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDataTableSharedModule } from '@sycadApp/shared/material-modules/materialDataTableShared.module';
import { MatFormControlSharedModule } from '@sycadApp/shared/material-modules/materialFormControlShared.module';
import { MatPopupModalSharedModule } from '@sycadApp/shared/material-modules/materialPopupModalShared.module';
import { MatButtonIndicatorSharedModule } from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import { GeneralGlobalSharedModule } from '@sycadApp/shared/generalShared.module';
import { GlobalWorkflowModule } from '@sycadApp/shared/form-components/processus/global-workflow.module';
import { GenericsFormModule } from '@sycadApp/shared/form-components/generic-form.module';
import { ContribuablePhysiqueService } from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';
import { CreationParAgentComponent } from './edition-contribution-fonciere/creation-par-agent/creation-par-agent.component';
import { CreationParContribuableComponent } from './edition-contribution-fonciere/creation-par-contribuable/creation-par-contribuable.component';
import { SaisieParAgentComponent } from './edition-contribution-fonciere/saisie-par-agent/saisie-par-agent.component';
import { SaisieParContribuableComponent } from './edition-contribution-fonciere/saisie-par-contribuable/saisie-par-contribuable.component';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { MandatService } from '@sycadApp/services/workflow/mandat.service';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { SectionService } from '@sycadApp/services/cession-parcelle/section.service';
import { IlotService } from '@sycadApp/services/cession-parcelle/ilot.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { ExerciceFiscaleService } from '@sycadApp/services/impot/exercice-fiscale.service';
import { SolderCFComponent } from './edition-contribution-fonciere/solder-cf/solder-cf.component';
import { EnvoieVersSintaxComponent } from './edition-contribution-fonciere/envoie-vers-sintax/envoie-vers-sintax.component';
import { CalculCFComponent } from './edition-contribution-fonciere/calcul-cf/calcul-cf.component';
import { BureauService } from '@sycadApp/services/data-references/organigramme/bureau.service';
import { StructureService } from '@sycadApp/services/data-references/organigramme/structure.service';
import { ServiceAdministratifService } from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';
import { CalendrierFiscaleService } from '@sycadApp/services/impot/calendrier-fiscale.service';
import { ReglementTitreComponent } from './edition-contribution-fonciere/reglement-titre/reglement-titre.component';
import { CycleDeVieParcelleService } from '@sycadApp/services/workflow/cycle-de-vie-parcelle.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { FormGenerationContributionFonciereComponent } from './form-generation-cf/form-generation-cf.component';
import {
  ProfessionService
} from "@sycadApp/services/data-references/system/profession.service";
import {
  ContactContribuableService
} from "@sycadApp/services/data-references/system/contact.service";
import {
  StatusJuridiqueService
} from "@sycadApp/services/data-references/system/status-juridique.service";
import {
  ContribuableMoralService
} from "@sycadApp/services/data-references/contribuables/contribuable-moral-service";
import {
  NationaliteService
} from "@sycadApp/services/data-references/system/nationalite.service";
import {
  IndivisionrelationService
} from "@sycadApp/services/data-references/contribuables/indivisionRelation.service";
import {
  ArrondissementsService
} from "@sycadApp/services/data-references/territoire/arrondissements.service";
import {
  IndivisionsService
} from "@sycadApp/services/data-references/contribuables/indivisions.service";
import {
  ContribuableService
} from "@sycadApp/services/data-references/system/contribuable.service";
import {
  PopupService
} from "@sycadApp/services/cession-parcelle/popup.service";


@NgModule({
  declarations: [ContributionFonciereComponent,EditionContributionFonciereComponent, VueContributionFonciereComponent, CreationParAgentComponent, CreationParContribuableComponent, SaisieParAgentComponent, SaisieParContribuableComponent, SolderCFComponent, EnvoieVersSintaxComponent, CalculCFComponent, ReglementTitreComponent,FormGenerationContributionFonciereComponent],
  imports: [
    CommonModule,
    ContributionFonciereRoutingModule,
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
    ReactiveFormsModule
  ],
  providers: [CycleDeVieParcelleService,CalendrierFiscaleService,ContactContribuableService,StatusJuridiqueService,ContribuableMoralService,
    TransitionService,ContributionFonciereService,ContribuationFonciereResolver,
    ContribuationFonciereTransitionResolver,ContribuationFonciereProcessusResolver,ContribuablePhysiqueService,
    ContributionFonciereService,ContribuablePhysiqueService,ContribuableService,ParcelleService,MandatService,ProfessionService,
    CommunesService,SectionService,IlotService,CategoriePieceService,ExerciceFiscaleService,BureauService,StructureService,ServiceAdministratifService,
    ArrondissementsService,MandatService, IndivisionsService,IndivisionrelationService  ,NationaliteService,PopupService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: { }}
  ]
})
export class ContributionFonciereModule { }



