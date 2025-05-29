import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericsFormModule } from "@sycadApp/shared/form-components/generic-form.module";
import { GeneralGlobalSharedModule } from '@sycadApp/shared/generalShared.module';
import { MatButtonIndicatorSharedModule } from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import { MatPopupModalSharedModule } from '@sycadApp/shared/material-modules/materialPopupModalShared.module';
import { MatFormControlSharedModule } from '@sycadApp/shared/material-modules/materialFormControlShared.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';

import { TransitionService } from '@sycadApp/services/workflow/transition.service';

import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { BureauService } from '@sycadApp/services/data-references/organigramme/bureau.service';
import { ServiceAdministratifService } from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { PCSecSaisieSectionnementComponent } from './edition-plan-cadastral-sectionnement/saisie-sectionnement/saisie-sectionnement.component';
import { PCSecCompleterAvantValidationComponent } from './edition-plan-cadastral-sectionnement/completer-avant-validation/completer-avant-validation.component';
import { PCSecEnvoiePourValidationComponent } from './edition-plan-cadastral-sectionnement/envoie-pour-validation/envoie-pour-validation.component';
import { PCSecValiderLaSaisieComponent } from './edition-plan-cadastral-sectionnement/valider-la-saisie/valider-la-saisie.component';
import { PCSecRejeterLaSaisieComponent } from './edition-plan-cadastral-sectionnement/rejeter-la-saisie/rejeter-la-saisie.component';

import { EditionPlanCadastralComponent } from './edition-plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement.component';
import { PCSecCreationComponent } from './edition-plan-cadastral-sectionnement/creation/creation.component';
import {PlanCadastralRoutingModule} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/sectionnement-routing.module';
import {PlanCadastralComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/sectionnement.component';
import {PlanCadastralSectionnementProcessusResolver, PlanCadastralSectionnementResolver, PlanCadastralSectionnementTransitionResolver} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/sectionnement.resolver';
import { ConstructeurDocumentComponent } from './edition-plan-cadastral-sectionnement/constructeur-document/constructeur-document.component';
import { DocumentTypeService } from '@sycadApp/services/data-references/system/document-type.service';
import { VueSectionnementComponent } from './vue-sectionnement/vue-sectionnement.component';
import { SectionService } from '@sycadApp/services/cession-parcelle/section.service';
import { MatDataTableSharedModule } from '@sycadApp/shared/material-modules/materialDataTableShared.module';
import { MatIconModule } from '@angular/material/icon';
import { PlanCadastralSectionnementService } from '@sycadApp/services/workflow/common/sectionnement-services';
import { GlobalWorkflowModule } from '@sycadApp/shared/form-components/processus/global-workflow.module';



@NgModule({
  declarations: [PlanCadastralComponent, EditionPlanCadastralComponent, PCSecCreationComponent, PCSecSaisieSectionnementComponent, PCSecCompleterAvantValidationComponent, PCSecEnvoiePourValidationComponent, PCSecValiderLaSaisieComponent, PCSecRejeterLaSaisieComponent, ConstructeurDocumentComponent, VueSectionnementComponent],
  imports: [
    CommonModule,
    PlanCadastralRoutingModule,
    GlobalWorkflowModule,
    GenericsFormModule,
    GeneralGlobalSharedModule,
    MatButtonIndicatorSharedModule,
    MatPopupModalSharedModule,
    MatFormControlSharedModule,
    MatNativeDateModule,
    MatDataTableSharedModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    MatCardModule,
    MatTabsModule,
    FormsModule,
    MatGridListModule,
    MatExpansionModule,
    ReactiveFormsModule
  ],
  providers: [
    PlanCadastralSectionnementResolver, PlanCadastralSectionnementService, TransitionService, PlanCadastralSectionnementProcessusResolver,PlanCadastralSectionnementTransitionResolver, CategoriePieceService,
    BureauService, ServiceAdministratifService, StructureService, CommunesService, DocumentTypeService
  ]
})
export class PlanCadastralModule { }
