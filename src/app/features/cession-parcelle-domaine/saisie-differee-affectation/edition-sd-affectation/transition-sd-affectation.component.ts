
import { Input, Directive } from '@angular/core';

import { Validators, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DossierPiece, Processus, Transition } from '@sycadApp/models/workflow/common/general';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { DateAdapter } from '@angular/material/core';
import { MediaObserver } from '@angular/flex-layout';
import { IlotElement, ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';

import { TransitionComponent } from '@sycadApp/shared/form-components/processus/transition/component.transition';
import {AffectationParcelle} from '@sycadApp/models/workflow/sd-affectation.model';
import { AdvancedRemoteAutocomplete } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/advanced-remote-autocomplete';

import { ActeurAutocomplete } from '@sycadApp/models/data-references/contribuables/acteur.model';
import { CategoriePiece, GeneralContribuable, Ilot, Section } from '@sycadApp/models/data-references/contribuables/global.model';
import { CessionSource } from '@sycadApp/models/workflow/common/attribution-source.model';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { CessionSourceService } from '@sycadApp/services/impot/cession-source.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';

import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { Observable, of, Subject } from 'rxjs';
import {StructureAutocomplete} from '@sycadApp/models/data-references/organigramme/structure.model';
import { SdAffectationService } from '@sycadApp/services/workflow/sd-affectation.service';
import {Document} from '@sycadApp/models/workflow/common/general';
import { catchError, map } from 'rxjs/operators';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { TypeColonne } from '@sycadApp/libs/model-table';
@Directive()
export class TransitionAffectationComponent extends TransitionComponent {


  @Input()
  public affectation: AffectationParcelle;
  @Input()
  public transition: Transition;

  @Input()
  public processus: Processus;


 public structureRemoteAutocomplete = new RemoteAutocomplete<StructureAutocomplete>();
  public acteurRemoteAutocomplete = new AdvancedRemoteAutocomplete<ActeurAutocomplete>();
  public attributaireRemoteAutocomplete = new AdvancedRemoteAutocomplete<GeneralContribuable>();
  public categorieIdentiteRemoteAutocomplete = new RemoteAutocomplete<CategoriePiece>();
  public cessionSourceRemoteAutocomplte = new RemoteAutocomplete<CessionSource>();


  public isLoadingResults = false;
  public attributaireForm: FormGroup;

get structure() { return this.formulaire.get('structure');}
  get pieces() { return this.formulaire.controls.pieces as FormArray; }
  get documents() { return this.formulaire.controls.documents as FormArray; }
  get dossier() { return this.formulaire.get('dossier'); }
  get parcelle() { return this.formulaire.get('parcelle'); }
  get acteur() { return this.formulaire.get('acteur'); }
  get cessionSource() { return this.formulaire.get('cessionSource'); }
  //get transmissionCreateur() {return this.formulaire.get('transmissionCreateur')}

  public autocompletionByIlotAndLibre:(search:string,params:Map<string,any>)=>Observable<any[]>;

  constructor(
    public router: Router,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public affectationService: SdAffectationService,
    public attributionSourceService: CessionSourceService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public professionService: ProfessionService,
    public categoriePieceService: CategoriePieceService,
    public parcelleService: ParcelleService,
  ) {
    super(mediaObserver);

    this.formulaire = this.fb.group({
      dossier: this.fb.group({
        objet: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
        dateExterne: [null, Validators.compose([Validators.required])],
        etatDossier: [null || false],
        refExterne: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
        observation: [null],
      }),
      acteur: [null],
      cessionSource: [null, Validators.compose([Validators.required])],
     structure: [null, Validators.compose([Validators.required])],
      parcelle: [null, Validators.compose([Validators.required])],
      pieces: new FormArray([]),
      documents: new FormArray([]),
    });

    this.autocompletionByIlotAndLibre=(search:string,params:Map<string,any>)=> {
      return this.parcelleService.autocompletionByIlotAndLibre(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };
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



  /*************************** creation de documents**********************************/
  createDocument(document: Document = null) {
    if(document != null){
      return this.fb.group({
        id: [document.id],
        libelle:[document.libelle, [Validators.required]],
        numero:[document.numero, [Validators.required]],
        pieceJointe:[document.pieceJointe],
        dateValidite: [document.dateValidite],
        documentType: [document.documentType.id, [Validators.required]],
        dateDoc: [document.dateDoc, [Validators.required]]
      });
    }else {
    return this.fb.group({
      id: [null],
      libelle: [null, [Validators.required]],
      numero: [null, [Validators.required]],
      pieceJointe: [null, [Validators.required]],
      dateValidite: [null],
      documentType: [null, [Validators.required]],
      dateDoc: [null, [Validators.required]]
    });
    }
  }

  addDocument() {
    this.documents.insert(0, this.createDocument());

  }

  removeDocument(index) {

    this.documents.removeAt(index);

  }
  /***************** fin création document **********************/
public onSearchStructure(eventNgSelect){
  this.structureRemoteAutocomplete.term.next(eventNgSelect.term);
  }


  public onSearchCessionSource(eventNgSelect) {
    this.cessionSourceRemoteAutocomplte.term.next(eventNgSelect.term);
  }



$
  receiveSubjectActeur(acteur: any) {
    // this.attribution.acteur= acteur;
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }




  initConfigAutocompleteActeur() {

    let callbackAutocomplete = (search:string,params:Map<string,any>)=> {
      return this.acteurService.autocompletion(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };

    this.acteurRemoteAutocomplete.customNgSelectConfig = {
      multiple: false,
      controlName: 'acteur',
      libelle: 'libelle',
      callbackAutocomplete: callbackAutocomplete,
      term: new Subject<string>(),
      formulaire: this.formulaire,
      placeholder: "L'acteur promoteur immobilier"
    };

    this.acteurRemoteAutocomplete.nativeNgSelectConfig.placeholder = "L'acteur promoteur immobilier";
    this.acteurRemoteAutocomplete.nativeNgSelectConfig.appendTo = 'body';
    this.acteurRemoteAutocomplete.nativeNgSelectConfig.bindValue = 'guid';
    this.acteurRemoteAutocomplete.listItemSelected = [];
    this.acteurRemoteAutocomplete.keyId = 'guid';
    this.acteurRemoteAutocomplete.callbackAutocomplete = callbackAutocomplete;

    this.acteurRemoteAutocomplete.mapFunction = (acteur: ActeurAutocomplete): ActeurAutocomplete => {
      acteur.libelle = acteur.denomination + " ( " + acteur.categorie + " )";
      acteur.libelleTelephone = acteur?.telephones?.map(value => value.value).join(', ');
      acteur.libelleEmail =  acteur?.emails?.map(value => value.value).join(', ');
      return acteur;
    };
    const colTabAttributaire = [
      { name: 'codeUnique', label: 'Code unique' },
      { name: 'statusJuridique', label: 'Status juridique' },
      { name: 'denomination', label: 'Dénomination' },
      { name: 'sigle', label: 'Sigle' },
      { name: 'categorie', label: 'Catégorie' },
      { name: 'pieceOfficielle.categorie.libelle', label: 'Type pièce' , type: TypeColonne.STRING },
      { name: 'pieceOfficielle.numero', label: 'Numéro pièce' , type: TypeColonne.STRING },
      { name: 'pieceOfficielle.nip', label: 'Nip pièce', type: TypeColonne.STRING  },
      { name: 'pieceOfficielle.dateObtention', label: 'date pièce' , type: TypeColonne.DATE },
      { name: 'profession', label: 'Profession' , type: TypeColonne.STRING },
      { name: 'libelleTelephone', label: 'Téléphone' , type: TypeColonne.STRING },
      { name: 'libelleEmail', label: 'Email' , type: TypeColonne.STRING },
    ];

    this.acteurRemoteAutocomplete.tableDescription = this.acteurRemoteAutocomplete.pushColumn(colTabAttributaire, 'Tableau des acteurs');

  }

}
