import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {TransitionPlanCadastralMiseAJourLotissementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-mise-a-jour-lotissement/edition-maj-lotissement/transition-maj-lotissement.component';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import { PlanCadastralMAJLotissementElement } from '@sycadApp/models/workflow/maj-lotissement.model';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import {CategoriePieceService} from '@sycadApp/services/data-references/system/categorie-piece.service';
import {PlanCadastralFusionnementService} from '@sycadApp/services/workflow/common/fusionnement.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import {ContribuableService} from '@sycadApp/services/data-references/system/contribuable.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {MandatService} from '@sycadApp/services/workflow/mandat.service';
import {CategoriePieceProcessus} from '@sycadApp/models/workflow/common/general';
import {environment} from '../../../../../../environments/environment';
import {PlanCadastralMiseAjourLotissementService} from '@sycadApp/services/workflow/common/maj-lotissement.service';
import {SycadUtils} from '@sycadShared/utils.functions';
import { RemoteAutocompleteCommuneZoneCompetence } from '@sycadApp/features/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence';
import { CommuneAutocomplete } from '@sycadApp/models/data-references/territoire/commune.model';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';

@Component({
  selector: 'app-creation-maj-lotissement-par-agent',
  templateUrl: './creation-par-agent.component.html',
  styleUrls: ['./creation-par-agent.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreationParAgentComponent extends  TransitionPlanCadastralMiseAJourLotissementComponent implements OnInit {



  public communeRemoteAutocomplete = new RemoteAutocompleteCommuneZoneCompetence<CommuneAutocomplete>();


  constructor(
    public dialog: MatDialog,
    public router: Router,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public communeService: CommunesService,
    public fb: FormBuilder,
    public categoriePieceService: CategoriePieceService,
    public majLotissmentService: PlanCadastralMiseAjourLotissementService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public structureService: StructureService,
    public parcelleService: ParcelleService,
    public mandatService: MandatService
  ) {

    super(router, dialog, _snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService, majLotissmentService,
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
    this.majLotissement = new PlanCadastralMAJLotissementElement();
    this.categoriePieceProcessus$ = this.processus?.categoriePieces;
    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.structureService);
    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);

    this.initConfigAutocompleteActeur();
    this.initConfigAutocompleteActeurPromoteur();

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
  public onSearchCommune(eventNgSelect) {
    this.communeRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }
   // console.log(this.formulaire.value);
    this.loadingEvent.emit(true);
    let { dossier,typeOperation, commune, acteurExterne,promoteurImmobilier, contribuableBeneficiaire, structureBeneficiaire ,
      parcelles, pieces, ilots,
      parcellesAAjouter, sectionsADesactive, parcellesADesactive, ilotsADesactive, parcellesAModifier,
      sectionsAAjouter,sectionsAModifier,
      ilotsAAjouter,ilotsAModifier} = this.formulaire.value;
    let tmp = { typeOperation, commune, acteurExterne,promoteurImmobilier,parcelles,contribuableBeneficiaire,
      structureBeneficiaire , pieces, ilots,
      parcellesAAjouter, sectionsADesactive, parcellesADesactive, ilotsADesactive, parcellesAModifier,
      sectionsAAjouter,sectionsAModifier,
      ilotsAAjouter,ilotsAModifier};
    let dataPost = { ...dossier, ...tmp};
    this.majLotissmentService.creer(dataPost).subscribe(data => {
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

}
