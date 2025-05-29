import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject, of} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RemoteErrorMessageSnackbarComponent} from '@sycadApp/shared/app-toast/snackbar.component';
import { DataStoreService } from '@sycadApp/services/data-references/system/data-store.service';


import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Parametre } from '@sycadApp/models/data-references/system/model';
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-form-data-store',
  templateUrl: './form-datastore.component.html',
  styleUrls: ['./form-datastore.component.scss'],

})
export class FormStoreComponent implements OnInit {
  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public  isLoadingResults:boolean = false;

  get valeur() { return this.formulaire.get('valeur'); }

  constructor(public dialogRef: MatDialogRef<FormStoreComponent>,
              @Inject(MAT_DIALOG_DATA)
              public parametre: Parametre,
              public DataStoreService: DataStoreService,
              private _snackBar: MatSnackBar,
              public fb: FormBuilder,
              )
  {
    this.formulaire = this.fb.group({
      id: null,
      valeur: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.parametre) {

      if(this.parametre.typeValeurParametre==="SECRET"){
        this.formulaire.setValue({
          id: this.parametre.id,
          valeur: this.parametre.valeur
        });
      }else {
        this.formulaire.setValue({
          id: this.parametre.id,
          valeur: this.parametre.valeur
        });
      }

    } else {
      this.parametre = new Parametre();
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
        this.isLoadingResults = true;
        if (this.formulaire.value.id) {
          this.DataStoreService.update(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults = false;
              this.openSnackBar("La data store est modifiée avec succès","OK");
              this.dialogRef.close(data);
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

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  /*fin destructure d'instance*/



  editorConfig: AngularEditorConfig = {
       editable: true,
      spellcheck: true,
      height: '20rem',
      minHeight: '15rem',
      width: 'auto',
      minWidth: '0',
      translate: 'oui',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Entrer un texte...',
      defaultParagraphSeparator: 'p',
      defaultFontName: 'Arial',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize', 'insertImage',
      'insertVideo','insertHorizontalRule']
    ]
};
}
