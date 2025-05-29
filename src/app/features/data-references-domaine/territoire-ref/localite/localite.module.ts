import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocaliteRoutingModule } from './localite-routing.module';
import { LocaliteComponent } from './localite.component';
import { FormLocaliteComponent } from './form-localite/form-localite.component';
import { GeneralGlobalSharedModule } from '@sycadApp/shared/generalShared.module';
import { MatButtonIndicatorSharedModule } from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import { MatPopupModalSharedModule } from '@sycadApp/shared/material-modules/materialPopupModalShared.module';
import { MatFormControlSharedModule } from '@sycadApp/shared/material-modules/materialFormControlShared.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';



@NgModule({
  declarations: [LocaliteComponent,FormLocaliteComponent],
  imports: [
    CommonModule,
    LocaliteRoutingModule,
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
  providers: [ LocaliteService,ArrondissementsService] ,
  entryComponents:[
    FormLocaliteComponent  ]
})
export class LocaliteModule { }
