import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder } from '@angular/forms';
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
import { ArrondissementAutocomplete } from '@sycadApp/models/data-references/territoire/arrondissement.model';

import { CessionSource, CessionSourceType } from '@sycadApp/models/workflow/common/attribution-source.model';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import {AffectationParcelle} from '@sycadApp/models/workflow/sd-affectation.model';
import { CessionSourceService } from '@sycadApp/services/impot/cession-source.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';

import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';

import { SdAffectationService } from '@sycadApp/services/workflow/sd-affectation.service';
import {DocumentType} from '@sycadApp/models/data-references/system/document-type.model';
import { TransitionAffectationComponent } from '../transition-sd-affectation.component';
import { environment } from 'environments/environment';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';


@Component({
  selector: 'pc-creation-sd-affectation',
  templateUrl: './creation-sd-affectation.component.html',
  styleUrls: ['./creation-sd-affectation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreationSdAffectationComponent extends TransitionAffectationComponent implements OnInit {




  constructor(
    public router: Router,
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
    public categoriePieceService: CategoriePieceService,
    public structureService: StructureService,
    public parcelleService: ParcelleService) {
    super(router, _snackBar, confirmService, _adapter, mediaObserver, fb, affectationService, attributionSourceService,  acteurService, contribuableService, professionService, categoriePieceService,parcelleService);
  }


  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  ngOnInit(): void {
    this._adapter.setLocale("fr");

    this.affectation = new AffectationParcelle();

    this.categoriePieceProcessus$ = this.processus.categoriePieces;
    this.categorieIdentiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.categoriePieceService);
      this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.structureService);
    this.cessionSourceRemoteAutocomplte.params.set("type", CessionSourceType.AFFECTATION);
    this.cessionSourceRemoteAutocomplte.initializeRemoteAutocompletion(this._onDestroy, this.attributionSourceService);
    this.initConfigAutocompleteActeur();


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
    let { dossier, acteur, cessionSource, structure, parcelle, pieces, documents } = this.formulaire.value;

    let tmp = { acteur, cessionSource, parcelle, structure, pieces, documents };
    let dataPost = { ...dossier, ...tmp };
    this.affectationService.creer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
      SycadUtils.notifyRemoteInfo("Affectation ajoutée avec succès", this._snackBar);
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
