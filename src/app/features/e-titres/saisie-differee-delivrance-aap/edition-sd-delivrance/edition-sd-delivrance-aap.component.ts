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
import { AuthentificatedUser, TypeUser } from '@sycadApp/features/transverse/login/auth.user';
import { DelivranceAap } from '@sycadApp/models/workflow/sd-delivrance-aap.model';
import { SdDelivranceAapService } from '@sycadApp/services/workflow/sd-delivrance-aap.service';
import { hasPermission } from '@sycadApp/shared/utils.functions';
import { PermissionConstantes } from '@sycadApp/models/permssion-constantes';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-edition-sd-delivrance-aap',
  templateUrl: './edition-sd-delivrance-aap.component.html',
  styleUrls: ['./edition-sd-delivrance-aap.component.scss']
})
export class EditionSdDelivranceAapComponent implements OnInit {

  public delivranceAap: DelivranceAap;
  public transition: Transition;
  public processus: Processus;
  public isLoadingResults:Boolean = false;
  public authentificatedUser: AuthentificatedUser;
  public typeActeur=TypeUser.ACTEUR;
   public displayedColumnsEtat: string[] = ['code', 'libelle', 'description'];



  constructor(  private router: Router,
                private route: ActivatedRoute,
                public authService: AuthenticationService,
                private mediaObserver: MediaObserver,
                public confirmService: AppConfirmService,
                public delivranceAapService: SdDelivranceAapService,
                private _snackBar: MatSnackBar,
                private _adapter: DateAdapter<any>,
                public fb: FormBuilder)
  {
    this.delivranceAap = this.route.snapshot.data["delivranceAap"];
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
    return environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DELIVRANCE_AAP;
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

  // private hasPermissionNumerotationValue:boolean=null;

  // hasPermissionRenvoyerAuCreateur(){
  //   if(this.hasPermissionNumerotationValue===null) {
  //     this.hasPermissionNumerotationValue=hasPermission([PermissionConstantes.RENVOYER_AU_CREATEUR_DOSSIER_CONTRIBUTION_FONCIERE],this.myRoles);
  //   }
  //   return this.hasPermissionNumerotationValue;
  // }
  // <ng-container *ngIf="authentificatedUser?.typeUser==='AGENT' && hasPermissionRenvoyerAuCreateur(); else autreContribuableCondition">
}
