
import {PlanCadastralFusionementElement} from '@sycadApp/models/workflow/cp-fusionnement.model';
import { Input, Directive } from '@angular/core';
import {TransitionComponent} from '@sycadShared/form-components/processus/transition/component.transition';
import {
  DossierPiece,
  Mandat,
  Processus,
  Transition
} from '@sycadApp/models/workflow/common/general';
import {AdvancedRemoteAutocomplete} from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/advanced-remote-autocomplete';
import {ActeurAutocomplete} from '@sycadApp/models/data-references/contribuables/acteur.model';
import {GeneralContribuable} from '@sycadApp/models/data-references/contribuables/global.model';
import {RemoteAutocomplete} from '@sycadShared/form-components/model/remote-autocomplete';
import {
  StructureAutocomplete,
  StructureElement
} from '@sycadApp/models/data-references/organigramme/structure.model';
import {
  FormArray,
  FormBuilder,
  FormGroup, Validators
} from '@angular/forms';
import {Router} from '@angular/router';
import {
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
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
import {PlanCadastralMorcellementService} from '@sycadApp/services/workflow/common/morcellement.service';
import {PlanCadastralMorcellementElement} from '@sycadApp/models/workflow/cp-morcellement.model';
import {ParcelleElement} from '@sycadApp/models/data-references/territoire/localite.model';
import {catchError, map} from 'rxjs/operators';
import {Observable, of, Subject} from 'rxjs';
import {RapideContribuableFormComponent} from '@sycadShared/form-components/annuaire-identite/rapide-contribuable-form/rapide-contribuable-form.component';
import {TypeColonne} from '@sycadApp/libs/model-table';
import {environment} from '../../../../../environments/environment';
import {PlanCadastralFusionnementService} from "@sycadApp/services/workflow/common/fusionnement.service";
import {Document} from '@sycadApp/models/workflow/common/general';
import { Impot, ValeurElementLiquidation } from '@sycadApp/models/impot/mode-reglement.model';



@Directive()
export class TransitionPlanCadastralFusionnement extends TransitionComponent{

  @Input()
  public fusion: PlanCadastralFusionementElement;
  @Input()
  public transition: Transition;

  @Input()
  public processus: Processus;

  public acteurRemoteAutocomplete = new AdvancedRemoteAutocomplete<ActeurAutocomplete>();
  public mandatRemoteAutocomplete = new AdvancedRemoteAutocomplete<Mandat>();
  public contribuableBeneficiaireRemoteAutocomplete = new AdvancedRemoteAutocomplete<GeneralContribuable>();
  public structureRemoteAutocomplete = new RemoteAutocomplete<StructureAutocomplete>();
  public isLoadingResults = false;
  public attributaireForm: FormGroup;

  get objet() { return this.formulaire.get('dossier').get('objet'); }
  get dateExterne() { return this.formulaire.get('dossier').get('dateExterne'); }
  get refExterne() { return this.formulaire.get('dossier').get('refExterne'); }
  get observation() { return this.formulaire.get('dossier').get('observation'); }
  get etatDossier() { return this.formulaire.get('dossier').get('etatDossier'); }
  get parcelle() { return this.formulaire.get('parcelle'); }
  get libelle() { return this.formulaire.get('parcelle').get('libelle'); }
  get dossier() { return this.formulaire.get('dossier'); }
  get parcelles() { return this.formulaire.get('parcelles'); }
  get acteurExterne() { return this.formulaire.get('acteurExterne'); }
  get structureBeneficiaire() { return this.formulaire.get('structureBeneficiaire'); }
  get contribuableBeneficiaire() { return this.formulaire.get('contribuableBeneficiaire'); }
  get mandat() { return this.formulaire.get('mandat'); }
  // get parcelles() { return this.formulaire.controls.parcelles as FormArray; }


  get pieces() { return this.formulaire.controls.pieces as FormArray; }
  get documents() { return this.formulaire.controls.documents as FormArray; }

  get impots() { return this.formulaire.controls.impots as FormArray; }



  public callbackAutocompleteParcelleByIlotByConnected:(search:string,params:Map<string,any>)=>Observable<any[]>;
  public callbackAutocompleteParcelleByIlotByOwn:(search:string,params:Map<string,any>)=>Observable<any[]>;
  public callbackAutocompleteParcelleByIlotByMandat:(search:string,params:Map<string,any>)=>Observable<any[]>;


  constructor(
    public router: Router,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public categoriePieceService: CategoriePieceService,
    public fusionService: PlanCadastralFusionnementService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public structureService: StructureService,
    public parcelleService: ParcelleService,
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
      numeroPVEvaluation: [null],
      dateEvaluation: [null],
      valeurInvestissement: [null],
      dateDBT: [null],
      numeroDBT: [null],
      structureBeneficiaire: [null],
      contribuableBeneficiaire: [null],
      parcelles: [null, Validators.compose([Validators.required])],
      parcelle: [null],
      pieces: new FormArray([]),
      documents: new FormArray([]),
      mandat: [null],
      impots: new FormArray([]),
    });

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
    this.callbackAutocompleteParcelleByIlotByMandat=(search:string,params:Map<string,any>)=> {
      return this.parcelleService.autocompletionByIlotByMandat(search,params).pipe(
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



  /**************** impot *********************/
  createValeurElementLiquidations(valeurElementLiquidation: ValeurElementLiquidation) {

    let form=this.fb.group({
     id: [valeurElementLiquidation.id],
     observation: [valeurElementLiquidation.observation],
     taux: [valeurElementLiquidation.taux],
     baseImpot: [valeurElementLiquidation.baseImpot],

   });


     return form;

   }
   createImpot(impot: Impot) {


     let valeurElementLiquidations = new FormArray([]);
     if (impot.valeurElementLiquidations) {
       impot.valeurElementLiquidations.map((vel) => {
         valeurElementLiquidations.insert(0, this.createValeurElementLiquidations(vel));
     });
     }

     let form=this.fb.group({
       id: [impot.id],
       observation: [impot.observation],
       typeDroit: [impot.typeDroit],
       libelleCourt: [impot.natureImpot.libelleCourt],
       valeurElementLiquidations: valeurElementLiquidations,
     });



     return form;

   }
   addNewImpot(impot: Impot) {
     this.impots.insert(0, this.createImpot(impot));

   }


   removeImpot(index) {
     this.impots.removeAt(index);
   }
   /**************** fin impot *********************/

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

  public contribuableBeneficiaireChoisie: GeneralContribuable;
  public structureBeneficiaireChoisie: StructureAutocomplete;
  receiveSubjectContribuableBeneficiaire(contri: GeneralContribuable) {
    this.contribuableBeneficiaireChoisie = contri;

    this.structureBeneficiaireChoisie=null;
    this.structureBeneficiaire.setValue(null);
    this.parcelles.setValue(null);
    this.parcellesChoisies = null;
  }

  public onSearchStructure(eventNgSelect) {
    this.structureRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onChangeStructure(structure: StructureElement) {


    this.structureBeneficiaireChoisie=structure;
    this.contribuableBeneficiaire.setValue(null);
    this.contribuableBeneficiaireChoisie = null;

    this.parcelles.setValue(null);
    this.parcellesChoisies = null;

  }


  public parcellesChoisies: ParcelleElement[];

  receiveSubjectActeur(acteur: any) {
    // this.attribution.acteur= acteur;
  }

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
    this.parcelles.setValue(null);
    this.parcellesChoisies=null;
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }


  public onChangeParcelle(parcelles) {
    this.parcellesChoisies = parcelles;
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

  openFormAddModal($event) {
    let { width, height, position } = this.getCorrectWidth();
    this.dialogRefRapideContribuableForm = this.dialog.open(RapideContribuableFormComponent, {
      data: {},
      panelClass: "sycad-dialog-form",
      width: width,
      height: height,
      position: position,
      disableClose: true
    });
    this.dialogRefRapideContribuableForm.afterClosed().subscribe(data => {
      // this.openSnackBar("Element ajouté avec succès","OK");
      if(data){
        this.contribuableBeneficiaireRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([data]);
        this.contribuableBeneficiaireRemoteAutocomplete.initialList = [data];
        this.contribuableBeneficiaireChoisie=data;
        this.contribuableBeneficiaire.setValue(data.guid);
       }
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
      controlName: 'contribuableBeneficiaire',
      libelle: 'libelle',
      term: new Subject<string>(),
      callbackAutocomplete: callbackAutocomplete,
      formulaire: this.formulaire,
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
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_FUSION}`]);
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
