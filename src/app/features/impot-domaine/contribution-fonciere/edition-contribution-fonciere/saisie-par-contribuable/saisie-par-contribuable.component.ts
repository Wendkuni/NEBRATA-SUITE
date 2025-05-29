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
import { of } from 'rxjs';
import { TransitionContributionFonciereComponent } from '../transition-contribution-fonciere.component';

@Component({
  selector: 'app-saisie-par-contribuable',
  templateUrl: './saisie-par-contribuable.component.html',
  styleUrls: ['./saisie-par-contribuable.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaisieParContribuableComponent extends TransitionContributionFonciereComponent implements OnInit {


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
  
    this.formulaire.addControl('action', this.fb.control(null, [Validators.required]));
    this.formulaire.addControl('numero', this.fb.control(null, [Validators.required]));
  }

  
  public guidProprietaire: string;
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  ngOnInit(): void {
    this._adapter.setLocale('fr');
    this.exerciceFiscaleRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.exerciceFiscaleService);
    this.exerciceFiscaleRemoteAutocomplete.params.set("etat","OUVERT");
    this.calendrierFiscaleRemoteAutocomplete.params.set("titre","118");

    this.calendrierFiscaleRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.calendrierFiscaleService);
    
    if(this.contributionFonciere.mandats) {
      this.mandatChoisie = this.contributionFonciere.mandats[0];
      this.contribuableChoisie = this.contributionFonciere?.contribuable;
    }
    
    this.guidProprietaire=this.contributionFonciere?.contribuable.guid;
 
   
  
 
    if (this.contributionFonciere.contribuable) {
      this.contribuableRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([this.contributionFonciere.contribuable]);
      this.contribuableRemoteAutocomplete.initialList = [this.contributionFonciere.contribuable];
    }
    if (this.contributionFonciere.exerciceFiscale) {
      this.exerciceFiscaleRemoteAutocomplete.listRessource$ = of([this.contributionFonciere.exerciceFiscale]);
      this.exerciceFiscaleRemoteAutocomplete.initialList = [this.contributionFonciere.exerciceFiscale];
    }

    if (this.contributionFonciere.calendrierFiscale) {
      this.calendrierFiscaleRemoteAutocomplete.listRessource$ = of([this.contributionFonciere.calendrierFiscale]);
      this.calendrierFiscaleRemoteAutocomplete.initialList = [this.contributionFonciere.calendrierFiscale];
    }

    if (this.contributionFonciere.mandats) {
      this.mandatRemoteAutocomplete.customNgSelectConfig.listRessource$ = of(this.contributionFonciere.mandats);
      this.mandatRemoteAutocomplete.initialList = this.contributionFonciere.mandats;
    }

    this.formulaire.patchValue({
      numero: this.contributionFonciere.numero,
      action: this.transition.code,
      dossier: {
        objet: this.contributionFonciere.objet
      },
      mandat: this.contributionFonciere?.mandats[0]?.id,
      contribuable: this.contributionFonciere?.contribuable?.guid,
      calendrierFiscale: this.contributionFonciere?.calendrierFiscale?.id,
      valeurDeclare: this.contributionFonciere.valeurDeclare,
      exerciceFiscale: this.contributionFonciere?.exerciceFiscale?.id,
      parcelle: this.contributionFonciere?.parcelle?.id
    });

 

    if (this.contributionFonciere.listPieces) {
      this.contributionFonciere.listPieces.map((piece) => {
        this.pieces.insert(0, this.createDossierPiece(piece));
      });
    }
    this.categoriePieceProcessus$ = this.transition?.categoriePieces;

    this.initConfigAutocompleteMandat();

//// console.log("contributionFonciere",this.contributionFonciere)
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
    let { dossier, contribuable,exerciceFiscale,calendrierFiscale ,valeurDeclare, parcelle, pieces, action, numero,mandat } = this.formulaire.value;

    let mandats=[{
      id:mandat
    }];

    let tmp = { parcelle,contribuable,exerciceFiscale ,calendrierFiscale,valeurDeclare, pieces, action, numero,mandats};
    let dataPost = { ...dossier, ...tmp};
    this.contributionFonciereService.executer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
      this.openSnackBar("Contribuable foncière mise à jour avec succès", "OK");
      this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_CONTRIBUTION_FONCIERE]);
    },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }





}

