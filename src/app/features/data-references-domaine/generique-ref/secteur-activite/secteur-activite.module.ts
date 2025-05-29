import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecteurActiviteRoutingModule } from './secteur-activite-routing.module';
import { SecteurActiviteComponent } from './secteur-activite.component';
import { SecteurActiviteFormComponent } from './secteur-activite-form/secteur-activite-form.component';
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
import { SecteurActiviteService } from '@sycadApp/services/data-references/system/secteur-activite.service';



@NgModule({
  declarations: [SecteurActiviteComponent, SecteurActiviteFormComponent],
  imports: [
    CommonModule,
    SecteurActiviteRoutingModule,
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
  providers: [SecteurActiviteService],
  entryComponents: [SecteurActiviteFormComponent]
})
export class SecteurActiviteModule { }
