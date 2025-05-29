import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {TransitionPlanCadastralFusionnement} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-fusion/edition-plan-cadastral-fusion/transition-fusion.component';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import {FormBuilder, Validators} from '@angular/forms';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { PlanCadastralFusionnementService } from '@sycadApp/services/workflow/common/fusionnement.service';
import {of} from 'rxjs';
import {environment} from '../../../../../../environments/environment';
import {SycadUtils} from '@sycadShared/utils.functions';
import {MatDialog} from "@angular/material/dialog";
import {CategoriePieceService} from "@sycadApp/services/data-references/system/categorie-piece.service";
import {ActeursService} from "@sycadApp/services/data-references/contribuables/acteurs.service";
import {ContribuableService} from "@sycadApp/services/data-references/system/contribuable.service";
import {StructureService} from "@sycadApp/services/data-references/organigramme/structure.service";
import {ParcelleService} from "@sycadApp/services/cession-parcelle/parcelle.service";
import {MandatService} from "@sycadApp/services/workflow/mandat.service";
import {ActeurAutocomplete} from '@sycadApp/models/data-references/contribuables/acteur.model';
import {CategoriePieceProcessus} from '@sycadApp/models/workflow/common/general';



@Component({
  selector: 'app-saisie-fusionnement-par-agent',
  templateUrl: './saisie-brouillon-par-agent.component.html',
  styleUrls: ['./saisie-brouillon-par-agent.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaisieBrouillonParAgentComponent extends TransitionPlanCadastralFusionnement implements OnInit {

  constructor(public dialog: MatDialog,
              public router: Router,
              public _snackBar: MatSnackBar,
              public confirmService: AppConfirmService,
              public _adapter: DateAdapter<any>,
              public mediaObserver: MediaObserver,
              public fb: FormBuilder,
              public categoriePieceService: CategoriePieceService,
              public fusionService: PlanCadastralFusionnementService,
              public acteurService: ActeursService,
              public contribuableService: ContribuableService,
              public structureService: StructureService,
              public parcelleService: ParcelleService,
              public mandatService: MandatService
  ) {
    super(router, dialog, _snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService, fusionService,
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
    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.structureService);
    this.initConfigAutocompleteActeur();
    this.initConfigAutocompleteContribuableBeneficiaire();
    this.contribuableBeneficiaireChoisie = this.fusion?.contribuableBeneficiaire;
    this.structureBeneficiaireChoisie = this.fusion?.structureBeneficiaire;
    if (this.fusion.acteurExterne) {
      let acteurEl: ActeurAutocomplete = new ActeurAutocomplete();

      acteurEl.denomination = this.fusion.acteurExterne.denomination;
      acteurEl.guid = this.fusion.acteurExterne.guid;
      acteurEl.statusJuridique = this.fusion.acteurExterne.statusJuridique.libelle;
      acteurEl.sigle = this.fusion.acteurExterne.sigle;
      acteurEl.username = this.fusion.acteurExterne.username;
      acteurEl.categorie = this.fusion.acteurExterne?.categorie?.libelle;

      this.acteurRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([acteurEl]);
      this.acteurRemoteAutocomplete.initialList = [acteurEl];
    }

    if (this.fusion.contribuableBeneficiaire) {
      this.contribuableBeneficiaireRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([this.fusion.contribuableBeneficiaire]);
      this.contribuableBeneficiaireRemoteAutocomplete.initialList = [this.fusion.contribuableBeneficiaire];
    }
    if (this.fusion.structureBeneficiaire) {
      this.structureRemoteAutocomplete.listRessource$ = of([this.fusion.structureBeneficiaire]);
      this.structureRemoteAutocomplete.initialList = [this.fusion.structureBeneficiaire];
    }
    this.parcellesChoisies = this.fusion.parcelles;
    this.formulaire.patchValue({
      numero: this.fusion.numero,
      action: this.transition.code,
      acteurExterne: this.fusion?.acteurExterne?.guid,
      dossier: {
        objet: this.fusion.objet,
        dateExterne: this.fusion.dateExterne,
        etatDossier: this.fusion.etatDossier,
        refExterne: this.fusion.refExterne
      },
      contribuableBeneficiaire: this.fusion?.contribuableBeneficiaire?.guid,
      structureBeneficiaire: this.fusion?.structureBeneficiaire?.id,
      parcelles: this.fusion?.parcelles?.map(parcelle => parcelle?.id),
      parcelle: this.fusion?.parcelle.id
    });

    if (this.fusion.listPieces) {
      this.fusion.listPieces.map((piece) => {
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
    let { dossier, acteurExterne, contribuableBeneficiaire, structureBeneficiaire ,parcelles, pieces, action, numero, parcelle } = this.formulaire.value;
    let tmp = { acteurExterne, contribuableBeneficiaire, structureBeneficiaire , pieces, action, numero, parcelles, parcelle};
    let dataPost = { ...dossier, ...tmp};


    this.fusionService.executer(dataPost).subscribe(data => {
        this.loadingEvent.emit(false);
        this.openSnackBar("Dossier de fusion  modifiée avec succès", "OK");
        this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_FUSION]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );

  }
  resetForm() {
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_FUSION}`]);
  }


}
