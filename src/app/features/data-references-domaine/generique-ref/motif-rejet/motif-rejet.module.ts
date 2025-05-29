import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {GeneralGlobalSharedModule} from '@sycadShared/generalShared.module';
import {MatButtonIndicatorSharedModule} from '@sycadShared/material-modules/materialButtonIndicatorShared.module';
import {MatPopupModalSharedModule} from '@sycadShared/material-modules/materialPopupModalShared.module';
import {MatFormControlSharedModule} from '@sycadShared/material-modules/materialFormControlShared.module';
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


import {AngularEditorModule} from "@kolkov/angular-editor";
import {
  MotifRejetComponent
} from "@sycadFeature/data-references-domaine/generique-ref/motif-rejet/motif-rejet.component";
import {
  MotifRejetRoutingModule
} from "@sycadFeature/data-references-domaine/generique-ref/motif-rejet/motif-rejet-routing.module";
import {
  MotifRejetService
} from "@sycadApp/services/data-references/system/motif-rejet.service";
import {
  MotifRejetResolver
} from "@sycadFeature/data-references-domaine/generique-ref/motif-rejet/motif-rejet-resolver";
import {
  MotifRejet
} from "@sycadApp/models/data-references/system/motif-rejet.model";
import {
  MotifRejetFormComponent
} from "@sycadFeature/data-references-domaine/generique-ref/motif-rejet/motif-rejet-form/motif-rejet-form.component";


let FormMotifRejetComponent;

@NgModule({
  declarations: [MotifRejetComponent, MotifRejetFormComponent],
  imports: [
    CommonModule,
    MotifRejetRoutingModule,
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
    AngularEditorModule
  ],
  providers: [MotifRejetService,MotifRejetResolver,MotifRejet],
  entryComponents: [FormMotifRejetComponent]
})
export class MotifRejetModule { }
