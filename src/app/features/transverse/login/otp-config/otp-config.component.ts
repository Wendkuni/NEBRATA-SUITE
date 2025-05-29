import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';


import { MatSnackBar } from '@angular/material/snack-bar';
import { OTPService } from '@sycadApp/services/data-references/system/otp.service';
import { AppSettingsService } from '@sycadApp/config/app.settings.service';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../authentication.service';


export function validateTOTPcODEValidator(control: AbstractControl): { [key: string]: boolean } | null {
  if(control.value) {
    let code = control.value.replace(/\D/g,'');
    if (code && code.length!==6) {
      return { 'codeTotpFormat': true };
    }
  }

  return null;
}


@Component({
  selector: 'app-otp-config',
  templateUrl: './otp-config.component.html',
  styleUrls: ['./otp-config.component.scss']
})
export class OtpConfigComponent implements  OnInit {
    public form:FormGroup;
    public otpConfig: any;
    public canScanQrCode:boolean = true;
    public  codemask = [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/];


    constructor(private _snackBar: MatSnackBar,
      public fb: FormBuilder, private route: ActivatedRoute,
      public router:Router,
      public otpService:OTPService,
      public authService:AuthenticationService,
      public appSettings:AppSettingsService){

      this.otpConfig=this.route.snapshot.data["otpConfig"];


      this.form = this.fb.group({
        'code': [null, Validators.compose([Validators.required,validateTOTPcODEValidator])]
      });
    }
    openSnackBar(message: string, action: string) {
      this._snackBar.open(message, action, {
        duration: 25000,
        verticalPosition:'top',

      });
    }

    ngOnInit() {

    }



    get f() { return this.form.controls; }

    public onSubmit(formData:Object):void {

      let code = formData["code"].replace(/\D/g,'');
       this.appSettings.settings.loadingSpinner = true;
       this.otpService.validateConfig(code)
           .pipe(first())
           .subscribe(
               data => {
                 this.appSettings.settings.loadingSpinner = false;
                 if(data) {
                  location.href ="/";

                 }else {
                  this.openSnackBar("Le code fourni n'est pas valide","OK");
                 }

               },
               err => {
                   this.openSnackBar(err.error.message,"OK");
                   this.appSettings.settings.loadingSpinner = false;

               });

    }

    public logout(){
      this.authService.logout();
    }

  }
