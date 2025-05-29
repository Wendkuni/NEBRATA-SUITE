
import { Input, Directive, ViewChild } from '@angular/core';

import { Validators, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DossierPiece, Mandat, Processus, Quittance, Transition } from '@sycadApp/models/workflow/common/general';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { DateAdapter } from '@angular/material/core';
import { MediaObserver } from '@angular/flex-layout';
import { TransitionComponent } from '@sycadApp/shared/form-components/processus/transition/component.transition';
import { AdvancedRemoteAutocomplete } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/advanced-remote-autocomplete';
import { Document } from '@sycadApp/models/workflow/common/general';
import { ActeurAutocomplete } from '@sycadApp/models/data-references/contribuables/acteur.model';
import { CategoriePiece, GeneralContribuable } from '@sycadApp/models/data-references/contribuables/global.model';
import { CessionSourceType } from '@sycadApp/models/workflow/common/attribution-source.model';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';

import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { ActeursService } from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { Observable, of, Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StructureAutocomplete, StructureElement } from '@sycadApp/models/data-references/organigramme/structure.model';
import { StructureService } from '@sycadApp/services/data-references/organigramme/structure.service';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { DocumentType } from '@sycadApp/models/data-references/system/document-type.model';
import { DropzoneComponent, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { RapideContribuableFormComponent } from '@sycadApp/shared/form-components/annuaire-identite/rapide-contribuable-form/rapide-contribuable-form.component';
import { catchError, map } from 'rxjs/operators';
import { TypeColonne } from '@sycadApp/libs/model-table';
import { DelivranceAap } from '@sycadApp/models/workflow/sd-delivrance-aap.model';
import { SdDelivranceAapService } from '@sycadApp/services/workflow/sd-delivrance-aap.service';
import { DestinationParcelle } from '@sycadApp/models/bornage/destinationParcelle.model';
import { DestinationParcelleService } from '@sycadApp/services/bornage/destination-parcelle.service';
import { UserProfilAttributionService } from '@sycadApp/services/data-references/system/user-profil-attribution.service';
import { SdAttributionService } from '@sycadApp/services/workflow/sd-attribution.service';
import { EnteteDossierService } from '@sycadApp/services/workflow/entete.service';
import { MandatService } from '@sycadApp/services/workflow/mandat.service';
import { ParcelleElement, ParcelleInexistante } from '@sycadApp/models/data-references/territoire/localite.model';
import { AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';
import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';

@Directive()
export class TransitionSdDelivranceComponent extends TransitionComponent {

  @Input()
  public delivranceAap: DelivranceAap;

  @Input()
  public transition: Transition;

  @Input()
  public processus: Processus;

  public mandataire = false;

  public authentificatedUser: AuthentificatedUser;

  public destinationRemoteAutocomplete = new RemoteAutocomplete<DestinationParcelle>();


  parcelleInexistanteElement: ParcelleInexistante;

  public lesDestinations=[];

  public mandatRemoteAutocomplete = new AdvancedRemoteAutocomplete<Mandat>();

  public contribuablequiretireletitre: GeneralContribuable;
  public acteurRemoteAutocomplete = new AdvancedRemoteAutocomplete<ActeurAutocomplete>();
  public contribuablequiretireletitreRemoteAutocomplete = new AdvancedRemoteAutocomplete<GeneralContribuable>();
  public contribuableBeneficiaireRemoteAutocomplete = new AdvancedRemoteAutocomplete<GeneralContribuable>();
  public categorieIdentiteRemoteAutocomplete = new RemoteAutocomplete<CategoriePiece>();
  public structureRemoteAutocomplete = new RemoteAutocomplete<StructureAutocomplete>();
  public isLoadingResults = false;
  public isLoadingplleInexistante = false;
  public attributaireChoisie: GeneralContribuable;
  public attributaireForm: FormGroup;
  public autocompletionByIlotAndLibre:(search:string,params:Map<string,any>)=>Observable<any[]>;
  public callbackAutocompleteParcelleByIlotByConnected:(search:string,params:Map<string,any>)=>Observable<any[]>;
  public callbackAutocompleteParcelleByIlotByMandataire:(search:string,params:Map<string,any>)=>Observable<any[]>;
  public callbackAutocompleteParcelleByIlotByMandatNotSaved:(search:string,params:Map<string,any>)=>Observable<any[]>;


  public parcelleInexistantechoix: boolean = false;
    parcelleInexistantefacile: ParcelleInexistante = new ParcelleInexistante;

  get objet() { return this.formulaire.get('dossier').get('objet'); }
  get dateExterne() { return this.formulaire.get('dossier').get('dateExterne'); }
  get refExterne() { return this.formulaire.get('dossier').get('refExterne'); }
  get observation() { return this.formulaire.get('dossier').get('observation'); }
  get etatDossier() { return this.formulaire.get('dossier').get('etatDossier'); }

  get parcelleInexistante(){return this.formulaire.get('parcelleInexistante');}




  get quittances() { return this.formulaire.controls.quittances as FormArray; }

  // get libelle() { return this.formulaire.get('documents.0').get('libelle'); }
  // get numero() { return this.formulaire.get('documents.0').get('numero'); }
  // get archivDoc() { return this.formulaire.get('documents.0').get('archivDoc'); }
  // get dateValidite() { return this.formulaire.get('documents.0').get('dateValidite'); }
  // get documentType() { return this.formulaire.get('documents.0').get('documentType'); }
  // get dateDoc() { return this.formulaire.get('documents.0').get('dateDoc'); }


  get documentDeSortie() { return this.formulaire.controls.documentDeSortie; }
  get numero() { return this.documentDeSortie.get('numero'); }
  get pieceJointe() { return this.documentDeSortie.get('pieceJointe'); }
  get dateValidite() { return this.documentDeSortie.get('dateValidite'); }
  get documentType() { return this.documentDeSortie.get('documentType'); }
  get dateDoc() { return this.documentDeSortie.get('dateDoc'); }



  get pieces() { return this.formulaire.controls.pieces as FormArray; }
  get documents() { return this.formulaire.controls.documents as FormArray; }
  get mandats() { return this.formulaire.controls.mandats as FormArray; }
  get dossier() { return this.formulaire.get('dossier'); }
  get parcelle() { return this.formulaire.get('parcelle'); }
  get acteurExterne() { return this.formulaire.get('acteurExterne'); }
  get contribuableBeneficiaire() { return this.formulaire.get('contribuableBeneficiaire'); }


  public autocompletionByIlotByOwn:(search:string,params:Map<string,any>)=>Observable<any[]>;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public delivranceAapService: SdDelivranceAapService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public professionService: ProfessionService,
    public categoriePieceService: CategoriePieceService,
    public structureService: StructureService,
    public parcelleService: ParcelleService,
    public destinationParcelleService: DestinationParcelleService,
    public userProfilAttributionService: UserProfilAttributionService,
    public sdAttributionService: SdAttributionService,
    public enteteDossierService: EnteteDossierService,
    public mandatService: MandatService,
    public authService: AuthenticationService,

  ) {
    super(mediaObserver);

    this.formulaire = this.fb.group({
      dossier: this.fb.group({
        objet: [null, [Validators.required]],
        dateExterne: [null],
        refExterne: [null],
        observation: [null],
      }),
      documentType:[null, [Validators.required]],
      quittances: new FormArray([]),

      acteurExterne: [null],
      documentDeSortie: this.fb.group({
        libelle: [null],
        numero: [null],
        documentType: [null],
        dateDoc: [null],
        archivDoc: [null],
      }),

      contribuableBeneficiaire: [null],
      parcelle: [null, Validators.compose([Validators.required])],
      pieces: new FormArray([]),
      documents: new FormArray([]),
      mandats: new FormArray([]),
      parcelleInexistante: this.fb.group({
        id: [null],
        commune: [null],
        arrondissement: [null],
        localite: [null], 
        quartier: [null], 
        section: [null],
        ilot: [null],
        numero: [null],
        superficie: [null],
        destination: [null],
        etatMiseEnValeur: [null]
      }),
    });

    this.autocompletionByIlotAndLibre=(search:string,params:Map<string,any>)=> {
      return this.parcelleService.autocompletionByIlotAndOccupee(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };

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

    this.callbackAutocompleteParcelleByIlotByMandataire=(search:string,params:Map<string,any>)=> {
      return this.parcelleService.autocompletionByIlotByMandat(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };

    this.callbackAutocompleteParcelleByIlotByMandatNotSaved=(search:string,params:Map<string,any>)=> {

      params.set("proprietaire", this.mandatChoisie[0].mandant);

      return this.parcelleService.autocompletionByIlotByOwn(search,params).pipe(
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

  public contribuableBeneficiaireChoisie: GeneralContribuable;
  public structureBeneficiaireChoisie: StructureElement;

  receiveSubjectContribuableBeneficiaire(contri: GeneralContribuable) {
    this.contribuableBeneficiaireChoisie = contri;

    this.parcelle.setValue(null);
  }


  receiveSubjectContribuablequiretireletitre(contri: GeneralContribuable) {
    this.contribuablequiretireletitre = contri;
    this.formulaire.patchValue({
      documentDeSortie: {
        retirerPar: {
          guid: this.contribuablequiretireletitre.guid
        }
      }
    });

  }


  public onSearchStructure(eventNgSelect) {
    this.structureRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  groupByFnParcelle = (item) => item.ilot.numero;
  groupValueFnParcelle = (_: string, ilots: any[]) => ({ name: ilots[0].ilot.numero + (ilots[0].ilot.numeroAncien ? "(" + ilots[0].ilot.numeroAncien + ")" : ""), total: ilots.length });




  receiveSubjectActeur(acteur: any) {
    // this.attribution.acteur= acteur;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }

  /*************************** creation de quittances**********************************/
  createQuittance(quittance: Quittance = null) {
    if (quittance != null) {
      return this.fb.group({
        id: [quittance.id],
        reference: [quittance.reference, [Validators.required]],
        date: [quittance.date, [Validators.required]],
        montant: [quittance.montant, [Validators.required]],
      });
    } else {
      return this.fb.group({
        id: [null],
        reference: [null, [Validators.required]],
        date: [null, [Validators.required]],
        montant: [null, [Validators.required]],
      });
    }
  }

  addQuittance() {
    this.quittances.insert(0, this.createQuittance());

  }

  removeQuittance(index) {

    this.quittances.removeAt(index);

  }
  /***************** fin création quittances **********************/









  /*************************** creation de Mandat**********************************/
  createMandat(mandat: Mandat = null) {
    if (mandat != null) {
      return this.fb.group({
        id: [mandat.id],
        actif: [mandat.actif],
        debut: [mandat.debut, [Validators.required]],
        fin: [mandat.fin],
        description: [mandat.description, [Validators.required]],
        objet: [mandat.objet, [Validators.required]],
        reference: [mandat.reference, [Validators.required]],
        pieceJointe: [mandat.pieceJointe],
        mandant: [null],
        mandataire: [mandat.mandataire, [Validators.required]]
      });
    } else {
      return this.fb.group({
        id: [null],
        actif: [null],
        debut: [null, [Validators.required]],
        fin: [null],
        description: [null, [Validators.required]],
        objet: [null, [Validators.required]],
        reference: [null, [Validators.required]],
        pieceJointe: [null],
        mandant: [null],
        mandataire: [null, [Validators.required]]
      });
    }
  }

  addMandat() {

    this.mandats.insert(0, this.createMandat());

  }

  removeMandat(index) {

    this.mandats.removeAt(index);
    this.changeMandat(null);
    this.mandatChoisie = null;

  }
  /***************** fin création Mandat **********************/
//filtre des mandats
public filteredListMandat: number[] = [];

public changeMandat(mandat:Mandat){


this.filteredListMandat = [];
for (let i = 0; i < this.mandats.length; i++) {
  let man = this.mandats.at(i);
  if(man.value.id) {
    this.filteredListMandat.push(man.value.id);
  }
}
}

initConfigAutocompleteAttributaire() {

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
    controlName: 'contribuableBeneficiaire',
    libelle: 'libelle',
    callbackAutocomplete: callbackAutocomplete,
    term: new Subject<string>(),
    formulaire: this.formulaire,
    placeholder: ""
  };

  this.contribuableBeneficiaireRemoteAutocomplete.nativeNgSelectConfig.placeholder = "L'attributaire";
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


initConfigAutocompleteContribuablequiretireletitre() {

  // let callbackAutocomplete = (search:string,params:Map<string,any>)=> {
  //   return this.contribuableService.autocompletion(search,params).pipe(
  //     map(response => {
  //       return response.body;
  //     }),
  //     catchError((err) => {
  //        return of([]);
  //      })
  //   );
  // };
  this.contribuablequiretireletitreRemoteAutocomplete.customNgSelectConfig = {
    multiple: false,
    controlName: 'contribuableBeneficiaire',
    libelle: 'libelle',
    callbackAutocomplete: null, //callbackAutocomplete,
    term: new Subject<string>(),
    formulaire: this.formulaire,
    placeholder: ""
  };

  this.contribuablequiretireletitreRemoteAutocomplete.nativeNgSelectConfig.placeholder = "Retiré par";
  this.contribuablequiretireletitreRemoteAutocomplete.nativeNgSelectConfig.appendTo = 'body';
  this.contribuablequiretireletitreRemoteAutocomplete.nativeNgSelectConfig.bindValue = 'guid';
  this.contribuablequiretireletitreRemoteAutocomplete.listItemSelected = [];
  this.contribuablequiretireletitreRemoteAutocomplete.keyId = 'guid';
  this.contribuablequiretireletitreRemoteAutocomplete.callbackAutocomplete = null; //callbackAutocomplete;
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
  this.contribuablequiretireletitreRemoteAutocomplete.mapFunction= (value : GeneralContribuable):GeneralContribuable=>{
    value.libelleTelephone = value.telephones.map(value => value.value).join(', ');
    value.libelleEmail =  value.emails.map(value => value.value).join(', ');
    return value;
  };
  this.contribuablequiretireletitreRemoteAutocomplete.tableDescription = this.contribuablequiretireletitreRemoteAutocomplete.pushColumn(colTabAttributaire, 'Liste des attributaires');

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
      controlName: 'acteurExterne',
      libelle: 'libelle',
      callbackAutocomplete: callbackAutocomplete,
      term: new Subject<string>(),
      formulaire: this.formulaire,
      placeholder: "L'acteur externe"
    };

    this.acteurRemoteAutocomplete.nativeNgSelectConfig.placeholder = "L'acteur externe";
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
  public dialogRefRapideContribuableForm: MatDialogRef<RapideContribuableFormComponent, any>;

  openFormAddModal(param?: any) {
    let { width,height,position}=this.getCorrectWidth();
    let guid = null;
    if(param){
      guid = param
    }

    this.dialogRefRapideContribuableForm = this.dialog.open(RapideContribuableFormComponent, {
      data: {
        guid
      },
      panelClass: "sycad-dialog-form",
      width: width,
      height: height,
      position: position,
      disableClose: true
    });
    this.dialogRefRapideContribuableForm.afterClosed().subscribe(data => {
      if(data){
        this.contribuableBeneficiaireRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([data]);
        this.contribuableBeneficiaireRemoteAutocomplete.initialList = [data];
        this.contribuableBeneficiaireChoisie=data;
        this.contribuableBeneficiaire.setValue(data.guid);
       }
    });
  }

  public typeDocuments: DocumentType [];

  public documentPiece = '';

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

  public onUploadError(args: any): void {
    this.dropzoneComponentRef.directiveRef.reset();
  }

  public onUploadInit(args: any): void {

  }


  public getAttributaireParcelleOccupe(icad: string) {
    this.contribuableService.getContribuableByIcad(icad, CessionSourceType.ATTRIBUTION).subscribe(data => {
      if(data){
        this.formulaire.controls.contribuableBeneficiaire.setValue(data.guid);
        this.contribuableBeneficiaireChoisie = data;

        this.isLoadingResults = false;
      }
    });
  }
  changeParcelle(parcelle: any){
    this.isLoadingResults = true;

    const parcelleInexistanteGroup = this.formulaire.get('parcelleInexistante') as FormGroup;
    if (parcelleInexistanteGroup) {
      parcelleInexistanteGroup.reset();
    }

    this.contribuableBeneficiaireChoisie = null;
    if(parcelle.etatAttribution == "OCCUPE"){
      this.getAttributaireParcelleOccupe(parcelle.icad);
    }
  }


   //lorsquon clique le toggle parcelle inexistante
   toggleParcelle(value:any){
    this.isLoadingplleInexistante = true;

     this.parcelleInexistantechoix = value.checked;
    
     setTimeout(()=>{
       this.manageParcelValidity();
       this.initializeParcelleInexistante(); 
       this.getContribuableConnecte();
     this.isLoadingplleInexistante = false;
     },0)
   }
 
   //lorsqqu'on selectionne parcelle inexistante rend le champ parcelle non obligatoire et si déselectionné le rend obligatoire
   manageParcelValidity() {
     const parcelleControl = this.formulaire.get('parcelle');
     if (this.parcelleInexistantechoix) {
       if (parcelleControl) {
         parcelleControl.clearValidators();
         parcelleControl.updateValueAndValidity();
       }
     }else{
       if (parcelleControl) {
         parcelleControl.setValidators(Validators.compose([Validators.required]));
         parcelleControl.updateValueAndValidity();
       }
     }
   }
 
   initializeParcelleInexistante() {
     if(this.delivranceAap?.parcelleInexistante?.id){
      this.parcelleInexistanteElement = this.delivranceAap?.parcelleInexistante;
     
       this.formulaire.get('parcelleInexistante').patchValue({
         id:this.delivranceAap?.parcelleInexistante.id,
         section: this.delivranceAap?.parcelleInexistante.section,
         ilot: this.delivranceAap?.parcelleInexistante.ilot,
         numero:this.delivranceAap?.parcelleInexistante.numero,
         etatMiseEnValeur:this.delivranceAap?.parcelleInexistante['etatMiseEnValeur'],
         superficie:this.delivranceAap?.parcelleInexistante.superficie,
         commune: this.delivranceAap?.parcelleInexistante.commune,
         arrondissement: this.delivranceAap?.parcelleInexistante.arrondissement,
         localite: this.delivranceAap?.parcelleInexistante.localite,
         quartier: this.delivranceAap?.parcelleInexistante.quartier,
         destination: this.delivranceAap?.parcelleInexistante.destination,
       });
     }
   }

   getContribuableConnecte(){
    this.isLoadingResults = true;
    this.contribuableService.autocompletion(this.authentificatedUser?.username).subscribe(data => {
     if(data){
       for(let dat of data.body){
         if(dat['username'] == this.authentificatedUser?.username){
           this.formulaire.controls.contribuableBeneficiaire.setValue(dat.guid);
           this.contribuableBeneficiaireChoisie= dat as GeneralContribuable;
         }
       }
     }
       this.isLoadingResults = false;
   });
 }

  // getDataDossierAttribution(){

  //   this.enteteDossierService.getProcessus("WRKFProcessDelivranceAttestationAttributionParcelle").subscribe(data =>{
  //     if(data.typeDocuments[0] != null){
  //       this.formulaire.controls.dossier.patchValue({
  //         "objet": data.typeDocuments[0].libelle
  //       })
  //     }
  //     catchError(error => {
  //       return of(null)
  //     })
  //   });
  // }


  public onUploadSuccess(remoteResponse): void {
    this.formulaire.patchValue({
      documentDeSortie: ({
        archivDoc: remoteResponse[1].name
      })
    });
  }


  public resetDropZone(): void {
    this.dropzoneComponentRef.directiveRef.reset();
    this.formulaire.patchValue({
      documents: ({
        archivDoc:null
      })
    });
  }

  initConfigAutocompleteMandat() {

    let callbackAutocomplete = (search:string,params:Map<string,any>)=> {
      return this.mandatService.autocompletionByMesMandats(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };

    this.mandatRemoteAutocomplete.customNgSelectConfig = {
      multiple: false,
      controlName: 'mandat',
      libelle: 'objet',
      term: new Subject<string>(),
      callbackAutocomplete: callbackAutocomplete,
      formulaire: this.formulaire,
      placeholder: "Le mandat associé à ce dossier"
    };

    this.mandatRemoteAutocomplete.nativeNgSelectConfig.placeholder = "Le mandat associé à ce dossier";
    this.mandatRemoteAutocomplete.nativeNgSelectConfig.appendTo = 'body';
    this.mandatRemoteAutocomplete.nativeNgSelectConfig.bindValue = 'id';
    this.mandatRemoteAutocomplete.listItemSelected = [];
    this.mandatRemoteAutocomplete.keyId = 'id';
    this.mandatRemoteAutocomplete.callbackAutocomplete = callbackAutocomplete;
    const colTabAttributaire = [
      { name: 'objet', label: 'Objet' },
      { name: 'reference', label: 'Référence' },
      { name: 'mandant.libelle', label: 'Mandant' },
      { name: 'mandataire.libelle', label: 'Mandataire' },
      { name: 'debut', label: 'Début',type:TypeColonne.DATE },
      { name: 'fin', label: 'Fin',type:TypeColonne.DATE },
    ];
    this.mandatRemoteAutocomplete.tableDescription = this.mandatRemoteAutocomplete.pushColumn(colTabAttributaire, 'Tableau de mes mandats');

  }



  public parcelleChoisie: ParcelleElement;
  public mandatChoisie: Mandat;
  receiveSubjectMandat(mandat: Mandat) {
     this.mandatChoisie= mandat;
     if(mandat) {
       this.contribuableBeneficiaireChoisie=mandat.mandant;
       this.contribuableBeneficiaire.setValue(mandat.mandant.guid);
     }else {
      this.contribuableBeneficiaireChoisie=null;
      this.contribuableBeneficiaire.setValue(null);
     }
     this.parcelle.setValue(null);
     this.parcelleChoisie=null;
  }
  onchangeFormMandat(){
    this.mandatChoisie= this.formulaire.controls.mandats.value;
  }

  changeDocumentType(event: any){
    this.formulaire.controls.dossier.patchValue({
      "objet":event.libelle
    })
  }


  toggleMandataire(value:any){
     this.mandataire = value.checked;
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
        width: '90vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("md")) {
      return {
        width: '90vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("lg")) {
      return {
        width: '90vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }
    if(this.mediaObserver.isActive("xl")) {
      return {
        width: '60vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }
  }
}
