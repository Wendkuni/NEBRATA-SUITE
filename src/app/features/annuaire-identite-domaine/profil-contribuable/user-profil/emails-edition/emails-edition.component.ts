import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";

import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';
import { UserProfilService } from '@sycadApp/services/data-references/system/user-profil.service';

import {SycadUtils} from "@sycadShared/utils.functions";
import {MatSnackBar} from "@angular/material/snack-bar";
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ModificationInformationProfile } from '../modification-information-profile/modification-information-profile.component';
import { AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';

@Component({
  selector: 'app-emails-edition',
  templateUrl: './emails-edition.component.html',
  styleUrls: ['./emails-edition.component.scss']
})
export class EmailsEditionComponent implements OnInit {
  public formulaireEmails: FormGroup;
  public userConnected$ : Observable<AuthentificatedUser>;

  @Output()
  closeFormModal:EventEmitter<void> = new EventEmitter<void> ();

  get getFormEmails(): FormArray { return this.formulaireEmails.get('emails') as FormArray;}
  constructor(private _snackBar: MatSnackBar,public fb: FormBuilder, public authService: AuthenticationService, public userProfilService: UserProfilService) {
    this.formulaireEmails = fb.group({
      emails: new FormArray([]),
    })
  }

  ngOnInit(): void {
    this.userConnected$=this.authService.me()
    this.setFormValue()
  }
  setFormValue(){
    if(this.userConnected$){
      this.formulaireEmails.setValue({
        emails:[]
      })
      this.userConnected$.subscribe(user=>{
        if(user.emails){
          user.emails.map(em => {
            this.getFormEmails.push(this.fb.group(
              {
                id: [em.id],
                email: [em.value, Validators.compose([Validators.required])],
                level: [em.level, Validators.compose([Validators.required])],
                principal: [em.principal, Validators.compose([Validators.required])],
              }));
          });
        }
      })
    }
  }
  addNewEmail() {
    this.getFormEmails.push(this.fb.group(
      {
        id: [null],
        email: [null, Validators.compose([Validators.required])],
        level: [null, Validators.compose([Validators.required])],
        principal: [null || false],
      }));
  }
  removeEmails(index,emails) {
      if(emails.value.id){
        this.userProfilService.deleteEmail(emails.value.id).subscribe(
          result => {
            this.getFormEmails.removeAt(index);
            this.openSnackBar("Email supprimé avec succès","OK");
          },
          errorResponseEmail => {
            SycadUtils.notifyRemoteError(errorResponseEmail.error, this._snackBar);
          }
        );
      }
      else{
        this.getFormEmails.removeAt(index);
      }
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top'
    });
  }
  public onChangeEmailPrincipal(PROFESSIONAL) {
    this.getFormEmails.controls.forEach(emailsCtl => {
      if(emailsCtl!==PROFESSIONAL) {
        emailsCtl.patchValue({
          principal: false
        });
      }
    });
  }
  onSubmitEmails(){
    if (!this.formulaireEmails.valid) {
      return false;
    } else {
      this.userProfilService.updateEmail(this.formulaireEmails.value.emails).subscribe(
        data => {
          this.openSnackBar("Les emails ont été modifié avec succès","OK");
          this.closeFormModal.emit();
        },
        err => {
          SycadUtils.notifyRemoteError(err.error, this._snackBar);
        }
        );


    }
  }
}
