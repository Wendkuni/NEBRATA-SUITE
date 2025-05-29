import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {of, Subject} from 'rxjs';
import {RemoteAutocomplete} from '@sycadApp/shared/form-components/model/remote-autocomplete';
import {TypeImmeuble} from '@sycadApp/models/bornage/type-immeuble.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CategorieImmeuble} from '@sycadApp/models/data-references/system/categorie-immeuble.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import { CategorieImmeubleService } from '@sycadApp/services/data-references/system/categorie-immeuble.service';
import { TypeImmeubleService } from '@sycadApp/services/bornage/type-immeuble.service';
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-form-caregorie-immeuble',
  templateUrl: './form-categorie-immeuble.component.html',
  styleUrls: ['./form-categorie-immeuble.component.scss']
})
export class FormCategorieImmeubleComponent implements OnInit {
public formulaire: FormGroup;
private _onDestroy = new Subject<void>();
public isLoadingResults = false;
public typeImmeubleRemoteAutocomplete = new RemoteAutocomplete<TypeImmeuble>();

get code() { return this.formulaire.get('code');}
get libelle() { return this.formulaire.get('libelle');}


  constructor(public dialogRef: MatDialogRef<FormCategorieImmeubleComponent>,
              @Inject(MAT_DIALOG_DATA) public categorieImmeuble: CategorieImmeuble,
              public fb: FormBuilder, public _snackBar: MatSnackBar,
              public categorieImmeubleService: CategorieImmeubleService)
  {
    this.formulaire = this.fb.group({
      id: [null],
      code: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      libelle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
  if(this.categorieImmeuble){
    this.formulaire.setValue({
      id: this.categorieImmeuble.id,
      code: this.categorieImmeuble.code,
      libelle: this.categorieImmeuble.libelle
    });

  }else {
    this.categorieImmeuble = new CategorieImmeuble();
  }
  }

  onSubmit(){
  if(!this.formulaire.value){
    return false;
  }else {
    if(this.formulaire.value){
      this.isLoadingResults=true;
      if(this.formulaire.value.id){
        
        this.categorieImmeubleService.update(this.formulaire.value).subscribe(data =>{
          this.openSnackBar("Catégorie immeuble modifié avec succès","OK");
          this.isLoadingResults=false;
          this.dialogRef.close(data);
        },
          errorResponse =>{
            this.isLoadingResults=false;
          SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
          }
        );
      }else {
        this.categorieImmeubleService.add(this.formulaire.value).subscribe(data =>{
          this.openSnackBar("Catégorie immeuble ajouté avec succès","OK");
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
