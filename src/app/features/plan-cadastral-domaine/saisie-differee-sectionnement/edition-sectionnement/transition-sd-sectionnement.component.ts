
import { Input, Component, Directive } from '@angular/core';
import {PlanCadastralMAJLotissementElement} from '@sycadApp/models/workflow/maj-lotissement.model';
import {Validators, FormArray, FormGroup, FormBuilder} from '@angular/forms';
import {Document, DossierPiece, Mandat, Processus, Transition} from '@sycadApp/models/workflow/common/general';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import {TransitionComponent} from '@sycadShared/form-components/processus/transition/component.transition';
import {AdvancedRemoteAutocomplete} from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/advanced-remote-autocomplete';
import {ActeurAutocomplete} from '@sycadApp/models/data-references/contribuables/acteur.model';
import {GeneralContribuable, Ilot, Section} from '@sycadApp/models/data-references/contribuables/global.model';
import {StructureAutocomplete, StructureElement} from '@sycadApp/models/data-references/organigramme/structure.model';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {MediaObserver} from '@angular/flex-layout';
import {CategoriePieceService} from '@sycadApp/services/data-references/system/categorie-piece.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import {ContribuableService} from '@sycadApp/services/data-references/system/contribuable.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {MandatService} from '@sycadApp/services/workflow/mandat.service';
import {IlotElement, ParcelleElement} from '@sycadApp/models/data-references/territoire/localite.model';
import {catchError, map} from 'rxjs/operators';
import {Observable, of, Subject} from 'rxjs';
import {RapideContribuableFormComponent} from '@sycadShared/form-components/annuaire-identite/rapide-contribuable-form/rapide-contribuable-form.component';
import {TypeColonne} from '@sycadApp/libs/model-table';

import {PlanCadastralMiseAjourLotissementService} from '@sycadApp/services/workflow/common/maj-lotissement.service';
import { PlanCadastralRegularisationElement } from '@sycadApp/models/workflow/regularisation.model';
import { environment } from 'environments/environment';
import { SdMajService } from '@sycadApp/services/workflow/common/regularisation.service';
import { RemoteAutocompleteCommuneZoneCompetence } from '../../plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence';
import { CommuneAutocomplete } from '@sycadApp/models/data-references/territoire/commune.model';
import {
  SdSectionnementElement
} from "@sycadApp/models/workflow/sd-sectionnement.model";
import {
  SdSectionnementService
} from "@sycadApp/services/workflow/common/sd-sectionnement.service";



@Directive()
export class TransitionSdSectionnementComponent extends TransitionComponent {

  @Input()
  public sdSectionnementElement: SdSectionnementElement;
  @Input()
  public transition: Transition;

  @Input()
  public processus: Processus;



  public communeRemoteAutocomplete = new RemoteAutocompleteCommuneZoneCompetence<CommuneAutocomplete>();

  public mandatRemoteAutocomplete = new AdvancedRemoteAutocomplete<Mandat>();
  public acteurRemoteAutocomplete = new AdvancedRemoteAutocomplete<ActeurAutocomplete>();
  public acteurBeneficiaireRemoteAutocomplete = new AdvancedRemoteAutocomplete<ActeurAutocomplete>();
  public structureRemoteAutocomplete = new RemoteAutocomplete<StructureAutocomplete>();
  public isLoadingResults = false;
  public attributaireForm: FormGroup;

