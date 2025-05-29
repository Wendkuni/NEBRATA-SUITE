import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';

import { TextMaskModule } from 'angular2-text-mask';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormControlSharedModule } from '@sycadApp/shared/material-modules/materialFormControlShared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonIndicatorSharedModule } from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import { OtpConfigComponent } from './otp-config/otp-config.component';
import { OtpValidationComponent } from './otp-validation/otp-validation.component';
import { OTPConfigResolver, OTPValidationResolver } from './otp-config.resolver';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { OTPService } from '@sycadApp/services/data-references/system/otp.service';
import { GeneralGlobalSharedModule } from '@sycadApp/shared/generalShared.module';
  
const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'otp-config', component: OtpConfigComponent, resolve: { otpConfig: OTPConfigResolver }},
  { path: 'otp-validation', component: OtpValidationComponent, resolve: { otpConfig: OTPValidationResolver }},
];
 
@NgModule({
  declarations: [ LoginComponent,OtpConfigComponent,OtpValidationComponent],
  imports: [
    CommonModule,
    GeneralGlobalSharedModule,
    RouterModule.forChild(routes),
    MatFormControlSharedModule,
    MatButtonIndicatorSharedModule,
    MatCardModule,
    MatSidenavModule, 
    TextMaskModule,
    MatListModule,
    FlexLayoutModule,
    FormsModule, 
    ReactiveFormsModule,
  ],
  exports: [RouterModule],
  providers: [OTPService,OTPConfigResolver,OTPValidationResolver]
})
export class LoginModule { }
