import { Input } from "@angular/core";
import { Directive } from "@angular/core";
import { CategoriePiece, GeneralContribuable } from "@sycadApp/models/data-references/contribuables/global.model";
import {DossierPiece, MandatElem, MandatElement, Processus, Transition} from '@sycadApp/models/workflow/common/general';
import { AdvancedRemoteAutocomplete } from "@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/advanced-remote-autocomplete";
import { TransitionComponent } from "@sycadApp/shared/form-components/processus/transition/component.transition";
import { MediaObserver } from '@angular/flex-layout';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { DateAdapter } from "@angular/material/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { CategoriePieceService } from "@sycadApp/services/data-references/system/categorie-piece.service";
import { ContribuableService } from "@sycadApp/services/data-references/system/contribuable.service";
import { ProfessionService } from "@sycadApp/services/data-references/system/profession.service";
import { AppConfirmService } from "@sycadApp/shared/app-confirm/app-confirm.service";
import { RapideContribuableFormComponent } from "@sycadApp/shared/form-components/annuaire-identite/rapide-contribuable-form/rapide-contribuable-form.component";
import { of, Subject } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { MandatsService } from "@sycadApp/services/workflow/mandats.service";
import { RemoteAutocomplete } from "@sycadApp/shared/form-components/model/remote-autocomplete";
import { TypeColonne } from "@sycadApp/libs/model-table";
@Directive()
export class TransitionMandatComponent extends TransitionComponent{
    @Input()
    public mandat: MandatElem;
    @Input()
    public transition: Transition;

    @Input()
    public processus: Processus;

    public isLoadingResults = false;
    public mandatF: FormGroup;

    public mandataireRemoteAutocomplete = new AdvancedRemoteAutocomplete<GeneralContribuable>();
    public mandantRemoteAutocomplete = new AdvancedRemoteAutocomplete<GeneralContribuable>();
    public categorieIdentiteRemoteAutocomplete = new RemoteAutocomplete<CategoriePiece>();

    get pieces() { return this.formulaire.controls.pieces as FormArray; }
    get description(){return this.formulaire.get('mandat').get('description'); }
    get fin(){return this.formulaire.get('mandat').get('fin'); }
    get debut() { return this.formulaire.get('mandat').get('debut'); }
    get objet() { return this.formulaire.get('mandat').get('objet'); }
    get documents() { return this.formulaire.controls.documents as FormArray; }
    get dossier() { return this.formulaire.get('dossier'); }
    get mandatForm() { return this.formulaire.get('mandat'); }
    constructor(
    public router: Router,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public fb: FormBuilder,
    public mediaObserver: MediaObserver,
    public contribuableService: ContribuableService,
    public professionService: ProfessionService,
    public categoriePieceService: CategoriePieceService,
    public mandatService: MandatsService)
    {
        super(mediaObserver);

        this.mandatF = this.fb.group({
          mandant: [null],
          mandataire: [null, Validators.compose([Validators.required])],
          reference: [null],
          description: [null],
          actif: [null || false],
          debut: [null, Validators.compose([Validators.required])],
          fin: [null],
          pieceJointe: [null],
          objet: [null, [Validators.required]],
          id: [null],
        });
        this.formulaire = this.fb.group({
          dossier: this.fb.group({
            objet: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
            dateExterne: [null, Validators.compose([Validators.required])],
            etatDossier: [null || false],
            refExterne: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
            observation: [null],
          }),
          mandat: this.mandatF,
          pieces: new FormArray([]),
          documents: new FormArray([])
        });
    }

  /**************** piece officielle *********************/

  createDossierPiece(piece: DossierPiece = null) {

    if (piece != null) {


      return this.fb.group({
        id: [piece.id],
        categorie: [piece.categorie, Validators.compose([Validators.required])],
        reference: [piece.reference, Validators.compose([Validators.required])],
        dateExpiration: [piece.dateExpiration, Validators.compose([Validators.required])],
        dateDelivrance: [piece.dateDelivrance, Validators.compose([Validators.required])],
        autoriteDeDelivrance: [piece.autoriteDeDelivrance, Validators.compose([Validators.required])],
        observation: [piece.observation],
        pieceJointe: [piece.pieceJointe],
      });
    } else {
      return this.fb.group({
        id: [null],
        categorie: [null, Validators.compose([Validators.required])],
        reference: [null, Validators.compose([Validators.required])],
        dateExpiration: [null, Validators.compose([Validators.required])],
        dateDelivrance: [null, Validators.compose([Validators.required])],
        autoriteDeDelivrance: [null, Validators.compose([Validators.required])],
        observation: [null],
        pieceJointe: null,
      });
    }

  }
  addNewDossierPiece() {
    this.pieces.insert(0, this.createDossierPiece());

  }


  removeDossierPiece(index) {
    this.pieces.removeAt(index);
  }
  /**************** fin piece officielle *********************/

  public mandataireChoisie: GeneralContribuable;
  receiveSubjectMandataire(contri: GeneralContribuable) {
    this.mandataireChoisie = contri;
  }


  public mandantChoisie: GeneralContribuable;
  receiveSubjectMandant(contri: GeneralContribuable) {
    this.mandantChoisie = contri;
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }



