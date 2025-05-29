import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '@sycadShared/app-confirm/app-confirm.service';
import { DateAdapter } from '@angular/material/core';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import {
  FormArray,
  FormBuilder,
  Validators
} from '@angular/forms';
import { SycadUtils } from '@sycadShared/utils.functions';
import { CategoriePieceProcessus } from '@sycadApp/models/workflow/common/general';
import { SdAttributionService } from '@sycadApp/services/workflow/sd-attribution.service';
import { TransitionAttributionComponent } from '../transition-sd-attribution.component';
import { environment } from 'environments/environment';
import { ActeurAutocomplete } from '@sycadApp/models/data-references/contribuables/acteur.model';
import {  CessionSourceType } from '@sycadApp/models/workflow/common/attribution-source.model';
import { of } from 'rxjs';
import { CessionSourceService } from '@sycadApp/services/impot/cession-source.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';

import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { MatDialog } from '@angular/material/dialog';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import {
  DocumentTypeService
} from "@sycadApp/services/data-references/system/document-type.service";


@Component({
  selector: 'pc-saisie-sd-attribution',
  templateUrl: './saisie-sd-attribution.component.html',
  styleUrls: ['./saisie-sd-attribution.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaisieSdAttributionComponent extends TransitionAttributionComponent implements OnInit {

  constructor(public router: Router,
    public _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public attributionService: SdAttributionService,
    public attributionSourceService: CessionSourceService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public professionService: ProfessionService,
    public categoriePieceService: CategoriePieceService,
    public parcelleService: ParcelleService,
    public communeService: CommunesService,
    public documentTypeService: DocumentTypeService
  ) {
    super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver, fb, attributionService, attributionSourceService, acteurService, contribuableService, professionService, categoriePieceService,parcelleService,documentTypeService);

    this.formulaire.addControl("action", this.fb.control(null, [Validators.required]));
    this.formulaire.addControl("numero", this.fb.control(null, [Validators.required]));

  }

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  get filteredDossiers() {
    return this.dossierRetour.filter(dossier => dossier.numero !== this.attribution.numero);
  }

  ngOnInit(): void {
    this._adapter.setLocale("fr");

    this.categorieIdentiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.categoriePieceService);

    this.cessionSourceRemoteAutocomplte.params.set("type", CessionSourceType.ATTRIBUTION);
    this.cessionSourceRemoteAutocomplte.initializeRemoteAutocompletion(this._onDestroy, this.attributionSourceService);
    this.documentTypeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.documentTypeService);
    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);
    this.initConfigAutocompleteActeur();
    this.initConfigAutocompleteAttributaire();
    this.typeDocuments=this.processus.typeDocuments;
    if (this.attribution.attributaire) {
      this.attributaireRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([this.attribution.attributaire]);
      this.attributaireRemoteAutocomplete.initialList = [this.attribution.attributaire];

           this.attributaireChoisie=this.attribution.attributaire;
    }

    if (this.attribution.acteur) {
      let acteurEl: ActeurAutocomplete = new ActeurAutocomplete();

      acteurEl.denomination = this.attribution.acteur.denomination;
      acteurEl.guid = this.attribution.acteur.guid;
      acteurEl.statusJuridique = this.attribution.acteur.statusJuridique.libelle;
      acteurEl.sigle = this.attribution.acteur.sigle;
      acteurEl.username = this.attribution.acteur.username;
      acteurEl.categorie = this.attribution.acteur?.categorie?.libelle;

      this.acteurRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([acteurEl]);
      this.acteurRemoteAutocomplete.initialList = [acteurEl];
    }

    if (this.attribution.cessionSource) {
      this.cessionSourceRemoteAutocomplte.listRessource$ = of([this.attribution.cessionSource]);
      this.cessionSourceRemoteAutocomplte.initialList = [this.attribution.cessionSource];
    }

    if (this.attribution.parcelle) {
      this.attribution.parcelle.arrondissement.commune=this.attribution.parcelle.ilot.section.commune;

    }

    if (this.attribution.listPieces) {
      this.attribution.listPieces.map((piece) => {
        this.pieces.insert(0, this.createDossierPiece(piece));
      });
    }

    if(this.attribution.mandats){
      this.attribution.mandats.map((mandat) => {
        this.mandats.insert(0, this.createMandat(mandat));
      });
    }

    this.categoriePieceProcessus$ = this.transition.categoriePieces;

    this.formulaire.patchValue({
      numero: this.attribution.numero,
      action: this.transition.code,
      dossier: {
        objet: this.attribution.objet,
        dateExterne: this.attribution.dateExterne,
        etatDossier: this.attribution.etatDossier,
        refExterne: this.attribution.refExterne
      },
      acteur: this.attribution?.acteur?.guid,
      attributaire: this.attribution?.attributaire?.guid,
      cessionSource: this.attribution?.cessionSource?.id,
      parcelle: this.attribution?.parcelle?.id,
      mandats: [],
      numeroDePage: this.attribution?.numeroDePage,
      numeroDePV:this.attribution.numeroDePV,
      documentDeSortie:{
        id: this.attribution.documentDeSortie?.id,
        numero: this.attribution.documentDeSortie?.numero,
        libelle: this.attribution.documentDeSortie?.libelle,
        pieceJointe: this.attribution.documentDeSortie?.pieceJointe,
        documentType: this.attribution.documentDeSortie?.documentType?.id,
        dateDoc: this.attribution.documentDeSortie?.dateDoc
      },
      documentType:this.attribution?.documentDeSortie.documentType,
    });

    if(this.attribution?.parcelleInexistante){
      this.parcelleInexistantechoix = true;
    }

    this.changeParcelle(this.attribution?.parcelle);
    this.manageParcelValidity();

    if (this.parcelleInexistantechoix) {
      this.initializeParcelleInexistante();
    }

  }

  onSearchCommune(eventNgSelect) {
    this.communeRemoteAutocomplete.term.next(eventNgSelect.term);
  }


  get documents(): FormArray {
    return this.formulaire.get('documents') as FormArray;
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
    this.categoriePieceProcessus$ = this.transition.categoriePieces.filter((piece) => {
      return (that.idCategoriePieceListChosen$.indexOf(piece.id) < 0);
    });

  }

  public onSearchCategoriePiece(eventNgSelect) {
    this.categorieIdentiteRemoteAutocomplete.term.next(eventNgSelect.term);
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

    let { dossier, acteur, cessionSource, attributaire, parcelle, pieces, documentDeSortie, numero,
      action,mandats, numeroDePage,numeroDePV, parcelleInexistante } = this.formulaire.value;

    let tmp = { acteur, cessionSource, parcelle, attributaire, pieces, documentDeSortie, action, mandats, numero, numeroDePage,numeroDePV, parcelleInexistante };
    let dataPost = { ...dossier, ...tmp };

    this.attributionService.executer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
      SycadUtils.notifyRemoteInfo("Attribution modifié avec succès", this._snackBar);
      this.router.navigate([environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_ATTRIBUTION]);

    },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );

  }

  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_ATTRIBUTION}`]);
  }

}
