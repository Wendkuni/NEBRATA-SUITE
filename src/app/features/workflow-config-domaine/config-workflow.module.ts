import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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

import {MatSelectModule} from '@angular/material/select';
import {UploadSharedModule} from '@sycadShared/uploadShared.module';
import {MatStepperModule} from '@angular/material/stepper';
import { PipesModule } from 'app/pipes/pipes.module';
import { GenericsFormModule } from '@sycadApp/shared/form-components/generic-form.module';
import { MatDataTableSharedModule } from '@sycadApp/shared/material-modules/materialDataTableShared.module';
import { ConfigWorkflowComponent } from './config-workflow.component';
import { ConfigWorkflowRoutingModule } from './config-workflow-routing.module';
import { ConfigWorkflowResolver } from './config-workflow-resolver';
import { DestinationParcelleService } from '@sycadApp/services/bornage/destination-parcelle.service';
import { DocumentTypeService } from '@sycadApp/services/data-references/system/document-type.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { FormConfigProcessusComponent } from './form-config-processus/form-config-processus.component';
import { ConfigProcessusComponent } from './config-processus/config-processus.component';
import {
  TypeTransitionService
} from "@sycadApp/services/data-references/system/type-transition.service";
import {
  DomaineFonctionnelService
} from "@sycadApp/services/data-references/system/domaine-fonctionnel.service";


@NgModule({
  declarations: [ConfigWorkflowComponent, FormConfigProcessusComponent, ConfigProcessusComponent],
    imports: [
        CommonModule,
        ConfigWorkflowRoutingModule,
        GeneralGlobalSharedModule,
        MatButtonIndicatorSharedModule,
        MatPopupModalSharedModule,
        MatFormControlSharedModule,
        MatNativeDateModule,
        MatDividerModule,
        PipesModule,
        MatMenuModule,
        MatCardModule,
        MatTabsModule,
        MatDataTableSharedModule,
        FormsModule,
        MatGridListModule,
        MatExpansionModule,
        ReactiveFormsModule,

        MatSelectModule,
        UploadSharedModule,
        MatStepperModule,
        GenericsFormModule,

    ],
  providers: [ConfigWorkflowResolver,
    DestinationParcelleService,
    DocumentTypeService,
    CategoriePieceService,
    TypeTransitionService,
    DomaineFonctionnelService]
})
export class ConfigWorkflowModule { }
