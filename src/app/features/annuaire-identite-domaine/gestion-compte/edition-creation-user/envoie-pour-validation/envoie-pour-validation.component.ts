import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { GeneralContribuable } from '@sycadApp/models/data-references/contribuables/global.model';
import { CompteService } from '@sycadApp/services/data-references/contribuables/compte.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { AdvancedRemoteAutocomplete } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/advanced-remote-autocomplete';
import { RemoteAutocompleteExtend } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { GlobalPattern } from '@sycadApp/shared/validators/global-pattern';
import { AttributsExist } from '@sycadApp/shared/validators/remote/attributs-exist';
import { environment } from 'environments/environment';
import { catchError, map, of, Subject } from 'rxjs';
import { TransitionCreationUserComponent } from '../transition-creation-user.component';
import { CorrespondanceParcelle } from './model';
import { TypeColonne } from '@sycadApp/libs/model-table';

@Component({
  selector: 'app-envoie-pour-validation',
  templateUrl: './envoie-pour-validation.component.html',
  styleUrls: ['./envoie-pour-validation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EnvoiePourValidationComponent extends  TransitionCreationUserComponent implements OnInit {


    public contribuableMatcheRemoteAutocomplete = new AdvancedRemoteAutocomplete<GeneralContribuable>();
   public contribuableMatcheRemoteAutocompleteR = new RemoteAutocompleteExtend<GeneralContribuable>();

  public contribuableMatcheChoisie: GeneralContribuable;

  get contribuableMatche() { return this.formulaire.get('contribuableMatche');}
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
  contribuableMatche: [null],
});
}



  ngOnInit(): void {

    this.formulaire.patchValue({
      numero: this.compteContribuable.numero,
      action: this.transition.code,

    });

   // this.contribuableMatcheRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,false);
    this.initConfigAutocompleteContribuableMatche();
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

            let {numero,action,observation,contribuableMatche} = this.formulaire.value;


            let dataPost = {numero,action,observation, contribuableMatche};


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
  public runSearchContribuable() {
    this.contribuableMatcheRemoteAutocompleteR.term.next("")
  }
  public onChangeContribuable(correspondanceParcelle: CorrespondanceParcelle) {
   this.contribuableMatcheChoisie=correspondanceParcelle.contribuable;
  }

  initConfigAutocompleteContribuableMatche() {
let that = this;
    let callbackAutocomplete = (search:string,params:Map<string,any>)=> {
      return this.compteService.correspondanceContribuable(that.compteContribuable.numero).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };
    this.contribuableMatcheRemoteAutocomplete.customNgSelectConfig = {
      multiple: false,
      controlName: 'contribuableMatche',
      libelle: 'modeCorrespondance',
      term: new Subject<string>(),
      callbackAutocomplete: callbackAutocomplete,
      formulaire: this.formulaire,
      placeholder: ""
    };

    this.contribuableMatcheRemoteAutocomplete.nativeNgSelectConfig.placeholder = "Le contribuable pouvant correspondre";
    this.contribuableMatcheRemoteAutocomplete.nativeNgSelectConfig.appendTo = 'body';
    this.contribuableMatcheRemoteAutocomplete.nativeNgSelectConfig.bindValue = 'contribuable.guid';
    this.contribuableMatcheRemoteAutocomplete.listItemSelected = [];
    this.contribuableMatcheRemoteAutocomplete.keyId = 'contribuable.guid';
    this.contribuableMatcheRemoteAutocomplete.callbackAutocomplete = callbackAutocomplete;



    const colTabAttributaire = [
      { name: 'modeCorrespondance', label: 'Mode correspondance' },
      { name: 'contribuable.codeUnique', label: 'Code-IFU' },
      { name: 'contribuable.nom', label: 'Nom' },
      { name: 'contribuable.prenoms', label: 'Prénom(s)' },
      { name: 'contribuable.dateNaissance', label: 'Date de naissance' },
      { name: 'contribuable.lieuNaissance', label: 'Lieu naissance' },
      { name: 'contribuable.civilité', label: 'civilité' },
      { name: 'contribuable.genre', label: 'Genre' },
      { name: 'contribuable.nationalite', label: 'Nationalité' },
      { name: 'contribuable.statusJuridique', label: 'Status juridique' },
      { name: 'contribuable.denomination', label: 'Dénomination' },
      { name: 'contribuable.sigle', label: 'Sigle' },
      { name: 'contribuable.nomPere', label: 'Nom du père' },
      { name: 'contribuable.prenomsPere', label: 'prénom(s) du père' },
      { name: 'contribuable.nomMere', label: 'Nom de la mère' },
      { name: 'contribuable.prenomsMere', label: 'Nom de la mère' },
      { name: 'contribuable.pieceOfficielle.categorie.nom', label: 'Catégorie pièce' },
      { name: 'contribuable.pieceOfficielle.numero', label: 'Numéro pièce' },
      { name: 'contribuable.pieceOfficielle.nip', label: 'NIP' },
      { name: 'contribuable.pieceOfficielle.dateObtention', label: 'Date de délivrance' },
      { name: 'contribuable.pieceOfficielle.dateExpiration', label: 'Date expiration' },
      { name: 'libelleTelephone', label: 'Téléphone' , type: TypeColonne.STRING },
      { name: 'libelleEmail', label: 'Email' , type: TypeColonne.STRING },
    ];

    this.contribuableMatcheRemoteAutocomplete.mapFunction= (value : GeneralContribuable):GeneralContribuable=>{
      if( value.telephones) {
        value.libelleTelephone = value.telephones.map(value => value.value).join(', ');
      }
      if( value.emails) {
        value.libelleEmail =  value.emails.map(value => value.value).join(', ');
      }


      return value;
    };
    this.contribuableMatcheRemoteAutocomplete.tableDescription = this.contribuableMatcheRemoteAutocomplete.pushColumn(colTabAttributaire, 'Personne correspondante');

  }
  receiveSubjectContribuable(contri: CorrespondanceParcelle) {
    this.contribuableMatcheChoisie = contri.contribuable;
  }
}
