import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriePieceRoutingModule } from './categorie-piece-routing.module';
import { CategoriePieceComponent } from './categorie-piece.component';
import {GeneralGlobalSharedModule} from "@sycadShared/generalShared.module";
import {MatButtonIndicatorSharedModule} from "@sycadApp/shared/material-modules/materialButtonIndicatorShared.module";
import {MatPopupModalSharedModule} from "@sycadApp/shared/material-modules/materialPopupModalShared.module";
import {MatFormControlSharedModule} from "@sycadApp/shared/material-modules/materialFormControlShared.module";
import {MatNativeDateModule} from "@angular/material/core";
import {MatDividerModule} from "@angular/material/divider";
import {MatMenuModule} from "@angular/material/menu";
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatExpansionModule} from "@angular/material/expansion";

import { FormCategoriePieceComponent } from './form-categorie-piece/form-categorie-piece.component';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';





@NgModule({
    declarations: [CategoriePieceComponent, FormCategoriePieceComponent],
    imports: [
        CommonModule,
        CategoriePieceRoutingModule,
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
    providers: [CategoriePieceService],
    exports: [
        CategoriePieceComponent
    ],
    entryComponents: [FormCategoriePieceComponent]
})
export class CategoriePieceModule { }
