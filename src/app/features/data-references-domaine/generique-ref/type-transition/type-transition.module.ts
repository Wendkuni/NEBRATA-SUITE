import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypeTransitionComponent } from './type-transition.component';
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

import {
  TypeTransitionRoutingModule
} from "@sycadFeature/data-references-domaine/generique-ref/type-transition/type-transition-routing.module";
import {
  TypeTransitionService
} from "@sycadApp/services/data-references/system/type-transition.service";
import {
  TypeTransition
} from "@sycadApp/models/data-references/system/type-transition.model";
import {
  TypeTransitionResolver
} from "@sycadFeature/data-references-domaine/generique-ref/type-transition/type-transition-resolver";
import {
  FormTypeTransitionComponent
} from "@sycadFeature/data-references-domaine/generique-ref/type-transition/form-type-transition/form-type-transition.component";
import {AngularEditorModule} from "@kolkov/angular-editor";



@NgModule({
  declarations: [TypeTransitionComponent, FormTypeTransitionComponent],
  imports: [
    CommonModule,
    TypeTransitionRoutingModule,
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
  providers: [TypeTransitionService,TypeTransitionResolver,TypeTransition],
  entryComponents: [FormTypeTransitionComponent]
})
export class TypeTransitionModule { }
