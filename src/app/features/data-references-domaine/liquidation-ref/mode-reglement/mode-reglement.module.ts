import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModeReglementRoutingModule } from './mode-reglement-routing.module';
import { ModeReglementComponent } from './mode-reglement.component';
import {GeneralGlobalSharedModule} from '@sycadShared/generalShared.module';
import {MatButtonIndicatorSharedModule} from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import {MatPopupModalSharedModule} from '@sycadApp/shared/material-modules/materialPopupModalShared.module';
import {MatFormControlSharedModule} from '@sycadApp/shared/material-modules/materialFormControlShared.module';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';

import { FormModeReglementComponent } from './form-mode-reglement/form-mode-reglement.component';
import { ModeReglementService } from '@sycadApp/services/impot/mode-reglement.service';
import { TitreRecetteService } from '@sycadApp/services/impot/titre-recette.service';


@NgModule({
  declarations: [ModeReglementComponent, FormModeReglementComponent],
  imports: [
    CommonModule,
    ModeReglementRoutingModule,
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
    ReactiveFormsModule
  ],
  providers: [ModeReglementService, TitreRecetteService],
  entryComponents: [FormModeReglementComponent]
})
export class ModeReglementModule { }
