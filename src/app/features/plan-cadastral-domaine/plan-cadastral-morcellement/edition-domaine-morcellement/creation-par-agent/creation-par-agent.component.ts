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
import {FormBuilder} from '@angular/forms';
import {CategoriePieceService} from '@sycadApp/services/data-references/system/categorie-piece.service';
import {BornageDelimitationService} from '@sycadApp/services/bornage/bornage-delimitation.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import {ContribuableService} from '@sycadApp/services/data-references/system/contribuable.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {MandatService} from '@sycadApp/services/workflow/mandat.service';
import {PlanCadastralMorcellementService} from '@sycadApp/services/workflow/common/morcellement.service';
import {PlanCadastralMorcellementElement} from '@sycadApp/models/workflow/cp-morcellement.model';
import {CategoriePieceProcessus} from '@sycadApp/models/workflow/common/general';
import {environment} from '../../../../../../environments/environment';
import { SycadUtils} from '@sycadShared/utils.functions';


@Component({
  selector: 'app-creation-morcellement-par-agent',
  templateUrl: './creation-par-agent.component.html',
  styleUrls: ['./creation-par-agent.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreationParAgentComponent extends TransitionDomaineMorcellementComponent implements OnInit {

  constructor(public dialog: MatDialog,
              public router: Router,
              public _snackBar: MatSnackBar,
              public confirmService: AppConfirmService,
              public _adapter: DateAdapter<any>,
              public mediaObserver: MediaObserver,
              public fb: FormBuilder,
              public categoriePieceService: CategoriePieceService,
              public morcellementService:PlanCadastralMorcellementService,
              public acteurService: ActeursService,
              public contribuableService: ContribuableService,
              public structureService: StructureService,
              public parcelleService: ParcelleService, public mandatService: MandatService)
  {
    super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService,morcellementService,
      acteurService, contribuableService, structureService,parcelleService,mandatService);
  }
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  ngOnInit(): void {
    this._adapter.setLocale("fr");
    this.morcellement = new PlanCadastralMorcellementElement();
    this.categoriePieceProcessus$ = this.processus.categoriePieces;
    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.structureService);
    this.initConfigAutocompleteActeur();
    this.initConfigAutocompleteContribuableBeneficiaire();
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

    let { dossier, acteurExterne, contribuableBeneficiaire, structureBeneficiaire , parcelle, parcelles, pieces } = this.formulaire.value;
    let tmp = { acteurExterne,parcelle,contribuableBeneficiaire, structureBeneficiaire,parcelles , pieces};
    let dataPost = { ...dossier, ...tmp};

 
    this.morcellementService.creer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
        this.openSnackBar("Dossier de morcellement ajouté avec succès", "OK");
        this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MORCELLEMENT]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );

  }

}
