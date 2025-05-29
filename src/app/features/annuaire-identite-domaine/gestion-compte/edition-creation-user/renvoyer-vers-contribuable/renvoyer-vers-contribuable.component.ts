import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CompteService } from '@sycadApp/services/data-references/contribuables/compte.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { GlobalPattern } from '@sycadApp/shared/validators/global-pattern';
import { AttributsExist } from '@sycadApp/shared/validators/remote/attributs-exist';
import { environment } from 'environments/environment';
import { TransitionCreationUserComponent } from '../transition-creation-user.component';

@Component({
  selector: 'app-renvoyer-vers-contribuable',
  templateUrl: './renvoyer-vers-contribuable.component.html',
  styleUrls: ['./renvoyer-vers-contribuable.component.scss']
})
export class RenvoyerVersContribuableComponent  extends  TransitionCreationUserComponent implements OnInit {


  get telephone() { return this.formulaire.get('telephone');}
  get email() { return this.formulaire.get('email');}
  get observation() { return this.formulaire.get('observation');}

  constructor(public router: Router,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public compteService: CompteService) {
super(router, dialog,_snackBar, confirmService,_adapter, mediaObserver, fb, compteService);

this.formulaire = this.fb.group({
  numero: [null, [Validators.required]],
  action: [null, [Validators.required]],
  observation: [null, [Validators.required]],
  email: [null, Validators.compose([Validators.required, Validators.email])],
  telephone: [null, Validators.compose([ GlobalPattern.patternTelephoneBf])],
});
}



  ngOnInit(): void {

    this.formulaire.patchValue({ 
      numero: this.compteContribuable.numero,
      action: this.transition.code,
      telephone: this.compteContribuable?.informationsContribuable?.telephone,
      email: this.compteContribuable?.informationsContribuable?.email,
    });
  }
  public onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    } else {
      if (this.formulaire.value) {

        this.confirmService.confirm({
          title:"Confirmation",
          message:`Voulez-vous renvoyer ces informations pour traitement ? `
        }).subscribe(($choix)=> {
          if($choix===true) {
        
            this.isLoadingResults =true;
    
            let {numero,action,observation,email,telephone} = this.formulaire.value;
        
    
            let informationsContribuable = {email,telephone};
    
            
            let dataPost = {numero,action,observation, informationsContribuable};
     
          
            this.compteService.executer(dataPost).subscribe(data => {
              this.isLoadingResults = false;
              this.openSnackBar("Demande de création de compte mise à jour avec succès","OK");
              location.href =environment.FRONTEND_ROUTES.GESTION_COMPTE;
            },
            errorResponse => {
              this.isLoadingResults = false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );  
          
  
            
          }       
        }); 

     

  
      }
    } 

    
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
