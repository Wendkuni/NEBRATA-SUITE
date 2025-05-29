import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SituationMatrimonialeRoutingModule } from './situation-matrimoniale-routing.module';
import { SituationMatrimonialeComponent } from './situation-matrimoniale.component';
import { FormSituationMatrimonialeComponent } from './form-situation-matrimoniale/form-situation-matrimoniale.component';
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
import { SituationMatrimonialeService } from '@sycadApp/services/data-references/system/situationMatrimoniale.service';



@NgModule({
  declarations: [SituationMatrimonialeComponent, FormSituationMatrimonialeComponent],
  imports: [
    CommonModule,
    SituationMatrimonialeRoutingModule,
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
    ReactiveFormsModule
  ],
  providers: [SituationMatrimonialeService],
  entryComponents: [FormSituationMatrimonialeComponent]
})
export class SituationMatrimonialeModule { }
