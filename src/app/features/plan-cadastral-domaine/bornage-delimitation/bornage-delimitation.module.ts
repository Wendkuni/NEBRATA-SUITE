import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BornageDelimitationRoutingModule } from './bornage-delimitation-routing.module';
import { BornageDelimitationComponent } from './bornage-delimitation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';

import { GeneralGlobalSharedModule } from '@sycadApp/shared/generalShared.module';
import { MatButtonIndicatorSharedModule } from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import { MatDataTableSharedModule } from '@sycadApp/shared/material-modules/materialDataTableShared.module';
import { MatFormControlSharedModule } from '@sycadApp/shared/material-modules/materialFormControlShared.module';
import { MatPopupModalSharedModule } from '@sycadApp/shared/material-modules/materialPopupModalShared.module';
import { VueBornageDelimitationComponent } from './vue-bornage-delimitation/vue-bornage-delimitation.component';
import { EditionBornageDelimitationComponent } from './edition-bornage-delimitation/edition-bornage-delimitation.component';
import { BornageDelimitationService } from '@sycadApp/services/bornage/bornage-delimitation.service';
import { BornageDelimitationProcessusResolver, BornageDelimitationResolver, BornageDelimitationTransitionResolver } from './bornage-delimitation-resolver';
import { BureauService } from '@sycadApp/services/data-references/organigramme/bureau.service';
import { ServiceAdministratifService } from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';
import { StructureService } from '@sycadApp/services/data-references/organigramme/structure.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { DocumentTypeService } from '@sycadApp/services/data-references/system/document-type.service';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { TransitionService } from '@sycadApp/services/workflow/transition.service';
import { CreationBornageDelimitationParAgentComponent } from './edition-bornage-delimitation/creation-par-agent/creation.component';
import { GlobalWorkflowModule } from '@sycadApp/shared/form-components/processus/global-workflow.module';
import { GenericsFormModule } from '@sycadApp/shared/form-components/generic-form.module';
import { ActeursService } from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { ContactContribuableService } from '@sycadApp/services/data-references/system/contact.service';
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';
import { ContribuableMoralService } from '@sycadApp/services/data-references/contribuables/contribuable-moral-service';
import { ContribuablePhysiqueService } from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';
import { SectionService } from '@sycadApp/services/cession-parcelle/section.service';
import { StatusJuridiqueService } from '@sycadApp/services/data-references/system/status-juridique.service';
import { DestinationParcelleService } from '@sycadApp/services/bornage/destination-parcelle.service';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import { MandatService } from '@sycadApp/services/workflow/mandat.service';
import { CreationParActeurGeometreComponent } from './edition-bornage-delimitation/creation-par-acteur-geometre/creation-par-acteur-geometre.component';
import { CreationParContribuableComponent } from './edition-bornage-delimitation/creation-par-contribuable/creation-par-contribuable.component';
import {CategorieImmeubleService} from '@sycadApp/services/data-references/system/categorie-immeuble.service';
import {TypeImmeubleService} from '@sycadApp/services/bornage/type-immeuble.service';
import {IlotService} from '@sycadApp/services/cession-parcelle/ilot.service';
import { SaisieBrouillonParAgentComponent } from './edition-bornage-delimitation/saisie-brouillon-par-agent/saisie-brouillon-par-agent.component';
import { SaisieBrouillonParActeurComponent } from './edition-bornage-delimitation/saisie-brouillon-par-acteur/saisie-brouillon-par-acteur.component';
import { SaisieBrouillonParContribuableComponent } from './edition-bornage-delimitation/saisie-brouillon-par-contribuable/saisie-brouillon-par-contribuable.component';
import { NumerotationDBTComponent } from './edition-bornage-delimitation/numerotation-dbt/numerotation-dbt.component';
import { AffectationDBTComponent } from './edition-bornage-delimitation/affectation-dbt/affectation-dbt.component';
import { EditionPVBornageComponent } from './edition-bornage-delimitation/edition-pvbornage/edition-pvbornage.component';
import { BornageDossierComponent } from './edition-bornage-delimitation/bornage-dossier/bornage-dossier.component';
import { EnvoyerPourControleBornageComponent } from './edition-bornage-delimitation/envoyer-pour-controle-bornage/envoyer-pour-controle-bornage.component';
import { ApprouverControleBornageComponent } from './edition-bornage-delimitation/approuver-controle-bornage/approuver-controle-bornage.component';
import { ValiderBornageComponent } from './edition-bornage-delimitation/valider-bornage/valider-bornage.component';
import { NotifierBornageValiderComponent } from './edition-bornage-delimitation/notifier-bornage-valider/notifier-bornage-valider.component';
import { RetraitDossierBornageComponent } from './edition-bornage-delimitation/retrait-dossier-bornage/retrait-dossier-bornage.component';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { CycleDeVieParcelleService } from '@sycadApp/services/workflow/cycle-de-vie-parcelle.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalculLiqBornageComponent } from './edition-bornage-delimitation/calcul-liq-bornage/calcul-liq-bornage.component';
import { EnvoieLiqBornageVersSintaxComponent } from './edition-bornage-delimitation/envoie-liq-bornage-vers-sintax/envoie-liq-bornage-vers-sintax.component';
import { SolderLiqBornageComponent } from './edition-bornage-delimitation/solder-liq-bornage/solder-liq-bornage.component';
import { ReglementLiqBornageComponent } from './edition-bornage-delimitation/reglement-liq-bornage/reglement-liq-bornage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { ContribuableServicesProvidersModule } from '@sycadApp/shared/form-components/annuaire-identite/contribuable-services-providers/contribuable-providers.module';
import {
  PopupService
} from "@sycadApp/services/cession-parcelle/popup.service";


@NgModule({
  declarations: [BornageDelimitationComponent, VueBornageDelimitationComponent, EditionBornageDelimitationComponent, CreationBornageDelimitationParAgentComponent, CreationParActeurGeometreComponent, CreationParContribuableComponent, SaisieBrouillonParAgentComponent, SaisieBrouillonParActeurComponent, SaisieBrouillonParContribuableComponent, NumerotationDBTComponent, AffectationDBTComponent, EditionPVBornageComponent, BornageDossierComponent, EnvoyerPourControleBornageComponent, ApprouverControleBornageComponent, ValiderBornageComponent, NotifierBornageValiderComponent, RetraitDossierBornageComponent, CalculLiqBornageComponent, EnvoieLiqBornageVersSintaxComponent, SolderLiqBornageComponent, ReglementLiqBornageComponent],
  imports: [
    ContribuableServicesProvidersModule,
    CommonModule,
    BornageDelimitationRoutingModule,
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
  providers: [CycleDeVieParcelleService,BornageDelimitationService, BornageDelimitationResolver,BornageDelimitationTransitionResolver,BornageDelimitationProcessusResolver, TransitionService, CategoriePieceService,
    BureauService, ServiceAdministratifService, StructureService, SectionService, DestinationParcelleService,
   ParcelleService, CommunesService, ActeursService, ArrondissementsService, MandatService,CategorieImmeubleService,TypeImmeubleService,
  IlotService,ContribuableService,PopupService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: { }}]
})
export class BornageDelimitationModule { }

