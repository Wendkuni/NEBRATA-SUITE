import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TitreHonorifiqueRoutingModule } from './titre-honorifique-routing.module';
import { TitreHonorifiqueComponent } from './titre-honorifique.component';
import { FormTitreHonorifiqueComponent } from './form-titre-honorifique/form-titre-honorifique.component';
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
import { TitreHonorifiqueService } from '@sycadApp/services/data-references/system/titreHonorifique.service';



@NgModule({
  declarations: [TitreHonorifiqueComponent, FormTitreHonorifiqueComponent],
  imports: [
    CommonModule,
    TitreHonorifiqueRoutingModule,
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
    ReactiveFormsModule
  ],
  providers: [TitreHonorifiqueService],
  entryComponents: [FormTitreHonorifiqueComponent]
})
export class TitreHonorifiqueModule { }
