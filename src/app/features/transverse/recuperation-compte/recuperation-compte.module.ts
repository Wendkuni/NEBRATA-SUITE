import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RecuperationCompteRoutingModule } from "./recuperation-compte-routing.module";
import { RecuperationCompteComponent } from "./recuperation-compte.component";

import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatFormControlSharedModule } from "@sycadApp/shared/material-modules/materialFormControlShared.module";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonIndicatorSharedModule } from "@sycadApp/shared/material-modules/materialButtonIndicatorShared.module";
import { RecuperationCompteService } from '@sycadApp/services/data-references/system/recuperation-compte.service';
import { GeneralGlobalSharedModule } from "@sycadApp/shared/generalShared.module";



@NgModule({
  declarations: [RecuperationCompteComponent],
  imports: [
    CommonModule,
    GeneralGlobalSharedModule,
    RecuperationCompteRoutingModule,
    MatFormControlSharedModule,
    MatButtonIndicatorSharedModule,
    MatCardModule,
    MatSidenavModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [RecuperationCompteService],
})
export class RecuperationCompteModule {}
