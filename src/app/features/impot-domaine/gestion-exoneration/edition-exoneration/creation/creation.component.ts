import {
  Component, Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormBuilder } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
import { TransitionExonerationComponent } from '../transition-exoneration.component';
import {AuthentificatedUser} from '@sycadApp/features/transverse/login/auth.user';

@Component({
  selector: 'app-creation-exoneration',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreationComponent extends TransitionExonerationComponent implements OnInit {
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
    { super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver,fb, exonerationService, exonerationCategorieService, natureImpotService, contribuableService, professionService,categoriePieceService,parcelleService);
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

   this.categoriePieceProcessus$ = this.processus.categoriePieces;
    

    
    this.parcelle.valueChanges.subscribe(x=>{
      if(x){
        this.contribuable.reset(this.contribuableChoisie = null);
      }
    });
    this.contribuable.valueChanges.subscribe(x=>{
      if(x){
        this.parcelle.reset();
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
