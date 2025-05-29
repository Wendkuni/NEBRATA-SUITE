import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {of, Subject} from 'rxjs';
import {RemoteAutocomplete} from '@sycadShared/form-components/model/remote-autocomplete';
import {TypeImmeuble} from '@sycadApp/models/bornage/type-immeuble.model';
import {CategorieImmeuble} from '@sycadApp/models/data-references/system/categorie-immeuble.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import { CategorieImmeubleService } from '@sycadApp/services/data-references/system/categorie-immeuble.service';
import {SycadUtils} from '@sycadShared/utils.functions';
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {
  environment
} from "../../../../../../environments/environment";
import {ActivatedRoute, Router} from "@angular/router";
import {
  TypeTransition
} from "@sycadApp/models/data-references/system/type-transition.model";
import {
  TypeTransitionService
} from "@sycadApp/services/data-references/system/type-transition.service";

@Component({
  selector: 'app-form-caregorie-immeuble',
  templateUrl: './form-type-transition.component.html',
  styleUrls: ['./form-type-transition.component.scss']
})
export class FormTypeTransitionComponent implements OnInit {
public formulaire: FormGroup;
private _onDestroy = new Subject<void>();
public isLoadingResults = false;
  public typeTransition: TypeTransition = new TypeTransition();
public typeImmeubleRemoteAutocomplete = new RemoteAutocomplete<TypeImmeuble>();

get code() { return this.formulaire.get('code');}
get libelle() { return this.formulaire.get('libelle');}


  constructor(public router: Router,
              private route: ActivatedRoute,
              public fb: FormBuilder,
              public _snackBar: MatSnackBar,
              public typeTransitionService: TypeTransitionService)
  {
    this.formulaire = this.fb.group({
      id: [null],
      code: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      libelle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.typeTransition = data.processus;
    });
  if(this.typeTransition){
    this.formulaire.setValue({
      id: this.typeTransition.id,
      code: this.typeTransition.code,
      libelle: this.typeTransition.libelle
    });

  }else {
    this.typeTransition = new TypeTransition();
  }
  }

  onSubmit(){
  if(!this.formulaire.value){
    return false;
  }else {
    if(this.formulaire.value){
      this.isLoadingResults=true;
      if(this.formulaire.value.id){

        this.typeTransitionService.update(this.formulaire.value).subscribe(data =>{
          this.openSnackBar("Type transition modifié avec succès","OK");
          this.isLoadingResults=false;
            this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_TYPE_TRANSITION}`]);
        },
          errorResponse =>{
            this.isLoadingResults=false;
          SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
          }
        );
      }else {
        this.typeTransitionService.add(this.formulaire.value).subscribe(data =>{
          this.openSnackBar("Type transition ajouté avec succès","OK");
          this.isLoadingResults=false;
            this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_TYPE_TRANSITION}`]);
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
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_TYPE_TRANSITION}`]);
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
