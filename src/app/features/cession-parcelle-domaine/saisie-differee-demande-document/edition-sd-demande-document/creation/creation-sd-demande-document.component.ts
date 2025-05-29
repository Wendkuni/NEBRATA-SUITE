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
import {
  TransitionDemandeDocumentComponent
} from '../transition-sd-demande-document.component';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import {SdDemandeDocumentService} from '@sycadApp/services/workflow/sd-demande-document.service';
import {DemandeDocument} from '@sycadApp/models/workflow/sd-demande-document.model';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';

@Component({
  selector: 'pc-creation-sd-demande-document',
  templateUrl: './creation-sd-demande-document.component.html',
  styleUrls: ['./creation-sd-demande-document.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreationSdDemandeDocumentComponent extends TransitionDemandeDocumentComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public router: Router,
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
    public parcelleService: ParcelleService) {
    super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver, fb, demandeDocumentService, acteurService, contribuableService, professionService, categoriePieceService, structureService,parcelleService);
  }


  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  ngOnInit(): void {
    this._adapter.setLocale("fr");

    this.demandeDocument = new DemandeDocument();

    this.pieceJointe.setValidators([Validators.required]);
    this.pieceJointe.updateValueAndValidity();

    this.categoriePieceProcessus$ = this.processus.categoriePieces;
    this.categorieIdentiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.categoriePieceService);
    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.structureService);
    this.initConfigAutocompleteActeur();
    this.initConfigAutocompleteContribuableBeneficiaire();

    this.typeDocuments=this.processus.typeDocuments;

  }



  public onSearchCategoriePiece(eventNgSelect) {
    this.categorieIdentiteRemoteAutocomplete.term.next(eventNgSelect.term);
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
  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }
   


   this.loadingEvent.emit(true);
    let { dossier, acteurExterne, contribuableBeneficiaire, structureBeneficiaire,numeroDBT,dateDBT , valeurInvestissement, dateEvaluation, numeroPVEvaluation, parcelle, pieces,mandats, documents,documentDeSortie } = this.formulaire.value;
    let tmp = { acteurExterne,parcelle,documentDeSortie, numeroDBT,dateDBT,contribuableBeneficiaire, structureBeneficiaire , valeurInvestissement, dateEvaluation, numeroPVEvaluation, pieces, documents,mandats };
    let dataPost = { ...dossier, ...tmp };
    this.demandeDocumentService.creer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
      this.openSnackBar("Demande document ajoutée avec succès", "OK");
      this.router.navigate([environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DEMANDE_DOCUMENT]);
    },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }



  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DEMANDE_DOCUMENT}`]);
  }



}
