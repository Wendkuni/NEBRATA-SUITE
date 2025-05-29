import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {FormBuilder, Validators} from '@angular/forms';
import {CategoriePieceService} from '@sycadApp/services/data-references/system/categorie-piece.service';
import {PlanCadastralFusionnementService} from '@sycadApp/services/workflow/common/fusionnement.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import {ContribuableService} from '@sycadApp/services/data-references/system/contribuable.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {MandatService} from '@sycadApp/services/workflow/mandat.service';
import {TransitionPlanCadastralFusionnement} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-fusion/edition-plan-cadastral-fusion/transition-fusion.component';
import {of} from 'rxjs';
import {CategoriePieceProcessus, Mandat} from '@sycadApp/models/workflow/common/general';
import {AuthentificatedUser} from '@sycadApp/features/transverse/login/auth.user';
import {environment} from '../../../../../../environments/environment';
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-saisie-fusionnement-par-contribuable',
  templateUrl: './saisie-brouillon-par-contribuable.component.html',
  styleUrls: ['./saisie-brouillon-par-contribuable.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaisieBrouillonParContribuableComponent extends TransitionPlanCadastralFusionnement implements OnInit {

  @Input('authentificatedUser')
  public authentificatedUser: AuthentificatedUser;

  public guidProprietaire: string;

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
    this.initConfigAutocompleteMandat();
    this.contribuableBeneficiaireChoisie = this.fusion?.contribuableBeneficiaire;
    this.mandatChoisie = this.fusion.mandats[0];

    this.guidProprietaire=this.authentificatedUser.guid;
    if (this.fusion.mandats) {
      this.mandatRemoteAutocomplete.customNgSelectConfig.listRessource$ = of(this.fusion.mandats);
      this.mandatRemoteAutocomplete.initialList = this.fusion.mandats;
    }
    this.parcellesChoisies = this.fusion.parcelles;
    this.formulaire.patchValue({
      numero: this.fusion.numero,
      action: this.transition.code,
      mandat: this.fusion?.mandats[0]?.id,
      dossier: {
        objet: this.fusion.objet,
        dateExterne: this.fusion.dateExterne,
        etatDossier: this.fusion.etatDossier,
        refExterne: this.fusion.refExterne
      },
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

  receiveSubjectMandat(mandat: Mandat) {
    this.mandatChoisie= mandat;
    if(mandat) {
      this.contribuableBeneficiaireChoisie=mandat.mandant;
      this.guidProprietaire=mandat.mandant.guid;
    }else {
      this.contribuableBeneficiaireChoisie=null;
      this.guidProprietaire=this.authentificatedUser.guid;

    }
    this.parcellesChoisies=null;
    this.parcelles.setValue(null);
  }

  onSubmit(){
    if (!this.formulaire.valid) {
      return false;
    }
    this.loadingEvent.emit(true);
    let { dossier , parcelle,parcelles, pieces, mandat, numero, action} = this.formulaire.value;


    let mandats= (mandat)?[{
      id:mandat
    }]:null;
    let tmp = { parcelle ,parcelles, pieces, mandats, numero, action};
    let dataPost = { ...dossier, ...tmp};


    this.fusionService.executer(dataPost).subscribe(data => {
        this.loadingEvent.emit(false);
        this.openSnackBar("Dossier de morcellement modifié avec succès", "OK");
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
