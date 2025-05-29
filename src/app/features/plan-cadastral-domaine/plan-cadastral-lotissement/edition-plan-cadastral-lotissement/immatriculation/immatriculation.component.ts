import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {TransitionPlanCadastralLotissementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-lotissement/edition-plan-cadastral-lotissement/transition-plan-cadastral-lotissement.component';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import {FormBuilder, Validators} from '@angular/forms';
import { BureauService } from '@sycadApp/services/data-references/organigramme/bureau.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import { ServiceAdministratifService } from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';
import { LotissementService } from '@sycadApp/services/workflow/common/lotissement.service';
import {environment} from '../../../../../../environments/environment';
import {SycadUtils} from '@sycadShared/utils.functions';
import { CategoriePieceProcessus } from '@sycadApp/models/workflow/common/general';

@Component({
  selector: 'pc-lotissement-immatriculation',
  templateUrl: './immatriculation.component.html',
  styleUrls: ['./immatriculation.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ImmatriculationComponent extends TransitionPlanCadastralLotissementComponent implements OnInit {

  constructor(   public router: Router,
                 public _snackBar: MatSnackBar,
                 public confirmService: AppConfirmService,
                 public _adapter: DateAdapter<any>,
                 public mediaObserver: MediaObserver,
                 public fb: FormBuilder,
                 public planCadastralService: LotissementService,
                 public bureauService : BureauService, public structureService : StructureService,
                 public serviceAdminService : ServiceAdministratifService)
  {
    super(router, _snackBar, confirmService, _adapter, mediaObserver,fb);

 
    this.formulaire.addControl("action",this.fb.control(null, [Validators.required]));
    this.formulaire.addControl("numero",this.fb.control(null, [Validators.required]));
    this.formulaire.addControl("ilots",this.fb.array([]));
  }
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  ngOnInit(): void {
    this._adapter.setLocale("fr");

//console.log("this.planCadastral",this.planCadastral)
    this.formulaire.patchValue({
      numero: this.planCadastral.numero,
      action: this.transition.code,
      zone: this.planCadastral.zone,
      domaine: this.planCadastral.domaine,
      dateMajPlan: this.planCadastral.dateMajPlan,
      dossier: {
        objet: this.planCadastral.objet,
        dateExterne: this.planCadastral.dateExterne,
        etatDossier: this.planCadastral.etatDossier,
        refExterne: this.planCadastral.refExterne
      }
    });

    if (this.planCadastral.listPieces) {
      this.planCadastral.listPieces.map((piece) => {
        this.pieces.insert(0, this.createDossierPiece(piece));
    });
    }

    if (this.planCadastral.ilots) {
      this.planCadastral.ilots.map((ilot) => {
        this.ilots.insert(0, this.createIlot(ilot));
    });
    }
   this.categoriePieceProcessus$=this.transition.categoriePieces;
  }



  public categoriePieceProcessus$  :CategoriePieceProcessus[]=[];
  public idCategoriePieceListChosen$ :number[]= [];
  public changeCategoriePiece(data:CategoriePieceProcessus) {

    this.idCategoriePieceListChosen$=[];
    for (let i = 0; i < this.pieces.length; i++) {
      let piece = this.pieces.at(i);
      this.idCategoriePieceListChosen$.push( piece.value.categorie);
      }
      let that=this;
      this.categoriePieceProcessus$=this.transition.categoriePieces.filter((piece) => {
          return  ( that.idCategoriePieceListChosen$.indexOf(piece.id) <0 ) ;
      });

  }

  addNewDossierPiece() {
    if(this.categoriePieceProcessus$.length>0) {
      super.addNewDossierPiece();
    }
  }

  removeDossierPiece(i){
    super.removeDossierPiece(i);
    this.changeCategoriePiece(null);
  }


  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }
    this.loadingEvent.emit(true);
    

    let {objet,dateExterne,etatDossier,refExterne,observation}=this.formulaire.value.dossier;
    let {
      transmission,
      dateMajPlan,
      zone,
      ilots,
      numero,
      action,
      domaine,
      pieces
    }=this.formulaire.value;
    let dataPost= {
      transmission,
      dateMajPlan,
      zone,
      ilots,
      numero,
      action,
      domaine,
      pieces,
      objet,dateExterne,etatDossier,refExterne,observation
    };
    this.planCadastralService.executer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
        this.openSnackBar("Lotissement plan cadastral modifié avec succès","OK");
        this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_LOTISSEMENT]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }
  resetForm(){

    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_LOTISSEMENT}`]);
  /*  if(this.planCadastral.numero) {
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_LOTISSEMENT}`]);
    }else {
      this.formulaire.reset();
    } */
  }

}
