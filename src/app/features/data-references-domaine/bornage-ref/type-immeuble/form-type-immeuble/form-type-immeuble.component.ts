import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TypeImmeuble } from '@sycadApp/models/bornage/type-immeuble.model';
import { TypeImmeubleService } from '@sycadApp/services/bornage/type-immeuble.service';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-form-type-immeuble',
  templateUrl: './form-type-immeuble.component.html',
  styleUrls: ['./form-type-immeuble.component.scss']
})
export class FormTypeImmeubleComponent implements OnInit {

  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults=false;
  categories = [
    'BATIMENT',
    'AMENAGEMENT_PARTICULIER',
    'CLOTURE'
  ];

  get code() {return this.formulaire.get('code');}
  get libelle() {return this.formulaire.get('libelle');}
  get categorie() {return this.formulaire.get('categorie');}

  constructor(public dialogRef: MatDialogRef<FormTypeImmeubleComponent>,
              @Inject(MAT_DIALOG_DATA) public typeImmeuble: TypeImmeuble, private _snackBar: MatSnackBar,
              public fb: FormBuilder,
              private http: HttpClient,public typeImmeubleService: TypeImmeubleService)
               {
                this.formulaire = this.fb.group({
                  id: null,
                  code: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
                  libelle: [null, Validators.compose([Validators.required])],
                  categorie:[null, Validators.compose([Validators.required])]
                });
                }

  ngOnInit(): void {
    if(this.typeImmeuble){
      this.formulaire.setValue({
        id: this.typeImmeuble.id,
        code: this.typeImmeuble.code,
        libelle: this.typeImmeuble.libelle,
        categorie: this.typeImmeuble.categorie

      })
    }else {
      this.typeImmeuble = new TypeImmeuble();
    }
  }
  onSubmit() {

    if (!this.formulaire.valid) {
      return false;
    } else {

      if (this.formulaire.value) {
        this.isLoadingResults=true;
        if (this.formulaire.value.id) {
          this.typeImmeubleService.update(this.formulaire.value).subscribe(
            data => {
              this.openSnackBar("Type immeuble modifié avec succès","OK");
              this.isLoadingResults=false;
              this.dialogRef.close(data);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
              }
          );
        } else {
          this.typeImmeubleService.add(this.formulaire.value).subscribe(
            data => {
              this.openSnackBar("Type immeuble ajouté avec succès","OK");
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
