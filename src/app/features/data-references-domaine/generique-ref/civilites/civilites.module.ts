import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CivilitesRoutingModule } from './civilites-routing.module';
import { CivilitesComponent } from './civilites.component';
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

import { FormCivilitesComponent } from './form-civilites/form-civilites.component';
import { CiviliteService } from '@sycadApp/services/data-references/system/civilite-service.service';


@NgModule({
  declarations: [CivilitesComponent, FormCivilitesComponent],
  imports: [
    CommonModule,
    CivilitesRoutingModule,
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
    
  ],
  providers: [CiviliteService],
  entryComponents: [FormCivilitesComponent]
})
export class CivilitesModule { }
