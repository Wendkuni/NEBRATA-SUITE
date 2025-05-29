import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegimeFiscal } from '@sycadApp/models/data-references/contribuables/global.model';
import { RegimeFiscalService } from '@sycadApp/services/impot/regime-fiscal.service';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-form-regime-fiscal',
  templateUrl: './form-regime-fiscal.component.html',
  styleUrls: ['./form-regime-fiscal.component.scss']
})
export class FormRegimeFiscalComponent implements OnInit {

  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean=false;
  get code() { return this.formulaire.get('code'); }
  get libelle() { return this.formulaire.get('libelle'); }

  constructor(public dialogRef: MatDialogRef<FormRegimeFiscalComponent>,
              @Inject(MAT_DIALOG_DATA) public regimeFiscal: RegimeFiscal, private _snackBar: MatSnackBar,
              public fb: FormBuilder, public regimeFiscalService: RegimeFiscalService) 
              {
                this.formulaire = this.fb.group({
                  id: null,
                  code: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
                  libelle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]]
                });
               }


  ngOnInit(): void {

    if(this.regimeFiscal){

      this.formulaire.setValue({
        id: this.regimeFiscal.id,
        code: this.regimeFiscal.code,
        libelle: this.regimeFiscal.libelle
      });
    }else {
      this.regimeFiscal = new RegimeFiscal();
    }
    
  }

  onSubmit() {

    if (!this.formulaire.valid) {
      return false;
    } else {

      if (this.formulaire.value) {
        this.isLoadingResults=true;
        if (this.formulaire.value.id) {
          this.regimeFiscalService.update(this.formulaire.value).subscribe(
            data => {
              this.openSnackBar("Le régime fiscal est modifié avec succès","OK");
              this.isLoadingResults=false;
              this.dialogRef.close(data);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
              }
          );
        } else {
          this.regimeFiscalService.add(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("Le régime fiscal est ajouté avec succès","OK");

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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }
}
