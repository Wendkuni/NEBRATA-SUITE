import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElementLiquidationRoutingModule } from './element-liquidation-routing.module';
import { ElementLiquidationComponent } from './element-liquidation.component';
import { FormElementLiquidationComponent } from './form-element-liquidation/form-element-liquidation.component';
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
import { ElementLiquidationService } from '@sycadApp/services/impot/element-liquidation.service';
import {
  NatureImpotService
} from "@sycadApp/services/impot/nature-impot.service";


@NgModule({
  declarations: [ElementLiquidationComponent, FormElementLiquidationComponent],
  imports: [
    CommonModule,
    ElementLiquidationRoutingModule,
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

    MatSelectModule
  ],
  providers: [ElementLiquidationService,NatureImpotService],
  entryComponents: [FormElementLiquidationComponent]
})
export class ElementLiquidationModule { }
