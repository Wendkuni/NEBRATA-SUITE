import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {MediaObserver} from '@angular/flex-layout';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import {CategoriePieceService} from '@sycadApp/services/data-references/system/categorie-piece.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import {ContribuableService} from '@sycadApp/services/data-references/system/contribuable.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {MandatService} from '@sycadApp/services/workflow/mandat.service';
import {CategoriePieceProcessus} from '@sycadApp/models/workflow/common/general';
import {environment} from '../../../../../../environments/environment';
import {SycadUtils} from '@sycadShared/utils.functions';
import {TransitionDomaineMorcellementComponent} from '@sycadApp/features/plan-cadastral-domaine/plan-cadastral-morcellement/edition-domaine-morcellement/transition-domaine-morcellement.component';
import {PlanCadastralMorcellementService} from '@sycadApp/services/workflow/common/morcellement.service';



@Component({
  selector: 'app-envoyer-pour-controle-apres-mocellement',
  templateUrl: './envoyer-pour-controle-apres-mocellement.component.html',
  styleUrls: ['./envoyer-pour-controle-apres-mocellement.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EnvoyerPourControleApresMocellementComponent extends TransitionDomaineMorcellementComponent implements OnInit {

  constructor(public dialog: MatDialog,
              public router: Router,
              public _snackBar: MatSnackBar,
              public confirmService: AppConfirmService,
              public _adapter: DateAdapter<any>,
              public mediaObserver: MediaObserver,
              public fb: FormBuilder,
              public categoriePieceService: CategoriePieceService,
              public morcellementService: PlanCadastralMorcellementService,
              public acteurService: ActeursService,
              public contribuableService: ContribuableService,
              public structureService: StructureService,
              public parcelleService: ParcelleService, public mandatService: MandatService) {
    super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService, morcellementService,
      acteurService, contribuableService, structureService, parcelleService, mandatService);

    this.formulaire =this.fb.group({
      numero: [null, [Validators.required]],
      action: [null, [Validators.required]],
      pieces: new FormArray([]),
      dossier : this.fb.group({
        observation: [null]
      }),
    });


  }

  ngOnInit(): void {

    this.formulaire.patchValue({
      numero: this.morcellement.numero,
      action: this.transition.code
    });

    if(this.transition.categoriePieces) {
      let listPiecePourCetteTransition: number[] = this.transition.categoriePieces.map(catPiece => catPiece.id);
      if (this.morcellement.listPieces) {
        this.morcellement.listPieces.map((piece) => {
          if(listPiecePourCetteTransition.indexOf(piece.categorie.id)>=0) {
            this.pieces.insert(0, this.createDossierPiece(piece));
          }
         
        });
      }
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
  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }
    

    this.loadingEvent.emit(true);

    let {numero,action,pieces}=this.formulaire.value;
    let {observation}=this.formulaire.value.dossier;
    let dataPost= {
      numero,action,observation,pieces
    };
    this.morcellementService.executer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
        this.openSnackBar("Dossier de morcellement modifié avec succès", "OK");
        this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MORCELLEMENT]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }
  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MORCELLEMENT}`]);
  }
 

}
