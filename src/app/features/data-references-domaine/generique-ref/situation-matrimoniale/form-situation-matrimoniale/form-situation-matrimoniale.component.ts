import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SituationMatrimonialeComponent} from '@sycadFeature/data-references-domaine/generique-ref/situation-matrimoniale/situation-matrimoniale.component';
import {SituationMatrimonialeElement} from '@sycadApp/models/data-references/contribuables/global.model';
import { SituationMatrimonialeService } from '@sycadApp/services/data-references/system/situationMatrimoniale.service';
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-form-situation-matrimoniale',
  templateUrl: './form-situation-matrimoniale.component.html',
  styleUrls: ['./form-situation-matrimoniale.component.scss']
})
export class FormSituationMatrimonialeComponent implements OnInit {
  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean=false;
  get libelle() {return this.formulaire.get('libelle')};
  constructor(public dialogRef: MatDialogRef<SituationMatrimonialeComponent>,
              @Inject(MAT_DIALOG_DATA) public situationMatrimoniale: SituationMatrimonialeElement, private _snackBar: MatSnackBar,
              public fb: FormBuilder, public situationMatrimonialeService: SituationMatrimonialeService)
  {
    this.formulaire = this.fb.group({
      id: null,
      libelle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    if(this.situationMatrimoniale){
      this.formulaire.setValue({
        id: this.situationMatrimoniale.id,
        libelle: this.situationMatrimoniale.libelle
      });
    } else {
      this.situationMatrimoniale = new SituationMatrimonialeElement();
    }
  }
  onSubmit(){
    if (!this.formulaire.valid) {
      return false;
    } else {

      if (this.formulaire.value) {
        this.isLoadingResults=true;
        if (this.formulaire.value.id) {
          this.situationMatrimonialeService.update(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("La situation matrimoiale est modifiée avec succès","OK");
              this.dialogRef.close(data);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        } else {
          this.situationMatrimonialeService.add(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("La situation matrimoiale est ajoutée avec succès","OK");
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
      verticalPosition:'top'

    });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
