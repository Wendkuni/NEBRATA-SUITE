import { Component, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';
import {ExonerationDossier } from '@sycadApp/models/impot/exoneration.model';
import { PermissionConstantes } from '@sycadApp/models/permssion-constantes';
import { Transition, Processus } from '@sycadApp/models/workflow/common/general';
import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';
import { ExonerationService } from '@sycadApp/services/impot/exoneration.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { hasPermission } from '@sycadApp/shared/utils.functions';
import { environment } from 'environments/environment';
import { AuthorisationService } from '@sycadApp/features/transverse/login/authorisation.service';

@Component({
  selector: 'app-edition-exoneration',
  templateUrl: './edition-exoneration.component.html',
  styleUrls: ['./edition-exoneration.component.scss']
})
export class EditionExonerationComponent implements OnInit {
  public exonerationDossier: ExonerationDossier;
  public transition: Transition;
  public processus: Processus;
  public isLoadingResults:Boolean = false;
  public authentificatedUser: AuthentificatedUser;
  public myRoles: String[];

  constructor( private route: ActivatedRoute,
                public authService: AuthenticationService,
                private mediaObserver: MediaObserver,
                public confirmService: AppConfirmService,
                public authorisationService: AuthorisationService,
                public fb: FormBuilder, public exonerationService: ExonerationService)
                {
                  this.exonerationDossier = this.route.snapshot.data["exonerationDossier"];
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
    return environment.FRONTEND_ROUTES.PROCESSUS_EXONERATION;
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
