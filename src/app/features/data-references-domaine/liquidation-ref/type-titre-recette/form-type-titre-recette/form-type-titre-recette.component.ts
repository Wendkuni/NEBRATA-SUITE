import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TypeTitreRecette} from '@sycadApp/models/impot/type-titre-recette.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import { TypeTitreRecetteService } from '@sycadApp/services/impot/type-titre-recette.service';
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-form-type-titre-recette',
  templateUrl: './form-type-titre-recette.component.html',
  styleUrls: ['./form-type-titre-recette.component.scss']
})
export class FormTypeTitreRecetteComponent implements OnInit {
public formulaire: FormGroup;
private _onDestroy = new Subject<void>();
public  isLoadingResults:boolean=false;

get code() {return this.formulaire.get('code');}
get libelle() {return this.formulaire.get('libelle');}

  constructor(public dialogRef: MatDialogRef<FormTypeTitreRecetteComponent>,
              @Inject(MAT_DIALOG_DATA) public typeTitreRecette: TypeTitreRecette,
              public fb: FormBuilder, public _snackBar: MatSnackBar,
              public typeTitreRecetteService: TypeTitreRecetteService)
   {
    this.formulaire = this.fb.group({
      id: [null],
      code: [null, [Validators.required]],
      libelle: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
   if(this.typeTitreRecette){
     this.formulaire.setValue({
       id: this.typeTitreRecette.id,
       code: this.typeTitreRecette.code,
       libelle: this.typeTitreRecette.libelle
     });
   } else {
     this.typeTitreRecette = new TypeTitreRecette();
   }
  }

  onSubmit(){
    if(!this.formulaire.value){
      return false;
    }else {
      if(this.formulaire.value){
        this.isLoadingResults=true;
        if(this.formulaire.value.id){
          this.typeTitreRecetteService.update(this.formulaire.value).subscribe(data =>{
            this.openSnackBar("Type titre recette modifié avec succès","OK");
            this.isLoadingResults=false;
              this.dialogRef.close(data);
            },
            errorResponse =>{
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
