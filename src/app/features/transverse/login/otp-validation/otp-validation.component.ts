import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';


import { MatSnackBar } from '@angular/material/snack-bar';
import { OTPService } from '@sycadApp/services/data-references/system/otp.service';
import { AppSettingsService } from '@sycadApp/config/app.settings.service';
import { first } from 'rxjs/operators';
import { validateTOTPcODEValidator } from '../otp-config/otp-config.component';
import { AuthenticationService } from '../authentication.service';


@Component({
  selector: 'app-otp-validation',
  templateUrl: './otp-validation.component.html',
  styleUrls: ['./otp-validation.component.scss']
})
export class OtpValidationComponent implements  OnInit {
  public form:FormGroup;
  public  codemask = [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/];

  
  constructor(private _snackBar: MatSnackBar, 
    public fb: FormBuilder, private route: ActivatedRoute, 
    public router:Router, 
    public otpService:OTPService,
    public appSettings:AppSettingsService,public authService:AuthenticationService){

    
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
     this.otpService.validateCode(code)
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
