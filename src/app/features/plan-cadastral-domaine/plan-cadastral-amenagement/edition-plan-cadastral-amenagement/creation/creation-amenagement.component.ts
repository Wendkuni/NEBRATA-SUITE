import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import {SycadUtils} from '@sycadShared/utils.functions';
import { RemoteAutocompleteArrondissementZoneCompetence } from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence';
import { CategoriePieceProcessus } from '@sycadApp/models/workflow/common/general';
import { ArrondissementAutocomplete } from '@sycadApp/models/data-references/territoire/arrondissement.model';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import { AmenagementService } from '@sycadApp/services/workflow/common/amenagement.service';
import { TransitionPlanCadastralAmenagementComponent } from '../transition-plan-cadastral-amenagement.component';
import { environment } from 'environments/environment';
import { PlanCadastralAmenagementElement } from '@sycadApp/models/workflow/cp-amenagement.model';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { DestinationParcelle } from '@sycadApp/models/bornage/destinationParcelle.model';
import { DestinationParcelleService } from '@sycadApp/services/bornage/destination-parcelle.service';

@Component({
  selector: 'pc-creation-amenagement',
  templateUrl: './creation-amenagement.component.html',
  styleUrls: ['./creation-amenagement.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreationAmenagementComponent extends TransitionPlanCadastralAmenagementComponent implements OnInit {



  get arrondissement(){ return this.formulaire.get('arrondissement');}
  get destination(){ return this.formulaire.get('destination');}
  public arrondissementRemoteAutocomplete = new RemoteAutocompleteArrondissementZoneCompetence<ArrondissementAutocomplete>();
  groupByFnArrondissement = (item) => item.commune.nom;
  groupValueFnArrondissement = (_: string, communes: any[]) => ({ name: communes[0].commune.nom, total: communes.length });
  public destinationRemoteAutocomplete = new RemoteAutocomplete<DestinationParcelle>();

   constructor(
     public router: Router,
     public _snackBar: MatSnackBar,
     public confirmService: AppConfirmService,
     public _adapter: DateAdapter<any>,
     public mediaObserver: MediaObserver,
     public fb: FormBuilder,
     public planCadastralService: AmenagementService,
     public destinationParcelleService: DestinationParcelleService,
     public arrondissementService: ArrondissementsService){
     super(router, _snackBar, confirmService, _adapter, mediaObserver,fb);


     this.formulaire.addControl("arrondissement",this.fb.control([null, Validators.required]));
     this.formulaire.addControl("destination",this.fb.control([null, Validators.required]));


    }
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

   ngOnInit(): void {
     this._adapter.setLocale("fr");

     this.planCadastral = new PlanCadastralAmenagementElement();

     this.arrondissementRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.arrondissementService);
     this.destinationRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.destinationParcelleService);

     this.categoriePieceProcessus$=this.processus.categoriePieces;


   }


   public onSearchArrondissement(eventNgSelect) {
     this.arrondissementRemoteAutocomplete.term.next(eventNgSelect.term);
   }

   public onSearchDestination(eventNgSelect){
    this.destinationRemoteAutocomplete.term.next(eventNgSelect.term);
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
   /*compareFunction(item, selected) {
// console.log("compareFunction",item,selected)
        return item.nom === selected.nom
      }
      */
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
       destination,
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
       destination,
       objet,dateExterne,etatDossier,refExterne,observation
     };
     this.planCadastralService.creer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
       this.openSnackBar("Aménagement plan cadastral ajouté avec succès","OK");
       this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_AMENAGEMENT]);
     },
     errorResponse => {
      this.loadingEvent.emit(false);
       SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
     }
   );


   }


   resetForm(){
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_AMENAGEMENT}`]);
    /*
    if(this.planCadastral.numero) {
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_AMENAGEMENT}`]);
    }else {
      this.formulaire.reset();
    }
    */
  }
}
