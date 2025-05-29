import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject, of} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RemoteErrorMessageSnackbarComponent} from '@sycadApp/shared/app-toast/snackbar.component';
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { ArrondissementAutocomplete } from '@sycadApp/models/data-references/territoire/arrondissement.model';
import { LocaliteElement } from '@sycadApp/models/data-references/territoire/localite.model';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import {SycadUtils} from '@sycadShared/utils.functions';



@Component({
  selector: 'app-form-localite',
  templateUrl: './form-localite.component.html',
  styleUrls: ['./form-localite.component.scss']
})
export class FormLocaliteComponent implements OnInit {

  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean = false;
  typeLocalites = [
    'SECTEUR', 'VILLAGE'
  ];

  public arrondissementRemoteAutocomplete = new RemoteAutocomplete<ArrondissementAutocomplete>();

  get code() { return this.formulaire.get('code'); }
  get nom() { return this.formulaire.get('nom'); }
  get typeLocalite() { return this.formulaire.get('typeLocalite'); }
  get arrondissement() { return this.formulaire.get('arrondissement'); }
  constructor(public dialogRef: MatDialogRef<FormLocaliteComponent>,
              @Inject(MAT_DIALOG_DATA) public localite: LocaliteElement, private _snackBar: MatSnackBar,
              public fb: FormBuilder,
              public arrondissementservice: ArrondissementsService,
              public localiteservice: LocaliteService
              )
  {
    this.formulaire = this.fb.group({
      id: null,
      nom: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      code: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      typeLocalite: [null, Validators.compose([Validators.required])],
      arrondissement:[null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit(): void {
    this.arrondissementRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.arrondissementservice);
    if(this.localite){

      if(this.localite.arrondissement) {
        this.arrondissementRemoteAutocomplete.listRessource$=of([this.localite.arrondissement]);
        this.arrondissementRemoteAutocomplete.initialList=[this.localite.arrondissement];
      }
   

      this.formulaire.setValue({
        id: this.localite.id,
        code: this.localite.code,
        nom: this.localite.nom,
        typeLocalite: this.localite.typeLocalite,
        arrondissement: this.localite?.arrondissement?.id
      });

    } else {
      this.localite = new LocaliteElement();
    }
  }

  public onSearchArrondissement(eventNgSelect) {
    this.arrondissementRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  onSubmit() {

    if (!this.formulaire.valid) {
      return false;
    } else {

      if (this.formulaire.value) {
        this.isLoadingResults = true;
        if (this.formulaire.value.id) {
          this.localiteservice.update(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults = false;
              this.dialogRef.close(data);
            },
            errorResponse => {
              this.isLoadingResults = false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
              }
          );
        } else {
          this.localiteservice.add(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults = false;
              this.dialogRef.close(this.formulaire.value);
            },
            errorResponse => {
              this.isLoadingResults = false;
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
  /*fin destructure d'instance*/

}
