import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { FormBuilder} from '@angular/forms';
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
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';


import { CessionSource, CessionSourceType } from '@sycadApp/models/workflow/common/attribution-source.model';
import { CessionSourceService } from '@sycadApp/services/impot/cession-source.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';

import { SdMutationService } from '@sycadApp/services/workflow/sd-mutation.service';

import {MatDialog} from '@angular/material/dialog';
import {DocumentType} from '@sycadApp/models/data-references/system/document-type.model';
import { DocumentTypeService } from '@sycadApp/services/data-references/system/document-type.service';
import { MutationParcelle } from '@sycadApp/models/workflow/sd-mutation.model';
import { TransitionSdMutationComponent } from '../transition-sd-mutation.component';
import { environment } from 'environments/environment';

@Component({
  selector: 'pc-creation-sd-mutation',
  templateUrl: './creation-sd-mutation.component.html',
  styleUrls: ['./creation-sd-mutation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreationSdMutationComponent extends TransitionSdMutationComponent implements OnInit {




  constructor(
    public dialog: MatDialog,
    public router: Router,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public mutationService: SdMutationService,
    public attributionSourceService: CessionSourceService,
    public parcelleService: ParcelleService,
    public communeService: CommunesService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public professionService: ProfessionService,
    public categoriePieceService: CategoriePieceService,
    public documentTypeService: DocumentTypeService) {
    super(dialog,router, _snackBar, confirmService, _adapter, mediaObserver, fb, mutationService, attributionSourceService, parcelleService, communeService, acteurService, contribuableService, professionService, categoriePieceService);
  }


  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  ngOnInit(): void {
    this._adapter.setLocale("fr");

    this.mutation = new MutationParcelle();

    this.categoriePieceProcessus$ = this.processus.categoriePieces;
    this.categorieIdentiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.categoriePieceService);
    this.typeDocumentRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.documentTypeService);

    this.cessionSourceRemoteAutocomplte.params.set("type", CessionSourceType.MUTATION);
    this.cessionSourceRemoteAutocomplte.initializeRemoteAutocompletion(this._onDestroy, this.attributionSourceService);
    this.initConfigAutocompleteActeur();
    this.initConfigAutocompleteCedant();
    this.initConfigAutocompleteCessionnaire();

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




  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }
    
    this.loadingEvent.emit(true);
    let { dossier, acteur, cessionSource, cessionnaire, cedant, valeurDeclare, droit, enregistrement,
      bordereau, folio, caseDoc, numeroQuittance, dateQuittance, parcelle, pieces, documents,mandats } = this.formulaire.value;

    let tmp = { acteur, cessionSource, parcelle, cessionnaire, cedant, valeurDeclare, droit, enregistrement,
      bordereau, folio, caseDoc, numeroQuittance, dateQuittance, pieces, documents,mandats };
    let dataPost = { ...dossier, ...tmp };
    this.mutationService.creer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
      this.openSnackBar("Mutation ajoutée avec succès", "OK");
      this.router.navigate([environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_MUTATION]);
    },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }

  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_MUTATION}`]);
  }



}
