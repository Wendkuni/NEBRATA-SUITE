import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {TransitionPlanCadastralLotissementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-lotissement/edition-plan-cadastral-lotissement/transition-plan-cadastral-lotissement.component';
import { FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import { LotissementService } from '@sycadApp/services/workflow/common/lotissement.service';
import {PlanCadastralLotissementElement} from '@sycadApp/models/workflow/cp-lotissement.model';
import {SycadUtils} from '@sycadShared/utils.functions';
import { RemoteAutocompleteArrondissementZoneCompetence} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence';
import { CategoriePieceProcessus } from '@sycadApp/models/workflow/common/general';
import { ArrondissementAutocomplete } from '@sycadApp/models/data-references/territoire/arrondissement.model';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import { environment } from 'environments/environment';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';

@Component({
  selector: 'lo-creation-par-acteur',
  templateUrl: './creation-par-acteur.component.html',
  styleUrls: ['./creation-par-acteur.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class CreationParActeurComponent extends TransitionPlanCadastralLotissementComponent implements OnInit {




  get arrondissement(){ return this.formulaire.get('arrondissement');}
  groupByFnArrondissement = (item) => item.commune.nom;
  groupValueFnArrondissement = (_: string, communes: any[]) => ({ name: communes[0].commune.nom, total: communes.length });
  public arrondissementRemoteAutocomplete = new RemoteAutocomplete<ArrondissementAutocomplete>();


   constructor(
     public router: Router,
     public _snackBar: MatSnackBar,
     public confirmService: AppConfirmService,
     public _adapter: DateAdapter<any>,
     public mediaObserver: MediaObserver,
     public fb: FormBuilder,
     public planCadastralService: LotissementService,
     public arrondissementService: ArrondissementsService){
     super(router, _snackBar, confirmService, _adapter, mediaObserver,fb);


     this.formulaire.addControl("arrondissement",this.fb.control([null, Validators.required]));


    }

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
   ngOnInit(): void {
     this._adapter.setLocale("fr");

     this.planCadastral = new PlanCadastralLotissementElement();

     this.arrondissementRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.arrondissementService);


     this.categoriePieceProcessus$=this.processus.categoriePieces;


   }


   public onSearchArrondissement(eventNgSelect) {
     this.arrondissementRemoteAutocomplete.term.next(eventNgSelect.term);
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
       this.categoriePieceProcessus$=this.processus.categoriePieces.filter((piece) => {
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
       transmissionCreateur,
       dateMajPlan,
       zone,
       domaine,
       ilots,
       arrondissement,
       pieces
     }=this.formulaire.value;
     let dataPost= {
       transmissionCreateur,
       dateMajPlan,
       zone,
       domaine,
       ilots,
       pieces,
       arrondissement,
       objet,dateExterne,etatDossier,refExterne,observation
     };
     this.planCadastralService.creer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
       this.openSnackBar("Lotissement plan cadastral ajouté avec succès","OK");
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
