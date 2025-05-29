import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import { TypePieceIdentite } from '@sycadApp/models/data-references/system/model';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import {SycadUtils} from '@sycadShared/utils.functions';


@Component({
  selector: 'app-form-categorie-piece',
  templateUrl: './form-categorie-piece.component.html',
  styleUrls: ['./form-categorie-piece.component.scss']
})
export class FormCategoriePieceComponent implements OnInit {
  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults=false;
  get libelle() { return this.formulaire.get('libelle'); }
  get typePieceOficielles() { return this.formulaire.get('typePieceOficielles'); }
  get code(){ return this.formulaire.get('code');}
  constructor( public dialogRef: MatDialogRef<FormCategoriePieceComponent>,
               @Inject(MAT_DIALOG_DATA) public categoriePieceIdentite: TypePieceIdentite, private _snackBar: MatSnackBar,
               public fb: FormBuilder, public categoriePieceIdentiteService: CategoriePieceService)
  {
    this.formulaire = this.fb.group({
      id: null,
      code: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      libelle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      identite: [false],
      typePieceOficielles:[null]
    });
  }

  ngOnInit(): void {
    if(this.categoriePieceIdentite){
      
      if(!this.categoriePieceIdentite.identite){
        this.categoriePieceIdentite.identite = false;
      }

      this.formulaire.setValue({
        id: this.categoriePieceIdentite.id,
        code:this.categoriePieceIdentite.code,
        libelle: this.categoriePieceIdentite.libelle,
        identite: this.categoriePieceIdentite.identite,
        typePieceOficielles: this.categoriePieceIdentite.typePieceOficielles
      });
    } else {
      this.categoriePieceIdentite = new TypePieceIdentite();
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top'

    });
  }

  onSubmit() {

    if (!this.formulaire.valid) {
      return false;
    } else {

      if (this.formulaire.value) {
        this.isLoadingResults=true;
        if (this.formulaire.value.id) {
          this.categoriePieceIdentiteService.update(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.dialogRef.close(data);
              this.openSnackBar("La catégorie de pièce est modifiée avec succès","OK");
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
              }
          );
        } else {
          this.categoriePieceIdentiteService.add(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.dialogRef.close(data);
              this.openSnackBar("La catégorie de pièce est ajoutée avec succès","OK");

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


  //
  /*destructure d'instance*/

  closeFormModal(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  /*fin destructure d'instance*/

}
