
import {Input, Directive, ViewChild} from '@angular/core';

import { Validators, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DossierPiece, Processus, Transition } from '@sycadApp/models/workflow/common/general';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { DateAdapter } from '@angular/material/core';
import { MediaObserver } from '@angular/flex-layout';
import { IlotElement } from '@sycadApp/models/data-references/territoire/localite.model';

import { TransitionComponent } from '@sycadApp/shared/form-components/processus/transition/component.transition';

import { CessionSource } from '@sycadApp/models/workflow/common/attribution-source.model';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';

import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { Observable, of, Subject } from 'rxjs';
import {StructureAutocomplete} from '@sycadApp/models/data-references/organigramme/structure.model';
import {Document} from '@sycadApp/models/workflow/common/general';
import { EntetePV } from '@sycadApp/models/workflow/sd-entete-pv.model';
import { SdEntetePVService } from '@sycadApp/services/workflow/sd-entetePV.service';
import { CategoriePiece, Ilot, Section } from '@sycadApp/models/data-references/contribuables/global.model';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { SectionService } from '@sycadApp/services/cession-parcelle/section.service';
import { IlotService } from '@sycadApp/services/cession-parcelle/ilot.service';
import {
  CommuneAutocomplete,
  CommuneItem, CommuneNestedItem
} from '@sycadApp/models/data-references/territoire/commune.model';
import { CessionSourceService } from '@sycadApp/services/impot/cession-source.service';
import { ActeursService } from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { AdvancedRemoteAutocomplete } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/advanced-remote-autocomplete';
import { ActeurAutocomplete } from '@sycadApp/models/data-references/contribuables/acteur.model';
import { catchError, map } from 'rxjs/operators';
import { TypeColonne } from '@sycadApp/libs/model-table';
import {
  DocumentType
} from "@sycadApp/models/data-references/system/document-type.model";
import {
  DropzoneComponent,
  DropzoneConfigInterface
} from "ngx-dropzone-wrapper";
import {
  DocumentTypeService
} from "@sycadApp/services/data-references/system/document-type.service";
import {
  RemoteAutocompleteCommuneZoneCompetence,
  RemoteAutocompleteZoneArrondissementCompetence
} from "@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence";
import {
  ArrondissementZone
} from "@sycadApp/models/data-references/territoire/arrondissement.model";
import {
  ArrondissementsService
} from "@sycadApp/services/data-references/territoire/arrondissements.service";

@Directive()
export class TransitionEntetePVComponent extends TransitionComponent {


  @Input()
  public entetePV: EntetePV;
  @Input()
  public transition: Transition;

  @Input()
  public processus: Processus;

  documentDeSortie: FormGroup;
  public arrondissementRemoteAutocomplete;
  selectedDocumentType: DocumentType[] = [];
  public communeRemoteAutocomplete = new RemoteAutocompleteCommuneZoneCompetence<CommuneAutocomplete>();

  public structureRemoteAutocomplete = new RemoteAutocomplete<StructureAutocomplete>();
  public categorieIdentiteRemoteAutocomplete = new RemoteAutocomplete<CategoriePiece>();
  public cessionSourceRemoteAutocomplte = new RemoteAutocomplete<CessionSource>();
  public documentTypeRemoteAutocomplete = new RemoteAutocomplete<DocumentType>();
  public acteurRemoteAutocomplete = new AdvancedRemoteAutocomplete<ActeurAutocomplete>();
  public arrondissementZoneRemoteAutocomplete=new RemoteAutocompleteZoneArrondissementCompetence<ArrondissementZone>();
  public isLoadingResults = false;
  public attributaireForm: FormGroup;
  get objet() {
    return this.dossier.get('objet');
  }

  get commune(){ return this.formulaire.get('commune');}
  get arrondissement() { return this.formulaire.get('arrondissement'); }
  get communeEle() { return this.formulaire.get('communeEle'); }
  get pieces() { return this.formulaire.controls.pieces as FormArray; }
  get documents() { return this.formulaire.controls.documents as FormArray; }
  get dossier() { return this.formulaire.get('dossier'); }
  get cessionSource() { return this.formulaire.get('cessionSource'); }
  get libelle(){return this.formulaire.get('document.0.libelle')}
  get numero(){return this.formulaire.get('document.0.numero')}
  get dateDoc(){return this.formulaire.get('document.0.dateDoc')}
  //get transmissionCreateur() {return this.formulaire.get('transmissionCreateur')}

  public autocompletionByIlotAndLibre:(search:string,params:Map<string,any>)=>Observable<any[]>;

  public typeDocuments: DocumentType [];
  constructor(
    public router: Router,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public entetePVService: SdEntetePVService,
    public categoriePieceService: CategoriePieceService,
    public communeService: CommunesService,
    public documentTypeService: DocumentTypeService,
    public attributionSourceService: CessionSourceService,
    public arrondissementService: ArrondissementsService,
  ) {
    super(mediaObserver);
    this.documentDeSortie = this.fb.group({
      id: [null],
      numero: [null,Validators.required],
      libelle: [null,Validators.required],
      pieceJointe: [null],
      documentType: [null],
      dateDoc: [null]
    });
    this.formulaire = this.fb.group({
        dossier: this.fb.group({
        observation: [null],
      }),
      commune: [null, Validators.required],
      arrondissement: [null,Validators.required],
      cessionSource: [null],
      documentType:[null],
      documentDeSortie: this.documentDeSortie
    });


  }


  /**************** Commune *********************/

  getCommune(commune: CommuneItem) {

    if (commune != null) {
      return this.fb.group({
        id: [commune.id, Validators.compose([Validators.required])],
        nom: [commune.nom],
      });
    } else {
      return this.fb.group({
        id: [null, Validators.compose([Validators.required])],
        nom: [null],
      });
    }

  }
    /**************** fin commune *********************/

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
        documentType: [document.documentType.id, [Validators.required]],
        dateDoc: [document.dateDoc, [Validators.required]]
      });
    }else {
    return this.fb.group({
      id: [null],
      libelle: [null, [Validators.required]],
      numero: [null, [Validators.required]],
      pieceJointe: [null, [Validators.required]],
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
  public onSearchDocumentType(eventNgSelect) {
    this.documentTypeRemoteAutocomplete.term.next(eventNgSelect.term);
  }




  onChangeTypeDocuments(event: any) {
    // Vérifiez que l'événement contient les propriétés nécessaires
    if (event && event.id && event.libelle) {
      // Création d'une nouvelle instance de DocumentType
      const documentType = new DocumentType(); // Utilisez le constructeur de DocumentType

      documentType.id = event.id;
      documentType.libelle = event.libelle;
      documentType.estTitreFoncier = event.estTitreFoncier || false;
      documentType.estTitreParcelle = event.estTitreParcelle || false;
      documentType.actif = event.actif || false;


      this.selectedDocumentType = [];
      this.selectedDocumentType.push(documentType);
    }
  }

  receiveSubjectActeur(acteur: any) {
    // this.attribution.acteur= acteur;
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }
  public onChangeCommune(commune: CommuneNestedItem) {
    if (!commune) {
      // Si aucune commune sélectionnée, vider la liste des localites et des arrondissements
      this.arrondissementRemoteAutocomplete.listRessource$ = of([])
    } else {
      this.arrondissementRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.arrondissementService);
      this.arrondissementRemoteAutocomplete.params.set("commune", commune?.id);
      this.arrondissementRemoteAutocomplete.term.next("");

    }
  }
  onSearchArrondissement(eventNgSelect) {
    this.arrondissementRemoteAutocomplete.term.next(eventNgSelect.term);
  }

}
