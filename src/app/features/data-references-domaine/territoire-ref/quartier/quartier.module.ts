import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuartierRoutingModule } from './quartier-routing.module';
import { QuartierComponent } from './quartier.component';
import { FormQuartierComponent } from './form-quartier/form-quartier.component';
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
import { QuartierService } from '@sycadApp/services/data-references/territoire/quartier.service';


@NgModule({
  declarations: [QuartierComponent, FormQuartierComponent],
  imports: [
    CommonModule,
    QuartierRoutingModule,
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
  providers: [QuartierService, CommunesService],
  entryComponents: [FormQuartierComponent]
})
export class QuartierModule { }
