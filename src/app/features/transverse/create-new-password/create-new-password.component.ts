import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Settings } from "@sycadApp/config/app.settings.model";
import { AppSettingsService } from "@sycadApp/config/app.settings.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SycadUtils } from "@sycadShared/utils.functions";
import { RecoverPass } from "@sycadApp/models/data-references/system/recover-pass";
import { CreateNewPasswordService } from '@sycadApp/services/data-references/system/create-new-password.service';
import { ReCaptchaV3Service } from "ng-recaptcha";

@Component({
  selector: "app-create-new-password",
  templateUrl: "./create-new-password.component.html",
  styleUrls: ["./create-new-password.component.scss"],
})
export class CreateNewPasswordComponent implements OnInit {
  public form: FormGroup;
  public settings: Settings;
  public statusResult = 0;
  public code = null;
  public formData = new RecoverPass();
  public passwordHide: boolean = true;
  public passwordConfirm: boolean = true;

  constructor(
    public appSettings: AppSettingsService,
    private _snackBar: MatSnackBar,
    public fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    public reCaptchaV3Service : ReCaptchaV3Service,
    private recuperationCompteService: CreateNewPasswordService
  ) {

    this.settings = this.appSettings.settings;
    this.form = this.fb.group({
      password: [null, Validators.compose([Validators.required])],
      confirmPassword: [null, Validators.compose([Validators.required])],
    });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }

  ngOnInit() {
   //// console.log("ngOnInit")
    this.code = this.route.snapshot.paramMap.get("code");
    document.querySelector("#login-container").classList.add("body-login");
  }

  ngOnDestroy() {
    document.querySelector("#login-container").classList.remove("body-login");
  }

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.form.controls.password.value) {
      return { error: true, confirm: true };
    }
    return {};
  };

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
        this.settings.loadingSpinner = true;
        this.formData.password = this.form.controls.password.value;

        this.reCaptchaV3Service.execute('resetNouveauPasswordCompteSycad')
        .subscribe((token) => {
          this.formData.recaptcha = token;
    
             
        this.recuperationCompteService.updatePassword(this.code, this.formData).subscribe(
          (data) => {
            this.settings.loadingSpinner = false;
            this.openSnackBar("mot de passe modifié avec succès", "OK");
           //// console.log("mot de passe modifié avec succès");
            this.statusResult = 200;
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
