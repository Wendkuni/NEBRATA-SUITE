import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {of, Subject} from 'rxjs';
import {CategoriePiece} from '@sycadApp/models/data-references/contribuables/global.model';
import {RemoteAutocomplete} from '@sycadApp/shared/form-components/model/remote-autocomplete';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CategoriePieceProcessus} from '@sycadApp/models/workflow/common/general';
import { CategoriePieceProcessusService } from '@sycadApp/services/workflow/categorie-piece-processus.service';


import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-form-categorie-piece-processus',
  templateUrl: './form-categorie-piece-processus.component.html',
  styleUrls: ['./form-categorie-piece-processus.component.scss']
})
export class FormCategoriePieceProcessusComponent implements OnInit {
  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean=false;
  public categoriePieceRemoteAutocomplete = new RemoteAutocomplete<CategoriePiece>();
  constructor(public dialogRef: MatDialogRef<FormCategoriePieceProcessusComponent>,
              @Inject(MAT_DIALOG_DATA) public categoriePieceProcessus: CategoriePieceProcessus, private _snackBar: MatSnackBar,
              public fb: FormBuilder, public categoriePieceProcessusService: CategoriePieceProcessusService,
              public categoriePieceService: CategoriePieceService)
  {
    this.formulaire = this.fb.group({
      id: null,
      nbExemplaire: [null],
      obligatoire: [null  || false ],
      categoriePiece: [null],

    });
  }

  ngOnInit(): void {
    this.categoriePieceRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.categoriePieceService);
    if(this.categoriePieceProcessus){
      this.categoriePieceRemoteAutocomplete.listRessource$ = of([this.categoriePieceProcessus.categoriePiece]);
      this.categoriePieceRemoteAutocomplete.initialList= [this.categoriePieceProcessus.categoriePiece];

      this.formulaire.setValue({
        id: this.categoriePieceProcessus.id,
        nbExemplaire: this.categoriePieceProcessus.nbExemplaire,
        obligatoire: this.categoriePieceProcessus.obligatoire,
        categoriePiece: this.categoriePieceProcessus.categoriePiece ? this.categoriePieceProcessus.categoriePiece.id : null
      });
    }else {
      this.categoriePieceProcessus = new CategoriePieceProcessus();
    }
  }

  public onSearchCategoriePiece(eventNgSelect){
    this.categoriePieceRemoteAutocomplete.term.next(eventNgSelect.term);
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
          this.categoriePieceProcessusService.update(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("La catégorie de pièce du processus est ajoutée avec succès","OK");
              this.dialogRef.close(data);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        } else {
          this.categoriePieceProcessusService.add(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("La catégorie de pièce du processus est modifiée avec succès","OK");
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
