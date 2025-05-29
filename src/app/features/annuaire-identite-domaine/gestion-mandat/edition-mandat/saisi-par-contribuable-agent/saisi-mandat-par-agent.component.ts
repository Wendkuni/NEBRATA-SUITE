import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
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
import { of } from 'rxjs';
import { TransitionMandatComponent } from '../transition-mandat.component';

@Component({
  selector: 'app-saisi-mandat-par-agent',
  templateUrl: './saisi-mandat-par-agent.component.html',
  styleUrls: ['./saisi-mandat-par-agent.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaisiMandatParAgentComponent extends TransitionMandatComponent implements OnInit {
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
              public contribuableService: ContribuableService,
              public professionService: ProfessionService,
              public mandatService: MandatsService) {
    super(router, dialog,_snackBar, confirmService,_adapter,fb, mediaObserver,contribuableService,professionService,categoriePieceService,mandatService);
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

    this.guidProprietaire=this.authentificatedUser.guid;
    this.initConfigAutocompleteMandant();
    this.initConfigAutocompleteMandataire();

    this.categorieIdentiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.categoriePieceService);

    if(this.mandat.mandat.mandataire){
      this.mandataireRemoteAutocomplete.customNgSelectConfig.listRessource$=of([this.mandat.mandat.mandataire]);
      this.mandataireRemoteAutocomplete.initialList=[this.mandat.mandat.mandataire];
      this.mandataireChoisie = this.mandat.mandat.mandataire;
    }

    if(this.mandat.mandat.mandant){
      this.mandantRemoteAutocomplete.customNgSelectConfig.listRessource$=of([this.mandat.mandat.mandant]);
      this.mandantRemoteAutocomplete.initialList=[this.mandat.mandat.mandant];
      this.mandantChoisie = this.mandat.mandat.mandant;
    }
    
    if (this.mandat.listPieces) {
      this.mandat.listPieces.map((piece) => {
        this.pieces.insert(0, this.createDossierPiece(piece));
      });
    }


    this.categoriePieceProcessus$ = this.transition.categoriePieces;
    this.mandatF = this.fb.group({
      id:this.mandat.mandat.id,
      actif:this.mandat.mandat.actif,
      objet:this.mandat.mandat.objet,
      pieceJointe: this.mandat.mandat.pieceJointe,
      reference:this.mandat.mandat.reference,
      description: this.mandat.mandat.description,
      debut: this.mandat.mandat.debut,
      fin:this.mandat.mandat.fin,
      mandataire: this.mandat.mandat.mandataire.guid,
      mandant: this.mandat.mandat.mandant.guid
    });

    this.formulaire.patchValue({
      numero: this.mandat.numero,
      action: this.transition.code,
      dossier: {
        objet: this.mandat.objet,
        dateExterne: this.mandat.dateExterne,
        etatDossier: this.mandat.etatDossier,
        refExterne: this.mandat.refExterne
      },
      mandat:{
        id:this.mandat.mandat.id,
        actif:this.mandat.mandat.actif,
        objet:this.mandat.mandat.objet,
        libelle:this.mandat.mandat.libelle,
        pieceJointe: this.mandat.mandat.pieceJointe,
        reference:this.mandat.mandat.reference,
        description: this.mandat.mandat.description,
        debut: this.mandat.mandat.debut,
        fin:this.mandat.mandat.fin,
        mandataire: this.mandat.mandat.mandataire.guid,
        mandant:this.mandat.mandat.mandant.guid

      }
    });

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
    this.categoriePieceProcessus$ = this.transition.categoriePieces.filter((piece) => {
      return (that.idCategoriePieceListChosen$.indexOf(piece.id) < 0);
    });

  }
  public onSearchCategoriePiece(eventNgSelect) {
    this.categorieIdentiteRemoteAutocomplete.term.next(eventNgSelect.term);
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
    let { dossier,pieces, mandat, action, numero} = this.formulaire.value;

    let tmp = { mandat, pieces, action, numero};
    let dataPost = { ...dossier, ...tmp};

    this.mandatService.executer(dataPost).subscribe(data => {
        this.loadingEvent.emit(false);
        this.openSnackBar("Mandat modifié avec succès", "OK");
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