  get objet() { return this.formulaire.get('dossier').get('objet'); }
  get dateExterne() { return this.formulaire.get('dossier').get('dateExterne'); }
  get refExterne() { return this.formulaire.get('dossier').get('refExterne'); }
  get observation() { return this.formulaire.get('dossier').get('observation'); }
  get etatDossier() { return this.formulaire.get('dossier').get('etatDossier'); }
  get libelle() { return this.formulaire.get('parcelle').get('libelle'); }
  get dossier() { return this.formulaire.get('dossier'); }
  get acteurExterne() { return this.formulaire.get('acteurExterne'); }
  get typeOperation() { return this.formulaire.get('typeOperation'); }
  get commune() { return this.formulaire.get('commune'); }
  get promoteurImmobilier() { return this.formulaire.get('promoteurImmobilier'); }
  get structureBeneficiaire() { return this.formulaire.get('structureBeneficiaire'); }
  get contribuableBeneficiaire() { return this.formulaire.get('contribuableBeneficiaire'); }
  get mandat() { return this.formulaire.get('mandat'); }
  get pieces() { return this.formulaire.controls.pieces as FormArray; }
  get documents() { return this.formulaire.controls.documents as FormArray; }
  get numerosDossierRetrait() { return this.formulaire.get('numerosDossierRetrait'); }

  get sectionsADesactive() { return this.formulaire.get('sectionsADesactive'); }

  get sectionsAAjouter(){return this.formulaire.controls.sectionsAAjouter as FormArray;}
  get sectionsAModifier(){return this.formulaire.controls.sectionsAModifier as FormArray;}
  get sectionsM() { return this.formulaire.get('sectionsM'); }

