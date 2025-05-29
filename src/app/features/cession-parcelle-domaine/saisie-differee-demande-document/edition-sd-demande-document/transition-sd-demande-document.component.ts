
import { Input, Directive, ViewChild } from '@angular/core';

import { Validators, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DossierPiece, Mandat, Processus, Transition } from '@sycadApp/models/workflow/common/general';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { DateAdapter } from '@angular/material/core';
import { MediaObserver } from '@angular/flex-layout';
import { TransitionComponent } from '@sycadApp/shared/form-components/processus/transition/component.transition';
import { AdvancedRemoteAutocomplete } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/advanced-remote-autocomplete';

import { ActeurAutocomplete } from '@sycadApp/models/data-references/contribuables/acteur.model';
import { CategoriePiece, GeneralContribuable } from '@sycadApp/models/data-references/contribuables/global.model';
import { CessionSource } from '@sycadApp/models/workflow/common/attribution-source.model';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';

import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { ActeursService } from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { Observable, of, Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DemandeDocument } from '@sycadApp/models/workflow/sd-demande-document.model';
import { SdDemandeDocumentService } from '@sycadApp/services/workflow/sd-demande-document.service';
import { StructureAutocomplete, StructureElement } from '@sycadApp/models/data-references/organigramme/structure.model';
import { StructureService } from '@sycadApp/services/data-references/organigramme/structure.service';
import { ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';
import { ArrondissementAutocomplete } from '@sycadApp/models/data-references/territoire/arrondissement.model';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { DocumentType } from '@sycadApp/models/data-references/system/document-type.model';
import { DropzoneComponent, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { RapideContribuableFormComponent } from '@sycadApp/shared/form-components/annuaire-identite/rapide-contribuable-form/rapide-contribuable-form.component';
import { catchError, map } from 'rxjs/operators';
import { TypeColonne } from '@sycadApp/libs/model-table';

@Directive()
export class TransitionDemandeDocumentComponent extends TransitionComponent {


  @Input()
  public demandeDocument: DemandeDocument;
  @Input()
  public transition: Transition;

  @Input()
  public processus: Processus;



  public acteurRemoteAutocomplete = new AdvancedRemoteAutocomplete<ActeurAutocomplete>();
  public contribuableBeneficiaireRemoteAutocomplete = new AdvancedRemoteAutocomplete<GeneralContribuable>();
  public categorieIdentiteRemoteAutocomplete = new RemoteAutocomplete<CategoriePiece>();
  public structureRemoteAutocomplete = new RemoteAutocomplete<StructureAutocomplete>();
  public isLoadingResults = false;
  public attributaireForm: FormGroup;


  get objet() { return this.formulaire.get('dossier').get('objet'); }
  get dateExterne() { return this.formulaire.get('dossier').get('dateExterne'); }
  get refExterne() { return this.formulaire.get('dossier').get('refExterne'); }
  get observation() { return this.formulaire.get('dossier').get('observation'); }
  get etatDossier() { return this.formulaire.get('dossier').get('etatDossier'); }

  get libelle() { return this.formulaire.get('documentDeSortie').get('libelle'); }
  get numero() { return this.formulaire.get('documentDeSortie').get('numero'); }
  get pieceJointe() { return this.formulaire.get('documentDeSortie').get('pieceJointe'); }
  get dateValidite() { return this.formulaire.get('documentDeSortie').get('dateValidite'); }
  get documentType() { return this.formulaire.get('documentDeSortie').get('documentType'); }
  get dateDoc() { return this.formulaire.get('documentDeSortie').get('dateDoc'); }


  get pieces() { return this.formulaire.controls.pieces as FormArray; }
  get documents() { return this.formulaire.controls.documents as FormArray; }
  get mandats() { return this.formulaire.controls.mandats as FormArray; }
  get dossier() { return this.formulaire.get('dossier'); }
  get documentDeSortie() { return this.formulaire.get('documentDeSortie'); }
  get parcelle() { return this.formulaire.get('parcelle'); }
  get acteurExterne() { return this.formulaire.get('acteurExterne'); }
  get numeroPVEvaluation() { return this.formulaire.get('numeroPVEvaluation'); }
  get dateEvaluation() { return this.formulaire.get('dateEvaluation'); }
  get valeurInvestissement() { return this.formulaire.get('valeurInvestissement'); }
  get structureBeneficiaire() { return this.formulaire.get('structureBeneficiaire'); }
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
    public demandeDocumentService: SdDemandeDocumentService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public professionService: ProfessionService,
    public categoriePieceService: CategoriePieceService,
    public structureService: StructureService,
    public parcelleService: ParcelleService,
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
      documentDeSortie: this.fb.group({
        id: [null],
        numero: [null, [Validators.required]],
        libelle: [null, [Validators.required]],
        pieceJointe: [null],
        dateValidite: [null],
        documentType: [null, [Validators.required]],
        dateDoc: [null, [Validators.required]]
      }),
      numeroPVEvaluation: [null],
      dateEvaluation: [null],
      valeurInvestissement: [null],
      dateDBT: [null],
      numeroDBT: [null],
      structureBeneficiaire: [null],
      contribuableBeneficiaire: [null],
      parcelle: [null, Validators.compose([Validators.required])],
      pieces: new FormArray([]),
      documents: new FormArray([]),
      mandats: new FormArray([]),
    });

    this.autocompletionByIlotByOwn=(search:string,params:Map<string,any>)=> {
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

    this.structureBeneficiaire.setValue(null);
    this.structureBeneficiaireChoisie=null;

    this.parcelle.setValue(null);
  }



  public onSearchStructure(eventNgSelect) {
    this.structureRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onChangeStructure(structure: StructureElement) {



    this.contribuableBeneficiaireChoisie = null;
    this.structureBeneficiaireChoisie = structure;

    this.contribuableBeneficiaire.setValue(null);


    this.parcelle.setValue(null);

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


  /*************************** creation de documents**********************************/
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

  }
  /***************** fin création document **********************/
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
//console.log('filteredListMandat',this.filteredListMandat);
}
//end filtre des mandats

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
      callbackAutocomplete:callbackAutocomplete ,
      term: new Subject<string>(),
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
  public typeDocuments: DocumentType [];

  public onChangeTypeDocument(document:DocumentType) {
this.documentType.setValue(document.id);
  }




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
  public resetDropZone(): void {
    this.dropzoneComponentRef.directiveRef.reset();
    this.pieceJointe.setValue(null);
  }
  public onUploadSuccess(remoteResponse): void {
   this.pieceJointe.setValue(remoteResponse[1].name);
  }
  public onUploadInit(args: any): void {

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
