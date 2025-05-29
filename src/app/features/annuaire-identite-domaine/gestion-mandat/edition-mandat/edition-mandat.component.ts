import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormBuilder } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';
import { PermissionConstantes } from '@sycadApp/models/permssion-constantes';
import { MandatElement, Processus, Transition } from '@sycadApp/models/workflow/common/general';
import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';
import { AuthorisationService } from '@sycadApp/features/transverse/login/authorisation.service';
import { MandatsService } from '@sycadApp/services/workflow/mandats.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { hasPermission } from '@sycadApp/shared/utils.functions';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-edition-mandat',
  templateUrl: './edition-mandat.component.html',
  styleUrls: ['./edition-mandat.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditionMandatComponent implements OnInit {
  public mandat: MandatElement;
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
    public mandatService: MandatsService,
    private _snackBar: MatSnackBar,
    private _adapter: DateAdapter<any>,
    public fb: FormBuilder) 
    { 
      this.mandat= this.route.snapshot.data["mandat"];
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
    return environment.FRONTEND_ROUTES.PROCESSUS_MANDAT;
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
