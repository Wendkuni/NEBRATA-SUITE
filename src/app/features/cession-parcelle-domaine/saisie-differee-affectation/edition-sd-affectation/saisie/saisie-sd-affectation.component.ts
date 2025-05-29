import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '@sycadShared/app-confirm/app-confirm.service';
import { DateAdapter } from '@angular/material/core';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';

import { SycadUtils } from '@sycadShared/utils.functions';
import { CategoriePieceProcessus } from '@sycadApp/models/workflow/common/general';
import { environment } from 'environments/environment';
import { ActeurAutocomplete } from '@sycadApp/models/data-references/contribuables/acteur.model';
import { CessionSourceType } from '@sycadApp/models/workflow/common/attribution-source.model';
import { of} from 'rxjs';
import { CessionSourceService } from '@sycadApp/services/impot/cession-source.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';

import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { SdAffectationService } from '@sycadApp/services/workflow/sd-affectation.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import { TransitionAffectationComponent } from '../transition-sd-affectation.component';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';


@Component({
  selector: 'pc-saisie-sd-affectation',
  templateUrl: './saisie-sd-affectation.component.html',
  styleUrls: ['./saisie-sd-affectation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaisieSdAffectationComponent extends TransitionAffectationComponent implements OnInit {

  constructor(public router: Router,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public affectationService: SdAffectationService,
    public attributionSourceService: CessionSourceService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public professionService: ProfessionService,
    public categoriePieceService: CategoriePieceService, public structureService: StructureService,
    public parcelleService: ParcelleService
  ) {
    super(router, _snackBar, confirmService, _adapter, mediaObserver, fb, affectationService, attributionSourceService, acteurService, contribuableService, professionService, categoriePieceService,parcelleService);



    this.formulaire.addControl("action", this.fb.control(null, [Validators.required]));
    this.formulaire.addControl("numero", this.fb.control(null, [Validators.required]));

  }
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  ngOnInit(): void {
    this._adapter.setLocale("fr");



    this.categorieIdentiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.categoriePieceService);
    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.structureService);

    this.cessionSourceRemoteAutocomplte.params.set("type", CessionSourceType.AFFECTATION);
    this.cessionSourceRemoteAutocomplte.initializeRemoteAutocompletion(this._onDestroy, this.attributionSourceService);
    this.initConfigAutocompleteActeur();

    if (this.affectation.acteur) {
      let acteurEl: ActeurAutocomplete = new ActeurAutocomplete();

      acteurEl.denomination = this.affectation.acteur.denomination;
      acteurEl.guid = this.affectation.acteur.guid;
      acteurEl.statusJuridique = this.affectation.acteur.statusJuridique.libelle;
      acteurEl.sigle = this.affectation.acteur.sigle;
      acteurEl.username = this.affectation.acteur.username;
      acteurEl.categorie = this.affectation.acteur?.categorie?.libelle;

      this.acteurRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([acteurEl]);
      this.acteurRemoteAutocomplete.initialList = [acteurEl];
    }
    if (this.affectation.cessionSource) {
      this.cessionSourceRemoteAutocomplte.listRessource$ = of([this.affectation.cessionSource]);
      this.cessionSourceRemoteAutocomplte.initialList = [this.affectation.cessionSource];
    }
    if(this.affectation.structure){
      this.structureRemoteAutocomplete.listRessource$ = of([this.affectation.structure]);
      this.structureRemoteAutocomplete.initialList= [this.affectation.structure];
    }
    if (this.affectation.parcelle) {
      this.affectation.parcelle.arrondissement.commune=this.affectation.parcelle.ilot.section.commune;

    }

    if (this.affectation.listPieces) {
      this.affectation.listPieces.map((piece) => {
        this.pieces.insert(0, this.createDossierPiece(piece));
      });
    }

    if (this.affectation.documents) {
      this.affectation.documents.map((document) => {
        this.documents.insert(0, this.createDocument(document));
      });
    }
    this.categoriePieceProcessus$ = this.transition.categoriePieces;



    this.formulaire.patchValue({
      numero: this.affectation.numero,
      action: this.transition.code,
      dossier: {
        objet: this.affectation.objet,
        dateExterne: this.affectation.dateExterne,
        etatDossier: this.affectation.etatDossier,
        refExterne: this.affectation.refExterne
      },
      acteur: this.affectation?.acteur?.guid,
      structure: this.affectation?.structure?.id,
      cessionSource: this.affectation?.cessionSource?.id,
      parcelle: this.affectation?.parcelle?.id,
    });
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
    let { dossier, acteur, cessionSource, structure, parcelle, pieces, documents, numero,
      action } = this.formulaire.value;

    let tmp = { acteur, cessionSource, parcelle, structure, pieces, documents, action, numero };
    let dataPost = { ...dossier, ...tmp };

    this.affectationService.executer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
      SycadUtils.notifyRemoteInfo("Affectation modifiée avec succès", this._snackBar);
      this.router.navigate([environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_AFFECTATION]);
    },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }
  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_AFFECTATION}`]);
  }

}
