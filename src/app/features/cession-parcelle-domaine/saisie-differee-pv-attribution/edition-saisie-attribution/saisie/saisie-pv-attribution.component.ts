import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '@sycadShared/app-confirm/app-confirm.service';
import { DateAdapter } from '@angular/material/core';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import { of } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SycadUtils } from '@sycadShared/utils.functions';
import { CategoriePieceProcessus } from '@sycadApp/models/workflow/common/general';
import { environment } from 'environments/environment';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { MatDialog } from '@angular/material/dialog';
import { TransitionEntetePVComponent } from '../transition-saisie-attribution.component';
import { SdEntetePVService } from '@sycadApp/services/workflow/sd-entetePV.service';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { SectionService } from '@sycadApp/services/cession-parcelle/section.service';
import { IlotService } from '@sycadApp/services/cession-parcelle/ilot.service';
import { CessionSourceService } from '@sycadApp/services/impot/cession-source.service';
import { ActeursService } from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { CommuneAutocomplete } from '@sycadApp/models/data-references/territoire/commune.model';
import {
  RemoteAutocompleteArrondissementZoneCompetence,
  RemoteAutocompleteCommuneZoneCompetence
} from '@sycadApp/features/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence';
import { CessionSourceType } from '@sycadApp/models/workflow/common/attribution-source.model';
import {
  DocumentTypeService
} from "@sycadApp/services/data-references/system/document-type.service";
import {
  ArrondissementsService
} from "@sycadApp/services/data-references/territoire/arrondissements.service";
import {
  ArrondissementAutocomplete
} from "@sycadApp/models/data-references/territoire/arrondissement.model";

@Component({
  selector: 'app-saisie-pv-attribution',
  templateUrl: './saisie-pv-attribution.component.html',
  styleUrls: ['./saisie-pv-attribution.component.scss']
})
export class SaisiePvAttributionComponent extends TransitionEntetePVComponent implements OnInit {



  public communeRemoteAutocomplete = new RemoteAutocompleteCommuneZoneCompetence<CommuneAutocomplete>();

  constructor(public router: Router,
    public _snackBar: MatSnackBar,
    public dialog: MatDialog,
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
    super(router,_snackBar, confirmService, _adapter, mediaObserver, fb, entetePVService, categoriePieceService, communeService,documentTypeService,  attributionSourceService,arrondissementService);

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

   this.typeDocuments=this.processus.typeDocuments;
    this.arrondissementRemoteAutocomplete= new RemoteAutocompleteArrondissementZoneCompetence<ArrondissementAutocomplete>();
    this.categorieIdentiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.categoriePieceService);
    this.cessionSourceRemoteAutocomplte.params.set("type", CessionSourceType.ATTRIBUTION);
    this.cessionSourceRemoteAutocomplte.initializeRemoteAutocompletion(this._onDestroy, this.attributionSourceService);
    this.documentTypeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.documentTypeService);
    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);
    //
    // console.log(this.typeDocuments);

    if (this.entetePV.cessionSource) {
      this.cessionSourceRemoteAutocomplte.listRessource$ = of([this.entetePV.cessionSource]);
      this.cessionSourceRemoteAutocomplte.initialList = [this.entetePV.cessionSource];
    }

    // if (this.entetePV.documentDeSortie) {
    //   this.documentTypeRemoteAutocomplete.listRessource$ = of([this.entetePV.documentDeSortie.documentType]);
    //   this.documentTypeRemoteAutocomplete.initialList = [this.entetePV.documentDeSortie.documentType];
    // }


    this.formulaire.patchValue({
      numero: this.entetePV.numero,
      action: this.transition.code,
      dossier: {
        observation:this.entetePV.observation
      },
      commune: this.entetePV?.arrondissement?.commune?.id,
      arrondissement:this.entetePV?.arrondissement?.id,
      cessionSource: this.entetePV?.cessionSource?.id,
      documentType:this.entetePV.documentDeSortie.documentType,
      documentDeSortie:{
        id: this.entetePV.documentDeSortie?.id,
        numero: this.entetePV.documentDeSortie?.numero,
        libelle: this.entetePV.documentDeSortie?.libelle,
        pieceJointe: this.entetePV.documentDeSortie?.pieceJointe,
        documentType: this.entetePV.documentDeSortie.documentType.id,
        dateDoc: this.entetePV.documentDeSortie?.dateDoc
      }
    });
  this.onChangeCommune(this.entetePV?.arrondissement?.commune)
  }

public onSearchCommune(eventNgSelect) {
    this.communeRemoteAutocomplete.term.next(eventNgSelect.term);
  }


  public categoriePieceProcessus$: CategoriePieceProcessus[] = [];
  public idCategoriePieceListChosen$: number[] = [];
  public changeCategoriePiece(data: CategoriePieceProcessus) {
/*
    this.idCategoriePieceListChosen$ = [];
    for (let i = 0; i < this.pieces.length; i++) {
      let piece = this.pieces.at(i);
      this.idCategoriePieceListChosen$.push(piece.value.categorie);
    }
    let that = this;
    this.categoriePieceProcessus$ = this.transition.categoriePieces.filter((piece) => {
      return (that.idCategoriePieceListChosen$.indexOf(piece.id) < 0);
    });
  */
  }

  public onSearchCategoriePiece(eventNgSelect) {
    this.categorieIdentiteRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  addNewDossierPiece() {
    //if (this.categoriePieceProcessus$.length > 0) {
      super.addNewDossierPiece();
    //}
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
    let { numero, action, dossier,  cessionSource, documentDeSortie ,arrondissement} = this.formulaire.value;

    let tmp = { numero, action, cessionSource, documentDeSortie ,arrondissement};
    let dataPost = { ...dossier, ...tmp };

    this.entetePVService.executer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
      SycadUtils.notifyRemoteInfo("Entete de pv modifié avec succès", this._snackBar);
      this.router.navigate([environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_PV_ATTRIBUTION]);
    },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }
  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_PV_ATTRIBUTION}`]);
  }

}
