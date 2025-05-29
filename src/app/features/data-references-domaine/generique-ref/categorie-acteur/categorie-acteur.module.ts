import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategorieActeurRoutingModule } from './categorie-acteur-routing.module';
import { CategorieActeurComponent } from './categorie-acteur.component';
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

import { FormCategorieActeurComponent } from './form-categorie-acteur/form-categorie-acteur.component';
import { RolesService } from '@sycadApp/services/data-references/security/roles-services';
import { MatDataTableSharedModule } from '@sycadApp/shared/material-modules/materialDataTableShared.module';
import { CategorieActeurResolver } from './categorie-acteur-resolver';
import { ProfilesService } from '@sycadApp/services/data-references/security/profiles.service';
import { CategorieActeurService } from '@sycadApp/services/data-references/system/categorie-acteur.service';
@NgModule({
  declarations: [CategorieActeurComponent, FormCategorieActeurComponent],
  imports: [
    CommonModule,
    CategorieActeurRoutingModule,
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
    
    MatDataTableSharedModule,
  ],
  providers: [CategorieActeurService,CategorieActeurResolver,ProfilesService]
  /* ,
  entryComponents: [FormCategorieActeurComponent] */
})
export class CategorieActeurModule { }
