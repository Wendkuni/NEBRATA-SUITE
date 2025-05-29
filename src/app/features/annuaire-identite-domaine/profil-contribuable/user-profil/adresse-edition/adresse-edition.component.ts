import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';
import { UserProfilService } from '@sycadApp/services/data-references/system/user-profil.service';

import {Observable} from "rxjs";

import {SycadUtils} from "@sycadShared/utils.functions";
import {MatSnackBar} from "@angular/material/snack-bar";
import { AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';

@Component({
  selector: 'app-adresse-edition',
  templateUrl: './adresse-edition.component.html',
  styleUrls: ['./adresse-edition.component.scss']
})
export class AdresseEditionComponent implements OnInit {

  @Output()
  closeFormModal:EventEmitter<void> = new EventEmitter<void> ();

  public formulaireAdresses: FormGroup;
  public userConnected$ : Observable<AuthentificatedUser>;
  get getFormAdresses(): FormArray { return this.formulaireAdresses.get('adresses') as FormArray;}
  constructor(private _snackBar: MatSnackBar, public fb: FormBuilder, public authService: AuthenticationService,public userProfilService: UserProfilService) {
    this.formulaireAdresses = fb.group({
      adresses: new FormArray([]),
    })
  }

  ngOnInit(): void {
    this.userConnected$=this.authService.me()
    this.setFormValue()
  }
  setFormValue(){
    if(this.userConnected$){
      this.formulaireAdresses.setValue({
        adresses:[]
      })
      this.userConnected$.subscribe(user=>{
        if(user['adresses']){
          user["adresses"].map(ad => {
            this.getFormAdresses.push(this.fb.group(
              {
                id: [ad.id],
                libelle: [ad.libelle, Validators.compose([Validators.required])],
                principal: [ad.principal, Validators.compose([Validators.required])],
              }));
          });
        }
      })
    }
  }
  addNewAdresse() {
    this.getFormAdresses.push(this.fb.group(
      {
        id: [null],
        principal: [null || false],
        libelle: [null, Validators.compose([Validators.required, Validators.maxLength(150), Validators.minLength(2)])]
      }));

  }
  removeAdresse(index,adresses) {
    if(adresses.value.id){
      this.userProfilService.deleteAdresse(adresses.value.id).subscribe(
        result => {
          this.getFormAdresses.removeAt(index);
          this.openSnackBar("Element supprimé avec succès","OK");
        },
        errorResponseAdresse => {
          SycadUtils.notifyRemoteError(errorResponseAdresse.error, this._snackBar);
        }
      );
    }
    else{
      this.getFormAdresses.removeAt(index);
    }
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top'
    });
  }
  public onChangeAdressePrincipal(adresse) {
    this.getFormAdresses.controls.forEach(adresseCtl => {
      if(adresseCtl!==adresse) {
        adresseCtl.patchValue({
          principal: false
        });
      }
    });

  }
  onSubmitAdresses(){
    if (!this.formulaireAdresses.valid) {
      return false;
    } else {
      if (this.formulaireAdresses.value) {


        this.userProfilService.updateAdresse(this.formulaireAdresses.value.adresses).subscribe(
          data => {
            this.openSnackBar("Les adresses ont été modifié avec succès","OK");
            this.closeFormModal.emit();
          },
         err => {
           SycadUtils.notifyRemoteError(err.error, this._snackBar);
         }
         )


      }
    }
  }
}