  initConfigAutocompleteMandataire() {

    let callbackAutocomplete = (search:string,params:Map<string,any>)=> {
      return this.contribuableService.autocompletion(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };
    this.mandataireRemoteAutocomplete.customNgSelectConfig = {
      multiple: false,
      controlName: 'mandataire',
      libelle: 'libelle',
      callbackAutocomplete: callbackAutocomplete,
      term: new Subject<string>(),
      formulaire: this.mandatF,
      placeholder: ""
    };


    this.mandataireRemoteAutocomplete.nativeNgSelectConfig.placeholder = "Le mandataire";
    this.mandataireRemoteAutocomplete.nativeNgSelectConfig.appendTo = 'body';
    this.mandataireRemoteAutocomplete.nativeNgSelectConfig.bindValue = 'guid';
    this.mandataireRemoteAutocomplete.listItemSelected = [];
    this.mandataireRemoteAutocomplete.keyId = 'guid';
    this.mandataireRemoteAutocomplete.callbackAutocomplete = callbackAutocomplete;
    const colTabMandataire = [
      { name: 'codeUnique', label: 'Code unique', type: TypeColonne.STRING },
      { name: 'nom', label: 'Nom' , type: TypeColonne.STRING },
      { name: 'prenoms', label: 'Prénom' , type: TypeColonne.STRING },
      { name: 'genre', label: 'Genre' , type: TypeColonne.STRING },
      { name: 'statusJuridique', label: 'Status juridique', type: TypeColonne.STRING  },
      { name: 'denomination', label: 'Dénomination', type: TypeColonne.STRING  },
      { name: 'sigle', label: 'Sigle' , type: TypeColonne.STRING },
      { name: 'categorie', label: 'Catégorie' , type: TypeColonne.STRING },
      { name: 'pieceOfficielle.categorie.libelle', label: 'Type pièce' , type: TypeColonne.STRING },
      { name: 'pieceOfficielle.numero', label: 'Numéro pièce' , type: TypeColonne.STRING },
      { name: 'pieceOfficielle.nip', label: 'Nip pièce', type: TypeColonne.STRING  },
      { name: 'pieceOfficielle.dateObtention', label: 'date pièce' , type: TypeColonne.DATE },
      { name: 'profession', label: 'Profession' , type: TypeColonne.STRING },
      { name: 'libelleTelephone', label: 'Téléphone' , type: TypeColonne.STRING },
      { name: 'libelleEmail', label: 'Email' , type: TypeColonne.STRING },
    ];
    this.mandataireRemoteAutocomplete.mapFunction= (value : GeneralContribuable):GeneralContribuable=>{
      value.libelleTelephone = value.telephones.map(value => value.value).join(', ');
      value.libelleEmail =  value.emails.map(value => value.value).join(', ');
      return value;
    };
    this.mandataireRemoteAutocomplete.tableDescription = this.mandataireRemoteAutocomplete.pushColumn(colTabMandataire, 'Liste des mandataires');

  }


  initConfigAutocompleteMandant() {

    let callbackAutocomplete = (search:string,params:Map<string,any>)=> {
      return this.contribuableService.autocompletion(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };
    this.mandantRemoteAutocomplete.customNgSelectConfig = {
      multiple: false,
      controlName: 'mandant',
      libelle: 'libelle',
      callbackAutocomplete: callbackAutocomplete,
      term: new Subject<string>(),
      formulaire: this.mandatF,
      placeholder: ""
    };

    this.mandantRemoteAutocomplete.nativeNgSelectConfig.placeholder = "Le mandant";
    this.mandantRemoteAutocomplete.nativeNgSelectConfig.appendTo = 'body';
    this.mandantRemoteAutocomplete.nativeNgSelectConfig.bindValue = 'guid';
    this.mandantRemoteAutocomplete.listItemSelected = [];
    this.mandantRemoteAutocomplete.keyId = 'guid';
    this.mandantRemoteAutocomplete.callbackAutocomplete = callbackAutocomplete;
    const colTabMandat = [
      { name: 'codeUnique', label: 'Code unique', type: TypeColonne.STRING },
      { name: 'nom', label: 'Nom' , type: TypeColonne.STRING },
      { name: 'prenoms', label: 'Prénom' , type: TypeColonne.STRING },
      { name: 'genre', label: 'Genre' , type: TypeColonne.STRING },
      { name: 'statusJuridique', label: 'Status juridique', type: TypeColonne.STRING  },
      { name: 'denomination', label: 'Dénomination', type: TypeColonne.STRING  },
      { name: 'sigle', label: 'Sigle' , type: TypeColonne.STRING },
      { name: 'categorie', label: 'Catégorie' , type: TypeColonne.STRING },
      { name: 'pieceOfficielle.categorie.libelle', label: 'Type pièce' , type: TypeColonne.STRING },
      { name: 'pieceOfficielle.numero', label: 'Numéro pièce' , type: TypeColonne.STRING },
      { name: 'pieceOfficielle.nip', label: 'Nip pièce', type: TypeColonne.STRING  },
      { name: 'pieceOfficielle.dateObtention', label: 'date pièce' , type: TypeColonne.DATE },
      { name: 'profession', label: 'Profession' , type: TypeColonne.STRING },
      { name: 'libelleTelephone', label: 'Téléphone' , type: TypeColonne.STRING },
      { name: 'libelleEmail', label: 'Email' , type: TypeColonne.STRING },
    ];
    this.mandantRemoteAutocomplete.mapFunction= (value : GeneralContribuable):GeneralContribuable=>{
      value.libelleTelephone = value.telephones.map(value => value.value).join(', ');
      value.libelleEmail =  value.emails.map(value => value.value).join(', ');
      return value;
    };
    this.mandantRemoteAutocomplete.tableDescription = this.mandataireRemoteAutocomplete.pushColumn(colTabMandat, 'Liste des mandants');

  }
  private getCorrectWidth() {

    if(this.mediaObserver.isActive("xs")) {
      return {
        width: '95vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("sm")) {
      return {
        width: '80vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("md")) {
      return {
        width: '60vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("lg")) {
      return {
        width: '55vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }
    if(this.mediaObserver.isActive("xl")) {
      return {
        width: '50vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }
  }
}
