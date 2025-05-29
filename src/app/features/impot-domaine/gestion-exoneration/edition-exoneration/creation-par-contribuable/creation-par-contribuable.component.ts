import { Input, ViewEncapsulation } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormBuilder } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';
import { ExonerationDossier } from '@sycadApp/models/impot/exoneration.model';
import { CategoriePieceProcessus } from '@sycadApp/models/workflow/common/general';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { ExonerationCategorieService } from '@sycadApp/services/evaluation/exoneration-categorie.service';
import { ExonerationService } from '@sycadApp/services/impot/exoneration.service';
import { NatureImpotService } from '@sycadApp/services/impot/nature-impot.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { environment } from 'environments/environment';
import { of } from 'rxjs';
import { TransitionExonerationComponent } from '../transition-exoneration.component';

@Component({
  selector: 'app-creation-par-contribuable',
  templateUrl: './creation-par-contribuable.component.html',
  styleUrls: ['./creation-par-contribuable.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreationParContribuableComponent extends TransitionExonerationComponent implements OnInit {
  @Input("authentificatedUser")
  public authentificatedUser: AuthentificatedUser;
 
  public guidProprietaire: string;

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
    public parcelleService: ParcelleService) 
    { 
      super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver,fb, exonerationService, exonerationCategorieService, natureImpotService, contribuableService, professionService,categoriePieceService,parcelleService);
    }
    public activeMediaQuery = '';
    ngAfterContentInit() {
      this.mediaObserver.media$.subscribe((change: MediaChange) => {
        this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
      });
    }
  ngOnInit(): void {
    this._adapter.setLocale("fr");
    this.exonerationDossier = new ExonerationDossier();

    this.natureImpotRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.natureImpotService);
    this.categorieRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.exonerationCategorieService);
    //this.initConfigAutocompleteContribuableBeneficiaire();
    this.categoriePieceProcessus$ = this.processus.categoriePieces;
    
    this.guidProprietaire=this.authentificatedUser.guid;
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

    let { dossier, pieces, exoneration } = this.formulaire.value;

    let tmp = { pieces,exoneration };
    let dataPost = { ...dossier,...tmp };
    this.exonerationService.creer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
      this.openSnackBar("Exoneration ajoutée avec succès", "OK");
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
