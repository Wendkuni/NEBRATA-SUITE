import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExonerationRoutingModule } from './exoneration-routing.module';
import { ExonerationComponent } from './exoneration.component';
import { FormExonerationComponent } from './form-exoneration/form-exoneration.component';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { NatureImpotService } from '@sycadApp/services/impot/nature-impot.service';
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

import {UploadSharedModule} from '@sycadShared/uploadShared.module';
import { ExonerationCategorieService } from '@sycadApp/services/evaluation/exoneration-categorie.service';
import { ExonerationService } from '@sycadApp/services/evaluation/exoneration.service';


@NgModule({
  declarations: [ExonerationComponent, FormExonerationComponent],
  imports: [
    CommonModule,
    ExonerationRoutingModule,
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
    
    UploadSharedModule
  ],
  providers: [ExonerationService, ParcelleService, NatureImpotService, ExonerationCategorieService]
})
export class ExonerationModule { }
