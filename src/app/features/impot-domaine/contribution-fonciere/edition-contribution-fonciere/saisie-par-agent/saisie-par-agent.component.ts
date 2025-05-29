import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DossierContributionFonciere } from '@sycadApp/models/impot/contribution-fonciere.model';
import { CategoriePieceProcessus } from '@sycadApp/models/workflow/common/general';
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
import {
  CessionSourceType
} from "@sycadApp/models/workflow/common/attribution-source.model";
import {
  ContribuableService
} from "@sycadApp/services/data-references/system/contribuable.service";

@Component({
  selector: 'app-saisie-par-agent',
  templateUrl: './saisie-par-agent.component.html',
  styleUrls: ['./saisie-par-agent.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaisieParAgentComponent extends TransitionContributionFonciereComponent implements OnInit {

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
    public contribuableService: ContribuableService,
    public exerciceFiscaleService: ExerciceFiscaleService,
    public calendrierFiscaleService: CalendrierFiscaleService,
    public parcelleService: ParcelleService, public mandatService: MandatService) {
    super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver, fb,contributionFonciereService,contribuablePhysiqueService,parcelleService,exerciceFiscaleService,mandatService);

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
    this.exerciceFiscaleRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.exerciceFiscaleService);
    this.calendrierFiscaleRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.calendrierFiscaleService);
    this.exerciceFiscaleRemoteAutocomplete.params.set("etat","OUVERT");
    this.calendrierFiscaleRemoteAutocomplete.params.set("titre","118");


    this.contribuableChoisie = this.contributionFonciere?.contribuable;


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

    this.formulaire.patchValue({
      numero: this.contributionFonciere.numero,
      action: this.transition.code,
      dossier: {
        objet: this.contributionFonciere.objet
      },
      contribuable: this.contributionFonciere?.contribuable?.guid,
      exerciceFiscale: this.contributionFonciere?.exerciceFiscale?.id,
      calendrierFiscale: this.contributionFonciere?.calendrierFiscale?.id,
      valeurDeclare: this.contributionFonciere.valeurDeclare,
      parcelle: this.contributionFonciere?.parcelle?.id
    });



    if (this.contributionFonciere.listPieces) {
      this.contributionFonciere.listPieces.map((piece) => {
        this.pieces.insert(0, this.createDossierPiece(piece));
      });
    }
    this.categoriePieceProcessus$ = this.transition?.categoriePieces;


   //// console.log("parcelle",this.contributionFonciere.parcelle)
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
  public getAttributaireParcelleOccupe(icad: string) {
    this.contribuableService.getContribuableByIcad(icad, CessionSourceType.ATTRIBUTION).subscribe(data => {
      if(data){
        this.formulaire.controls.contribuable.setValue(data.guid);
        this.contribuableChoisie = data;
      }
    });
  }
  changeParcelle(parcelle: any){
    this.contribuableChoisie = null;
    if(parcelle.etatAttribution == "OCCUPE"){
      this.getAttributaireParcelleOccupe(parcelle.icad);
    }
    if(parcelle.etatAttribution == "LIBRE"){
      this.contribuableChoisie = null;
    this.openSnackBar("La parcelle sélectionnée n'a pas encore fait l'objet d'attribution","Ok");
    }
  }
  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }



   this.loadingEvent.emit(true);
    let { dossier, contribuable,exerciceFiscale, calendrierFiscale ,valeurDeclare, parcelle, pieces, action, numero } = this.formulaire.value;
    let tmp = { parcelle,contribuable,exerciceFiscale,calendrierFiscale ,valeurDeclare , pieces, action, numero};
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: "top",
    });
  }



}
