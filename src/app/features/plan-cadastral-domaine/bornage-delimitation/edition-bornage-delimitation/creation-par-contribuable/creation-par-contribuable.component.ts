import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';
import { DossierBornage } from '@sycadApp/models/bornage/bornage.model';
import { CategoriePieceProcessus, Mandat } from '@sycadApp/models/workflow/common/general';
import { BornageDelimitationService } from '@sycadApp/services/bornage/bornage-delimitation.service';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { ActeursService } from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { StructureService } from '@sycadApp/services/data-references/organigramme/structure.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';
import { MandatService } from '@sycadApp/services/workflow/mandat.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { environment } from 'environments/environment';
import { TransitionBornageDelimitationComponent } from '../transition-bornage-delimitation.component';

@Component({
  selector: 'app-creation-bornage-delimitation-par-contribuable',
  templateUrl: './creation-par-contribuable.component.html',
  styleUrls: ['./creation-par-contribuable.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreationParContribuableComponent extends TransitionBornageDelimitationComponent implements OnInit {

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
    public bornageDelimitationService: BornageDelimitationService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public structureService: StructureService,
    public parcelleService: ParcelleService,
    public mandatService: MandatService) {
    super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService,bornageDelimitationService, acteurService, contribuableService, structureService,parcelleService,mandatService);
  }


  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  ngOnInit(): void {
    this._adapter.setLocale("fr");

    this.bornage = new DossierBornage();


    this.categoriePieceProcessus$ = this.processus.categoriePieces;
    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.structureService);
   // this.initConfigAutocompleteActeur();
    this.initConfigAutocompleteContribuableBeneficiaire();
    this.initConfigAutocompleteMandat();


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
 onSubmit() {
  if (!this.formulaire.valid) {
    return false;
  }
 


 this.loadingEvent.emit(true);
  let { dossier , parcelle, pieces, mandat} = this.formulaire.value;
  let mandats=[{
    id:mandat
  }];
  let tmp = { parcelle , pieces, mandats};
  let dataPost = { ...dossier, ...tmp};
  this.bornageDelimitationService.creer(dataPost).subscribe(data => {
    this.loadingEvent.emit(false);
    this.openSnackBar("Dossier de bornage ajoutée avec succès", "OK");
    this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_BORNAGE_DELIMITATION]);
  },
    errorResponse => {
      this.loadingEvent.emit(false);
      SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
    }
  );


}





}
