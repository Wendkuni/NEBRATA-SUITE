import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TransitionBornageDelimitationComponent } from '../transition-bornage-delimitation.component';
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AppConfirmService} from "@sycadShared/app-confirm/app-confirm.service";
import {DateAdapter} from "@angular/material/core";
import {MediaChange, MediaObserver} from "@angular/flex-layout";
import {FormBuilder, Validators} from "@angular/forms";
import {CategoriePieceService} from "@sycadApp/services/data-references/system/categorie-piece.service";
import {BornageDelimitationService} from "@sycadApp/services/bornage/bornage-delimitation.service";
import {ActeursService} from "@sycadApp/services/data-references/contribuables/acteurs.service";
import {ContribuableService} from "@sycadApp/services/data-references/system/contribuable.service";
import {StructureService} from "@sycadApp/services/data-references/organigramme/structure.service";
import {ParcelleService} from "@sycadApp/services/cession-parcelle/parcelle.service";
import {MandatService} from "@sycadApp/services/workflow/mandat.service";
import {CategoriePieceProcessus} from "@sycadApp/models/workflow/common/general";
import {environment} from "../../../../../../environments/environment";
import {SycadUtils} from "@sycadShared/utils.functions";
import {ActeurAutocomplete} from "@sycadApp/models/data-references/contribuables/acteur.model";
import {of} from "rxjs";

@Component({
  selector: 'app-saisie-brouillon-par-agent',
  templateUrl: './saisie-brouillon-par-agent.component.html',
  styleUrls: ['./saisie-brouillon-par-agent.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaisieBrouillonParAgentComponent  extends TransitionBornageDelimitationComponent implements OnInit {

  constructor( public dialog: MatDialog,
               public router: Router,
               public _snackBar: MatSnackBar,
               public confirmService: AppConfirmService,
               public _adapter: DateAdapter<any>,
               public mediaObserver: MediaObserver,
               public fb: FormBuilder,
               public categoriePieceService: CategoriePieceService,
               public bornageDelimitationService: BornageDelimitationService,
               public acteurService: ActeursService,
               public contribuableService: ContribuableService,
               public structureService: StructureService,
               public parcelleService: ParcelleService, public mandatService: MandatService) {
    super(router, dialog, _snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService, bornageDelimitationService, acteurService, contribuableService, structureService, parcelleService, mandatService);

    this.formulaire.addControl('action', this.fb.control(null, [Validators.required]));
    this.formulaire.addControl('numero', this.fb.control(null, [Validators.required]));
  }

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  ngOnInit(): void {
    this._adapter.setLocale('fr');
    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.structureService);
    this.initConfigAutocompleteActeur();
    this.initConfigAutocompleteContribuableBeneficiaire();
    this.contribuableBeneficiaireChoisie = this.bornage?.contribuableBeneficiaire;
    this.structureBeneficiaireChoisie = this.bornage?.structureBeneficiaire;
    if (this.bornage.acteurExterne) {
      let acteurEl: ActeurAutocomplete = new ActeurAutocomplete();

      acteurEl.denomination = this.bornage.acteurExterne.denomination;
      acteurEl.guid = this.bornage.acteurExterne.guid;
      acteurEl.statusJuridique = this.bornage.acteurExterne.statusJuridique.libelle;
      acteurEl.sigle = this.bornage.acteurExterne.sigle;
      acteurEl.username = this.bornage.acteurExterne.username;
      acteurEl.categorie = this.bornage.acteurExterne?.categorie?.libelle;

      this.acteurRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([acteurEl]);
      this.acteurRemoteAutocomplete.initialList = [acteurEl];
    }

    if (this.bornage.contribuableBeneficiaire) {
      this.contribuableBeneficiaireRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([this.bornage.contribuableBeneficiaire]);
      this.contribuableBeneficiaireRemoteAutocomplete.initialList = [this.bornage.contribuableBeneficiaire];
    }
    if (this.bornage.structureBeneficiaire) {
      this.structureRemoteAutocomplete.listRessource$ = of([this.bornage.structureBeneficiaire]);
      this.structureRemoteAutocomplete.initialList = [this.bornage.structureBeneficiaire];
    }
    this.formulaire.patchValue({
      numero: this.bornage.numero,
      action: this.transition.code,
      acteurExterne: this.bornage?.acteurExterne?.guid,
      dossier: {
        objet: this.bornage.objet,
        dateExterne: this.bornage.dateExterne,
        etatDossier: this.bornage.etatDossier,
        refExterne: this.bornage.refExterne
      },
      contribuableBeneficiaire: this.bornage?.contribuableBeneficiaire?.guid,
      structureBeneficiaire: this.bornage?.structureBeneficiaire?.id,
      parcelle: this.bornage?.parcelle?.id
    });

   /* if (this.bornage.parcelle) {
      this.bornage.parcelle.arrondissement.commune = this.bornage.parcelle.ilot.section.commune;
    } */

    if (this.bornage.listPieces) {
      this.bornage.listPieces.map((piece) => {
        this.pieces.insert(0, this.createDossierPiece(piece));
      });
    }
    this.categoriePieceProcessus$ = this.transition?.categoriePieces;
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
    this.categoriePieceProcessus$ = this.transition?.categoriePieces.filter((piece) => {
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
    let { dossier, acteurExterne, contribuableBeneficiaire, structureBeneficiaire , parcelle, pieces, action, numero } = this.formulaire.value;
    let tmp = { acteurExterne,parcelle,contribuableBeneficiaire, structureBeneficiaire , pieces, action, numero};
    let dataPost = { ...dossier, ...tmp};
    this.bornageDelimitationService.executer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
        this.openSnackBar("Bornage modifiée avec succès", "OK");
        this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_BORNAGE_DELIMITATION]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );
  }

  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_BORNAGE_DELIMITATION}`]);
  }

}
