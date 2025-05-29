import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {FormBuilder} from '@angular/forms';
import {CategoriePieceService} from '@sycadApp/services/data-references/system/categorie-piece.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import {ContribuableService} from '@sycadApp/services/data-references/system/contribuable.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {MandatService} from '@sycadApp/services/workflow/mandat.service';
import {CategoriePieceProcessus} from '@sycadApp/models/workflow/common/general';

import {SycadUtils} from '@sycadShared/utils.functions';
import { TransitionSdMajPlanComponent } from '../transition-sd-maj-plan.component';
import { environment } from 'environments/environment';
import { PlanCadastralRegularisationElement } from '@sycadApp/models/workflow/regularisation.model';
import { SdMajService } from '@sycadApp/services/workflow/common/regularisation.service';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import {
  CommuneAutocomplete
} from "@sycadApp/models/data-references/territoire/commune.model";
import {
  ArrondissementElement
} from "@sycadApp/models/data-references/territoire/arrondissement.model";


@Component({
  selector: 'pc-creation-sd-maj',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreationSdMajPlanComponent extends  TransitionSdMajPlanComponent implements OnInit {
  communeAuto: CommuneAutocomplete;
  constructor(
    public dialog: MatDialog,
    public router: Router,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public communeService: CommunesService,
    public categoriePieceService: CategoriePieceService,
    public sdMajService: SdMajService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public structureService: StructureService,
    public parcelleService: ParcelleService,
    public mandatService: MandatService,
  ) {

    super(router, dialog, _snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService, sdMajService,
      acteurService, contribuableService, structureService, parcelleService, mandatService);

  }
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  ngOnInit(): void {

    this._adapter.setLocale("fr");
    this.sdMaj = new PlanCadastralRegularisationElement();
    this.categoriePieceProcessus$ = this.processus?.categoriePieces;
    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.structureService);
    this.initConfigAutocompleteActeur();
    this.initConfigAutocompleteActeurPromoteur();
    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);

  }
  updateArrondissement(value: number) {
    this.arrondissement.setValue(value);
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
    let { dossier, acteurExterne,typeOperation,commune,arrondissement,promoteurImmobilier,  contribuableBeneficiaire,
       structureBeneficiaire , parcelles, pieces, ilots, parcellesAAjouter,
       parcellesADesactive, ilotsADesactive, parcellesAModifier,
       ilotsAAjouter,ilotsAModifier } = this.formulaire.value;

    let tmp = {  acteurExterne,typeOperation,commune,arrondissement,promoteurImmobilier,parcelles, contribuableBeneficiaire,
        structureBeneficiaire , pieces, ilots, parcellesAAjouter,
        parcellesADesactive, ilotsADesactive, parcellesAModifier,ilotsAAjouter,ilotsAModifier};

    let dataPost = { ...dossier, ...tmp};
    this.sdMajService.creer(dataPost).subscribe(data => {
        this.loadingEvent.emit(false);
        this.openSnackBar("Dossier de mise a jour plan  ajouté avec succès", "OK");
        this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MAJ_PLAN_CADASTRE]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );
  }

  resetForm(){
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MAJ_PLAN_CADASTRE}`]);

  }
  public onChangeCommune(commune: CommuneAutocomplete) {
    this.communeAuto = commune;
  }

}
