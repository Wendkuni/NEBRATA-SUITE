import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntitesCadastralesRoutingModule } from './entites-cadastrales-routing.module';
import { EntitesCadastralesComponent } from './entites-cadastrales.component';
import { SectionsComponent } from './sections/sections.component';
import { IlotComponent } from './ilot/ilot.component';
import { ParcelleComponent } from './parcelle/parcelle.component';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import {GeneralGlobalSharedModule} from "@sycadShared/generalShared.module";
import {MatButtonIndicatorSharedModule} from "@sycadApp/shared/material-modules/materialButtonIndicatorShared.module";
import {MatFormControlSharedModule} from "@sycadApp/shared/material-modules/materialFormControlShared.module";
import {MatNativeDateModule} from "@angular/material/core";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatExpansionModule} from "@angular/material/expansion";
import {UploadSharedModule} from "@sycadShared/uploadShared.module";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatListModule} from '@angular/material/list';
import { IlotService } from '@sycadApp/services/cession-parcelle/ilot.service';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { SectionService } from '@sycadApp/services/cession-parcelle/section.service';
import { CycleDeVieParcelleService } from '@sycadApp/services/workflow/cycle-de-vie-parcelle.service';
import { GenericsFormModule } from '@sycadApp/shared/form-components/generic-form.module';
import {
  UserProfilModule
} from "@sycadFeature/annuaire-identite-domaine/profil-contribuable/user-profil/user-profil.module";
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from "@angular/material/dialog";
import {
  PopupService
} from "@sycadApp/services/cession-parcelle/popup.service";
import {
  ArrondissementsService
} from "@sycadApp/services/data-references/territoire/arrondissements.service";


@NgModule({
  declarations: [EntitesCadastralesComponent, SectionsComponent, IlotComponent, ParcelleComponent],
  imports: [
    CommonModule,
    GenericsFormModule,
    EntitesCadastralesRoutingModule,
    GeneralGlobalSharedModule,
    MatButtonIndicatorSharedModule,
    MatFormControlSharedModule,
    MatNativeDateModule,
    MatDividerModule,
    MatFormFieldModule,
    MatTooltipModule,
    //  MatListModule,
    MatSelectModule,
    MatInputModule,
    // MatMenuModule,
    MatCardModule,
    MatTabsModule,
    FormsModule,
    MatGridListModule,
    MatExpansionModule,
    UploadSharedModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatListModule,
    UserProfilModule
  ],
  exports: [
    SectionsComponent,
    IlotComponent,
    ParcelleComponent
  ],
  providers: [CycleDeVieParcelleService,SectionService, IlotService, ParcelleService, CommunesService,PopupService,ArrondissementsService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: { }}]
})
export class EntitesCadastralesModule { }
