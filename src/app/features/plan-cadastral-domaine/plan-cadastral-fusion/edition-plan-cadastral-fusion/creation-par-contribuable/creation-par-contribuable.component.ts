import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {TransitionPlanCadastralFusionnement} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-fusion/edition-plan-cadastral-fusion/transition-fusion.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {FormBuilder} from '@angular/forms';
import {CategoriePieceService} from '@sycadApp/services/data-references/system/categorie-piece.service';
import {PlanCadastralFusionnementService} from '@sycadApp/services/workflow/common/fusionnement.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import {ContribuableService} from '@sycadApp/services/data-references/system/contribuable.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {MandatService} from '@sycadApp/services/workflow/mandat.service';
import {PlanCadastralFusionementElement} from '@sycadApp/models/workflow/cp-fusionnement.model';
import {CategoriePieceProcessus, Mandat} from '@sycadApp/models/workflow/common/general';
import {AuthentificatedUser} from '@sycadApp/features/transverse/login/auth.user';
import {environment} from '../../../../../../environments/environment';
import {SycadUtils} from '@sycadShared/utils.functions';


@Component({
  selector: 'app-creation-fusionnement-par-contribuable',
  templateUrl: './creation-par-contribuable.component.html',
  styleUrls: ['./creation-par-contribuable.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreationParContribuableComponent extends TransitionPlanCadastralFusionnement implements OnInit {

  @Input("authentificatedUser")
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
              public mandatService: MandatService) {
    super(router, dialog, _snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService, fusionService,
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
    this.fusion = new PlanCadastralFusionementElement();

    this.categoriePieceProcessus$ = this.processus.categoriePieces;
    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.structureService);
    this.initConfigAutocompleteContribuableBeneficiaire();
    this.initConfigAutocompleteMandat();


    this.guidProprietaire=this.authentificatedUser.guid;
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
  receiveSubjectMandat(mandat: Mandat) {
    this.mandatChoisie = mandat;
    if (mandat) {
      this.contribuableBeneficiaireChoisie = mandat.mandant;
      this.guidProprietaire = mandat.mandant.guid;
    }else {
      this.contribuableBeneficiaireChoisie = null;
      this.guidProprietaire = this.authentificatedUser.guid;

    }
    this.parcellesChoisies = null;
    this.parcelles.setValue(null);
  }


  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }
    this.loadingEvent.emit(true);

    let { dossier ,parcelles, pieces, mandat} = this.formulaire.value;
    let mandats=[{
      id:mandat
    }];
    let tmp = { parcelles, pieces, mandats};
    let dataPost = { ...dossier, ...tmp};
    this.fusionService.creer(dataPost).subscribe(data => {
        this.loadingEvent.emit(false);
        this.openSnackBar("Dossier de fusion ajouté avec succès", "OK");
        this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_FUSION]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }

}
