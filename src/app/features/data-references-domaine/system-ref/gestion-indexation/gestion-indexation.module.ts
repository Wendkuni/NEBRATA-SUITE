import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionIndexationRoutingModule } from './gestion-indexation-routing.module';
import { GestionIndexationComponent } from './gestion-indexation.component';
import { FormPageIndexationComponent } from './form-page-indexation/form-page-indexation.component';
import {GeneralGlobalSharedModule} from '@sycadShared/generalShared.module';
import {MatButtonIndicatorSharedModule} from '@sycadShared/material-modules/materialButtonIndicatorShared.module';
import {MatPopupModalSharedModule} from '@sycadShared/material-modules/materialPopupModalShared.module';
import {MatFormControlSharedModule} from '@sycadShared/material-modules/materialFormControlShared.module';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';
import {IndexationService} from '@sycadApp/services/data-references/system/indexation.service';


@NgModule({
  declarations: [
    GestionIndexationComponent,
    FormPageIndexationComponent
  ],
  imports: [
    CommonModule,
    GestionIndexationRoutingModule,
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
  providers: [IndexationService],
  entryComponents: [FormPageIndexationComponent]

})
export class GestionIndexationModule { }
