import { Component, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormBuilder } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';
import { Processus, Transition } from '@sycadApp/models/workflow/common/general';
import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';
import { AuthorisationService } from '@sycadApp/features/transverse/login/authorisation.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { environment } from 'environments/environment';
import { CompteElement } from '@sycadApp/models/data-references/contribuables/compte.model';
import { CompteService } from '@sycadApp/services/data-references/contribuables/compte.service';

@Component({
  selector: 'app-edition-creation-user',
  templateUrl: './edition-creation-user.component.html',
  styleUrls: ['./edition-creation-user.component.scss']
})
export class EditionCreationUserComponent implements OnInit {

  public compteContribuable: CompteElement;
  public transition: Transition;
  public processus: Processus;
  public isLoadingResults:Boolean = false;
  public authentificatedUser: AuthentificatedUser;
  public myRoles: String[]; 


  constructor(  private router: Router,
                private route: ActivatedRoute,
                public authService: AuthenticationService,
                public authorisationService: AuthorisationService,
                private mediaObserver: MediaObserver,
                public confirmService: AppConfirmService,
                public compteService: CompteService,
                private _snackBar: MatSnackBar,
                private _adapter: DateAdapter<any>,
                public fb: FormBuilder)
  {
    this.compteContribuable = this.route.snapshot.data["compteContribuable"];
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


  getFrontendTemplate(){
    return environment.FRONTEND_ROUTES.GESTION_COMPTE;
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
