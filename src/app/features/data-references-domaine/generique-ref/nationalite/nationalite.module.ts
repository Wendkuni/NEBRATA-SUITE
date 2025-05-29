import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NationaliteRoutingModule } from './nationalite-routing.module';
import { NationaliteComponent } from './nationalite.component';
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

import { FormNationaliteComponent } from './form-nationalite/form-nationalite.component';
import { NationaliteService } from '@sycadApp/services/data-references/system/nationalite.service';



@NgModule({
  declarations: [NationaliteComponent, FormNationaliteComponent],
  imports: [
    CommonModule,
    NationaliteRoutingModule,
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
  providers: [NationaliteService],
  entryComponents: [FormNationaliteComponent]
})
export class NationaliteModule { }
