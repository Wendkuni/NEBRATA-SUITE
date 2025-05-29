import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaremeImpotRoutingModule } from './bareme-impot-routing.module';
import { BaremeImpotComponent } from './bareme-impot.component';
import { FormBaremeImpotComponent } from './form-bareme-impot/form-bareme-impot.component';

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

import { NatureImpotService } from '@sycadApp/services/impot/nature-impot.service';
import { DestinationParcelleService } from '@sycadApp/services/bornage/destination-parcelle.service';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import { DegreSuccessoralService } from '@sycadApp/services/evaluation/degre-successoral.service';
import {MatSelectModule} from '@angular/material/select';
import { BaremeImpotService } from '@sycadApp/services/impot/bareme-impot.service';
import { BaremeImpotResolver } from './bareme-impot-resolver';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { ProcessusService } from '@sycadApp/services/workflow/processus.service';
import {
  CessionSourceService
} from "@sycadApp/services/impot/cession-source.service";


@NgModule({
  declarations: [BaremeImpotComponent, FormBaremeImpotComponent],
  imports: [
    CommonModule,
    BaremeImpotRoutingModule,
    CommonModule,
    GeneralGlobalSharedModule,
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

    MatSelectModule,
  ],
  providers: [BaremeImpotService,
    BaremeImpotResolver,
    NatureImpotService,
    DestinationParcelleService,
    ArrondissementsService,
    DegreSuccessoralService,
    CommunesService,
    ProcessusService,CessionSourceService]
})
export class BaremeImpotModule { }
