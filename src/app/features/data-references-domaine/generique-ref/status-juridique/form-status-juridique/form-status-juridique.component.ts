import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import {  StatusJuridique } from '@sycadApp/models/data-references/system/model';
import { Subject, of } from 'rxjs';
import { StatusJuridiqueService } from '@sycadApp/services/data-references/system/status-juridique.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import {SycadUtils} from '@sycadShared/utils.functions';


@Component({
  selector: 'app-form-status-juridique',
  templateUrl: './form-status-juridique.component.html',
  styleUrls: ['./form-status-juridique.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormStatusJuridiqueComponent implements OnInit {

  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean=false;

  get libelle() { return this.formulaire.get('libelle'); }
  get code() { return this.formulaire.get('code'); }

  constructor(public dialogRef: MatDialogRef<FormStatusJuridiqueComponent>,
    @Inject(MAT_DIALOG_DATA) public statusjuridique: StatusJuridique, private _snackBar: MatSnackBar,
    public fb: FormBuilder, public statusJuridiqueService: StatusJuridiqueService) {
    this.formulaire = this.fb.group({
      id: null,
      libelle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      code: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
    });
  }
  ngOnInit(): void {
    if (this.statusjuridique) {
             this.formulaire.setValue({
              id: this.statusjuridique.id,
              libelle: this.statusjuridique.libelle,
              code: this.statusjuridique.code,
            });
    }
    else {
      this.statusjuridique = new StatusJuridique();
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top',
      horizontalPosition: 'center'

    });
  }
  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    } else {
      if (this.formulaire.value) {
        this.isLoadingResults=true;
        if (this.formulaire.value.id) {
          this.statusJuridiqueService.update(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("Le statut juridique est modifié avec succès","OK");
              this.dialogRef.close(data);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
              }
          );
        } else {
          this.statusJuridiqueService.add(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("Le statut juridique est ajouté avec succès","OK");
              this.dialogRef.close(data);
            },
            errorResponse => {
              this.isLoadingResults=false;
             SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
              }
          );
        }
      }
    }

  }


  //
  /*destructure d'instance*/

  closeFormModal(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  /*fin destructure d'instance*/

}


