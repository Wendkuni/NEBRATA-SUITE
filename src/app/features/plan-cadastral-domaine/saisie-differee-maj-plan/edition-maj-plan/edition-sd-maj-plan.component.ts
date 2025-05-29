import { Component, OnInit } from '@angular/core';
import {Processus, Transition} from '@sycadApp/models/workflow/common/general';
import {ActivatedRoute, Router} from '@angular/router';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DateAdapter} from '@angular/material/core';
import {FormBuilder} from '@angular/forms';

import {AuthentificatedUser} from '@sycadApp/features/transverse/login/auth.user';
import {AuthenticationService} from '@sycadApp/features/transverse/login/authentication.service';
import { AuthorisationService } from '@sycadApp/features/transverse/login/authorisation.service';
import {hasPermission} from '@sycadShared/utils.functions';
import {PermissionConstantes} from '@sycadApp/models/permssion-constantes';
import { environment } from 'environments/environment';
import { PlanCadastralRegularisationElement } from '@sycadApp/models/workflow/regularisation.model';
import { SdMajService } from '@sycadApp/services/workflow/common/regularisation.service';

@Component({
  selector: 'app-edition-regularisation',
  templateUrl: './edition-sd-maj-plan.component.html',
  styleUrls: ['./edition-sd-maj-plan.component.scss']
})
export class EditionSdMajPlanComponent implements OnInit {
  public sdMaj: PlanCadastralRegularisationElement;
  public transition: Transition;
  public processus: Processus;
  public authentificatedUser: AuthentificatedUser;
  public myRoles: String[];


  public isLoadingResults:Boolean = false;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private mediaObserver: MediaObserver,
              public confirmService: AppConfirmService,
              private _snackBar: MatSnackBar,
              private _adapter: DateAdapter<any>,
              public fb: FormBuilder,
              public sdMajService: SdMajService,
              public authService: AuthenticationService,
              public authorisationService: AuthorisationService)
  {

    this.sdMaj = this.route.snapshot.data["sdMaj"];
    this.transition = this.route.snapshot.data["transition"];
    this.processus = this.route.snapshot.data["processus"];
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

  public formErrors: Array<string>;
  public onFormError(list) {
    this.formErrors=list;
  }

  private hasPermissionNumerotationValue: boolean = null;
  hasPermissionNumerotation(){
    if(this.hasPermissionNumerotationValue === null) {
      this.hasPermissionNumerotationValue = hasPermission([PermissionConstantes.NUMEROTER_DOSSIER],this.myRoles);
    }
    return this.hasPermissionNumerotationValue;
  }


  public loadingEvent(statut: Boolean) {
    this.isLoadingResults = statut;
  }

  getFrontendTemplate(){
    return environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MAJ_PLAN_CADASTRE;
  }

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';

    });
  }
}
