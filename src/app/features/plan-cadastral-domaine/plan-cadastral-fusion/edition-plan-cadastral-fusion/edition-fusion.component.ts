import { Component, OnInit } from '@angular/core';
import {PlanCadastralFusionementElement} from '@sycadApp/models/workflow/cp-fusionnement.model';
import {Processus, Transition} from '@sycadApp/models/workflow/common/general';
import {ActivatedRoute, Router} from '@angular/router';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DateAdapter} from '@angular/material/core';
import {FormBuilder} from '@angular/forms';
import { environment } from 'environments/environment';
import { PlanCadastralFusionnementService } from '@sycadApp/services/workflow/common/fusionnement.service';
import {AuthenticationService} from "@sycadApp/features/transverse/login/authentication.service";
import { AuthorisationService } from '@sycadApp/features/transverse/login/authorisation.service';
import {AuthentificatedUser} from "@sycadApp/features/transverse/login/auth.user";
import {hasPermission} from "@sycadShared/utils.functions";
import {PermissionConstantes} from "@sycadApp/models/permssion-constantes";


@Component({
  selector: 'app-edition-plan-cadastral-fusionnement',
  templateUrl: './edition-fusion.component.html',
  styleUrls: ['./edition-fusion.component.scss']
})
export class EditionPlanCadastralFusionnementComponent implements OnInit {

  public fusion: PlanCadastralFusionementElement;
  public transition: Transition;
  public processus: Processus;
  public authentificatedUser: AuthentificatedUser;
  public myRoles: String[];

  public isLoadingResults: Boolean = false;
  constructor(  private router: Router,
                private route: ActivatedRoute,
                public authService: AuthenticationService,
                public authorisationService: AuthorisationService,
                private mediaObserver: MediaObserver,
                public confirmService: AppConfirmService,
                public fusionService: PlanCadastralFusionnementService,
                private _snackBar: MatSnackBar,
                private _adapter: DateAdapter<any>,
                public fb: FormBuilder,
                public planCadastralService: PlanCadastralFusionnementService)
  {
      this.fusion = this.route.snapshot.data["fusion"];
      this.transition = this.route.snapshot.data["transition"];
      this.processus = this.route.snapshot.data["processus"];

  }

  public formErrors: Array<string>;
  public onFormError(list) {
    this.formErrors = list;
  }

  ngOnInit(): void {
    this.authService.getMe().subscribe((ob) => {
      this.authentificatedUser = ob;
    });

    //  // console.log('authorisationService has perm',this.authorisationService.hasPermission())

    this.authorisationService.myRoles().subscribe((list) => {
      this.myRoles = list;
    });

  }
 
  private hasPermissionNumerotationValue:boolean=null;
  hasPermissionNumerotation(){
    if(this.hasPermissionNumerotationValue===null) {
      this.hasPermissionNumerotationValue=hasPermission([PermissionConstantes.NUMEROTER_DOSSIER],this.myRoles);
    }
    return this.hasPermissionNumerotationValue;
  }


  public getFrontendTemplate() {
    return environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_FUSION;
  }

  
  public loadingEvent(statut:Boolean) {
    this.isLoadingResults=statut;
  }

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
      //// console.log("this.activeMediaQuery", this.activeMediaQuery)
    });
  }


}
