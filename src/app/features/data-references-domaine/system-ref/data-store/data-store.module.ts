import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataStoreRoutingModule } from './data-store-routing.module';
import { DataStoreComponent } from './data-store.component';
import {GeneralGlobalSharedModule} from "@sycadShared/generalShared.module";
import {MatButtonIndicatorSharedModule} from "@sycadApp/shared/material-modules/materialButtonIndicatorShared.module";
import {MatPopupModalSharedModule} from "@sycadApp/shared/material-modules/materialPopupModalShared.module";
import {MatFormControlSharedModule} from "@sycadApp/shared/material-modules/materialFormControlShared.module";
import {MatNativeDateModule} from "@angular/material/core";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatExpansionModule} from "@angular/material/expansion";

import {MatStepperModule} from "@angular/material/stepper";
  
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DataStoreService } from '@sycadApp/services/data-references/system/data-store.service';
import { FormStoreComponent } from './form-data-store/form-datastore.component';
  
@NgModule({
  declarations: [DataStoreComponent, FormStoreComponent],
  imports: [
    CommonModule,
    DataStoreRoutingModule,
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
  providers: [DataStoreService],
  entryComponents: [FormStoreComponent]
})
export class DataStoreModule { }
