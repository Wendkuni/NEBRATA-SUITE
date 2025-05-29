import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ModeReglement} from '@sycadApp/models/impot/mode-reglement.model';
import { ModeReglementService } from '@sycadApp/services/impot/mode-reglement.service';
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-form-mode-reglement',
  templateUrl: './form-mode-reglement.component.html',
  styleUrls: ['./form-mode-reglement.component.scss']
})
export class FormModeReglementComponent implements OnInit {
  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean=false;
  get code() {return this.formulaire.get('code');}
  get libelle() {return this.formulaire.get('libelle');}
  constructor(public dialogRef: MatDialogRef<FormModeReglementComponent>,
              @Inject(MAT_DIALOG_DATA) public modeReglement: ModeReglement,
              public fb: FormBuilder, public _snackBar: MatSnackBar, public modeReglementService: ModeReglementService)
  {
    this.formulaire = this.fb.group({
      id: [null],
      code: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      libelle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    if(this.modeReglement){
      this.formulaire.setValue({
        id: this.modeReglement.id,
        code: this.modeReglement.code,
        libelle: this.modeReglement.libelle
      });
    } else {
      this.modeReglement = new ModeReglement();
    }
  }
  onSubmit(){
    if(!this.formulaire.valid){
      return false;
    }else{
      if(this.formulaire.value){
        this.isLoadingResults=true;
        if(this.formulaire.value.id){
          this.modeReglementService.update(this.formulaire.value).subscribe(
            data =>{
              this.openSnackBar("Mode réglement modifié avec succès","OK");
              this.isLoadingResults=false;
              this.dialogRef.close(data);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        }else {
          this.modeReglementService.add(this.formulaire.value).subscribe(
            data =>{
              this.openSnackBar("Mode réglement ajouté avec succès","OK");
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
