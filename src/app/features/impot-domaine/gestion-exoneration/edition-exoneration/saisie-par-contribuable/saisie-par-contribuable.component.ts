import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';
import { GeneralContribuable } from '@sycadApp/models/data-references/contribuables/global.model';
import { ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';
import { ExonerationCategorie } from '@sycadApp/models/evaluation/exoneration-categorie.model';
import { NatureImpot } from '@sycadApp/models/impot/nature-impot.model';
import { CategoriePieceProcessus } from '@sycadApp/models/workflow/common/general';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { ExonerationCategorieService } from '@sycadApp/services/evaluation/exoneration-categorie.service';
import { ExonerationService } from '@sycadApp/services/impot/exoneration.service';
import { NatureImpotService } from '@sycadApp/services/impot/nature-impot.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { AdvancedRemoteAutocomplete } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/advanced-remote-autocomplete';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { environment } from 'environments/environment';
import { of } from 'rxjs';
import { TransitionExonerationComponent } from '../transition-exoneration.component';

@Component({
  selector: 'app-saisie-par-contribuable',
  templateUrl: './saisie-par-contribuable.component.html',
  styleUrls: ['./saisie-par-contribuable.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaisieParContribuableComponent extends TransitionExonerationComponent   implements OnInit {
  @Input("authentificatedUser")
  public authentificatedUser: AuthentificatedUser;
 
  public guidProprietaire: string;
  public documentPiece: string;
  public parcelleRemoteAutocomplete = new RemoteAutocomplete<ParcelleElement>();
  public contribuableRemoteAutocomplete = new AdvancedRemoteAutocomplete<GeneralContribuable>();
  public natureImpotRemoteAutocomplete = new RemoteAutocomplete<NatureImpot>();
  public categorieRemoteAutocomplete = new RemoteAutocomplete<ExonerationCategorie>();
  constructor(public router: Router,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public exonerationService: ExonerationService,
    public exonerationCategorieService: ExonerationCategorieService,
    public natureImpotService: NatureImpotService,
    public contribuableService: ContribuableService,
    public professionService: ProfessionService,
    public categoriePieceService: CategoriePieceService,
    public parcelleService: ParcelleService) {
      super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver,fb, exonerationService,exonerationCategorieService,natureImpotService,contribuableService, professionService,categoriePieceService,parcelleService);
      this.formulaire.addControl("action", this.fb.control(null, [Validators.required]));
      this.formulaire.addControl("numero", this.fb.control(null, [Validators.required]));
  }
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  ngOnInit(): void {
    this._adapter.setLocale("fr");
    this.guidProprietaire=this.authentificatedUser.guid;

   // this.initConfigAutocompleteContribuable();
   // this.initConfigAutocompleteContribuableBeneficiaire();

    if (this.exonerationDossier.listPieces) {
      this.exonerationDossier.listPieces.map((piece) => {
        this.pieces.insert(0, this.createDossierPiece(piece));
      });
    }

    this.contribuable.valueChanges.subscribe(x=>{
      if(x){
        this.parcelle.reset();
      }
    });
    this.parcelle.valueChanges.subscribe(x=>{
      if(x){
        this.contribuable.reset();
      }
    });

    this.montant.valueChanges.subscribe(x=>{
      if(x){
        this.taux.reset();
      }
    });
    this.taux.valueChanges.subscribe(x=>{
      if(x){
        this.montant.reset();
      }
    });
    this.categoriePieceProcessus$ = this.transition.categoriePieces;

    if(this.exonerationDossier.exoneration.natureImpot){
      this.natureImpotRemoteAutocomplete.listRessource$=of([this.exonerationDossier.exoneration.natureImpot]);
      this.natureImpotRemoteAutocomplete.initialList=[this.exonerationDossier.exoneration.natureImpot];
    }
    if(this.exonerationDossier.exoneration.categorie){
      this.categorieRemoteAutocomplete.listRessource$=of([this.exonerationDossier.exoneration.categorie]);
      this.categorieRemoteAutocomplete.initialList=[this.exonerationDossier.exoneration.categorie]
    }

    if(this.exonerationDossier.exoneration.parcelle){
      this.exonerationDossier.exoneration.parcelle.arrondissement.commune = this.exonerationDossier.exoneration.parcelle.ilot.section.commune
    }

    if (this.exonerationDossier.exoneration.contribuable) {
      this.contribuableBeneficiaireRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([this.exonerationDossier.exoneration.contribuable]);
      this.contribuableBeneficiaireRemoteAutocomplete.initialList = [this.exonerationDossier.exoneration.contribuable];
      this.contribuableBeneficiaireChoisie =this.exonerationDossier.exoneration.contribuable;
    }

    //
    if(this.exonerationDossier.exoneration?.modifDoc) {
this.documentPiece=this.exonerationDossier.exoneration?.modifDoc;
this.exonerationDossier.exoneration.modifDoc=null;
    }

    this.exonerationF = this.fb.group({
      id: this.exonerationDossier.exoneration.id,
      contribuable: this.exonerationDossier.exoneration?.contribuable?.guid,
      motif: this.exonerationDossier.exoneration.motif,
      observation: this.exonerationDossier.exoneration.observation,
      modifDoc: this.exonerationDossier.exoneration.modifDoc,
      natureImpot: this.exonerationDossier.exoneration?.natureImpot?.id,
      parcelle: this.exonerationDossier.exoneration?.parcelle?.id,
      categorie: this.exonerationDossier.exoneration?.categorie?.id,
      taux: this.exonerationDossier.exoneration.taux,
      montant: this.exonerationDossier.exoneration.montant,
      dateDebut: this.exonerationDossier.exoneration.dateDebut,
      dateFin: this.exonerationDossier.exoneration.dateFin,
      refExterne: this.exonerationDossier.exoneration.refExterne
    });
    this.formulaire.patchValue({
      numero: this.exonerationDossier.numero,
      action: this.transition.code,
      dossier: {
        objet: this.exonerationDossier.objet,
        dateExterne: this.exonerationDossier.dateExterne,
        etatDossier: this.exonerationDossier.etatDossier,
        refExterne: this.exonerationDossier.refExterne
      },
      exoneration: {
        id: this.exonerationDossier.exoneration.id,
        contribuable: this.exonerationDossier.exoneration?.contribuable?.guid,
        motif: this.exonerationDossier.exoneration.motif,
        observation: this.exonerationDossier.exoneration.observation,
        modifDoc: this.exonerationDossier.exoneration?.modifDoc,
        natureImpot: this.exonerationDossier.exoneration.natureImpot.id,
        parcelle: this.exonerationDossier.exoneration?.parcelle?.id,
        categorie: this.exonerationDossier.exoneration?.categorie?.id,
        taux: this.exonerationDossier.exoneration?.taux,
        montant: this.exonerationDossier.exoneration.montant,
        dateDebut: this.exonerationDossier.exoneration.dateDebut,
        dateFin: this.exonerationDossier.exoneration.dateFin,
        refExterne: this.exonerationDossier.exoneration.refExterne
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
    let { dossier, pieces, documents, numero,
      action, exoneration } = this.formulaire.value;

    let tmp = { pieces,exoneration,action, numero};
    let dataPost = { ...dossier, ...tmp };

    this.exonerationService.executer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
      this.openSnackBar("Exonération modifiée avec succès", "OK");
      this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_EXONERATION]);
    },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }
  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_EXONERATION}`]);
  }
}
