import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriePieceProcessusRoutingModule } from './categorie-piece-processus-routing.module';
import { CategoriePieceProcessusComponent } from './categorie-piece-processus.component';
import { FormCategoriePieceProcessusComponent } from './form-categorie-piece-processus/form-categorie-piece-processus.component';
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

import { RemoteAutocompeteModule } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/remote-autocompete.module';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { CategoriePieceProcessusService } from '@sycadApp/services/workflow/categorie-piece-processus.service';


@NgModule({
  declarations: [CategoriePieceProcessusComponent, FormCategoriePieceProcessusComponent],
  imports: [
    CommonModule,
    CategoriePieceProcessusRoutingModule,
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
    
    RemoteAutocompeteModule
  ],
  providers: [CategoriePieceProcessusService, CategoriePieceService],
  entryComponents: [FormCategoriePieceProcessusComponent]
})
export class CategoriePieceProcessusModule { }
