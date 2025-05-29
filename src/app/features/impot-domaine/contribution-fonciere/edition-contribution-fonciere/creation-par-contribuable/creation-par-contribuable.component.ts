import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';
import { DossierContributionFonciere } from '@sycadApp/models/impot/contribution-fonciere.model';
import { CategoriePieceProcessus, Mandat } from '@sycadApp/models/workflow/common/general';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { ContribuablePhysiqueService } from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';
import { CalendrierFiscaleService } from '@sycadApp/services/impot/calendrier-fiscale.service';
import { ContributionFonciereService } from '@sycadApp/services/impot/contribution-fonciere.service';
import { ExerciceFiscaleService } from '@sycadApp/services/impot/exercice-fiscale.service';
import { MandatService } from '@sycadApp/services/workflow/mandat.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { environment } from 'environments/environment';
import { TransitionContributionFonciereComponent } from '../transition-contribution-fonciere.component';

@Component({
  selector: 'app-creation-par-contribuable',
  templateUrl: './creation-par-contribuable.component.html',
  styleUrls: ['./creation-par-contribuable.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreationParContribuableComponent extends TransitionContributionFonciereComponent implements OnInit {


  @Input("authentificatedUser")
  public authentificatedUser: AuthentificatedUser;

  
  constructor(
    public dialog: MatDialog,
    public router: Router,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public contributionFonciereService: ContributionFonciereService,
    public contribuablePhysiqueService: ContribuablePhysiqueService,
    public exerciceFiscaleService: ExerciceFiscaleService,
    public calendrierFiscaleService: CalendrierFiscaleService,
    public parcelleService: ParcelleService, public mandatService: MandatService) {
    super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver, fb,contributionFonciereService,contribuablePhysiqueService,parcelleService,exerciceFiscaleService,mandatService);
  }

  public guidProprietaire: string;
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  ngOnInit(): void {
    this._adapter.setLocale("fr");

    this.contributionFonciere = new DossierContributionFonciere();


    this.categoriePieceProcessus$ = this.processus.categoriePieces;
    this.initConfigAutocompleteMandat();

    this.exerciceFiscaleRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.exerciceFiscaleService);
    this.calendrierFiscaleRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.calendrierFiscaleService);
    this.guidProprietaire=this.authentificatedUser.guid;

    this.exerciceFiscaleRemoteAutocomplete.params.set("etat","OUVERT");
    this.calendrierFiscaleRemoteAutocomplete.params.set("titre","118");
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
    this.mandatChoisie= mandat;
    if(mandat) {
      this.contribuableChoisie=mandat.mandant;
      this.guidProprietaire=mandat.mandant.guid;
    }else {
     this.contribuableChoisie=null;
     this.guidProprietaire=this.authentificatedUser.guid;
   
    }
    this.parcelleChoisie=null;
    this.parcelle.setValue(null);
 }


  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }
   
   

   this.loadingEvent.emit(true);
    let { dossier, contribuable,exerciceFiscale,calendrierFiscale ,valeurDeclare , parcelle, pieces,mandat } = this.formulaire.value;

    let mandats=[{
      id:mandat
    }];
    let tmp = { parcelle,contribuable,exerciceFiscale,calendrierFiscale ,valeurDeclare , pieces,mandats};

  
    let dataPost = { ...dossier, ...tmp};
    this.contributionFonciereService.creer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
      this.openSnackBar("Contribuable foncière ajoutée avec succès", "OK");
      this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_CONTRIBUTION_FONCIERE]);
    },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }





}
