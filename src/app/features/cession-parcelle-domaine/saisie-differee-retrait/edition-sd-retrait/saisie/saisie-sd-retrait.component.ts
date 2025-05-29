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
import { SdRetraitService } from '@sycadApp/services/workflow/sd-retrait.service';
import { TransitionRetraitComponent } from '../transition-sd-retrait.component';
import { environment } from 'environments/environment';

import { ActeurAutocomplete } from '@sycadApp/models/data-references/contribuables/acteur.model';
import { of, Subject } from 'rxjs';
import { CessionSourceService } from '@sycadApp/services/impot/cession-source.service';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';

import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';

import {CessionSourceType} from '@sycadApp/models/workflow/common/attribution-source.model';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import { MatDialog } from '@angular/material/dialog';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';

@Component({
  selector: 'pc-saisie-sd-retrait',
  templateUrl: './saisie-sd-retrait.component.html',
  styleUrls: ['./saisie-sd-retrait.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaisieSdRetraitComponent extends TransitionRetraitComponent implements OnInit {

  constructor( public dialog: MatDialog,public router: Router,
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
              public structureService: StructureService
  ) {
    super(dialog,router, _snackBar, confirmService, _adapter, mediaObserver, fb, retraitService, arrondissementsService, attributionSourceService, parcelleService, communeService, acteurService, contribuableService, professionService, categoriePieceService);



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


    this.cessionSourceRemoteAutocomplte.params.set("type", CessionSourceType.RETRAIT);
    this.cessionSourceRemoteAutocomplte.initializeRemoteAutocompletion(this._onDestroy, this.attributionSourceService);
    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.structureService);



    if (this.retrait.ancienAttributaire) {
      this.attributaireRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([this.retrait.ancienAttributaire]);
      this.attributaireRemoteAutocomplete.initialList = [this.retrait.ancienAttributaire];
    }

    if (this.retrait.acteur) {
      let acteurEl: ActeurAutocomplete = new ActeurAutocomplete();

      acteurEl.denomination = this.retrait.acteur.denomination;
      acteurEl.guid = this.retrait.acteur.guid;
      acteurEl.statusJuridique = this.retrait.acteur.statusJuridique.libelle;
      acteurEl.sigle = this.retrait.acteur.sigle;
      acteurEl.username = this.retrait.acteur.username;
      acteurEl.categorie = this.retrait.acteur?.categorie?.libelle;

      this.acteurRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([acteurEl]);
      this.acteurRemoteAutocomplete.initialList = [acteurEl];
    }
    if (this.retrait.cessionSource) {
      this.cessionSourceRemoteAutocomplte.listRessource$ = of([this.retrait.cessionSource]);
      this.cessionSourceRemoteAutocomplte.initialList = [this.retrait.cessionSource];
    }
    if(this.retrait.structure){
      this.structureRemoteAutocomplete.listRessource$ = of([this.retrait.structure]);
      this.structureRemoteAutocomplete.initialList = [this.retrait.structure];
      this.structureChoisie=this.retrait.structure;
    }
    if(this.retrait.ancienAttributaire){
      this.attributaireRemoteAutocomplete.customNgSelectConfig.listRessource$=of([this.retrait.ancienAttributaire]);
      this.attributaireRemoteAutocomplete.initialList=[this.retrait.ancienAttributaire];
      this.ancienAttributaireChoisie=this.retrait.ancienAttributaire;

    }
    if (this.retrait.parcelle) {
      this.retrait.parcelle.arrondissement.commune=this.retrait.parcelle.ilot.section.commune;



    }
    if (this.retrait.listPieces) {
      this.retrait.listPieces.map((piece) => {
        this.pieces.insert(0, this.createDossierPiece(piece));
      });
    }
    this.categoriePieceProcessus$ = this.transition.categoriePieces;

    if(this.retrait.documents){
      this.retrait.documents.map((document)=>{
        this.documents.insert(0, this.createDocument(document));
      });
    }

    this.formulaire.patchValue({
      numero: this.retrait.numero,
      action: this.transition.code,
      dossier: {
        objet: this.retrait.objet,
        dateExterne: this.retrait.dateExterne,
        etatDossier: this.retrait.etatDossier,
        refExterne: this.retrait.refExterne
      },
      acteur: this.retrait.acteur?.guid,
      ancienAttributaire: this.retrait.ancienAttributaire?.guid,
      attributaire: this.retrait.ancienAttributaire?.guid,
      cessionSource: this.retrait?.cessionSource?.id,
      parcelle: this.retrait?.parcelle?.id,
      structure: this.retrait?.structure?.id
    });


    this.initConfigAutocompleteActeur();
    this.initConfigAutocompleteAcienAttributaire();
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
    let { dossier, acteur, cessionSource, ancienAttributaire, structure, parcelle, pieces, documents, numero,
      action } = this.formulaire.value;

    let tmp = { acteur, cessionSource, parcelle, ancienAttributaire, structure, pieces, documents, action, numero };
    let dataPost = { ...dossier, ...tmp };

    this.retraitService.executer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
      this.openSnackBar("Retrait modifié avec succès", "OK");
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
