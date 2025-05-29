import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionCompteRoutingModule } from './gestion-compte-routing.module';
import { GestionCompteComponent } from './gestion-compte.component';
import { VisualiserComponent } from './visualiser/visualiser.component';
import { FormActeurComponent } from './visualiser/form-acteur/form-acteur.component';
import { FormAgentComponent } from './visualiser/form-agent/form-agent.component';
import { FormContribuablePhysiqueComponent } from './visualiser/form-contribuable-physique/form-contribuable-physique.component';
import { FormContribuableMoralComponent } from './visualiser/form-contribuable-moral/form-contribuable-moral.component';
import { CompteService } from '@sycadApp/services/data-references/contribuables/compte.service';
import { CreateCompteProcessusResolver } from '@sycadApp/features/transverse/create-compte/form-creation/create-compte-processus-resolver';
import { IlotService } from '@sycadApp/services/cession-parcelle/ilot.service';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { SectionService } from '@sycadApp/services/cession-parcelle/section.service';
import { ActeursService } from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { AgentsService } from '@sycadApp/services/data-references/contribuables/agent.service';
import { ContribuableMoralService } from '@sycadApp/services/data-references/contribuables/contribuable-moral-service';
import { ContribuablePhysiqueService } from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';
import { BureauService } from '@sycadApp/services/data-references/organigramme/bureau.service';
import { ServiceAdministratifService } from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';
import { StructureService } from '@sycadApp/services/data-references/organigramme/structure.service';
import { CategorieActeurService } from '@sycadApp/services/data-references/system/categorie-acteur.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { CiviliteService } from '@sycadApp/services/data-references/system/civilite-service.service';
import { ContactContribuableService } from '@sycadApp/services/data-references/system/contact.service';
import { NationaliteService } from '@sycadApp/services/data-references/system/nationalite.service';
import { PieceOfficielleService } from '@sycadApp/services/data-references/system/piece-officielle.service';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { SecteurActiviteService } from '@sycadApp/services/data-references/system/secteur-activite.service';
import { SituationMatrimonialeService } from '@sycadApp/services/data-references/system/situationMatrimoniale.service';
import { StatusJuridiqueService } from '@sycadApp/services/data-references/system/status-juridique.service';
import { TitreHonorifiqueService } from '@sycadApp/services/data-references/system/titreHonorifique.service';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';
import { RegimeFiscalService } from '@sycadApp/services/impot/regime-fiscal.service';
import { EnteteDossierService } from '@sycadApp/services/workflow/entete.service';
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
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { MatListModule } from '@angular/material/list';
import { MatSortModule } from '@angular/material/sort';
import { RemoteAutocompeteModule } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/remote-autocompete.module';
import { MatDataTableSharedModule } from '@sycadApp/shared/material-modules/materialDataTableShared.module';
import { EditionCreationUserComponent } from './edition-creation-user/edition-creation-user.component';
import { CreationCompteProcessusResolver, CreationCompteResolver, CreationCompteTransitionResolver } from './compte-resolver';
import { TransitionService } from '@sycadApp/services/workflow/transition.service';
import { ValiderCompteComponent } from './edition-creation-user/valider-compte/valider-compte.component';
import { FormAgentValiderCompteComponent } from './edition-creation-user/valider-compte/form-agent-valider-compte/form-agent-valider-compte.component';
import { FormActeurValiderCompteComponent } from './edition-creation-user/valider-compte/form-acteur-valider-compte/form-acteur-valider-compte.component';
import { FormMoralValiderCompteComponent } from './edition-creation-user/valider-compte/form-moral-valider-compte/form-moral-valider-compte.component';
import { FormPhysiqueValiderCompteComponent } from './edition-creation-user/valider-compte/form-physique-valider-compte/form-physique-valider-compte.component';
import { RenvoyerVersContribuableComponent } from './edition-creation-user/renvoyer-vers-contribuable/renvoyer-vers-contribuable.component';
import { EnvoiePourValidationComponent } from './edition-creation-user/envoie-pour-validation/envoie-pour-validation.component';
import { IndivisionsService } from '@sycadApp/services/data-references/contribuables/indivisions.service';
import { ContribuableServicesProvidersModule } from '@sycadApp/shared/form-components/annuaire-identite/contribuable-services-providers/contribuable-providers.module';



@NgModule({
  declarations: [
    GestionCompteComponent,
    VisualiserComponent,
    FormActeurComponent,
    FormAgentComponent,
    FormContribuablePhysiqueComponent,
    FormContribuableMoralComponent,
    EditionCreationUserComponent,
    ValiderCompteComponent,
    FormAgentValiderCompteComponent,
    FormActeurValiderCompteComponent,
    FormMoralValiderCompteComponent,
    FormPhysiqueValiderCompteComponent,
    RenvoyerVersContribuableComponent,
    EnvoiePourValidationComponent
  ],
  imports: [
    CommonModule,
    GestionCompteRoutingModule,
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
  providers: [CompteService, CreationCompteResolver,CreationCompteProcessusResolver,CreationCompteTransitionResolver,CiviliteService, SituationMatrimonialeService, NationaliteService, CompteService,
    ProfessionService, TitreHonorifiqueService, ContactContribuableService,TransitionService,
    PieceOfficielleService, CategoriePieceService, LocaliteService, ParcelleService,
    CategorieActeurService, RegimeFiscalService, SecteurActiviteService,IndivisionsService,
    StatusJuridiqueService, ContribuablePhysiqueService, ContribuableMoralService, CommunesService,ArrondissementsService, IlotService, SectionService,
    AgentsService, ActeursService, BureauService, StructureService, ServiceAdministratifService,CreateCompteProcessusResolver,EnteteDossierService]
})
export class GestionCompteModule { }
