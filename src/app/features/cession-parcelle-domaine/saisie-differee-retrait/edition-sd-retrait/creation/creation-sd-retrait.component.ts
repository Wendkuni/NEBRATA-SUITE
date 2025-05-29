import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '@sycadShared/app-confirm/app-confirm.service';
import { DateAdapter } from '@angular/material/core';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';

import { SycadUtils } from '@sycadShared/utils.functions';
import { CategoriePieceProcessus } from '@sycadApp/models/workflow/common/general';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';

import { TransitionRetraitComponent } from '../transition-sd-retrait.component';

import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';

import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';

import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { SdRetraitService } from '@sycadApp/services/workflow/sd-retrait.service';
import { RetraitParcelle } from '@sycadApp/models/workflow/sd-retrait.model';


import { CessionSourceService } from '@sycadApp/services/impot/cession-source.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';


import {CessionSourceType} from '@sycadApp/models/workflow/common/attribution-source.model';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DocumentType} from '@sycadApp/models/data-references/system/document-type.model';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import { DocumentTypeService } from '@sycadApp/services/data-references/system/document-type.service';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'pc-creation-sd-retrait',
  templateUrl: './creation-sd-retrait.component.html',
  styleUrls: ['./creation-sd-retrait.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreationSdRetraitComponent extends TransitionRetraitComponent implements OnInit {




  constructor(
    public dialog: MatDialog,
    public router: Router,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public retraitService: SdRetraitService,
    public arrondissementsService: ArrondissementsService,
    public attributionSourceService: CessionSourceService,
    public parcelleService: ParcelleService,
    public communeService: CommunesService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public professionService: ProfessionService,
    public categoriePieceService: CategoriePieceService,
    public structureService: StructureService,
    public documentTypeService: DocumentTypeService) {
    super(dialog,router, _snackBar, confirmService, _adapter, mediaObserver, fb,  retraitService, arrondissementsService, attributionSourceService, parcelleService, communeService, acteurService, contribuableService, professionService, categoriePieceService);
  }


  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  ngOnInit(): void {
    this._adapter.setLocale("fr");

    this.retrait = new RetraitParcelle();

    this.categoriePieceProcessus$ = this.processus.categoriePieces;
    this.categorieIdentiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.categoriePieceService);
    this.typeDocumentRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.documentTypeService);
    this.cessionSourceRemoteAutocomplte.params.set("type", CessionSourceType.RETRAIT);
    this.cessionSourceRemoteAutocomplte.initializeRemoteAutocompletion(this._onDestroy, this.attributionSourceService);
    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.structureService);
    this.initConfigAutocompleteActeur();
    this.initConfigAutocompleteAcienAttributaire();

  }



  public onSearchCategoriePiece(eventNgSelect) {
    this.categorieIdentiteRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchTypeDocument(eventNgSelect){
    this.typeDocumentRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public categoriePieceProcessus$: CategoriePieceProcessus[] = [];
  public idCategoriePieceListChosen$: number[] = [];
  public changeCategoriePiece(data: CategoriePieceProcessus) {
    this.idCategoriePieceListChosen$ = [];
    for (let i = 0; i < this.pieces.length; i++) {
      let piece = this.pieces.at(i);
      this.idCategoriePieceListChosen$.push(piece.value.categorie);
    }
    let that = this;
    this.categoriePieceProcessus$ = this.processus.categoriePieces.filter((piece) => {
      return (that.idCategoriePieceListChosen$.indexOf(piece.id) < 0);
    });

  }
  addNewDossierPiece() {
    if (this.categoriePieceProcessus$.length > 0) {
      super.addNewDossierPiece();
    }
  }
  removeDossierPiece(i) {
    super.removeDossierPiece(i);
    this.changeCategoriePiece(null);
  }
  public typeDocumentsProcessus$: DocumentType [] = [];
  public idTypeDocumentChosen$: number[] = [];
  public changeTypeDocument(data: DocumentType){
    this.idTypeDocumentChosen$ = [];
    for(let i =0 ; i < this.documents.length; i++){
      let document = this.documents.at(i);
      this.idCategoriePieceListChosen$.push(document.value.documentType);
    }
    let that = this;
    this.typeDocumentsProcessus$ = this.processus.typeDocuments.filter((document) =>{
      return (that.idTypeDocumentChosen$.indexOf(document.id) < 0);
    });
  }
  addNewTypeDocument(){
    if(this.typeDocumentsProcessus$.length > 0){
      super.addDocument();
    }
  }
  removeDocument(i) {
    super.removeDocument(i);
    this.changeTypeDocument(null);
  }

  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }
    this.loadingEvent.emit(true);
    let { dossier, acteur, cessionSource, ancienAttributaire, structure, parcelle, pieces, documents } = this.formulaire.value;

    let tmp = { acteur, cessionSource, parcelle, ancienAttributaire, structure, pieces, documents };
    let dataPost = { ...dossier, ...tmp };
    this.retraitService.creer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
      this.openSnackBar("Retrait ajouté avec succès", "OK");
      this.router.navigate([environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_RETRAIT]);
    },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }

  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_RETRAIT}`]);
  }


}
