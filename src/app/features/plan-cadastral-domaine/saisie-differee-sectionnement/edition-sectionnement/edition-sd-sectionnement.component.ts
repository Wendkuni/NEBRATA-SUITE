import {Component, OnInit} from '@angular/core';
import {
  Processus,
  Transition
} from "@sycadApp/models/workflow/common/general";
import {
  AuthentificatedUser
} from "@sycadFeature/transverse/login/auth.user";
import {ActivatedRoute, Router} from "@angular/router";
import {
  MediaChange,
  MediaObserver
} from "@angular/flex-layout";
import {
  AppConfirmService
} from "@sycadShared/app-confirm/app-confirm.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DateAdapter} from "@angular/material/core";
import {FormBuilder} from "@angular/forms";
import {
  AuthenticationService
} from "@sycadFeature/transverse/login/authentication.service";
import {
  AuthorisationService
} from "@sycadFeature/transverse/login/authorisation.service";
import {hasPermission} from "@sycadShared/utils.functions";
import {
  PermissionConstantes
} from "@sycadApp/models/permssion-constantes";
import {
  environment
} from "../../../../../environments/environment";
import {
  SdSectionnementElement
} from "@sycadApp/models/workflow/sd-sectionnement.model";
import {
  SdSectionnementService
} from "@sycadApp/services/workflow/common/sd-sectionnement.service";

@Component({
  selector: 'app-edition-sd-sectionnement',
  templateUrl: './edition-sd-sectionnement.component.html',
  styleUrls: ['./edition-sd-sectionnement.component.scss']
})
export class EditionSdSectionnementComponent implements OnInit{
  public sdSectionnementElement: SdSectionnementElement;
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
              public sdSectionnementService: SdSectionnementService,
              public authService: AuthenticationService,
              public authorisationService: AuthorisationService)
  {

    this.sdSectionnementElement = this.route.snapshot.data["sdSectionnement"];
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
    return environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_SECTIONNEMENT;
  }

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';

    });
  }

}
