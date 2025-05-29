import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArrondissementsRoutingModule } from './arrondissements-routing.module';
import { ArrondissementsComponent } from './arrondissements.component';
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
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { FormPageArrondissementComponent } from './form-page-arrondissement/form-page-arrondissement.component';
import { ArrondissementResolver } from '@sycadFeature/data-references-domaine/territoire-ref/arrondissements/arrondissement-resolver';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';


@NgModule({
  declarations: [ArrondissementsComponent, FormPageArrondissementComponent],
  imports: [
    CommonModule,
    ArrondissementsRoutingModule,
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
  providers: [ArrondissementsService, CommunesService, ArrondissementResolver]
})
export class ArrondissementsModule { }
