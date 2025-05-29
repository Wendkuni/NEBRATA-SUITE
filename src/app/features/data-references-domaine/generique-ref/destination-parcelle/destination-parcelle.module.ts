import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DestinationParcelleRoutingModule } from './destination-parcelle-routing.module';
import { DestinationParcelleComponent } from './destination-parcelle.component';
import { FormDestinationParcelleComponent } from './form-destination-parcelle/form-destination-parcelle.component';
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

import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import { DestinationParcelleService } from '@sycadApp/services/bornage/destination-parcelle.service';


@NgModule({
  declarations: [DestinationParcelleComponent, FormDestinationParcelleComponent],
  imports: [
    CommonModule,
    DestinationParcelleRoutingModule,
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
  providers: [DestinationParcelleService, StructureService],
  entryComponents: [FormDestinationParcelleComponent]
})
export class DestinationParcelleModule { }
