import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DegreSuccessoral} from '@sycadApp/models/evaluation/degre-successoral.model';
import { DegreSuccessoralService } from '@sycadApp/services/evaluation/degre-successoral.service';
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-form-degre-successoral',
  templateUrl: './form-degre-successoral.component.html',
  styleUrls: ['./form-degre-successoral.component.scss']
})
export class FormDegreSuccessoralComponent implements OnInit {
  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean=false;
  get rang() {return this.formulaire.get('rang')};
  get libelle() {return this.formulaire.get('libelle')};

  constructor(public dialogRef: MatDialogRef<FormDegreSuccessoralComponent>,
              @Inject(MAT_DIALOG_DATA) public degreSuccessoral: DegreSuccessoral, public fb: FormBuilder,
              private _snackBar: MatSnackBar, public degreSuccessoralService: DegreSuccessoralService)
  {
    this.formulaire = this.fb.group({
      id: [null],
      rang: [null, [Validators.required]],
      libelle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    if(this.degreSuccessoral){
      this.formulaire.setValue({
        id: this.degreSuccessoral.id,
        rang: this.degreSuccessoral.rang,
        libelle: this.degreSuccessoral.libelle,
      });
    } else {
      this.degreSuccessoral = new DegreSuccessoral();
    }
  }
  onSubmit(){
    if (!this.formulaire.valid) {
      return false;
    } else {

      if (this.formulaire.value) {
        this.isLoadingResults=true;
        if (this.formulaire.value.id) {
          this.degreSuccessoralService.update(this.formulaire.value).subscribe(
            data => {
              this.openSnackBar("Degré successoral modifié avec succès","OK");
              this.isLoadingResults=false;
              this.dialogRef.close(data);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        } else {
          this.degreSuccessoralService.add(this.formulaire.value).subscribe(
            data => {
              this.openSnackBar("Degré successoral ajouté avec succès","OK");
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
