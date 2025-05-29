import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SecteurActivitePrincipale} from '@sycadApp/models/data-references/contribuables/global.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import { SecteurActiviteService } from '@sycadApp/services/data-references/system/secteur-activite.service';
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-secteur-activite-form',
  templateUrl: './secteur-activite-form.component.html',
  styleUrls: ['./secteur-activite-form.component.scss']
})
export class SecteurActiviteFormComponent implements OnInit {
  public secteurActiviteFormulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean=false;
  get nom() {return this.secteurActiviteFormulaire.get('nom')};
  get code() {return this.secteurActiviteFormulaire.get('code')};
  constructor(public dialogRef: MatDialogRef<SecteurActiviteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public secteurActivite: SecteurActivitePrincipale,
              private _snackBar: MatSnackBar,
              public fb: FormBuilder, public secteurActiviteService: SecteurActiviteService)
  {
    this.secteurActiviteFormulaire = this.fb.group({
      id: [null],
      code: [null,[Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
      nom: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    if(this.secteurActivite){
      this.secteurActiviteFormulaire.setValue({
        id: this.secteurActivite.id,
        code: this.secteurActivite.code,
        nom: this.secteurActivite.nom
      });
    } else {
      this.secteurActivite = new SecteurActivitePrincipale();
    }
  }
  onSubmit(){
    if (!this.secteurActiviteFormulaire.valid) {
      return false;
    } else {

      if (this.secteurActiviteFormulaire.value) {
        this.isLoadingResults=true;
        if (this.secteurActiviteFormulaire.value.id) {
          this.secteurActiviteService.update(this.secteurActiviteFormulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("Le secteur d'activité est modifié avec succès","OK");

              this.dialogRef.close(data);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        } else {
          this.secteurActiviteService.add(this.secteurActiviteFormulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("Le secteur d'activité est ajouté avec succès","OK");
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top'

    });
  }

  closeFormModal(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
