import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, } from '@angular/router';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter } from '@angular/material/core';
import { FormBuilder } from '@angular/forms';
import { PlanCadastralSectionnementElement } from '@sycadApp/models/workflow/common/sectionnement.model';
import { Processus, Transition } from '@sycadApp/models/workflow/common/general';
import {environment} from '../../../../../environments/environment';
import { StructureAutocomplete } from '@sycadApp/models/data-references/organigramme/structure.model';
import { PlanCadastralSectionnementService } from '@sycadApp/services/workflow/common/sectionnement-services';

@Component({
  selector: 'app-edition-plan-cadastral-sectionnement',
  templateUrl: './edition-plan-cadastral-sectionnement.component.html',
  styleUrls: ['./edition-plan-cadastral-sectionnement.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditionPlanCadastralComponent  implements OnInit {


  public planCadastral: PlanCadastralSectionnementElement;
  public transition: Transition;
  public processus: Processus;


  public isLoadingResults:Boolean = false;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mediaObserver: MediaObserver,
    public confirmService: AppConfirmService,
    private _snackBar: MatSnackBar,
    private _adapter: DateAdapter<any>,
    public fb: FormBuilder, public planCadastralService: PlanCadastralSectionnementService
  ) {
    this.planCadastral = this.route.snapshot.data["planCadastral"];
    this.transition = this.route.snapshot.data["transition"];
    this.processus = this.route.snapshot.data["processus"];
  }



  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    //console.log("this.activeMediaQuery", this.activeMediaQuery)
    });
  }


  ngOnInit() {


  }

  
  public loadingEvent(statut:Boolean) {
    this.isLoadingResults=statut;
  }

  getFrontendTemplate(){
    return environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_SECTIONNEMENT;
   }

 
  
  public formErrors: Array<string>;
  public onFormError(list) {
      this.formErrors=list;
  }


}
