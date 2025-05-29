import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Settings } from '@sycadApp/config/app.settings.model';
import { AppSettingsService } from '@sycadApp/config/app.settings.service';
import { Router, ActivatedRoute } from '@angular/router';


import { first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';
import { environment } from 'environments/environment';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { ReCaptchaV3Service } from 'ng-recaptcha';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
public form:FormGroup;
  public settings: Settings;
  private returnUrl: string;
  public passwordHide:boolean = true;



  get urlRecuperation(){
    return environment.FRONTEND_ROUTES.SYSTEM_RECUPERATION_COMPTE;
  }
  get urlCreerCompte(){
    return environment.FRONTEND_ROUTES.SYSTEM_CREER_COMPTE;
  }
  constructor(
    public appSettings:AppSettingsService,
    private _snackBar: MatSnackBar,
    public fb: FormBuilder,
    private route: ActivatedRoute,
    public router:Router,
    private authenticationService: AuthenticationService,
    public reCaptchaV3Service : ReCaptchaV3Service){
    this.settings = this.appSettings.settings;
    this.form = this.fb.group({
      'identity': [null, Validators.compose([Validators.required])],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(5)])],
      'rememberMe': [false]
    });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top',

    });
  }

  ngOnInit() {
    document.querySelector("#login-container").classList.add('body-login');
    let currentToken = this.authenticationService.currentTokenValue;
    if(currentToken) {
      this.router.navigate([environment.FRONTEND_ROUTES.VUE_360]);
    }


    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || environment.FRONTEND_ROUTES.VUE_360;
  }

  ngOnDestroy() {
    document.querySelector("#login-container").classList.remove('body-login');
  }

  get f() { return this.form.controls; }

  public onSubmit(values:Object):void {
    if (this.form.valid) {

    this.settings.loadingSpinner = true;


    this.reCaptchaV3Service.execute('submitFormLoginSycad')
    .subscribe((token) => {
      this.authenticationService.login(this.f.identity.value, this.f.password.value,token, this.f.rememberMe.value)
      .pipe(first())
      .subscribe(
          data => {
            this.settings.loadingSpinner = false;
           location.href =this.returnUrl;
          },
          err => {
            if(err.error && err.error.message) {
              this.openSnackBar(err.error.message,"OK");
            }

              this.settings.loadingSpinner = false;
          });
    },(e)=>{
      this.settings.loadingSpinner = false;
      let mes= {
        message:"Impossible de valider ce formulaire"
      }
      SycadUtils.notifyRemoteError(mes, this._snackBar);
    });





    }
  }

  public onCaptchaResponse($event) {
    //// console.log("response ",$event)
   }

   public onCaptchaExpired() {
    // console.log("onCaptchaExpired ")
   }

}
