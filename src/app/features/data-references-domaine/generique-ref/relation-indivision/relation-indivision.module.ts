import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RelationIndivisionRoutingModule } from './relation-indivision-routing.module';
import { RelationIndivisionComponent } from './relation-indivision.component';
import {GeneralGlobalSharedModule} from "@sycadShared/generalShared.module";
import {MatButtonIndicatorSharedModule} from "@sycadApp/shared/material-modules/materialButtonIndicatorShared.module";
import {MatPopupModalSharedModule} from "@sycadApp/shared/material-modules/materialPopupModalShared.module";
import {MatFormControlSharedModule} from "@sycadApp/shared/material-modules/materialFormControlShared.module";
import {MatNativeDateModule} from "@angular/material/core";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatMenuModule} from "@angular/material/menu";
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatExpansionModule} from "@angular/material/expansion";

import {MatStepperModule} from "@angular/material/stepper";
import {FormIndivisionRelationComponent} from '@sycadFeature/data-references-domaine/generique-ref/relation-indivision/form-indivision/form-indivisionRelation.component';
import { IndivisionrelationService } from '@sycadApp/services/data-references/contribuables/indivisionRelation.service';


@NgModule({
  declarations: [RelationIndivisionComponent, FormIndivisionRelationComponent],
  imports: [
    CommonModule,
    RelationIndivisionRoutingModule,
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
    
    MatStepperModule,
  ],
  providers: [IndivisionrelationService] ,
})

export class RelationIndivisionModule { }
