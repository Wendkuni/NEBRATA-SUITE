import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypeImmeubleRoutingModule } from './type-immeuble-routing.module';
import { TypeImmeubleComponent } from './type-immeuble.component';
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


import {MatListModule} from "@angular/material/list";
import { TypeImmeubleService } from '@sycadApp/services/bornage/type-immeuble.service';
import { FormTypeImmeubleComponent } from './form-type-immeuble/form-type-immeuble.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [TypeImmeubleComponent, FormTypeImmeubleComponent],
    imports: [
        CommonModule,
        TypeImmeubleRoutingModule,
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
  providers: [TypeImmeubleService],
  entryComponents: [FormTypeImmeubleComponent]
})
export class TypeImmeubleModule { }
