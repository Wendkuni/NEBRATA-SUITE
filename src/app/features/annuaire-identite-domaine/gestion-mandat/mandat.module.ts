import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MandatRoutingModule } from './mandat-routing.module';
import { MandatComponent } from './mandat.component';
import { EditionMandatComponent } from './edition-mandat/edition-mandat.component';
import { CreerParContribuableComponent } from './edition-mandat/creer-par-contribuable/creer-par-contribuable.component';
import { SaisieParContribuableComponent } from './edition-mandat/saisie-par-contribuable/saisie-par-contribuable.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { RemoteAutocompeteModule } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/remote-autocompete.module';
import { GenericsFormModule } from '@sycadApp/shared/form-components/generic-form.module';
import { GlobalWorkflowModule } from '@sycadApp/shared/form-components/processus/global-workflow.module';
import { GeneralGlobalSharedModule } from '@sycadApp/shared/generalShared.module';
import { MatButtonIndicatorSharedModule } from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import { MatDataTableSharedModule } from '@sycadApp/shared/material-modules/materialDataTableShared.module';
import { MatFormControlSharedModule } from '@sycadApp/shared/material-modules/materialFormControlShared.module';
import { MatPopupModalSharedModule } from '@sycadApp/shared/material-modules/materialPopupModalShared.module';
import { MandatProcessusResolver, MandatTransitionResolver, MandatResolver } from './mandat-resolver';
import { MandatsService } from '@sycadApp/services/workflow/mandats.service';
import { ActeursService } from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { ContribuableMoralService } from '@sycadApp/services/data-references/contribuables/contribuable-moral-service';
import { ContribuablePhysiqueService } from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';
import { BureauService } from '@sycadApp/services/data-references/organigramme/bureau.service';
import { ServiceAdministratifService } from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';
import { StructureService } from '@sycadApp/services/data-references/organigramme/structure.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { StatusJuridiqueService } from '@sycadApp/services/data-references/system/status-juridique.service';
import { VueMandatComponent } from './vue-mandat/vue-mandat.component';
import { AnnulerMandatComponent } from './edition-mandat/annuler-mandat/annuler-mandat.component';
import { ValiderMandatComponent } from './edition-mandat/valider-mandat/valider-mandat.component';
import {MandatService} from '@sycadApp/services/workflow/mandat.service';
import {TransitionService} from '@sycadApp/services/workflow/transition.service';
import { CreationParAgentComponent } from './edition-mandat/creation-par-agent/creation-par-agent.component';
import { SaisiMandatParAgentComponent } from './edition-mandat/saisi-par-contribuable-agent/saisi-mandat-par-agent.component';
import { ContribuableServicesProvidersModule } from '@sycadApp/shared/form-components/annuaire-identite/contribuable-services-providers/contribuable-providers.module';


@NgModule({
  declarations: [MandatComponent, EditionMandatComponent, CreerParContribuableComponent, SaisieParContribuableComponent, VueMandatComponent,  AnnulerMandatComponent, ValiderMandatComponent, CreationParAgentComponent, SaisiMandatParAgentComponent],
  imports: [
    CommonModule,
    MandatRoutingModule,
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
    ContribuableServicesProvidersModule
  ],
  providers: [MandatResolver,MandatTransitionResolver,MandatProcessusResolver,MandatsService, MandatService,CategoriePieceService,
    BureauService, ServiceAdministratifService, StructureService,ContribuableMoralService, ContribuablePhysiqueService, StatusJuridiqueService,
     ActeursService, ContribuableService, ProfessionService, MandatService, TransitionService]
})
export class MandatModule { }
