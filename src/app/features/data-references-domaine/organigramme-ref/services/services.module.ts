import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { ServicesComponent } from './services.component';
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
import { FormPagesServicesComponent } from './form-pages-services/form-pages-services.component';
import {ServicesResolver} from "@sycadFeature/data-references-domaine/organigramme-ref/services/services-resolver";
import { GenericsFormModule } from '@sycadApp/shared/form-components/generic-form.module';
import { QuartierService } from '@sycadApp/services/data-references/territoire/quartier.service';
import { ServiceAdministratifService } from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';



@NgModule({
  declarations: [ServicesComponent, FormPagesServicesComponent ],
  imports: [
    CommonModule,
    ServicesRoutingModule,
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
    UploadSharedModule,
    ReactiveFormsModule,

    MatStepperModule,
    GenericsFormModule,
  ],
  providers: [ ServiceAdministratifService,  StructureService, LocaliteService, ServicesResolver, QuartierService]

})
export class ServicesModule { }
