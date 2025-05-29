import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormBuilder } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';
import {CategoriePieceProcessus, MandatElem, MandatElement} from '@sycadApp/models/workflow/common/general';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { MandatsService } from '@sycadApp/services/workflow/mandats.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { environment } from 'environments/environment';
import { TransitionMandatComponent } from '../transition-mandat.component';

@Component({
  selector: 'app-creer-par-contribuable',
  templateUrl: './creer-par-contribuable.component.html',
  styleUrls: ['./creer-par-contribuable.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreerParContribuableComponent extends TransitionMandatComponent implements OnInit {
  @Input("authentificatedUser")
  public authentificatedUser: AuthentificatedUser;

  public guidProprietaire: string;
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

    this._adapter.setLocale("fr");
    this.mandat = new MandatElem();
    this.categoriePieceProcessus$ = this.processus.categoriePieces;
    this.initConfigAutocompleteMandant();
    this.initConfigAutocompleteMandataire();

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
