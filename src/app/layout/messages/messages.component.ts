import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MessagesService } from './messages.service';
import {Router} from '@angular/router';
import {Notification} from '@sycadApp/models/data-references/system/model';
import { RemoteDataServiceService } from '@sycadApp/features/dashboard-domaine/global-info/live-users/remote-data-service.service';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';
import { AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MessagesService ]
})
export class MessagesComponent implements OnInit {  

  @ViewChild(MatMenuTrigger,{static:false}) trigger: MatMenuTrigger;

  public authentificatedUser$: Observable<AuthentificatedUser>;
   public notifications$: Observable<Notification[]>;
  
   public selectedTab:number=0;
   private canOpenMenu=false;
 
  constructor(private router: Router, public authService: AuthenticationService,public remoteDataService: RemoteDataServiceService) {

  }

  ngOnInit() {
    this.remoteDataService.getSingleton().subscribe(data => {
       if(data.diligenceDossier && data.diligenceDossier.length>0){
      //  // console.log(data.diligenceDossier)
        this.notifications$= of(data.diligenceDossier);
        this.canOpenMenu=true;
       }else {
        this.canOpenMenu=false;
       }
  });

  
  this.authService.getMe().subscribe((ob) => {
    this.authentificatedUser$=of(ob);
   });
  }
  ngOnDestroy() {
    this.remoteDataService.close();
  }
  openMessagesMenu() {

    if(this.canOpenMenu){
      this.trigger.openMenu();
      this.selectedTab = 0;
    }
   
  }

  onMouseLeave(){
    this.trigger.closeMenu();
  }

  stopClickPropagate(event: any){
    event.stopPropagation();
    event.preventDefault();
  }

  ouvrirLeDossier(notification: Notification) {
    switch (notification.codeProcessus) {
      case "WRKFProcessSaisieDiffereeAttribution":
        this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_ATTRIBUTION}`], {queryParams: { numero_fulltext: notification.numero}});
        break;
      case "WRKFProcessContribuationFonciers":
        this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_CONTRIBUTION_FONCIERE}`], {queryParams: { numero_fulltext: notification.numero}});
        break;
      case "WRKFProcessSaisieDiffereeDemandeDocument":
        this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DEMANDE_DOCUMENT}`], {queryParams: { numero_fulltext: notification.numero}});
        break;

      case "WRKFProcessBornageDelimitation":
        this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_BORNAGE_DELIMITATION}`], {queryParams: { numero_fulltext: notification.numero}});

        break;

      case "WRKFProcessFusionCadastral":
        this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_FUSION}`], {queryParams: { numero_fulltext: notification.numero}});
        break;

      case "WRKFProcessMorcellementCadastral":
        this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MORCELLEMENT}`], {queryParams: { numero_fulltext: notification.numero}});
        break;

      case "WRKFProcessMiseAJourPlanCadastral":
        this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MAJ_PLAN_CADASTRE}`], {queryParams: { numero_fulltext: notification.numero}});
        break;

      case "WRKFProcessSaisieDiffereeMutation":
        this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_MUTATION}`], {queryParams: { numero_fulltext: notification.numero}});
        break;

      case "WRKFProcessSaisieDiffereeAffectation":
        this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_AFFECTATION}`], {queryParams: { numero_fulltext: notification.numero}});
        break;
        
      case "WRKFProcessSaisieDiffereeRetrait":
        this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_RETRAIT}`], {queryParams: { numero_fulltext: notification.numero}});
        break;

      case "WRKFProcessLotissementCadastral":
        this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_LOTISSEMENT}`], {queryParams: { numero_fulltext: notification.numero}});
        break;

      case "WRKFProcessAmenagementCadastral":
        this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_AMENAGEMENT}`], {queryParams: { numero_fulltext: notification.numero}});
        break;
        case "WRKFProcessSectionnementCadastral":
          this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_SECTIONNEMENT}`], {queryParams: { numero_fulltext: notification.numero}});
          break;
      default:
        break;
    }
    this.trigger.closeMenu();
  }

}
