import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DegreSuccessoralRoutingModule } from './degre-successoral-routing.module';
import { DegreSuccessoralComponent } from './degre-successoral.component';
import { FormDegreSuccessoralComponent } from './form-degre-successoral/form-degre-successoral.component';
import {GeneralGlobalSharedModule} from '@sycadShared/generalShared.module';
import {MatButtonIndicatorSharedModule} from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import {MatPopupModalSharedModule} from '@sycadApp/shared/material-modules/materialPopupModalShared.module';
import {MatFormControlSharedModule} from '@sycadApp/shared/material-modules/materialFormControlShared.module';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';
import { DegreSuccessoralService } from '@sycadApp/services/evaluation/degre-successoral.service';



@NgModule({
  declarations: [DegreSuccessoralComponent, FormDegreSuccessoralComponent],
  imports: [
    CommonModule,
    DegreSuccessoralRoutingModule,
    GeneralGlobalSharedModule,
    MatButtonIndicatorSharedModule,
    MatPopupModalSharedModule,
    MatFormControlSharedModule,
    MatNativeDateModule,
    MatDividerModule,

    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatMenuModule,
    MatCardModule,
    MatTabsModule,
    FormsModule,
    MatGridListModule,
    MatExpansionModule,
    ReactiveFormsModule,
    
  ],
  providers: [DegreSuccessoralService],
  entryComponents: [FormDegreSuccessoralComponent]
})
export class DegreSuccessoralModule { }
