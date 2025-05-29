import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {TransitionPlanCadastralMiseAJourLotissementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-mise-a-jour-lotissement/edition-maj-lotissement/transition-maj-lotissement.component';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import {FormBuilder, Validators} from '@angular/forms';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import { PlanCadastralMiseAjourLotissementService } from '@sycadApp/services/workflow/common/maj-lotissement.service';
import {of} from 'rxjs';
import {environment} from '../../../../../../environments/environment';
import {SycadUtils} from '@sycadShared/utils.functions';
import {MatDialog} from '@angular/material/dialog';
import {CategoriePieceService} from '@sycadApp/services/data-references/system/categorie-piece.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import {ContribuableService} from '@sycadApp/services/data-references/system/contribuable.service';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {MandatService} from '@sycadApp/services/workflow/mandat.service';
import {ActeurAutocomplete} from '@sycadApp/models/data-references/contribuables/acteur.model';
import {CategoriePieceProcessus} from '@sycadApp/models/workflow/common/general';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { RemoteAutocompleteCommuneZoneCompetence } from '@sycadApp/features/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence';
import { CommuneAutocomplete } from '@sycadApp/models/data-references/territoire/commune.model';

@Component({
  selector: 'app-saisie-maj-lotissement-par-agent',
  templateUrl: './saisie-brouilon-par-agent.component.html',
  styleUrls: ['./saisie-brouilon-par-agent.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaisieBrouilonParAgentComponent extends TransitionPlanCadastralMiseAJourLotissementComponent implements OnInit {



  public communeRemoteAutocomplete = new RemoteAutocompleteCommuneZoneCompetence<CommuneAutocomplete>();

  constructor(public dialog: MatDialog,
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
  public mandatService: MandatService)
  {
    super(router, dialog, _snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService, majLotissmentService,
      acteurService, contribuableService, structureService, parcelleService, mandatService);
    this.formulaire.addControl('action',this.fb.control(null, [Validators.required]));
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
    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);

    this.initConfigAutocompleteActeur();
    this.initConfigAutocompleteActeurPromoteur();
    this.contribuableBeneficiaireChoisie = this.majLotissement?.contribuableBeneficiaire;
    this.structureBeneficiaireChoisie = this.majLotissement?.structureBeneficiaire;

    this.communeRemoteAutocomplete.listRessource$ = of([this.majLotissement.commune]);
    this.communeRemoteAutocomplete.initialList = [this.majLotissement.commune];

    if (this.majLotissement?.acteurExterne) {
      let acteurEl: ActeurAutocomplete = new ActeurAutocomplete();

      acteurEl.denomination = this.majLotissement.acteurExterne.denomination;
      acteurEl.guid = this.majLotissement.acteurExterne.guid;
      acteurEl.statusJuridique = this.majLotissement.acteurExterne.statusJuridique.libelle;
      acteurEl.sigle = this.majLotissement.acteurExterne.sigle;
      acteurEl.username = this.majLotissement.acteurExterne.username;
      acteurEl.categorie = this.majLotissement.acteurExterne?.categorie?.libelle;

      this.acteurRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([acteurEl]);
      this.acteurRemoteAutocomplete.initialList = [acteurEl];
    }
    if (this.majLotissement?.promoteurImmobilier) {
      let acteurEl: ActeurAutocomplete = new ActeurAutocomplete();

      acteurEl.denomination = this.majLotissement.promoteurImmobilier?.denomination;
      acteurEl.guid = this.majLotissement.promoteurImmobilier.guid;
      acteurEl.statusJuridique = this.majLotissement.promoteurImmobilier?.statusJuridique.libelle;
      acteurEl.sigle = this.majLotissement.promoteurImmobilier.sigle;
      acteurEl.username = this.majLotissement.promoteurImmobilier.username;
      acteurEl.categorie = this.majLotissement.promoteurImmobilier?.categorie?.libelle;

      this.acteurBeneficiaireRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([acteurEl]);
      this.acteurBeneficiaireRemoteAutocomplete.initialList = [acteurEl];
    }

    this.sectionsChoisies = this.majLotissement.sectionsADesactive;
    this.sectionsAAjouterChoisies = this.majLotissement?.sectionsAAjouter;
    this.sectionsAModifierChoisies = this.majLotissement?.sectionsAModifier;

    this.ilotsChoisies = this.majLotissement.ilotsADesactive;
    this.ilotsChoisiesAajouter = this.majLotissement.ilotsAAjouter;
    this.ilotsChoisiesAModifier = this.majLotissement.ilotsAModifier;

    this.parcellesChoisies = this.majLotissement.parcellesADesactive;
    this.newParcelles = this.majLotissement.parcellesAAjouter;
    this.editParcelles = this.majLotissement.parcellesAModifier;


    this.formulaire.patchValue({
      numero: this.majLotissement.numero,
      action: this.transition.code,
      acteurExterne: this.majLotissement?.acteurExterne?.guid,
      promoteurImmobilier: this.majLotissement?.promoteurImmobilier?.guid,
      typeOperation:this.majLotissement.typeOperation,
      commune:this.majLotissement.commune.id,
      dossier: {
        objet: this.majLotissement.objet,
        dateExterne: this.majLotissement.dateExterne,
        etatDossier: this.majLotissement.etatDossier,
        refExterne: this.majLotissement.refExterne
      },
      contribuableBeneficiaire: this.majLotissement?.contribuableBeneficiaire?.guid,
      structureBeneficiaire: this.majLotissement?.structureBeneficiaire?.id,
      parcellesADesactive: this.majLotissement?.parcellesADesactive?.map(parcelle => parcelle?.id),
      sectionsADesactive: this.majLotissement?.sectionsADesactive?.map(section => section?.id),
      sectionsAAjouter: this.majLotissement?.sectionsAAjouter?.map(section => section?.id),
      sectionsAModifier: this.majLotissement?.sectionsAModifier?.map(section => section?.id),
      sectionsM: this.majLotissement?.sectionsADesactive?.map(section => section?.id),
      ilotsADesactive: this.majLotissement?.ilotsADesactive?.map(ilot => ilot?.id),
      ilotsAAjouter: this.majLotissement?.ilotsAAjouter?.map(ilot => ilot?.id),
      ilotsAModifier: this.majLotissement?.ilotsAModifier?.map(ilot => ilot?.id),
      ilotsM: this.majLotissement?.ilotsAModifier?.map(ilot => ilot?.id),
      parcellesM: this.majLotissement?.parcellesAModifier?.map(parcelle => parcelle?.id)


    });

    if (this.majLotissement.listPieces) {
      this.majLotissement.listPieces.map((piece) => {
        this.pieces.insert(0, this.createDossierPiece(piece));
      });
    }
    this.categoriePieceProcessus$ = this.transition?.categoriePieces;

  }

  public onSearchCommune(eventNgSelect) {
    this.communeRemoteAutocomplete.term.next(eventNgSelect.term);
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
    let { dossier, typeOperation, commune, acteurExterne,promoteurImmobilier, contribuableBeneficiaire, structureBeneficiaire,
      parcelles, pieces, ilots,
      parcellesAAjouter, sectionsADesactive, parcellesADesactive, ilotsADesactive, parcellesAModifier, action, numero,
      sectionsAAjouter,sectionsAModifier,
      ilotsAAjouter,ilotsAModifier} = this.formulaire.value;
    let tmp = {typeOperation, commune,  acteurExterne,promoteurImmobilier,parcelles,contribuableBeneficiaire,
      structureBeneficiaire , pieces, ilots,
      parcellesAAjouter, sectionsADesactive, parcellesADesactive, ilotsADesactive, parcellesAModifier, action, numero,
      sectionsAAjouter,sectionsAModifier,
      ilotsAAjouter,ilotsAModifier};
    let dataPost = { ...dossier, ...tmp};
    this.majLotissmentService.executer(dataPost).subscribe(data => {
        this.loadingEvent.emit(false);
        this.openSnackBar("Dossier de mise a jour plan  modifié avec succès", "OK");
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
