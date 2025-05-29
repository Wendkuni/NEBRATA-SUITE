
import { Input, Component, Directive, ViewChild } from '@angular/core';

import { Validators, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DossierPiece, Mandat, Processus, Transition } from '@sycadApp/models/workflow/common/general';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { DateAdapter } from '@angular/material/core';
import { MediaObserver } from '@angular/flex-layout';
import { IlotElement, ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';

import { TransitionComponent } from '@sycadApp/shared/form-components/processus/transition/component.transition';
import { AdvancedRemoteAutocomplete } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/advanced-remote-autocomplete';

import { ActeurAutocomplete } from '@sycadApp/models/data-references/contribuables/acteur.model';
import { CategoriePiece, GeneralContribuable, Ilot, Section } from '@sycadApp/models/data-references/contribuables/global.model';
import { CessionSource } from '@sycadApp/models/workflow/common/attribution-source.model';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { SdMutationService } from '@sycadApp/services/workflow/sd-mutation.service';
import { CessionSourceService } from '@sycadApp/services/impot/cession-source.service';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';

import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { Observable, of, Subject } from 'rxjs';
import { ArrondissementAutocomplete } from '@sycadApp/models/data-references/territoire/arrondissement.model';
import {Document} from '@sycadApp/models/workflow/common/general';
import {DocumentType} from '@sycadApp/models/data-references/system/document-type.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MutationParcelle } from '@sycadApp/models/workflow/sd-mutation.model';
import { RapideContribuableMoralFormComponent } from '@sycadApp/shared/form-components/annuaire-identite/rapide-contribuable-moral-form/rapide-contribuable-moral-form.component';
import { RapideContribuablePhysiqueFormComponent } from '@sycadApp/shared/form-components/annuaire-identite/rapide-contribuable-physique-form/rapide-contribuable-physique-form.component';
import { catchError, map } from 'rxjs/operators';
import { ChoixParcelleFormComponent } from '@sycadApp/shared/form-components/plan-cadastral/choix-parcelle-form/choix-parcelle-form.component';
import { TypeColonne } from '@sycadApp/libs/model-table';

@Directive()
export class TransitionSdMutationComponent extends TransitionComponent {


  @Input()
  public mutation: MutationParcelle;
  @Input()
  public transition: Transition;

  @Input()
  public processus: Processus;

  public isParcelleLibreEnable: Boolean=false;

  @ViewChild("choixParcelle",{static:true})
  private choixParcelleComponent!: ChoixParcelleFormComponent;

  changeParcelleLibreEnable() {
    this.choixParcelleComponent.clearSelectparcelle();
    this.choixParcelleComponent.parcelleRemoteAutocomplte.term.next("");
  }


  public acteurRemoteAutocomplete = new AdvancedRemoteAutocomplete<ActeurAutocomplete>();
  public categorieIdentiteRemoteAutocomplete = new RemoteAutocomplete<CategoriePiece>();
  public cessionSourceRemoteAutocomplte = new RemoteAutocomplete<CessionSource>();
  public cessionnaireRemoteAutocomplete = new AdvancedRemoteAutocomplete<GeneralContribuable>();
  public cedantRemoteAutocomplete = new AdvancedRemoteAutocomplete<GeneralContribuable>();
  public typeDocumentRemoteAutocomplete = new RemoteAutocomplete<DocumentType>();


  public isLoadingResults = false;
  public attributaireForm: FormGroup;


  get pieces() { return this.formulaire.controls.pieces as FormArray; }
  get documents() { return this.formulaire.controls.documents as FormArray; }
  get dossier() { return this.formulaire.get('dossier'); }
  get parcelle() { return this.formulaire.get('parcelle'); }
  get acteur() { return this.formulaire.get('acteur'); }
  get cessionSource() { return this.formulaire.get('cessionSource'); }
  get cessionnaire() {return this.formulaire.get('cessionnaire');}
  get cedant() {return this.formulaire.get('cedant');}
  get valeurDeclare() {return this.formulaire.get('valeurDeclare');}
  get enregistrement() {return this.formulaire.get('enregistrement');}
  get bordereau() {return this.formulaire.get('bordereau');}
  get folio() {return this.formulaire.get('folio');}
  get caseDoc() {return this.formulaire.get('caseDoc');}
  get droit() {return this.formulaire.get('droit');}
  get numeroQuittance() {return this.formulaire.get('numeroQuittance');}
  get dateQuittance() {return this.formulaire.get('dateQuittance');}
  get mandats() { return this.formulaire.controls.mandats as FormArray; }

  public autocompletionByIlotLibreOrByOwn:(search:string,params:Map<string,any>)=>Observable<any[]>;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public attributionService: SdMutationService,
    public attributionSourceService: CessionSourceService,
    public parcelleService: ParcelleService,
    public communeService: CommunesService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public professionService: ProfessionService,
    public categoriePieceService: CategoriePieceService
  ) {
    super(mediaObserver);

    this.formulaire = this.fb.group({
      dossier: this.fb.group({
        objet: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
        dateExterne: [null, Validators.compose([Validators.required])],
        etatDossier: [false],
        refExterne: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
        observation: [null],
      }),
      acteur: [null],
      cessionnaire: [null],
      cedant: [null],
      valeurDeclare: [null, Validators.compose([Validators.required])],
      enregistrement: [null],
      bordereau: [null],
      folio: [null],
      caseDoc: [null],
      droit: [null],
      numeroQuittance: [null],
      dateQuittance: [null],
      cessionSource: [null, Validators.compose([Validators.required])],
      parcelle: [null, Validators.compose([Validators.required])],
      pieces: new FormArray([]),
      documents: new FormArray([]),
      mandats: new FormArray([]),
    });

    this.autocompletionByIlotLibreOrByOwn=(search:string,params:Map<string,any>)=> {

      params.set("activeParcelleLibre",this.isParcelleLibreEnable);
      return this.parcelleService.autocompletionByIlotLibreOrByOwn(search,params).pipe(
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

 /*************************** creation de mandat**********************************/
 createMandat(mandat: Mandat = null) {
  if(mandat != null){
    return this.fb.group({
      id: [mandat.id],
      actif: [mandat.actif],
      debut:[mandat.debut, [Validators.required]],
      fin:[mandat.fin, [Validators.required]],
      description:[mandat.description, [Validators.required]],
      objet:[mandat.objet, [Validators.required]],
      reference:[mandat.reference, [Validators.required]],
      pieceJointe:[mandat.pieceJointe],
      mandant: [mandat.mandant.guid, [Validators.required]],
      mandataire: [mandat.mandataire, [Validators.required]]
    });
  }else {
  return this.fb.group({
    id: [null],
    actif: [null],
    debut:[null, [Validators.required]],
    fin:[null, [Validators.required]],
    description:[null, [Validators.required]],
    objet:[null, [Validators.required]],
    reference:[null, [Validators.required]],
    pieceJointe:[null],
    mandant: [null, [Validators.required]],
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
}

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
/***************** fin création de mandat **********************/
  public onSearchCessionSource(eventNgSelect) {
    this.cessionSourceRemoteAutocomplte.term.next(eventNgSelect.term);
  }

  groupByFnArrondissement = (item) => item.commune.nom;
  groupValueFnArrondissement = (_: string, communes: any[]) => ({ name: communes[0].commune.nom, total: communes.length });





  receiveSubjectActeur(acteur: any) {
    // this.attribution.acteur= acteur;
  }

  public cedantChoisie: GeneralContribuable;
  receiveSubjectCedant(cedant: GeneralContribuable) {
    this.cedantChoisie = cedant;
   //// console.log("this.cedantChoisie",this.cedantChoisie);
    this.cessionnaireRemoteAutocomplete.filtersId=[];
    this.cessionnaireRemoteAutocomplete.filtersId.push(this.cedantChoisie.guid);
    this.cessionnaireRemoteAutocomplete.customNgSelectConfig.term.next("");
    this.parcelle.setValue(null);


  }

  public cessionnaireChoisie: GeneralContribuable;
  receiveSubjectCessionnaire(cessionnaire: GeneralContribuable) {
    this.cessionnaireChoisie = cessionnaire;
   //// console.log("this.cessionnaireChoisie",this.cessionnaireChoisie);
    this.cedantRemoteAutocomplete.filtersId=[];
    this.cedantRemoteAutocomplete.filtersId.push(this.cessionnaireChoisie.guid);
    this.cedantRemoteAutocomplete.customNgSelectConfig.term.next("");
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
      placeholder: "L'acteur (notaire)"
    };

    this.acteurRemoteAutocomplete.nativeNgSelectConfig.placeholder = "L'acteur (notaire)";
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

  public dialogRefContribuablePhysiqueForm: MatDialogRef<RapideContribuablePhysiqueFormComponent,any>;


  public openFormModalContribuablePhysique(){
    let { width,height,position}=this.getCorrectWidth();
    this.dialogRefContribuablePhysiqueForm = this.dialog.open(RapideContribuablePhysiqueFormComponent, {
      data: {},
      panelClass:"sycad-dialog-form",
      width: width,
      height: height,
      position: position,
      disableClose:true
    });
    this.dialogRefContribuablePhysiqueForm.afterClosed().subscribe(role => {
      if(role) {
        this.openSnackBar("Element ajouté avec succès","OK");
        //   this.refeshDataSubject.next("");
      }

    });
  }
  public dialogRefContribuableMoralForm: MatDialogRef<RapideContribuableMoralFormComponent,any>;
  public openFormModalContribuableMoral(){
    let { width,height,position}=this.getCorrectWidth();
    this.dialogRefContribuableMoralForm = this.dialog.open(RapideContribuableMoralFormComponent, {
      data: {},
      panelClass:"sycad-dialog-form",
      width: width,
      height: height,
      position: position,
      disableClose:true
    });
    this.dialogRefContribuableMoralForm.afterClosed().subscribe(role => {
      if(role) {
        this.openSnackBar("Element ajouté avec succès","OK");
        //   this.refeshDataSubject.next("");
      }

    });
  }
  initConfigAutocompleteCessionnaire() {

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

    this.cessionnaireRemoteAutocomplete.customNgSelectConfig = {
      multiple: false,
      controlName: 'cessionnaire',
      libelle: 'libelle',
      callbackAutocomplete: callbackAutocomplete,
      term: new Subject<string>(),
      formulaire: this.formulaire,
      placeholder: ""
    };

    this.cessionnaireRemoteAutocomplete.nativeNgSelectConfig.placeholder = "Le cessionnaire";
    this.cessionnaireRemoteAutocomplete.nativeNgSelectConfig.appendTo = 'body';
    this.cessionnaireRemoteAutocomplete.nativeNgSelectConfig.bindValue = 'guid';
    this.cessionnaireRemoteAutocomplete.listItemSelected = [];
    this.cessionnaireRemoteAutocomplete.keyId = 'guid';
    this.cessionnaireRemoteAutocomplete.callbackAutocomplete = callbackAutocomplete;
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
    this.cessionnaireRemoteAutocomplete.mapFunction= (value : GeneralContribuable):GeneralContribuable=>{
      value.libelleTelephone = value.telephones.map(value => value.value).join(', ');
      value.libelleEmail =  value.emails.map(value => value.value).join(', ');
      return value;
    };
    this.cessionnaireRemoteAutocomplete.tableDescription = this.cessionnaireRemoteAutocomplete.pushColumn(colTabAttributaire, 'Tableau des cessionnaires');

  }
  initConfigAutocompleteCedant() {

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
    this.cedantRemoteAutocomplete.customNgSelectConfig = {
      multiple: false,
      controlName: 'cedant',
      libelle: 'libelle',
      callbackAutocomplete: callbackAutocomplete,
      term: new Subject<string>(),
      formulaire: this.formulaire,
      placeholder: ""
    };


    this.cedantRemoteAutocomplete.nativeNgSelectConfig.placeholder = "Le cédant";
    this.cedantRemoteAutocomplete.nativeNgSelectConfig.appendTo = 'body';
    this.cedantRemoteAutocomplete.nativeNgSelectConfig.bindValue = 'guid';
    this.cedantRemoteAutocomplete.listItemSelected = [];
    this.cedantRemoteAutocomplete.keyId = 'guid';
    this.cedantRemoteAutocomplete.callbackAutocomplete =callbackAutocomplete;
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
    this.cedantRemoteAutocomplete.mapFunction= (value : GeneralContribuable):GeneralContribuable=>{
      value.libelleTelephone = value.telephones.map(value => value.value).join(', ');
      value.libelleEmail =  value.emails.map(value => value.value).join(', ');
      return value;
    };
    this.cedantRemoteAutocomplete.tableDescription = this.cedantRemoteAutocomplete.pushColumn(colTabAttributaire, 'Tableau des cédants');

  }

  private getCorrectWidth() {

    if(this.mediaObserver.isActive("xs")) {
      return {
        width: '90vw',
        height: '80vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("sm")) {
      return {
        width: '70vw',
        height: '80vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("md")) {
      return {
        width: '50vw',
        height: '80vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("lg")) {
      return {
        width: '45vw',
        height: '80vh',
        position: {
          top:'2vh',
        }
      };
    }
    if(this.mediaObserver.isActive("xl")) {
      return {
        width: '40vw',
        height: '80vh',
        position: {
          top:'2vh',
        }
      };
    }
  }
}
