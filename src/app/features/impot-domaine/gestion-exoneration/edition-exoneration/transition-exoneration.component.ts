import { Directive, Input, ViewChild } from "@angular/core";
import { MediaObserver } from "@angular/flex-layout";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { CategoriePiece, GeneralContribuable } from "@sycadApp/models/data-references/contribuables/global.model";
import { ExonerationCategorie } from "@sycadApp/models/evaluation/exoneration-categorie.model";
import {ExonerationDossier } from "@sycadApp/models/impot/exoneration.model";
import { NatureImpot } from "@sycadApp/models/impot/nature-impot.model";
import {
  Transition,
  Processus,
  DossierPiece,
  Document
} from '@sycadApp/models/workflow/common/general';
import { ParcelleService } from "@sycadApp/services/cession-parcelle/parcelle.service";
import { CategoriePieceService } from "@sycadApp/services/data-references/system/categorie-piece.service";
import { ContribuableService } from "@sycadApp/services/data-references/system/contribuable.service";
import { ProfessionService } from "@sycadApp/services/data-references/system/profession.service";
import { ExonerationCategorieService } from "@sycadApp/services/evaluation/exoneration-categorie.service";
import { ExonerationService } from "@sycadApp/services/impot/exoneration.service";
import { NatureImpotService } from "@sycadApp/services/impot/nature-impot.service";
import { AppConfirmService } from "@sycadApp/shared/app-confirm/app-confirm.service";
import { RemoteAutocomplete } from "@sycadApp/shared/form-components/model/remote-autocomplete";
import { TransitionComponent } from "@sycadApp/shared/form-components/processus/transition/component.transition";
import { Observable, of, Subject } from "rxjs";
import { map, catchError } from "rxjs/operators";
import {ParcelleElement} from '@sycadApp/models/data-references/territoire/localite.model';
import { AdvancedRemoteAutocomplete } from "@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/advanced-remote-autocomplete";
import { DropzoneComponent, DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { RapideContribuableFormComponent } from "@sycadApp/shared/form-components/annuaire-identite/rapide-contribuable-form/rapide-contribuable-form.component";
import { TypeColonne } from "@sycadApp/libs/model-table";
@Directive()
export class TransitionExonerationComponent extends TransitionComponent{
  [x: string]: any;

    @Input()
    public exonerationDossier: ExonerationDossier;
    @Input()
    public transition: Transition;

    @Input()
    public processus: Processus;


    public isLoadingResults = false;
    public contribuableForm: FormGroup;
    public exonerationF: FormGroup;

    public categorieIdentiteRemoteAutocomplete = new RemoteAutocomplete<CategoriePiece>();
    public contribuableRemoteAutocomplete = new AdvancedRemoteAutocomplete<GeneralContribuable>();
    public natureImpotRemoteAutocomplete = new RemoteAutocomplete<NatureImpot>();
    public categorieRemoteAutocomplete = new RemoteAutocomplete<ExonerationCategorie>();
    public contribuableBeneficiaireRemoteAutocomplete = new AdvancedRemoteAutocomplete<GeneralContribuable>();

   public callbackAutocompleteParcelleByIlotByConnected:(search:string,params:Map<string,any>)=>Observable<any[]>;
  //  public autocompletionByIlotByOwn:(search:string,params:Map<string,any>)=>Observable<any[]>;

    @ViewChild(DropzoneComponent, { static: false })
    dropzoneComponentRef?: DropzoneComponent;
    public config: DropzoneConfigInterface = {
      clickable: true,
      maxFiles: 1,
      autoReset: null,
      resizeWidth :300,
      resizeHeight :300,
      thumbnailHeight: 300,
      thumbnailWidth: 300,
      acceptedFiles: 'image/*,application/pdf',
      errorReset: null,
      cancelReset: null
    };
    public documentPiece = '';


    get contribuable() { return this.formulaire.get('exoneration').get('contribuable');}
    get pieces() { return this.formulaire.controls.pieces as FormArray; }
    get documents() { return this.formulaire.controls.documents as FormArray; }
    get dossier() { return this.formulaire.get('dossier'); }
    get parcelle() {return this.formulaire.get('exoneration').get('parcelle');}
    get taux() {return this.formulaire.get('exoneration').get('taux');}
    get montant() {return this.formulaire.get('exoneration').get('montant');}
    get modifDoc(){return this.formulaire.get('exoneration').get('modifDoc');}
   get natureImpot() {return this.formulaire.get('exoneration').get('natureImpot');}
   get categorie(){return this.formulaire.get('exonerationDossier').get('categorie');}
   get exonerationForm(){ return this.formulaire.get('exoneration');}

    constructor( public router: Router,
        public dialog: MatDialog,
        public _snackBar: MatSnackBar,
        public confirmService: AppConfirmService,
        public _adapter: DateAdapter<any>,
        public mediaObserver: MediaObserver,
        public fb: FormBuilder,
        public exonerationService: ExonerationService,
        public exonerationCategorieService: ExonerationCategorieService,
        public natureImpotService: NatureImpotService,
        public contribuableService: ContribuableService,
        public professionService: ProfessionService,
        public categoriePieceService: CategoriePieceService,
        public parcelleService: ParcelleService)
        {
            super(mediaObserver);
            this.exonerationF = this.fb.group({
                id: [null],
                motif: [null],
                refExterne: [null, Validators.compose([Validators.required])],
                modifDoc: [null],
                observation: [null],
                taux: [null],
                montant: [null],
                categorie: [null, Validators.compose([Validators.required])],
                dateDebut: [null],
                dateFin: [null],
                natureImpot: [null, Validators.compose([Validators.required])],
                contribuable: [null],
                parcelle: [null],
            });
            this.formulaire = this.fb.group({
                dossier: this.fb.group({
                  objet: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
                  dateExterne: [null, Validators.compose([Validators.required])],
                  etatDossier: [false],
                  refExterne: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
                  observation: [null],
                }),
                pieces: new FormArray([]),
                documents: new FormArray([]),
                exoneration: this.exonerationF

              });

              this.callbackAutocompleteParcelleByIlotByConnected=(search:string,params:Map<string,any>)=> {
                return this.parcelleService.autocompletionByIlotByConnected(search,params).pipe(
                  map(response => {
                    return response.body;
                  }),
                  catchError((err) => {
                     return of([]);
                   })
                );
              };
        /*

              this.callbackAutocompleteParcelleByIlotByOwn=(search:string,params:Map<string,any>)=> {
                return this.parcelleService.autocompletionByIlotByOwn(search,params).pipe(
                  map(response => {
                    return response.body;
                  }),
                  catchError((err) => {
                     return of([]);
                   })
                );
              };
   */


        }


/**************** piece officielle *********************/

createDossierPiece(piece: DossierPiece = null) {

  if (piece != null) {


    return this.fb.group({
      id: [piece.id],
      categorie: [piece.categorie, Validators.compose([Validators.required])],
      reference: [piece.reference],
      dateExpiration: [piece.dateExpiration],
      dateDelivrance: [piece.dateDelivrance],
      autoriteDeDelivrance: [piece.autoriteDeDelivrance],
      observation: [piece.observation],
      pieceJointe: [piece.pieceJointe],
    });
  } else {
    return this.fb.group({
      id: [null],
      categorie: [null, Validators.compose([Validators.required])],
      reference: [null],
      dateExpiration: [null],
      dateDelivrance: [null],
      autoriteDeDelivrance: [null],
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





  groupByFnArrondissement = (item) => item.commune.nom;
  groupValueFnArrondissement = (_: string, communes: any[]) => ({ name: communes[0].commune.nom, total: communes.length });



  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }
   initConfigAutocompleteContribuableBeneficiaire() {

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
    this.contribuableBeneficiaireRemoteAutocomplete.customNgSelectConfig = {
      multiple: false,
      controlName: 'contribuable',
      libelle: 'libelle',
      callbackAutocomplete:callbackAutocomplete ,
      term: new Subject<string>(),
      formulaire: this.exonerationF,
      placeholder: ""
    };

    this.contribuableBeneficiaireRemoteAutocomplete.nativeNgSelectConfig.placeholder = "Le contribuable bénéficaire";
    this.contribuableBeneficiaireRemoteAutocomplete.nativeNgSelectConfig.appendTo = 'body';
    this.contribuableBeneficiaireRemoteAutocomplete.nativeNgSelectConfig.bindValue = 'guid';
    this.contribuableBeneficiaireRemoteAutocomplete.listItemSelected = [];
    this.contribuableBeneficiaireRemoteAutocomplete.keyId = 'guid';
    this.contribuableBeneficiaireRemoteAutocomplete.callbackAutocomplete = callbackAutocomplete;



    const colTabAttributaire = [
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
    this.contribuableBeneficiaireRemoteAutocomplete.mapFunction= (value : GeneralContribuable):GeneralContribuable=>{
      value.libelleTelephone = value.telephones.map(value => value.value).join(', ');
      value.libelleEmail =  value.emails.map(value => value.value).join(', ');
      return value;
    };
    this.contribuableBeneficiaireRemoteAutocomplete.tableDescription = this.contribuableBeneficiaireRemoteAutocomplete.pushColumn(colTabAttributaire, 'Liste des attributaires');

  }

  public dialogRefRapideContribuableForm: MatDialogRef<RapideContribuableFormComponent, any>;


  public contribuableChoisie: GeneralContribuable;
  public contribuableBeneficiaireChoisie: GeneralContribuable;

  receiveSubjectMandataire(contri: GeneralContribuable) {
    this.contribuableChoisie = contri;
  }


  receiveSubjectContribuableBeneficiaire(contri: GeneralContribuable) {
    this.contribuableBeneficiaireChoisie = contri;
    //this.parcelle.setValue(null);
  }


  public onUploadError(args: any): void {
    this.dropzoneComponentRef.directiveRef.reset();
  }
  public resetDropZone(): void {
    this.dropzoneComponentRef.directiveRef.reset();
    this.modifDoc.setValue(null);
  }
  public onUploadSuccess(remoteResponse): void {
    this.modifDoc.setValue(remoteResponse[1].name);
  }
  public onUploadInit(args: any): void {

  }
  public onSearchCategorie(evetNgSelect){
    this.categorieRemoteAutocomplete.term.next(evetNgSelect.term);
  }
  public onSearchNatureImpot(eventNgSelect){
    this.natureImpotRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public parcelleChoisie: ParcelleElement;
}
