import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { UserProfilService } from '@sycadApp/services/data-references/system/user-profil.service';

import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {SycadUtils} from "@sycadShared/utils.functions";
import { AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';

@Component({
  selector: 'app-modification-information-profile',
  templateUrl: './modification-information-profile.component.html',
  styleUrls: ['./modification-information-profile.component.scss']
})
export class ModificationInformationProfile implements OnInit {
  public formulaireCredential: FormGroup;
  public formulaireAdresses: FormGroup;
  public formulaireEmails: FormGroup;
  public formulaireTelephones: FormGroup;

  public userConnected$: Observable<AuthentificatedUser>;
  hide = true;
  hideConf = true;
  hideCurr = true

  get username() {
    return this.formulaireCredential.get('username');
  }

  get existingpassword() {
    return this.formulaireCredential.get('existingpassword');
  }
  get password() {
    return this.formulaireCredential.get('password');
  }
  get confirmpassword() {
    return this.formulaireCredential.get('confirmpassword');
  }

  constructor(private _snackBar: MatSnackBar,private _bottomSheetRef: MatBottomSheetRef<ModificationInformationProfile>, public fb: FormBuilder,
              public bottomSheetRef:MatBottomSheetRef,public authService: AuthenticationService, public userProfilService: UserProfilService) {
    this.formulaireCredential = fb.group({
      username:[null, [Validators.required]],
      existingpassword: [null, [Validators.required]],
      password: [null, [Validators.required]],
      confirmpassword: [null, [Validators.required]],
    }, {
      validator: [
        this.ConfirmedValidator('password', 'confirmpassword')
      ]
    },)
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  ngOnInit(): void {
    this.userConnected$ = this.authService.me()
    this.setFormValue()
  }

  setFormValue() {
    if (this.userConnected$) {
      this.userConnected$.subscribe(user => {
        this.formulaireCredential.setValue({
          username: user.username,
          password: null,
          existingpassword: null,
          confirmpassword: null
        })
      })
    }
  }
  closeFormModal(){
    this.bottomSheetRef.dismiss();
  }
  onSubmitCredential() {
    delete this.formulaireCredential.value.confirmpassword
    //console.log(this.formulaireCredential.value)
     if (!this.formulaireCredential.valid) {
          return false;
        } else {
          if (this.formulaireCredential.value) {
            this.userProfilService.updateCredential(this.formulaireCredential.value).subscribe(
              data => {
                this.openSnackBar("Mot de passe changé avec succès","OK");
                this. closeFormModal();
                //console.log(data)
              },
            err => {
              SycadUtils.notifyRemoteError(err.error, this._snackBar);
            }
            )
          }
        }
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top'
    });
  }
  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({confirmedValidator: true});
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
  get f(){
    return this.formulaireCredential.controls;
  }
}
