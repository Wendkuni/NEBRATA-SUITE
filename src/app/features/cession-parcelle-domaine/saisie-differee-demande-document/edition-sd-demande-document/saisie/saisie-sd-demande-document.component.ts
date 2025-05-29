import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '@sycadShared/app-confirm/app-confirm.service';
import { DateAdapter } from '@angular/material/core';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
import { SycadUtils } from '@sycadShared/utils.functions';
import { CategoriePieceProcessus, Mandat } from '@sycadApp/models/workflow/common/general';
import { TransitionDemandeDocumentComponent } from '../transition-sd-demande-document.component';
import { environment } from 'environments/environment';
import { ActeurAutocomplete } from '@sycadApp/models/data-references/contribuables/acteur.model';
import { of } from 'rxjs';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';

import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { MatDialog } from '@angular/material/dialog';
import {SdDemandeDocumentService} from '@sycadApp/services/workflow/sd-demande-document.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';


@Component({
  selector: 'pc-saisie-sd-demande-document',
  templateUrl: './saisie-sd-demande-document.component.html',
  styleUrls: ['./saisie-sd-demande-document.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaisieSdDemandeDocumentComponent extends TransitionDemandeDocumentComponent implements OnInit {

  constructor(public router: Router,
    public _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public demandeDocumentService: SdDemandeDocumentService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public professionService: ProfessionService,
    public categoriePieceService: CategoriePieceService,
    public structureService: StructureService,
    public parcelleService: ParcelleService) {
    super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver, fb, demandeDocumentService, acteurService, contribuableService, professionService, categoriePieceService, structureService,parcelleService);



    this.formulaire.addControl("action", this.fb.control(null, [Validators.required]));
    this.formulaire.addControl("numero", this.fb.control(null, [Validators.required]));

  }
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
    super.ngAfterContentInit();
  }
  ngOnInit(): void {
    this._adapter.setLocale("fr");


    this.categorieIdentiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.categoriePieceService);
    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.structureService);
    this.initConfigAutocompleteActeur();
    this.initConfigAutocompleteContribuableBeneficiaire();

   //// console.log("this.demandeDocument.objet",this.demandeDocument)

    this.typeDocuments=this.processus.typeDocuments;

    let listObjets = this.typeDocuments.map((doc)=>{
      return doc.libelle;
    });
    
    if(listObjets.indexOf(this.demandeDocument.objet)<0) {
      this.demandeDocument.objet=null;
    }
    

    if (this.demandeDocument.contribuableBeneficiaire) {
      this.contribuableBeneficiaireRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([this.demandeDocument.contribuableBeneficiaire]);
      this.contribuableBeneficiaireRemoteAutocomplete.initialList = [this.demandeDocument.contribuableBeneficiaire];
      this.contribuableBeneficiaireChoisie=this.demandeDocument.contribuableBeneficiaire;
    }
    if(this.demandeDocument.structureBeneficiaire){
      this.structureRemoteAutocomplete.listRessource$=of([this.demandeDocument.structureBeneficiaire]);
      this.structureRemoteAutocomplete.initialList = [this.demandeDocument.structureBeneficiaire];
      this.structureBeneficiaireChoisie=this.demandeDocument.structureBeneficiaire;
    }

    if (this.demandeDocument.acteurExterne) {
      let acteurEl: ActeurAutocomplete = new ActeurAutocomplete();

      acteurEl.denomination = this.demandeDocument.acteurExterne.denomination;
      acteurEl.guid = this.demandeDocument.acteurExterne.guid;
      acteurEl.statusJuridique = this.demandeDocument.acteurExterne.statusJuridique.libelle;
      acteurEl.sigle = this.demandeDocument.acteurExterne.sigle;
      acteurEl.username = this.demandeDocument.acteurExterne.username;
      acteurEl.categorie = this.demandeDocument.acteurExterne?.categorie?.libelle;

      this.acteurRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([acteurEl]);
      this.acteurRemoteAutocomplete.initialList = [acteurEl];
    }
    if (this.demandeDocument.documentDeSortie) {
      this.documentPiece=this.demandeDocument.documentDeSortie.pieceJointe;
      this.demandeDocument.documentDeSortie.pieceJointe=null;

    }
  
    if (this.demandeDocument.listPieces) {
      this.demandeDocument.listPieces.map((piece) => {
        this.pieces.insert(0, this.createDossierPiece(piece));
      });
    }
    this.categoriePieceProcessus$ = this.transition.categoriePieces;

    if (this.demandeDocument.mandats) {
      this.demandeDocument.mandats.map((mandat) => {
        this.mandats.insert(0, this.createMandat(mandat));
      });
    }

   // this.arrondissementRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.arrondissementsService);

   if (this.demandeDocument.parcelle) {
    this.demandeDocument.parcelle.arrondissement.commune=this.demandeDocument.parcelle.ilot.section.commune;
  }
    this.formulaire.patchValue({
      numero: this.demandeDocument.numero,
      action: this.transition.code,
      dossier: {
        objet: this.demandeDocument.objet,
        dateExterne: this.demandeDocument.dateExterne,
        etatDossier: this.demandeDocument.etatDossier,
        refExterne: this.demandeDocument.refExterne
      },
      documentDeSortie:{
        id: this.demandeDocument.documentDeSortie?.id,
        numero: this.demandeDocument.documentDeSortie?.numero,
        libelle: this.demandeDocument.documentDeSortie?.libelle,
        pieceJointe: this.demandeDocument.documentDeSortie?.pieceJointe,
        dateValidite: this.demandeDocument.documentDeSortie?.dateValidite,
        documentType: this.demandeDocument.documentDeSortie?.documentType.id,
        dateDoc: this.demandeDocument.documentDeSortie?.dateDoc
      },
      numeroDBT:this.demandeDocument.numeroDBT,
      dateDBT:this.demandeDocument.dateDBT,
      acteurExterne: this.demandeDocument.acteurExterne ? this.demandeDocument.acteurExterne.guid : null,
      contribuableBeneficiaire: this.demandeDocument.contribuableBeneficiaire ? this.demandeDocument.contribuableBeneficiaire.guid : null,
      parcelle: this.demandeDocument.parcelle ? this.demandeDocument.parcelle.id : null,
      structureBeneficiaire: this.demandeDocument.structureBeneficiaire ? this.demandeDocument.structureBeneficiaire.id : null,
      valeurInvestissement: this.demandeDocument.valeurInvestissement,
      dateEvaluation: this.demandeDocument.dateEvaluation,
      numeroPVEvaluation: this.demandeDocument.numeroPVEvaluation
    });
  }



//filtre des categories de pieces
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
//end filtre des categories de pieces





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
    let { dossier,documentDeSortie, acteurExterne, contribuableBeneficiaire,numeroDBT,dateDBT, structureBeneficiaire , valeurInvestissement, dateEvaluation, numeroPVEvaluation,mandats, parcelle, pieces, documents, numero,
      action } = this.formulaire.value;

    let tmp = { acteurExterne,documentDeSortie, parcelle,numeroDBT,dateDBT, contribuableBeneficiaire, structureBeneficiaire, valeurInvestissement, dateEvaluation, numeroPVEvaluation, mandats,pieces, documents, action, numero };
    let dataPost = { ...dossier, ...tmp };

    this.demandeDocumentService.executer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
      this.openSnackBar("Demande document modifié avec succès", "OK");
      this.router.navigate([environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DEMANDE_DOCUMENT]);
    },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }
  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DEMANDE_DOCUMENT}`]);
  }

}