  public callbackAutocompleteParcelleByIlot:(search:string,params:Map<string,any>)=>Observable<any[]>;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public categoriePieceService: CategoriePieceService,
    public sdSectionnementService: SdSectionnementService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public structureService: StructureService,
    public mandatService: MandatService,

  ) {
    super(mediaObserver);

    this.formulaire = this.fb.group({
      dossier: this.fb.group({
        objet: [null, [Validators.required]],
        dateExterne: [null, Validators.compose([Validators.required])],
        etatDossier: [false],
        refExterne: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
        observation: [null],
      }),
      acteurExterne: [null],
      commune:  [null, [Validators.required]],
      typeOperation:  [null, [Validators.required]],
      promoteurImmobilier: [null],
      numeroPVEvaluation: [null],
      dateEvaluation: [null],
      dateDBT: [null],
      numeroDBT: [null],
      structureBeneficiaire: [null],
      contribuableBeneficiaire: [null],
      pieces: new FormArray([]),
      documents: new FormArray([]),
      mandat: [null],
      numerosDossierRetrait: [null],
      sectionsADesactive: [null],
      sectionsAAjouter: new FormArray([]),
      sectionsAModifier: new FormArray([]),
      sectionsM: [null]

    });

    // this.callbackAutocompleteParcelleByIlot=(search:string,params:Map<string,any>)=> {
    //   return this.parcelleService.autocompletionByIlot(search,params).pipe(
    //     map(response => {
    //       return response.body;
    //     }),
    //     catchError((err) => {
    //       return of([]);
    //     })
    //   );
    // };

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
  public onSearchCommune(eventNgSelect) {
    this.communeRemoteAutocomplete.term.next(eventNgSelect.term);
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

  // public contribuableBeneficiaireChoisie: GeneralContribuable;
  // public structureBeneficiaireChoisie: StructureAutocomplete;
  // receiveSubjectContribuableBeneficiaire(contri: GeneralContribuable) {
  //   this.contribuableBeneficiaireChoisie = contri;
  //  // console.log(this.parcellesAModifier);
  //   this.structureBeneficiaireChoisie=null;
  //   this.structureBeneficiaire.setValue(null);
  //   this.parcellesM.setValue(null);
  //   this.parcellesADesactive.setValue(null);
  //   this.parcellesChoisies = null;
  //   this.editParcelles = null;
  // }

  public onSearchStructure(eventNgSelect) {
    this.structureRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onChangeStructure(structure: StructureElement) {


    // this.structureBeneficiaireChoisie=structure;
    this.contribuableBeneficiaire.setValue(null);
    // this.contribuableBeneficiaireChoisie = null;

    // this.parcellesM.setValue(null);
    // this.parcellesADesactive.setValue(null);
    // this.parcellesChoisies = null;
    // this.editParcelles = null;

  }



  public sectionsChoisies: Section[];
  public sectionsAjoutes: Section[];
  public sectionsModifies: Section[];

  receiveSubjectActeur(acteur: any) {
    // this.attribution.acteur= acteur;
  }

  public mandatChoisie: Mandat;
  receiveSubjectMandat(mandat: Mandat) {
    this.mandatChoisie= mandat;
    if(mandat) {
      // this.contribuableBeneficiaireChoisie=mandat.mandant;
      this.contribuableBeneficiaire.setValue(mandat.mandant.guid);
    }else {
      // this.contribuableBeneficiaireChoisie=null;
      this.contribuableBeneficiaire.setValue(null);
    }
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }

  public onChangeSection(sections) {
    this.sectionsChoisies = sections;
  }



  initConfigAutocompleteActeurPromoteur() {

    let callbackAutocomplete =   (search:string,params:Map<string,any>)=> {
      return this.acteurService.autocompletion(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
          return of([]);
        })
      );
    };
    this.acteurBeneficiaireRemoteAutocomplete.customNgSelectConfig = {
      multiple: false,
      controlName: 'promoteurImmobilier',
      libelle: 'libelle',
      term: new Subject<string>(),
      callbackAutocomplete: callbackAutocomplete,
      formulaire: this.formulaire,
      placeholder: "L'acteur promoteur immobilier"
    };

    this.acteurBeneficiaireRemoteAutocomplete.nativeNgSelectConfig.placeholder = "L'acteur promoteur immobilier";
    this.acteurBeneficiaireRemoteAutocomplete.nativeNgSelectConfig.appendTo = 'body';
    this.acteurBeneficiaireRemoteAutocomplete.nativeNgSelectConfig.bindValue = 'guid';
    this.acteurBeneficiaireRemoteAutocomplete.listItemSelected = [];
    this.acteurBeneficiaireRemoteAutocomplete.keyId = 'guid';
    this.acteurBeneficiaireRemoteAutocomplete.callbackAutocomplete = callbackAutocomplete;

    this.acteurBeneficiaireRemoteAutocomplete.mapFunction = (acteur: ActeurAutocomplete): ActeurAutocomplete => {
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


    this.acteurBeneficiaireRemoteAutocomplete.tableDescription = this.acteurBeneficiaireRemoteAutocomplete.pushColumn(colTabAttributaire, 'Tableau des acteurs promoteurs immobilier');

  }
  initConfigAutocompleteActeur() {

    let callbackAutocomplete =   (search:string,params:Map<string,any>)=> {
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
      term: new Subject<string>(),
      callbackAutocomplete: callbackAutocomplete,
      formulaire: this.formulaire,
      placeholder: "L'acteur géomètre expert"
    };

    this.acteurRemoteAutocomplete.nativeNgSelectConfig.placeholder = "L'acteur géomètre expert";
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
    this.acteurRemoteAutocomplete.tableDescription = this.acteurRemoteAutocomplete.pushColumn(colTabAttributaire, 'Tableau des acteurs géomètre expert');

  }
  public dialogRefRapideContribuableForm: MatDialogRef<RapideContribuableFormComponent, any>;


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
  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_SECTIONNEMENT}`]);
  }


  private getCorrectWidth() {

    if (this.mediaObserver.isActive("xs")) {
      return {
        width: '95vw',
        height: '90vh',
        position: {
          top: '2vh',
        }
      };
    }

    if (this.mediaObserver.isActive("sm")) {
      return {
        width: '80vw',
        height: '90vh',
        position: {
          top: '2vh',
        }
      };
    }

    if (this.mediaObserver.isActive("md")) {
      return {
        width: '60vw',
        height: '90vh',
        position: {
          top: '2vh',
        }
      };
    }

    if (this.mediaObserver.isActive("lg")) {
      return {
        width: '55vw',
        height: '90vh',
        position: {
          top: '2vh',
        }
      };
    }
    if (this.mediaObserver.isActive("xl")) {
      return {
        width: '50vw',
        height: '90vh',
        position: {
          top: '2vh',
        }
      };
    }
  }

}
