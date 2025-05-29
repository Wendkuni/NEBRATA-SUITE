import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Settings } from "@sycadApp/config/app.settings.model";
import { AppSettingsService } from "@sycadApp/config/app.settings.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SycadUtils } from "@sycadShared/utils.functions";
import { RecoverPass } from "@sycadApp/models/data-references/system/recover-pass";
import { RecuperationCompteService } from '@sycadApp/services/data-references/system/recuperation-compte.service';
import { ReCaptchaV3Service } from "ng-recaptcha";



@Component({
  selector: "app-recuperation-compte",
  templateUrl: "./recuperation-compte.component.html",
  styleUrls: ["./recuperation-compte.component.scss"],
})
export class RecuperationCompteComponent implements OnInit {
  public form: FormGroup;
  public settings: Settings;
  public statusResult = 0;
  public formData = new RecoverPass();


  constructor(
    public appSettings: AppSettingsService,
    private _snackBar: MatSnackBar,
    public fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private recuperationCompteService: RecuperationCompteService,
    public reCaptchaV3Service : ReCaptchaV3Service
  ) {
 
   
    this.settings = this.appSettings.settings;
    this.form = this.fb.group({
      email: [null, Validators.compose([Validators.required, Validators.email])]
      
    });
  }

 


  public onCaptchaResponse($event) {
   // console.log("response ",$event)
  }

  public onCaptchaExpired() {
   // console.log("onCaptchaExpired ")
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }

  ngOnInit() {
    document.querySelector("#login-container").classList.add("body-login");
  }

  ngOnDestroy() {
    document.querySelector("#login-container").classList.remove("body-login");
  }

  get f() {
    return this.form.controls;
  }

  goHome(): void {
    this.router.navigate(["/"]);
  }

  public onSubmit() {
    if (!this.form.valid) {
      return false;
    } else {
      if (this.form.value) {
        this.formData.email = this.form.controls.email.value;
        this.settings.loadingSpinner = true;

        this.reCaptchaV3Service.execute('recuperationCompteSycad')
    .subscribe((token) => {
      this.formData.recaptcha = token;
      this.recuperationCompteService.envoyerMailRecuperation(this.formData).subscribe(
        (data) => {
          this.settings.loadingSpinner = false;
          this.statusResult = 200;
          this.openSnackBar(
            "Un lien de recuperation de mot de passe vous a été envoyé sur votre compte",
            "OK"
          );
        },
        (errorResponse) => {
          this.settings.loadingSpinner = false;
          this.statusResult = errorResponse.status;
          SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
        }
      );
    },(e)=>{
      this.settings.loadingSpinner = false;
      let mes= {
        message:"Impossible de valider ce formulaire"
      }
      SycadUtils.notifyRemoteError(mes, this._snackBar);
    });

       

      
      }
    }
  }
}
