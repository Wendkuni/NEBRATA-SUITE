import {Component, Inject, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SystemImposition} from '@sycadApp/models/impot/system-imposition.model';
import { SystemImpositionService } from '@sycadApp/services/impot/system-imposition.service'
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-form-system-imposition',
  templateUrl: './form-system-imposition.component.html',
  styleUrls: ['./form-system-imposition.component.scss']
})
export class FormSystemImpositionComponent implements OnInit {
  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean=false;

  get code() {return this.formulaire.get('code');}
  get libelle() {return this.formulaire.get('libelle');}

  constructor(public dialogRef: MatDialogRef<FormSystemImpositionComponent>,
              @Inject(MAT_DIALOG_DATA) public systemImpot: SystemImposition,
              public fb: FormBuilder, public _snackBar: MatSnackBar,public systemImpositionService: SystemImpositionService)
  {
    this.formulaire = this.fb.group({
      id: [null],
      code: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      libelle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    if(this.systemImpot){
      this.formulaire.setValue({
        id: this.systemImpot.id,
        code: this.systemImpot.code,
        libelle: this.systemImpot.libelle
      });
    } else {
      this.systemImpot = new SystemImposition();
    }
  }
  onSubmit(){
    if(!this.formulaire.valid){
      return false;
    }else{
      if(this.formulaire.value){
        this.isLoadingResults=true;
        if(this.formulaire.value.id){
          this.systemImpositionService.update(this.formulaire.value).subscribe(
            data =>{
              this.openSnackBar("Système imposition modifié avec succès","OK");
              this.isLoadingResults=false;
              this.dialogRef.close(data);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        }else {
          this.systemImpositionService.add(this.formulaire.value).subscribe(
            data =>{
              this.openSnackBar("Système imposition ajouté avec succès","OK");
              this.isLoadingResults=false;
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
