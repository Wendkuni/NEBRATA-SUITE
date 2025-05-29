import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { TitreHonorifiqueElement} from '@sycadApp/models/data-references/contribuables/global.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import { TitreHonorifiqueService } from '@sycadApp/services/data-references/system/titreHonorifique.service';
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-form-titre-honorifique',
  templateUrl: './form-titre-honorifique.component.html',
  styleUrls: ['./form-titre-honorifique.component.scss']
})
export class FormTitreHonorifiqueComponent implements OnInit {
  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean=false;
  get libelle() {return this.formulaire.get('libelle')};
  constructor(public dialogRef: MatDialogRef<FormTitreHonorifiqueComponent>,
              @Inject(MAT_DIALOG_DATA) public titreHonorifique: TitreHonorifiqueElement, private _snackBar: MatSnackBar,
              public fb: FormBuilder, public titreHonorifiqueService: TitreHonorifiqueService)
  {
    this.formulaire = this.fb.group({
      id: null,
      libelle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    if(this.titreHonorifique){
      this.formulaire.setValue({
        id: this.titreHonorifique.id,
        libelle: this.titreHonorifique.libelle
      });
    } else {
      this.titreHonorifique = new TitreHonorifiqueElement();
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
          this.titreHonorifiqueService.update(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("Le titre honorifique est modifié avec succès","OK");

              this.dialogRef.close(data);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        } else {
          this.titreHonorifiqueService.add(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("Le titre honorifique est ajouté avec succès","OK");
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
