import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';
import { TransitionBornageDelimitationComponent } from '../transition-bornage-delimitation.component';
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AppConfirmService} from "@sycadShared/app-confirm/app-confirm.service";
import {DateAdapter} from "@angular/material/core";
import {MediaChange, MediaObserver} from "@angular/flex-layout";
import {FormBuilder, Validators} from "@angular/forms";
import {CategoriePieceService} from "@sycadApp/services/data-references/system/categorie-piece.service";
import {BornageDelimitationService} from "@sycadApp/services/bornage/bornage-delimitation.service";
import {ActeursService} from "@sycadApp/services/data-references/contribuables/acteurs.service";
import {ContribuableService} from "@sycadApp/services/data-references/system/contribuable.service";
import {StructureService} from "@sycadApp/services/data-references/organigramme/structure.service";
import {ParcelleService} from "@sycadApp/services/cession-parcelle/parcelle.service";
import {MandatService} from "@sycadApp/services/workflow/mandat.service";
import {CategoriePieceProcessus, Mandat} from "@sycadApp/models/workflow/common/general";
import {environment} from "../../../../../../environments/environment";
import {SycadUtils} from "@sycadShared/utils.functions";
import {of} from "rxjs";

@Component({
  selector: 'app-saisie-brouillon-par-contribuable',
  templateUrl: './saisie-brouillon-par-contribuable.component.html',
  styleUrls: ['./saisie-brouillon-par-contribuable.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaisieBrouillonParContribuableComponent extends TransitionBornageDelimitationComponent implements OnInit {


  @Input('authentificatedUser')
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
    public bornageDelimitationService: BornageDelimitationService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public structureService: StructureService,
    public parcelleService: ParcelleService,
    public mandatService: MandatService) {
    super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService, bornageDelimitationService, acteurService, contribuableService, structureService, parcelleService, mandatService);

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
    this.initConfigAutocompleteMandat();
    this.contribuableBeneficiaireChoisie = this.bornage?.contribuableBeneficiaire;
    this.mandatChoisie = this.bornage.mandats[0];

    this.guidProprietaire=this.authentificatedUser.guid;
    if (this.bornage.mandats) {
      this.mandatRemoteAutocomplete.customNgSelectConfig.listRessource$ = of(this.bornage.mandats);
      this.mandatRemoteAutocomplete.initialList = this.bornage.mandats;
    }

    this.formulaire.patchValue({
      numero: this.bornage.numero,
      action: this.transition.code,
      mandat: this.bornage?.mandats[0]?.id,
      dossier: {
        objet: this.bornage.objet,
        dateExterne: this.bornage.dateExterne,
        etatDossier: this.bornage.etatDossier,
        refExterne: this.bornage.refExterne
      },
      parcelle: this.bornage?.parcelle?.id
    });
    if (this.bornage.listPieces) {
      this.bornage.listPieces.map((piece) => {
        this.pieces.insert(0, this.createDossierPiece(piece));
      });
    }
    this.categoriePieceProcessus$ = this.transition?.categoriePieces;
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
    this.categoriePieceProcessus$ = this.transition?.categoriePieces.filter((piece) => {
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
      this.contribuableBeneficiaireChoisie=mandat.mandant;
      this.guidProprietaire=mandat.mandant.guid;
    }else {
     this.contribuableBeneficiaireChoisie=null;
     this.guidProprietaire=this.authentificatedUser.guid;
   
    }
    this.parcelleChoisie=null;
    this.parcelle.setValue(null);
 }
  onSubmit(){
    if (!this.formulaire.valid) {
      return false;
    }
    this.loadingEvent.emit(true);
    let { dossier , parcelle, pieces, mandat, numero, action} = this.formulaire.value;
   
   
    let mandats= (mandat)?[{
      id:mandat
    }]:null;
    let tmp = { parcelle , pieces, mandats, numero, action};
    let dataPost = { ...dossier, ...tmp};
    this.bornageDelimitationService.executer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
        this.openSnackBar("Dossier bornage modifiée avec succès", "OK");
        this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_BORNAGE_DELIMITATION]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );
  }

}
