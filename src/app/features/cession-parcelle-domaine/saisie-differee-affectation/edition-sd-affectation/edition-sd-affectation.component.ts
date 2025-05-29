import { Component, OnInit } from '@angular/core';
import {Processus, Transition} from '@sycadApp/models/workflow/common/general';
import {ActivatedRoute, Router} from '@angular/router';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DateAdapter} from '@angular/material/core';
import {FormBuilder} from '@angular/forms';

import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';
import { environment } from 'environments/environment';

import {AffectationParcelle} from '@sycadApp/models/workflow/sd-affectation.model';
import { SdAffectationService } from '@sycadApp/services/workflow/sd-affectation.service';
import { AuthentificatedUser, TypeUser } from '@sycadApp/features/transverse/login/auth.user';

@Component({
  selector: 'app-edition-sd-affectation',
  templateUrl: './edition-sd-affectation.component.html',
  styleUrls: ['./edition-sd-affectation.component.scss']
})
export class EditionSdAffectationComponent implements OnInit {

  public affectation: AffectationParcelle;
  public transition: Transition;
  public processus: Processus;
  public isLoadingResults:Boolean = false;
  public authentificatedUser: AuthentificatedUser;
  public typeActeur=TypeUser.ACTEUR;

  constructor(  private router: Router,
                private route: ActivatedRoute,
                public authService: AuthenticationService,
                private mediaObserver: MediaObserver,
                public confirmService: AppConfirmService,
                private _snackBar: MatSnackBar,
                private _adapter: DateAdapter<any>,
                public fb: FormBuilder, public affectationService: SdAffectationService)
  {
    this.affectation = this.route.snapshot.data["affectation"];
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
    return environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_AFFECTATION;
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
