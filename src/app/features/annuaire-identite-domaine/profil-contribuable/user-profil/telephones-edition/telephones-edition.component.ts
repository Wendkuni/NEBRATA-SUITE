import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";

import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';
import { UserProfilService } from '@sycadApp/services/data-references/system/user-profil.service';

import {SycadUtils} from "@sycadShared/utils.functions";
import {MatSnackBar} from "@angular/material/snack-bar";
import { AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';

@Component({
  selector: 'app-telephones-edition',
  templateUrl: './telephones-edition.component.html',
  styleUrls: ['./telephones-edition.component.scss']
})
export class TelephonesEditionComponent implements OnInit {

  @Output()
  closeFormModal:EventEmitter<void> = new EventEmitter<void> ();
  public maskTelephone = ['0', '0', '2', '2', '6', ' ', /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/];

  public formulaireTelephones: FormGroup;
  public userConnected$ : Observable<AuthentificatedUser>;
  get getFormTelephones() : FormArray { return this.formulaireTelephones.get('telephones') as FormArray;}
  constructor(private _snackBar: MatSnackBar,public fb: FormBuilder, public userProfilService: UserProfilService,public authService: AuthenticationService) {
    this.formulaireTelephones = fb.group({
      telephones: new FormArray([]),
    })
  }

  ngOnInit(): void {
    this.userConnected$=this.authService.me()
    this.setFormValue()
  }
  setFormValue(){
    if(this.userConnected$){
      this.formulaireTelephones.setValue({
        telephones:[]
      })
      this.userConnected$.subscribe(user=>{
        user.telephones.map(tel => {
          this.getFormTelephones.push(this.fb.group(
            {
              id: [tel.id],
              level: [tel.level, Validators.compose([Validators.required])],
              numero: [tel.value, Validators.compose([Validators.required])],
              principal: [tel.principal, Validators.compose([Validators.required])],
            }));
        });
      })
    }
  }
  addNewTelephone(){
    this.getFormTelephones.push(this.fb.group(
      {
        id: [null],
        level: [null, Validators.compose([Validators.required])],
        numero: [null, Validators.compose([Validators.required])],
        principal: [false],
      }));
  }


  removeTelephones(index,telephones) {
    if(telephones.value.id){
      this.userProfilService.deleteTelephone(telephones.value.id).subscribe(
        result => {
          this.getFormTelephones.removeAt(index);
          this.openSnackBar("Element supprimé avec succès","OK");
        },
        errorResponseTelephone => {
          SycadUtils.notifyRemoteError(errorResponseTelephone.error, this._snackBar);
        }
      );
    }
    else{
      this.getFormTelephones.removeAt(index);
    }
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top'
    });
  }
  public onChangePhonePrincipal(PROFESSIONAL) {
    this.getFormTelephones.controls.forEach(phonesCtl => {
      if(phonesCtl!==PROFESSIONAL) {
        phonesCtl.patchValue({
          principal: false
        });
      }
    });
  }
  onSubmitTelephones() {
    if (!this.formulaireTelephones.valid) {
      return false;
    } else {
      this.userProfilService.updateTelephone(this.formulaireTelephones.value.telephones).subscribe(
        data => {
          this.openSnackBar("Les numéros de téléphone ont été modifié avec succès","OK");
          this.closeFormModal.emit();
        },
        err => {
          SycadUtils.notifyRemoteError(err.error, this._snackBar);
        }
        );
    }
  }
}
