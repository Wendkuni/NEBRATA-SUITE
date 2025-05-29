import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CreateNewPasswordRoutingModule } from "./create-new-password-routing.module";
import { CreateNewPasswordComponent } from "./create-new-password.component";

import { Routes, RouterModule, ActivatedRouteSnapshot } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatFormControlSharedModule } from "@sycadApp/shared/material-modules/materialFormControlShared.module";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonIndicatorSharedModule } from "@sycadApp/shared/material-modules/materialButtonIndicatorShared.module";
import { CreatePasswordResolver } from './create-password.resolver';
import { CreateNewPasswordService } from '@sycadApp/services/data-references/system/create-new-password.service';

@NgModule({
  declarations: [CreateNewPasswordComponent],
  imports: [
    CommonModule,
    CreateNewPasswordRoutingModule,
    MatFormControlSharedModule,
    MatButtonIndicatorSharedModule,
    MatCardModule,
    MatSidenavModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
  
  ],
  providers: [CreateNewPasswordService, CreatePasswordResolver],
})
export class CreateNewPasswordModule {}
