import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackageImpotRoutingModule } from './package-impot-routing.module';
import { PackageImpotComponent } from './package-impot.component';
import { FormPackageImpotComponent } from './form-package-impot/form-package-impot.component';
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

import {MatSelectModule} from '@angular/material/select';
import { NatureImpotService } from '@sycadApp/services/impot/nature-impot.service';
import {UploadSharedModule} from '@sycadShared/uploadShared.module';
import { ElementLiquidationService } from '@sycadApp/services/impot/element-liquidation.service';

import { PackageImpotService } from '@sycadApp/services/impot/package-impot.service';
import { ProcessusService } from '@sycadApp/services/workflow/processus.service';
import { PackageImpotResolver } from './package-impot-resolver';
import { GenericsFormModule } from '@sycadApp/shared/form-components/generic-form.module';
import {
  CessionSourceService
} from "@sycadApp/services/impot/cession-source.service";
import {
  TypeTitreRecetteService
} from "@sycadApp/services/impot/type-titre-recette.service";


@NgModule({
  declarations: [PackageImpotComponent, FormPackageImpotComponent],
  imports: [
    CommonModule,
    PackageImpotRoutingModule,
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

    UploadSharedModule,
    MatSelectModule,
    GenericsFormModule
  ],
  providers: [PackageImpotService, NatureImpotService, PackageImpotResolver, ElementLiquidationService, ProcessusService,CessionSourceService,TypeTitreRecetteService]
})
export class PackageImpotModule { }
