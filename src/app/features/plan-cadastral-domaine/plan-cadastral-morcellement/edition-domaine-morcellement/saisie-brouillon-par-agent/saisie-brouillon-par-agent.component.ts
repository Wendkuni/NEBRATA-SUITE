import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {TransitionDomaineMorcellementComponent} from '@sycadApp/features/plan-cadastral-domaine/plan-cadastral-morcellement/edition-domaine-morcellement/transition-domaine-morcellement.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import {FormBuilder, Validators} from '@angular/forms';
import {CategoriePieceService} from '@sycadApp/services/data-references/system/categorie-piece.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import {ContribuableService} from '@sycadApp/services/data-references/system/contribuable.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {MandatService} from '@sycadApp/services/workflow/mandat.service';
import {PlanCadastralMorcellementService} from '@sycadApp/services/workflow/common/morcellement.service';
import {ActeurAutocomplete} from '@sycadApp/models/data-references/contribuables/acteur.model';
import {of} from 'rxjs';
import {CategoriePieceProcessus} from '@sycadApp/models/workflow/common/general';
import {environment} from '../../../../../../environments/environment';
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-saisie-brouillon-par-agent',
  templateUrl: './saisie-brouillon-par-agent.component.html',
  styleUrls: ['./saisie-brouillon-par-agent.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaisieBrouillonParAgentComponent extends TransitionDomaineMorcellementComponent implements OnInit {

  constructor(public dialog: MatDialog,
              public router: Router,
              public _snackBar: MatSnackBar,
              public confirmService: AppConfirmService,
              public _adapter: DateAdapter<any>,
              public mediaObserver: MediaObserver,
              public fb: FormBuilder,
              public categoriePieceService: CategoriePieceService,
              public morcellementService: PlanCadastralMorcellementService,
              public acteurService: ActeursService,
              public contribuableService: ContribuableService,
              public structureService: StructureService,
              public parcelleService: ParcelleService, public mandatService: MandatService) {
    super(router, dialog, _snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService, morcellementService,
      acteurService, contribuableService, structureService, parcelleService, mandatService);
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
    this.contribuableBeneficiaireChoisie = this.morcellement?.contribuableBeneficiaire;
    this.structureBeneficiaireChoisie = this.morcellement?.structureBeneficiaire;
    if (this.morcellement.acteurExterne) {
      let acteurEl: ActeurAutocomplete = new ActeurAutocomplete();

      acteurEl.denomination = this.morcellement.acteurExterne.denomination;
      acteurEl.guid = this.morcellement.acteurExterne.guid;
      acteurEl.statusJuridique = this.morcellement.acteurExterne.statusJuridique.libelle;
      acteurEl.sigle = this.morcellement.acteurExterne.sigle;
      acteurEl.username = this.morcellement.acteurExterne.username;
      acteurEl.categorie = this.morcellement.acteurExterne?.categorie?.libelle;

      this.acteurRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([acteurEl]);
      this.acteurRemoteAutocomplete.initialList = [acteurEl];
    }

    if (this.morcellement.contribuableBeneficiaire) {
      this.contribuableBeneficiaireRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([this.morcellement.contribuableBeneficiaire]);
      this.contribuableBeneficiaireRemoteAutocomplete.initialList = [this.morcellement.contribuableBeneficiaire];
    }
    if (this.morcellement.structureBeneficiaire) {
      this.structureRemoteAutocomplete.listRessource$ = of([this.morcellement.structureBeneficiaire]);
      this.structureRemoteAutocomplete.initialList = [this.morcellement.structureBeneficiaire];
    }
    this.parcelleChoisie=this.morcellement.parcelle;
    this.formulaire.patchValue({
      numero: this.morcellement.numero,
      action: this.transition.code,
      acteurExterne: this.morcellement?.acteurExterne?.guid,
      dossier: {
        objet: this.morcellement.objet,
        dateExterne: this.morcellement.dateExterne,
        etatDossier: this.morcellement.etatDossier,
        refExterne: this.morcellement.refExterne
      },
      contribuableBeneficiaire: this.morcellement?.contribuableBeneficiaire?.guid,
      structureBeneficiaire: this.morcellement?.structureBeneficiaire?.id,
      parcelle: this.morcellement?.parcelle?.id
    });

    if (this.morcellement.listPieces) {
      this.morcellement.listPieces.map((piece) => {
        this.pieces.insert(0, this.createDossierPiece(piece));
      });
    }
    this.categoriePieceProcessus$ = this.transition?.categoriePieces;


    if (this.morcellement?.parcelles) {
      this.morcellement.parcelles.map((parcelle) => {
        this.parcelles.insert(0, this.createParcelle(parcelle));
      });
    }
    
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
    let { dossier, acteurExterne, contribuableBeneficiaire, structureBeneficiaire , parcelle,parcelles, pieces, action, numero } = this.formulaire.value;
    let tmp = { acteurExterne,parcelle,contribuableBeneficiaire, structureBeneficiaire ,parcelles, pieces, action, numero};
    let dataPost = { ...dossier, ...tmp};

    
    this.morcellementService.executer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
        this.openSnackBar("Morcellement modifiée avec succès", "OK");
        this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MORCELLEMENT]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );
  }

  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MORCELLEMENT}`]);
  }

}
