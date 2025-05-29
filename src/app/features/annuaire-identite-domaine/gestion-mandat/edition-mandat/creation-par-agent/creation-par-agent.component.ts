import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {TransitionMandatComponent} from '@sycadApp/features/annuaire-identite-domaine/gestion-mandat/edition-mandat/transition-mandat.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {FormBuilder} from '@angular/forms';
import {CategoriePieceService} from '@sycadApp/services/data-references/system/categorie-piece.service';
import {ContribuableService} from '@sycadApp/services/data-references/system/contribuable.service';
import {ProfessionService} from '@sycadApp/services/data-references/system/profession.service';
import {MandatsService} from '@sycadApp/services/workflow/mandats.service';
import {CategoriePieceProcessus, MandatElem} from '@sycadApp/models/workflow/common/general';
import {environment} from '../../../../../../environments/environment';
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-creation-mandat-par-agent',
  templateUrl: './creation-par-agent.component.html',
  styleUrls: ['./creation-par-agent.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreationParAgentComponent extends TransitionMandatComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public categoriePieceService: CategoriePieceService,
    public contribuableService: ContribuableService,
    public professionService: ProfessionService,
    public mandatService: MandatsService)
  {
    super(router, dialog,_snackBar, confirmService,_adapter,fb, mediaObserver,contribuableService,professionService,categoriePieceService,mandatService);
  }
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  ngOnInit(): void {
    //console.log('agent');
    this._adapter.setLocale("fr");
    this.mandat = new MandatElem();
    this.categoriePieceProcessus$ = this.processus.categoriePieces;
    this.initConfigAutocompleteMandant();
    this.initConfigAutocompleteMandataire();
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

    let { dossier,pieces, mandat} = this.formulaire.value;

    let tmp = { mandat, pieces};
    let dataPost = { ...dossier, ...tmp};
    this.mandatService.creer(dataPost).subscribe(data => {
        this.loadingEvent.emit(false);
        this.openSnackBar("Dossier de mandat ajouté avec succès", "OK");
        this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_MANDAT]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }
  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_MANDAT}`]);
  }

}
