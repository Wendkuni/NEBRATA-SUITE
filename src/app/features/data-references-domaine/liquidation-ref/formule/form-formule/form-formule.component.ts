import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Formule} from '@sycadApp/models/evaluation/formule.model';
import { FormuleService } from '@sycadApp/services/evaluation/formule.service';
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-form-formule',
  templateUrl: './form-formule.component.html',
  styleUrls: ['./form-formule.component.scss']
})
export class FormFormuleComponent implements OnInit {
  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public  isLoadingResults:boolean=false;
  get titre() {return this.formulaire.get('titre')};
  get expression() {return this.formulaire.get('expression')};
  constructor(public dialogRef: MatDialogRef<FormFormuleComponent>,
              @Inject(MAT_DIALOG_DATA) public formule: Formule, private _snackBar: MatSnackBar,
              public fb: FormBuilder,public formuleService: FormuleService)
  {
    this.formulaire = this.fb.group({
      id: null,
     titre: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      expression: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    if(this.formule){
      this.formulaire.setValue({
        id: this.formule.id,
        titre: this.formule.titre,
        expression: this.formule.expression
      });
    } else {
      this.formule = new Formule();
    }
  }
  onSubmit(){
    if (!this.formulaire.valid) {
      return false;
    } else {

      if (this.formulaire.value) {
        this.isLoadingResults=true;
        if (this.formulaire.value.id) {
          this.formuleService.update(this.formulaire.value).subscribe(
            data => {
              this.openSnackBar("Formule modifiée avec succès","OK");
              this.isLoadingResults=false;
              this.dialogRef.close(data);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        } else {
          this.formuleService.add(this.formulaire.value).subscribe(
            data => {
              this.openSnackBar("Formule ajoutée avec succès","OK");
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
