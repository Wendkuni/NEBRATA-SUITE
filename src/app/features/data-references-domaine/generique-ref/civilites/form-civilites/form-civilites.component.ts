import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Civilite} from '@sycadApp/models/data-references/system/model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RemoteErrorMessageSnackbarComponent} from '@sycadApp/shared/app-toast/snackbar.component';

import {SycadUtils} from '@sycadShared/utils.functions';
import { CiviliteService } from '@sycadApp/services/data-references/system/civilite-service.service';

@Component({
  selector: 'app-form-civilites',
  templateUrl: './form-civilites.component.html',
  styleUrls: ['./form-civilites.component.scss']
})
export class FormCivilitesComponent implements OnInit {

  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean=false;
  get libelle() { return this.formulaire.get('libelle'); }

  constructor(public dialogRef: MatDialogRef<FormCivilitesComponent>,
              @Inject(MAT_DIALOG_DATA) public civilite: Civilite, private _snackBar: MatSnackBar,
              public fb: FormBuilder, public civiliteService: CiviliteService)
  {
    this.formulaire = this.fb.group({
      id: null,
      libelle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {

    if(this.civilite){
      this.formulaire.setValue({
        id: this.civilite.id,
        libelle: this.civilite.libelle
      });
    }else {
      this.civilite = new Civilite();
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top'

    });
  }

  onSubmit() {

    if (!this.formulaire.valid) {
      return false;
    } else {

      if (this.formulaire.value) {
        this.isLoadingResults=true;
        if (this.formulaire.value.id) {
          this.civiliteService.update(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("La civlité est modifiée avec succès","OK");
              this.dialogRef.close(data);
            },
            errorResponse => {
              this.isLoadingResults=false;
             SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
              }
          );
        } else {
          this.civiliteService.add(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("La civlité est ajoutée avec succès","OK");
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
