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
import { SdMutationService } from '@sycadApp/services/workflow/sd-mutation.service';
import { MutationParcelle } from '@sycadApp/models/workflow/sd-mutation.model';
import { AuthentificatedUser, TypeUser } from '@sycadApp/features/transverse/login/auth.user';

@Component({
  selector: 'app-edition-sd-mutation',
  templateUrl: './edition-sd-mutation.component.html',
  styleUrls: ['./edition-sd-mutation.component.scss']
})
export class EditionSdMutationComponent implements OnInit {

  public mutation: MutationParcelle;
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
                public fb: FormBuilder, public mutationService: SdMutationService)
  {
    this.mutation = this.route.snapshot.data["mutation"];
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
    return environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_MUTATION;
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
