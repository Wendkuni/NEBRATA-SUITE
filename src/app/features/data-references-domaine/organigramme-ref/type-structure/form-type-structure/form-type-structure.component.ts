import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RemoteErrorMessageSnackbarComponent} from '@sycadApp/shared/app-toast/snackbar.component';
import { TypeStructure } from '@sycadApp/models/data-references/organigramme/type-structure.model';
import {TypeStructureService} from '@sycadApp/services/data-references/organigramme/type-structure.service';
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-form-type-structure',
  templateUrl: './form-type-structure.component.html',
  styleUrls: ['./form-type-structure.component.scss']
})
export class FormTypeStructureComponent implements OnInit {
  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean=false;
  get nom() {return this.formulaire.get('nom')};
  get description() {return this.formulaire.get('description')};

  constructor(public dialogRef: MatDialogRef<FormTypeStructureComponent>,
              @Inject(MAT_DIALOG_DATA) public typeStructure: TypeStructure, private _snackBar: MatSnackBar,
              public fb: FormBuilder, public typeStructureService: TypeStructureService)
  {
    this.formulaire = this.fb.group({
      id: null,
      nom: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      description: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {

    if(this.typeStructure){
      this.formulaire.setValue({
        id: this.typeStructure.id,
        nom: this.typeStructure.nom,
        description: this.typeStructure.description
      });
    } else {
      this.typeStructure = new TypeStructure();
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
        this.isLoadingResults=true;
        if (this.formulaire.value.id) {
          this.typeStructureService.update(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("Le type de structure est  modifié avec succès","OK");
              this.dialogRef.close(data);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
              }
          );
        } else {
          this.typeStructureService.add(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("Le type de structure est  ajouté avec succès","OK");
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
