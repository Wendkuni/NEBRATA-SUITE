import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParcelleBaremeRoutingModule } from './parcelle-bareme-routing.module';
import { ParcelleBaremeComponent } from './parcelle-bareme.component';
import { FormParcelleBaremeComponent } from './form-parcelle-bareme/form-parcelle-bareme.component';
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
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import { ArrondissementZoneService } from '@sycadApp/services/data-references/territoire/arrondissement-zone.service';

import { DestinationParcelleService } from '@sycadApp/services/bornage/destination-parcelle.service';
import { ParcelleBaremeService } from '@sycadApp/services/evaluation/parcelle-bareme.service';


@NgModule({
  declarations: [ParcelleBaremeComponent, FormParcelleBaremeComponent],
  imports: [
    CommonModule,
    ParcelleBaremeRoutingModule,
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
  providers: [ParcelleBaremeService, CommunesService,
    ArrondissementsService, ArrondissementZoneService,
    DestinationParcelleService
  ],
  entryComponents: [FormParcelleBaremeComponent]
})
export class ParcelleBaremeModule { }
