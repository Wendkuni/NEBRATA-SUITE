import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormuleRoutingModule } from './formule-routing.module';
import { FormuleComponent } from './formule.component';
import { FormFormuleComponent } from './form-formule/form-formule.component';
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
import { FormuleService } from '@sycadApp/services/evaluation/formule.service';



@NgModule({
  declarations: [FormuleComponent, FormFormuleComponent],
  imports: [
    CommonModule,
    FormuleRoutingModule,
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
    
  ],
  providers: [FormuleService],
  entryComponents: [FormFormuleComponent]
})
export class FormuleModule { }
