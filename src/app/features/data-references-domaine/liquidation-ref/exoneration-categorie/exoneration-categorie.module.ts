import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExonerationCategorieRoutingModule } from './exoneration-categorie-routing.module';
import { ExonerationCategorieComponent } from './exoneration-categorie.component';
import { FormExonerationCategorieComponent } from './form-exoneration-categorie/form-exoneration-categorie.component';
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

import { ProcessusService } from '@sycadApp/services/workflow/processus.service';
import { ExonerationCategorieService } from '@sycadApp/services/evaluation/exoneration-categorie.service';
import { ExonerationCategorieResolver } from './exoneration-categorie-resolver';


@NgModule({
  declarations: [ExonerationCategorieComponent, FormExonerationCategorieComponent],
  imports: [
    CommonModule,
    ExonerationCategorieRoutingModule,
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
  providers: [ExonerationCategorieService, ExonerationCategorieResolver, ProcessusService]
})
export class ExonerationCategorieModule { }
