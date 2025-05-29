import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProfessionElement} from '@sycadApp/models/data-references/contribuables/global.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-profession-form',
  templateUrl: './profession-form.component.html',
  styleUrls: ['./profession-form.component.scss']
})
export class ProfessionFormComponent implements OnInit {
  public professionFormulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean=false;
  get nom() {return this.professionFormulaire.get('nom')};
  get code() {return this.professionFormulaire.get('code')};
  constructor(public dialogRef: MatDialogRef<ProfessionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public profession: ProfessionElement,
              private _snackBar: MatSnackBar,
              public fb: FormBuilder, public professionService: ProfessionService)
  {
    this.professionFormulaire = this.fb.group({
      id: [null],
      code: [null,[Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
      nom: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    if(this.profession){
      this.professionFormulaire.setValue({
        id: this.profession.id,
        code: this.profession.code,
        nom: this.profession.nom
      });
    } else {
      this.profession = new ProfessionElement();
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top'

    });
  }
  onSubmit(){
    if (!this.professionFormulaire.valid) {
      return false;
    } else {

      if (this.professionFormulaire.value) {
        this.isLoadingResults=true;
        if (this.professionFormulaire.value.id) {
          this.professionService.update(this.professionFormulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("La profession est modifiée avec succès","OK");
              this.dialogRef.close(data);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        } else {
          this.professionService.add(this.professionFormulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("La profession est ajoutée avec succès","OK");
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
