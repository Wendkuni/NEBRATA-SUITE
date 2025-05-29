import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatusJuridiqueRoutingModule } from './status-juridique-routing.module';
import { StatusJuridiqueComponent } from './status-juridique.component';

import { FormStatusJuridiqueComponent } from './form-status-juridique/form-status-juridique.component';
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
import { StatusJuridiqueService } from '@sycadApp/services/data-references/system/status-juridique.service';



@NgModule({
  declarations: [StatusJuridiqueComponent, FormStatusJuridiqueComponent],
  imports: [
    CommonModule,
    StatusJuridiqueRoutingModule,
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
  providers: [ StatusJuridiqueService] ,
  entryComponents:[
    FormStatusJuridiqueComponent
  ]
})
export class StatusJuridiqueModule { }
