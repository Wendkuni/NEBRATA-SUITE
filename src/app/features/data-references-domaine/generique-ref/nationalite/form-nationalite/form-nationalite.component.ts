import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {
  NationaliteElement
} from '@sycadApp/models/data-references/contribuables/global.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import { NationaliteService } from '@sycadApp/services/data-references/system/nationalite.service';
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-form-nationalite',
  templateUrl: './form-nationalite.component.html',
  styleUrls: ['./form-nationalite.component.scss']
})
export class FormNationaliteComponent implements OnInit {
  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean=false;
  get libelle() {return this.formulaire.get('libelle')};
  constructor(public dialogRef: MatDialogRef<FormNationaliteComponent>,
              @Inject(MAT_DIALOG_DATA) public nationalite: NationaliteElement, private _snackBar: MatSnackBar,
              public fb: FormBuilder, public nationaliteService: NationaliteService)
  {
    this.formulaire = this.fb.group({
      id: null,
      libelle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    if(this.nationalite){
      this.formulaire.setValue({
        id: this.nationalite.id,
        libelle: this.nationalite.libelle
      });
    } else {
      this.nationalite = new NationaliteElement();
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top'

    });
  }
  onSubmit(){
    if (!this.formulaire.valid) {
      return false;
    } else {

      if (this.formulaire.value) {
        this.isLoadingResults=false;
        if (this.formulaire.value.id) {
          this.nationaliteService.update(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("La nationalité est modifiée avec succés","OK");
              this.dialogRef.close(data);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        } else {
          this.nationaliteService.add(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("La nationalité est ajoutée avec succés","OK");
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
  closeFormModal(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
