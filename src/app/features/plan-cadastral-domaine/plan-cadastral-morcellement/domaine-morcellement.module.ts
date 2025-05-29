import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DomaineMorcellementRoutingModule } from './domaine-morcellement-routing.module';
import { DomaineMorcellementComponent } from './domaine-morcellement.component';
import { VueDomaineMorcellementComponent } from './vue-domaine-morcellement/vue-domaine-morcellement.component';
import { EditionDomaineMorcellementComponent } from './edition-domaine-morcellement/edition-domaine-morcellement.component';
import { CreationParAgentComponent } from './edition-domaine-morcellement/creation-par-agent/creation-par-agent.component';
import { CreationParContribuableComponent } from './edition-domaine-morcellement/creation-par-contribuable/creation-par-contribuable.component';
import { SaisieBrouillonParAgentComponent } from './edition-domaine-morcellement/saisie-brouillon-par-agent/saisie-brouillon-par-agent.component';
import { SaisieBrouillonParContribuableComponent } from './edition-domaine-morcellement/saisie-brouillon-par-contribuable/saisie-brouillon-par-contribuable.component';
import {GlobalWorkflowModule} from '@sycadShared/form-components/processus/global-workflow.module';
import {GenericsFormModule} from '@sycadShared/form-components/generic-form.module';
import {GeneralGlobalSharedModule} from '@sycadShared/generalShared.module';
import {MatButtonIndicatorSharedModule} from '@sycadShared/material-modules/materialButtonIndicatorShared.module';
import {MatPopupModalSharedModule} from '@sycadShared/material-modules/materialPopupModalShared.module';
import {MatFormControlSharedModule} from '@sycadShared/material-modules/materialFormControlShared.module';
import {MatDataTableSharedModule} from '@sycadShared/material-modules/materialDataTableShared.module';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';
import {PlanCadastralMorcellementService} from '@sycadApp/services/workflow/common/morcellement.service';
import {
  DomaineMorcellementProcessusResolver,
  DomaineMorcellementResolver,
  DomaineMorcellementTransitionResolver
} from '@sycadApp/features/plan-cadastral-domaine/plan-cadastral-morcellement/domaine-morcellement-resolver';
import {ContactContribuableService} from '@sycadApp/services/data-references/system/contact.service';
import {TransitionService} from '@sycadApp/services/workflow/transition.service';
import {CategoriePieceService} from '@sycadApp/services/data-references/system/categorie-piece.service';
import {BureauService} from '@sycadApp/services/data-references/organigramme/bureau.service';
import {ServiceAdministratifService} from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {LocaliteService} from '@sycadApp/services/data-references/territoire/localite.service';
import {ContribuableMoralService} from '@sycadApp/services/data-references/contribuables/contribuable-moral-service';
import {ContribuablePhysiqueService} from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';
import {SectionService} from '@sycadApp/services/cession-parcelle/section.service';
import {StatusJuridiqueService} from '@sycadApp/services/data-references/system/status-juridique.service';
import {DestinationParcelleService} from '@sycadApp/services/bornage/destination-parcelle.service';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {CommunesService} from '@sycadApp/services/data-references/territoire/communes.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import {ContribuableService} from '@sycadApp/services/data-references/system/contribuable.service';
import {ArrondissementsService} from '@sycadApp/services/data-references/territoire/arrondissements.service';
import {MandatService} from '@sycadApp/services/workflow/mandat.service';
import {CategorieImmeubleService} from '@sycadApp/services/data-references/system/categorie-immeuble.service';
import {TypeImmeubleService} from '@sycadApp/services/bornage/type-immeuble.service';
import {IlotService} from '@sycadApp/services/cession-parcelle/ilot.service';
import {ProfessionService} from '@sycadApp/services/data-references/system/profession.service';
import { AffectationDMComponent } from './edition-domaine-morcellement/affectation-dm/affectation-dm.component';
import { MorcelerComponent } from './edition-domaine-morcellement/morceler/morceler.component';
import { EnvoyerPourControleApresMocellementComponent } from './edition-domaine-morcellement/envoyer-pour-controle-apres-mocellement/envoyer-pour-controle-apres-mocellement.component';
import { NumerotationMocellementComponent } from './edition-domaine-morcellement/numerotation-mocellement/numerotation-mocellement.component';
import { EditionEDMMocellementComponent } from './edition-domaine-morcellement/edition-edmmocellement/edition-edmmocellement.component';
import { ValiderMocellementComponent } from './edition-domaine-morcellement/valider-mocellement/valider-mocellement.component';
import {QuartierService} from "@sycadApp/services/data-references/territoire/quartier.service";
import {ArrondissementZoneService} from "@sycadApp/services/data-references/territoire/arrondissement-zone.service";
import { ApprouverTravailMorcellementComponent } from './edition-domaine-morcellement/approuver-travail-morcellement/approuver-travail-morcellement.component';
import { CycleDeVieParcelleService } from '@sycadApp/services/workflow/cycle-de-vie-parcelle.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalculLiquidationComponent } from './edition-domaine-morcellement/calcul-liquidation/calcul-liquidation.component';
import { EnvoieVersSintaxComponent } from './edition-domaine-morcellement/envoie-vers-sintax/envoie-vers-sintax.component';
import { ReglementLiquidationComponent } from './edition-domaine-morcellement/reglement-liquidation/reglement-liquidation.component';
import { SolderLiquidationComponent } from './edition-domaine-morcellement/solder-liquidation/solder-liquidation.component';
import { MatListModule } from '@angular/material/list';
import { ContribuableServicesProvidersModule } from '@sycadApp/shared/form-components/annuaire-identite/contribuable-services-providers/contribuable-providers.module';
import {
  PopupService
} from "@sycadApp/services/cession-parcelle/popup.service";


@NgModule({
  declarations: [DomaineMorcellementComponent, VueDomaineMorcellementComponent, EditionDomaineMorcellementComponent, CreationParAgentComponent, CreationParContribuableComponent, SaisieBrouillonParAgentComponent, SaisieBrouillonParContribuableComponent, AffectationDMComponent, MorcelerComponent, EnvoyerPourControleApresMocellementComponent, NumerotationMocellementComponent, EditionEDMMocellementComponent, ValiderMocellementComponent, ApprouverTravailMorcellementComponent, CalculLiquidationComponent, EnvoieVersSintaxComponent, ReglementLiquidationComponent, SolderLiquidationComponent],
  imports: [
    ContribuableServicesProvidersModule,
    CommonModule,
    DomaineMorcellementRoutingModule,
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
  providers: [CycleDeVieParcelleService,PlanCadastralMorcellementService, DomaineMorcellementResolver, DomaineMorcellementTransitionResolver, DomaineMorcellementProcessusResolver,
    TransitionService, CategoriePieceService, ContribuableService,
    BureauService, ServiceAdministratifService, StructureService, LocaliteService, SectionService, DestinationParcelleService,
    ParcelleService, CommunesService, ActeursService, ArrondissementsService, MandatService, CategorieImmeubleService, TypeImmeubleService,
    IlotService, QuartierService, ArrondissementZoneService,PopupService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: { }}]
})
export class DomaineMorcellementModule { }
