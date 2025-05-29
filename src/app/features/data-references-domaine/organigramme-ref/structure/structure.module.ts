import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StructureRoutingModule } from './structure-routing.module';
import { StructureComponent } from './structure.component';
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

import {TypeStructureService} from '@sycadApp/services/data-references/organigramme/type-structure.service';
import {MatSelectModule} from '@angular/material/select';
import {UploadSharedModule} from '@sycadShared/uploadShared.module';
import {MatStepperModule} from '@angular/material/stepper';
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';
import { PipesModule } from 'app/pipes/pipes.module';
import { FormPageStructureComponent } from './form-page-structure/form-page-structure.component';
import {StructureResolver} from "@sycadFeature/data-references-domaine/organigramme-ref/structure/structure-resolver";
import { QuartierService } from '@sycadApp/services/data-references/territoire/quartier.service';
import { GenericsFormModule } from '@sycadApp/shared/form-components/generic-form.module';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { MatDataTableSharedModule } from '@sycadApp/shared/material-modules/materialDataTableShared.module';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {
  TypeTransitionService
} from "@sycadApp/services/data-references/system/type-transition.service";
import {
  DomaineFonctionnelService
} from "@sycadApp/services/data-references/system/domaine-fonctionnel.service";
import {
  TransitionFonctionnelleService
} from "@sycadApp/services/data-references/system/transition-fonctionnelle.service";


@NgModule({
  declarations: [StructureComponent, FormPageStructureComponent],
    imports: [
        CommonModule,
        StructureRoutingModule,
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
        GenericsFormModule
    ],
  providers: [StructureService,
    TypeStructureService,
    LocaliteService,
    StructureResolver,
    QuartierService,
    ArrondissementsService,
    CommunesService,
    TypeTransitionService,
    DomaineFonctionnelService,
    TransitionFonctionnelleService
  ]
})
export class StructureModule { }
