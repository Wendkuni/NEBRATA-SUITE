import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {of, Subject} from 'rxjs';
import {RemoteAutocomplete} from '@sycadShared/form-components/model/remote-autocomplete';
import {TypeImmeuble} from '@sycadApp/models/bornage/type-immeuble.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SycadUtils} from '@sycadShared/utils.functions';
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {
  environment
} from "../../../../../../environments/environment";
import {ActivatedRoute, Router} from "@angular/router";
import {
  MotifRejet
} from "@sycadApp/models/data-references/system/motif-rejet.model";
import {
  MotifRejetService
} from "@sycadApp/services/data-references/system/motif-rejet.service";

@Component({
  selector: 'app-motif-rejet-form',
  templateUrl: './motif-rejet-form.component.html',
  styleUrls: ['./motif-rejet-form.component.scss']
})
export class MotifRejetFormComponent implements OnInit {
  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults = false;
  public motifRejet: MotifRejet = new MotifRejet();

  get code() { return this.formulaire.get('code');}
  get libelle() { return this.formulaire.get('libelle');}


  constructor(public router: Router,
              private route: ActivatedRoute,
              public fb: FormBuilder,
              public _snackBar: MatSnackBar,
              public motifRejetService: MotifRejetService)
  {
    this.formulaire = this.fb.group({
      id: [null],
      code: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      libelle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.motifRejet = data.processus;
    });
    if(this.motifRejet){
      this.formulaire.setValue({
        id: this.motifRejet.id,
        code: this.motifRejet.code,
        libelle: this.motifRejet.libelle
      });

    }else {
      this.motifRejet = new MotifRejet();
    }
  }

  onSubmit(){
    if(!this.formulaire.value){
      return false;
    }else {
      if(this.formulaire.value){
        this.isLoadingResults=true;
        if(this.formulaire.value.id){

          this.motifRejetService.update(this.formulaire.value).subscribe(data =>{
              this.openSnackBar("Motif rejet modifié avec succès","OK");
              this.isLoadingResults=false;
              this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_MOTIF_REJET}`]);
            },
            errorResponse =>{
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        }else {
          this.motifRejetService.add(this.formulaire.value).subscribe(data =>{
              this.openSnackBar("Motif rejet ajouté avec succès","OK");
              this.isLoadingResults=false;
              this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_MOTIF_REJET}`]);
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
  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_MOTIF_REJET}`]);
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
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "7rem",
    minHeight: "4rem",
    width: "auto",
    minWidth: "0",
    translate: "yes",
    enableToolbar: true,
    showToolbar: true,
    placeholder: "Saisir un texte...",
    defaultParagraphSeparator: "",
    defaultFontName: "",
    defaultFontSize: "",
    fonts: [
      { class: "arial", name: "Arial" },
      { class: "times-new-roman", name: "Times New Roman" },
      { class: "calibri", name: "Calibri" },
      { class: "comic-sans-ms", name: "Comic Sans MS" },
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: "redText",
        class: "redText",
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ],
    //uploadUrl: environment.APPLICATION.UPLOAD_FILE_API,
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: "top",
    toolbarHiddenButtons: [["bold", "italic"], ["fontSize"]],
  };
}
