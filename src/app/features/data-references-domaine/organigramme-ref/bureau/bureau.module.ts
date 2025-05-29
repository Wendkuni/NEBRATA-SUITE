import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BureauRoutingModule } from './bureau-routing.module';
import { BureauComponent } from './bureau.component';
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
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {UploadSharedModule} from '@sycadShared/uploadShared.module';
import { ServiceAdministratifService } from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';
import { FormPagesBureauComponent } from './form-pages-bureau/form-pages-bureau.component';
import { QuartierService } from '@sycadApp/services/data-references/territoire/quartier.service';
import {BureauResolver} from "@sycadFeature/data-references-domaine/organigramme-ref/bureau/bureau-resolver";
import { BureauService } from '@sycadApp/services/data-references/organigramme/bureau.service';
import { GenericsFormModule } from '@sycadApp/shared/form-components/generic-form.module';


@NgModule({
  declarations: [BureauComponent, FormPagesBureauComponent],
  imports: [
    CommonModule,
    BureauRoutingModule,
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
    UploadSharedModule,
    MatGridListModule,
    MatExpansionModule,
    ReactiveFormsModule,

    MatStepperModule,
    GenericsFormModule,
  ],
  providers: [ BureauResolver, ServiceAdministratifService, LocaliteService, StructureService, BureauService, QuartierService]
})
export class BureauModule { }
