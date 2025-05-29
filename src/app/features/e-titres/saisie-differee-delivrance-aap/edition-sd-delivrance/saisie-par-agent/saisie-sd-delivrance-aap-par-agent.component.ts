import { TransitionSdDelivranceComponent } from './../transition-sd-delivrance-aap.component';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '@sycadShared/app-confirm/app-confirm.service';
import { DateAdapter } from '@angular/material/core';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import { SycadUtils } from '@sycadShared/utils.functions';
import {Document} from '@sycadApp/models/workflow/common/general';
import { CategoriePieceProcessus } from '@sycadApp/models/workflow/common/general';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { SdDelivranceAapService } from '@sycadApp/services/workflow/sd-delivrance-aap.service';
import { DelivranceAap } from '@sycadApp/models/workflow/sd-delivrance-aap.model';
import { ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';
import { ArrondissementElement } from '@sycadApp/models/data-references/territoire/arrondissement.model';
import { SaisieDiffereeAttributionContexteElement } from '@sycadApp/models/workflow/sd-saisie-differee-attribution-contexte.model';
import { EtatAttribution, GeneralContribuable } from '@sycadApp/models/data-references/contribuables/global.model';
import { of } from 'rxjs';
import { AdvancedRemoteAutocomplete } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/advanced-remote-autocomplete';
import { DestinationParcelleService } from '@sycadApp/services/bornage/destination-parcelle.service';
import { UserProfilAttributionService } from '@sycadApp/services/data-references/system/user-profil-attribution.service';
import { SdAttributionService } from '@sycadApp/services/workflow/sd-attribution.service';
import { EnteteDossierService } from '@sycadApp/services/workflow/entete.service';
import { MandatService } from '@sycadApp/services/workflow/mandat.service';
import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';

@Component({
  selector: 'pc-saisie-sd-delivrance-aap-par-agent',
  templateUrl: './saisie-sd-delivrance-aap-par-agent.component.html',
  styleUrls: ['./saisie-sd-delivrance-aap-par-agent.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaisieParAgentSdDelivranceAapComponent extends TransitionSdDelivranceComponent implements OnInit {

  public parcelleContextInit: ParcelleElement = new ParcelleElement();
  public attributionContexte: SaisieDiffereeAttributionContexteElement ;
  public attributaireRemoteAutocomplete = new AdvancedRemoteAutocomplete<GeneralContribuable>();
  public icad:string = "";

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public delivranceAapService: SdDelivranceAapService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public professionService: ProfessionService,
    public categoriePieceService: CategoriePieceService,
    public structureService: StructureService,
    public parcelleService: ParcelleService, 
    public destinationParcelleService: DestinationParcelleService,
    public userProfilAttributionService: UserProfilAttributionService,
    public sdAttributionService: SdAttributionService,
    public enteteDossierService: EnteteDossierService,
    public mandatService: MandatService,
    public authService: AuthenticationService) {
    super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver, fb, delivranceAapService, acteurService, contribuableService, professionService, categoriePieceService, structureService,parcelleService, destinationParcelleService, userProfilAttributionService, sdAttributionService, enteteDossierService, mandatService, authService);

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

    this.categoriePieceProcessus$ = this.processus.categoriePieces;
    this.categorieIdentiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.categoriePieceService);
    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.structureService);
    this.initConfigAutocompleteActeur();
    this.initConfigAutocompleteAttributaire();

    if (this.delivranceAap.contribuableBeneficiaire) {
      this.attributaireRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([this.delivranceAap.contribuableBeneficiaire]);
      this.attributaireRemoteAutocomplete.initialList = [this.delivranceAap.contribuableBeneficiaire];
      this.attributaireChoisie=this.delivranceAap.contribuableBeneficiaire;
    }
    if(this.delivranceAap.mandats){
      this.delivranceAap.mandats.map((mandat) => {
        this.mandats.insert(0, this.createMandat(mandat));
      });
    }
    if (this.delivranceAap.parcelle) {
      this.delivranceAap.parcelle.arrondissement.commune=this.delivranceAap.parcelle.ilot.section.commune;
    }
    if (this.delivranceAap.listPieces) {
      this.delivranceAap.listPieces.map((piece) => {
        this.pieces.insert(0, this.createDossierPiece(piece));
      });
    }
    if(this.delivranceAap.documents){
      this.delivranceAap.documents.map((document)=>{
        this.documents.insert(0, this.createDocument(document));
      });
    }
    if(this.delivranceAap.quittances){
      this.delivranceAap.quittances.map((quittance)=>{
        this.quittances.insert(0, this.createQuittance(quittance));
      });
    }

    this.typeDocuments=this.processus.typeDocuments;
    this.formulaire.patchValue({
      numero: this.delivranceAap.numero,
      action: this.transition.code,
      documentType: this.delivranceAap.documentType.id,
      dossier: {
        objet: this.delivranceAap.objet,
        dateExterne: this.delivranceAap.dateExterne,
        etatDossier: this.delivranceAap.etatDossier,
        refExterne: this.delivranceAap.refExterne
      },
      
 
      parcelle: this.delivranceAap?.parcelle?.id,
      contribuableBeneficiaire: this.delivranceAap?.contribuableBeneficiaire?.guid,
      mandats: []
    });
    
    this.contribuableBeneficiaireChoisie = this.delivranceAap.contribuableBeneficiaire;
  
    

   
    
        
    this.destinationRemoteAutocomplete.listRessource$=of(this.lesDestinations);
    this.destinationRemoteAutocomplete.initialList=this.lesDestinations;
    

    this.destinationRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.destinationParcelleService);
  }

  public onSearchDestination(eventNgSelect){
    this.destinationRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchCategoriePiece(eventNgSelect) {
    this.categorieIdentiteRemoteAutocomplete.term.next(eventNgSelect.term);
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
    let { dossier, contribuableBeneficiaire, documentType, parcelle, pieces, documents, numero, action, mandats, quittances } = this.formulaire.value;
    let tmp = {contribuableBeneficiaire, documentType, parcelle, pieces, documents, numero, action, mandats, quittances };
   
    let dataPost = { ...dossier, ...tmp };
    this.delivranceAapService.executer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
      this.openSnackBar("Dossier mis à jour avec succès", "OK");

      if(this.transition.code ==="DELIVRANCE_ATTESTATION_ATTRIBUTION_PARCELLE_BROUILLON_TO_DRAFT_ACTE" || this.transition.code === "DELIVRANCE_ATTESTATION_ATTRIBUTION_PARCELLE_DRAFT_ACTE_TO_DRAFT_ACTE"){
        this.router.navigate([environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DELIVRANCE_AAP+"/view/"+this.formulaire.value.numero], { queryParams: { tab: 0.2 } });
      }else{
        this.router.navigate([environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DELIVRANCE_AAP+"/view/"+this.formulaire.value.numero]);
      }
      
    },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }

  createDocument(document: Document = null) {
    if(document != null){
      return this.fb.group({
        id: [document.id],
        libelle:[document.libelle],
        numero:[document.numero],
        pieceJointe:[document.pieceJointe],
        dateValidite: [document.dateValidite],
        documentType: [document.documentType.id],
        dateDoc: [document.dateDoc]
      });
    }else {
    return this.fb.group({
      id: [null],
      libelle: [null, [Validators.required]],
      numero: [null, [Validators.required]],
      pieceJointe: [null, [Validators.required]],
      dateValidite: [null],
      documentType: [null, [Validators.required]],
      dateDoc: [null, [Validators.required]]
    });
    }
  }

  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DELIVRANCE_AAP}`]);
  }


}
