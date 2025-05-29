import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExonerationRoutingModule } from './exoneration-routing.module';
import { ExonerationComponent } from './exoneration.component';
import { EditionExonerationComponent } from './edition-exoneration/edition-exoneration.component';
import { VueExonerationComponent } from './vue-exoneration/vue-exoneration.component';
import { CreationComponent } from './edition-exoneration/creation/creation.component';
import { SaisieComponent } from './edition-exoneration/saisie/saisie.component';
import { ValiderExonerationComponent } from './edition-exoneration/valider-exoneration/valider-exoneration.component';
import { AnnulerExonerationComponent } from './edition-exoneration/annuler-exoneration/annuler-exoneration.component';
import {GenericsFormModule} from '@sycadShared/form-components/generic-form.module';
import {GlobalWorkflowModule} from '@sycadShared/form-components/processus/global-workflow.module';
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
import {ExonerationService} from '@sycadApp/services/impot/exoneration.service';
import {ExonerationCategorieService} from '@sycadApp/services/evaluation/exoneration-categorie.service';
import {NatureImpotService} from '@sycadApp/services/impot/nature-impot.service';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';

import {
  ExonerationProcessusResolver,
  ExonerationResolver,
  ExonerationTransitionResolver
} from '@sycadApp/features/impot-domaine/gestion-exoneration/exoneration-resolver';
import {ContribuableService} from '@sycadApp/services/data-references/system/contribuable.service';
import {ProfessionService} from '@sycadApp/services/data-references/system/profession.service';
import {CategoriePieceService} from '@sycadApp/services/data-references/system/categorie-piece.service';
import {SectionService} from '@sycadApp/services/cession-parcelle/section.service';
import {IlotService} from '@sycadApp/services/cession-parcelle/ilot.service';
import {CommunesService} from '@sycadApp/services/data-references/territoire/communes.service';
import { TransitionService } from '@sycadApp/services/workflow/transition.service';
import { BureauService } from '@sycadApp/services/data-references/organigramme/bureau.service';
import { ServiceAdministratifService } from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import { CreationParContribuableComponent } from './edition-exoneration/creation-par-contribuable/creation-par-contribuable.component';
import { SaisieParContribuableComponent } from './edition-exoneration/saisie-par-contribuable/saisie-par-contribuable.component';
import { ActeursService } from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { ContribuableMoralService } from '@sycadApp/services/data-references/contribuables/contribuable-moral-service';
import { ContribuablePhysiqueService } from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';
import { CycleDeVieParcelleService } from '@sycadApp/services/workflow/cycle-de-vie-parcelle.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactContribuableService } from '@sycadApp/services/data-references/system/contact.service';
import { StatusJuridiqueService } from '@sycadApp/services/data-references/system/status-juridique.service';

@NgModule({
  declarations: [ExonerationComponent, EditionExonerationComponent, VueExonerationComponent,
    CreationComponent, SaisieComponent, ValiderExonerationComponent, AnnulerExonerationComponent, CreationParContribuableComponent, SaisieParContribuableComponent],
    imports: [
        CommonModule,
        ExonerationRoutingModule,
        GenericsFormModule,
      GlobalWorkflowModule,
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
      ReactiveFormsModule,


    ],
  providers: [ CycleDeVieParcelleService,ExonerationService, ExonerationCategorieService,
    NatureImpotService, ParcelleService, TransitionService, BureauService,
    StructureService,ServiceAdministratifService,
  ExonerationResolver, ExonerationTransitionResolver,
  ExonerationProcessusResolver, ContribuableService,ContactContribuableService, StatusJuridiqueService,
   ProfessionService, CategoriePieceService, ActeursService,ContribuableMoralService, ContribuablePhysiqueService,
    SectionService, IlotService, CommunesService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: { }}]
})
export class ExonerationModule { }
