import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  Processus,
  Transition
} from '@sycadApp/models/workflow/common/general';
import {AuthentificatedUser} from '@sycadApp/features/transverse/login/auth.user';
import {PlanCadastralMorcellementElement} from '@sycadApp/models/workflow/cp-morcellement.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '@sycadApp/features/transverse/login/authentication.service';
import { AuthorisationService } from '@sycadApp/features/transverse/login/authorisation.service';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DateAdapter} from '@angular/material/core';
import {FormBuilder} from '@angular/forms';
import {PlanCadastralMorcellementService} from '@sycadApp/services/workflow/common/morcellement.service';
import {hasPermission} from '@sycadShared/utils.functions';
import {PermissionConstantes} from '@sycadApp/models/permssion-constantes';
import {environment} from '../../../../../environments/environment';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-edition-domaine-morcellement',
  templateUrl: './edition-domaine-morcellement.component.html',
  styleUrls: ['./edition-domaine-morcellement.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditionDomaineMorcellementComponent implements OnInit {
  public morcellement: PlanCadastralMorcellementElement;
  public transition: Transition;
  public processus: Processus;
  public isLoadingResults: Boolean = false;
  public authentificatedUser: AuthentificatedUser;
  public myRoles: String[];
  constructor(private router: Router,
              private route: ActivatedRoute,
              public authService: AuthenticationService,
              public authorisationService: AuthorisationService,
              private mediaObserver: MediaObserver,
              public confirmService: AppConfirmService,
              public morcellementService: PlanCadastralMorcellementService,
              private _snackBar: MatSnackBar,
              private _adapter: DateAdapter<any>,
              public fb: FormBuilder)
  {
    this.morcellement = this.route.snapshot.data["morcellement"];
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

    this.authorisationService.myRoles().subscribe((list) => {
      this.myRoles=list;
    });



  }
  private hasPermissionNumerotationValue:boolean=null;
  hasPermissionNumerotation(){
    if(this.hasPermissionNumerotationValue===null) {
      this.hasPermissionNumerotationValue=hasPermission([PermissionConstantes.NUMEROTER_DOSSIER],this.myRoles);
    }
    return this.hasPermissionNumerotationValue;
  }

  getFrontendTemplate(){
    return environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MORCELLEMENT;
  }
  
  public loadingEvent(statut:Boolean) {
    this.isLoadingResults=statut;
  }

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }


}
