import { Component, OnInit } from '@angular/core';
import {Processus, Transition} from '@sycadApp/models/workflow/common/general';
import {ActivatedRoute, Router} from '@angular/router';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DateAdapter} from '@angular/material/core';
import {FormBuilder} from '@angular/forms';
import { AuthentificatedUser, TypeUser} from '@sycadApp/features/transverse/login/auth.user';
import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';
import { environment } from 'environments/environment';
import {PlanCadastralAmenagementElement} from '@sycadApp/models/workflow/cp-amenagement.model';
import { AmenagementService } from '@sycadApp/services/workflow/common/amenagement.service';

@Component({
  selector: 'app-edition-plan-cadastral-amenagement',
  templateUrl: './edition-plan-cadastral-amenagement.component.html',
  styleUrls: ['./edition-plan-cadastral-amenagement.component.scss']
})
export class EditionPlanCadastralAmenagementComponent implements OnInit {

  public planCadastral: PlanCadastralAmenagementElement;
  public transition: Transition;
  public processus: Processus;
  
  public isLoadingResults: Boolean = false;
  public authentificatedUser: AuthentificatedUser;
  public typeActeur=TypeUser.ACTEUR;

  constructor(  private router: Router,
                private route: ActivatedRoute,
                public authService: AuthenticationService,
                private mediaObserver: MediaObserver,
                public confirmService: AppConfirmService,
                private _snackBar: MatSnackBar,
                private _adapter: DateAdapter<any>,
                public fb: FormBuilder, public planCadastralService: AmenagementService)
  {
    this.planCadastral = this.route.snapshot.data["planCadastral"];
    this.transition = this.route.snapshot.data["transition"];
    this.processus = this.route.snapshot.data["processus"];
  }
  public formErrors: Array<string>;
  public onFormError(list) {
    this.formErrors=list;
  }

  ngOnInit(): void {

    this.authService.getMe().subscribe((ob) => {
      this.authentificatedUser=ob;
     });

  }

  getFrontendTemplate(){
    return environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_AMENAGEMENT;
  }

  public loadingEvent(statut:Boolean) {
    this.isLoadingResults=statut;
  }
  

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
      //console.log("this.activeMediaQuery", this.activeMediaQuery)
    });
  }
}
