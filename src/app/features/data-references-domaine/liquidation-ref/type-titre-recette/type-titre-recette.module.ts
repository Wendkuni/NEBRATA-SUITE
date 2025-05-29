import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypeTitreRecetteRoutingModule } from './type-titre-recette-routing.module';
import { TypeTitreRecetteComponent } from './type-titre-recette.component';
import { FormTypeTitreRecetteComponent } from './form-type-titre-recette/form-type-titre-recette.component';
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

import {MatStepperModule} from '@angular/material/stepper';
import {AngularEditorModule} from '@kolkov/angular-editor';
import { TypeTitreRecetteService } from '@sycadApp/services/impot/type-titre-recette.service';


@NgModule({
  declarations: [TypeTitreRecetteComponent, FormTypeTitreRecetteComponent],
  imports: [
    CommonModule,
    TypeTitreRecetteRoutingModule,
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
    
    MatStepperModule,
    AngularEditorModule
  ],
  providers: [TypeTitreRecetteService],
  entryComponents: [FormTypeTitreRecetteComponent]
})
export class TypeTitreRecetteModule { }
