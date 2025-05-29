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
import { SdAttributionService } from '@sycadApp/services/workflow/sd-attribution.service';
import { AuthentificatedUser, TypeUser } from '@sycadApp/features/transverse/login/auth.user';
import {DemandeDocument} from '@sycadApp/models/workflow/sd-demande-document.model';
import { SdDemandeDocumentService } from '@sycadApp/services/workflow/sd-demande-document.service';

@Component({
  selector: 'app-edition-sd-demande-document',
  templateUrl: './edition-sd-demande-document.component.html',
  styleUrls: ['./edition-sd-demande-document.component.scss']
})
export class EditionSdDemandeDocumentComponent implements OnInit {

  public demandeDocument: DemandeDocument;
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
                public demandeDocumentService: SdDemandeDocumentService,
                private _snackBar: MatSnackBar,
                private _adapter: DateAdapter<any>,
                public fb: FormBuilder)
  {
    this.demandeDocument = this.route.snapshot.data["demandeDocument"];
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
    return environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DEMANDE_DOCUMENT;
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
