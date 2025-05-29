import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import {  FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { DateAdapter } from '@angular/material/core';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';

import { Transition, Dossier, DossierPiece } from '@sycadApp/models/workflow/common/general';
import { environment } from 'environments/environment';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { PlanCadastralSectionnementElement } from '@sycadApp/models/workflow/common/sectionnement.model';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { PlanCadastralSectionnementService } from '@sycadApp/services/workflow/common/sectionnement-services';
import { TransitionPlanCadastralSectionnementComponent } from '../transition.plan-cadastral-sectionnement.component';
import { AffecationMinimumExist } from '@sycadApp/shared/validators/global-pattern';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { CommuneAutocomplete } from '@sycadApp/models/data-references/territoire/commune.model';
import { CategoriePieceProcessus } from '@sycadApp/models/workflow/common/general';
import { RemoteAutocompleteCommuneZoneCompetence } from './remote-autocomple-zone-competence';

@Component({
  selector: 'pc-sectionnement-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class PCSecCreationComponent extends TransitionPlanCadastralSectionnementComponent  implements OnInit {


 get sections() { return this.formulaire.controls.sections as FormArray; }
 get commune(){ return this.formulaire.get('commune');}
 public communeRemoteAutocomplete = new RemoteAutocompleteCommuneZoneCompetence<CommuneAutocomplete>();


  constructor(
    public router: Router,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public planCadastralService: PlanCadastralSectionnementService,
    public communeService: CommunesService){
    super(router, _snackBar, confirmService, _adapter, mediaObserver,fb);

    this.formulaire.addControl("sections",this.fb.array([]));
    this.formulaire.addControl("commune",this.fb.control([null, Validators.required]));


   }
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  ngOnInit(): void {
    this._adapter.setLocale("fr");

    this.planCadastral = new PlanCadastralSectionnementElement();

    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);


    this.categoriePieceProcessus$=this.processus.categoriePieces;


  }


  public onSearchCommune(eventNgSelect) {
    this.communeRemoteAutocomplete.term.next(eventNgSelect.term);
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
      sections,
      commune,
      pieces
    }=this.formulaire.value;
    let dataPost= {
      transmissionCreateur,
      dateMajPlan,
      zone,
      domaine,
      sections,
      pieces,
      commune,
      objet,dateExterne,etatDossier,refExterne,observation
    };
    this.planCadastralService.creer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
      this.openSnackBar("Sectionnement plan cadastral ajouté avec succès","OK");
      this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_SECTIONNEMENT]);
    },
    errorResponse => {
      this.loadingEvent.emit(false);
      SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
    }
  );


  }


  resetForm(){
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_SECTIONNEMENT}`]);
    /*
    if(this.planCadastral.numero) {
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_SECTIONNEMENT}`]);
    }else {
      this.formulaire.reset();
    } */
  }
}
