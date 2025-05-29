import {
  Compiler,
  Component,
  Injector,
  NgModuleFactory,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {Router} from '@angular/router';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { PlanCadastralMiseAjourLotissementService } from '@sycadApp/services/workflow/common/maj-lotissement.service';
import {
  ActionProcessusEvent,
  GenericAction, GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import {StatsExport} from '@sycadShared/directives/export.service';
import {environment} from '../../../../environments/environment';
import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import {PlanCadastralMAJLotissementElement} from '@sycadApp/models/workflow/maj-lotissement.model';
import { ChoixProcessusComponent } from './choix-processus/choix-processus.component';
import { FormRegionComponent } from '@sycadApp/features/data-references-domaine/territoire-ref/regions/form-region/form-region.component';
import { AuthorisationService } from '@sycadApp/features/transverse/login/authorisation.service';
import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';

@Component({
  selector: 'app-plan-cadastral-mise-a-jour-lotissement',
  templateUrl: './maj-lotissement.component.html',
  styleUrls: ['./maj-lotissement.component.scss']
})
export class PlanCadastralMiseAJourLotissementComponent extends AbstractSycadTableComponent implements OnInit {

  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;
  public myRoles: String[];
  static readonly PERMISSION_CREATION_DOSSIER_SAISIE_DIFFEREE_MAJ_PLAN="92c";
  static readonly PERMISSION_CREATION_DOSSIER_MAJ_PLAN="61c";
  static readonly CODE_DOSSIER_SAISIE_DOSSIER_MAJ_PLAN="DS11";

  public refeshDataSubject: Subject<string> = new Subject<string>();
  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver,
              public authorisationService: AuthorisationService,
              private router: Router,
              public confirmService: AppConfirmService,
              public dialog: MatDialog,private compiler: Compiler,
              private injector: Injector, public planCadastralService: PlanCadastralMiseAjourLotissementService) { super(); }

  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des dossiers mise à jour plan lotissement",true,false);
    this.monTableau
      .pushColumn(new SycadTableColonne("numero", "Numéro", true, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("objet", "Objet", true, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("typeOperation", "Type d'opération", true, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("commune.nom", "Commune", true, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("transmission.transmission", "Structure traitante", true, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("dateModificationDossier","Date de modification",true,TypeColonne.DATETIME,true,""))
      .pushColumn(new SycadTableColonne("etatDossier", "Etat Processus", true, TypeColonne.BOOLEAN, true, ""))
      .pushColumn(new SycadTableColonne("transmissionCreateur.transmission", "Localisation créateur dossier", false, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("dateCreationDossier", "Date de création", true, TypeColonne.DATETIME, true, ""))
      .pushColumn(new SycadTableColonne("etat", "Etat processus du dossier", true, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("acteurExterne.denomination", "Acteur Géomètre", true, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("promoteurImmobilier.denomination", "Acteur Promoteur", true, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("refExterne", "Référence externe", true, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("dateExterne", "Date externe", false, TypeColonne.DATE, true, ""))
      .pushColumn(new SycadTableColonne("dateMajPlan", "Date Mise à jour", false, TypeColonne.DATE, true, ""));

      this.monTableau.typeRessource="DossierMiseAJourPlanResource";
      this.monTableau.isExport=true;


    this.monTableau.transformeToProcessus();

    this.authorisationService.myRoles().subscribe((list) => {
      this.myRoles=list;
     // console.log("mes roles",list)
      if(this.myRoles?.indexOf(PlanCadastralMiseAJourLotissementComponent.PERMISSION_CREATION_DOSSIER_SAISIE_DIFFEREE_MAJ_PLAN)>=0 ||
      this.myRoles?.indexOf(PlanCadastralMiseAJourLotissementComponent.PERMISSION_CREATION_DOSSIER_MAJ_PLAN)>=0) {
        this.monTableau.isCreationActive=true;
      }else {
        this.monTableau.isCreationActive=false;
      }

      this.loadComponent();
     });





  }
  public async loadComponent() {
    this.componentFactories = [];
    const { SycadTableComponent,SycadTableModule } = await import('@sycadApp/libs/sycad-table/sycad-table.component');
    const moduleFactory = SycadTableModule instanceof NgModuleFactory ? SycadTableModule
      : (await this.compiler.compileModuleAsync(SycadTableModule));
    const moduleRef = moduleFactory.create(this.injector);
    const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(SycadTableComponent);
    this.anchor.clear();
    const tableauComponent = this.anchor.createComponent(componentFactory);
    tableauComponent.instance.tableDescription=this.monTableau;
    tableauComponent.instance.backendApiService=this.planCadastralService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onAddData.subscribe($event =>  this.actionProcessus(new ActionProcessusEvent(null,null)));
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.onActionProcessu.subscribe($event =>  this.actionProcessus($event));
    tableauComponent.instance.onPreviewData.subscribe($event =>  this.vueMajLotissement($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;
  }

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
     //// console.log("this.activeMediaQuery",this.activeMediaQuery)

      if(this.dialogRef) {
        let { width,height,position}=this.getCorrectWidth();
        this.dialogRef.updateSize(width, height);
        this.dialogRef.updatePosition(position);
      }

    });
  }
  public finishExport(event: StatsExport) {
    this._snackBar.open(`Export Plan cadastral mise à jour lotissement  terminé. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }
  public actionProcessus(context: ActionProcessusEvent) {
    if(context.numero){

      if(context.transition.code.startsWith("SAISIE_DIFFEREE_MAJ_PLAN")) {
        this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_MAJ}/edition`, context.numero,context.transition.code],{
          state: {
            context
          }
        });
      }else {
        this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MAJ_PLAN_CADASTRE}/edition`, context.numero,context.transition.code],{
          state: {
            context
          }
        });
      }

    }else {


      if(this.myRoles?.indexOf(PlanCadastralMiseAJourLotissementComponent.PERMISSION_CREATION_DOSSIER_SAISIE_DIFFEREE_MAJ_PLAN)>=0 &&
       this.myRoles?.indexOf(PlanCadastralMiseAJourLotissementComponent.PERMISSION_CREATION_DOSSIER_MAJ_PLAN) < 0) {
        this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_MAJ}/edition`]);
        return ;
      }

      if(this.myRoles?.indexOf(PlanCadastralMiseAJourLotissementComponent.PERMISSION_CREATION_DOSSIER_SAISIE_DIFFEREE_MAJ_PLAN)<0 &&
      this.myRoles?.indexOf(PlanCadastralMiseAJourLotissementComponent.PERMISSION_CREATION_DOSSIER_MAJ_PLAN) >= 0) {
        this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MAJ_PLAN_CADASTRE}/edition`]);
        return ;
     }

     if(this.myRoles?.indexOf(PlanCadastralMiseAJourLotissementComponent.PERMISSION_CREATION_DOSSIER_SAISIE_DIFFEREE_MAJ_PLAN)>=0 ||
     this.myRoles?.indexOf(PlanCadastralMiseAJourLotissementComponent.PERMISSION_CREATION_DOSSIER_MAJ_PLAN)>=0) {
      this.openFormModal();
     }

    }


  }

  public vueMajLotissement(majLotissement: PlanCadastralMAJLotissementElement){
    //console.log("majLotissement", majLotissement.numero.substring(0, 4))
    let codeDossier = majLotissement.numero.substring(0, 4);
    if(codeDossier===PlanCadastralMiseAJourLotissementComponent.CODE_DOSSIER_SAISIE_DOSSIER_MAJ_PLAN) {
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_MAJ}/view`, majLotissement.numero]);
    }else {
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MAJ_PLAN_CADASTRE}/view`, majLotissement.numero]);
    }

  }

  public genericAction(context: GenericActionEvent) {
   // console.log("une action quelconque  ",context)
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top'

    });
  }


  public dialogRef: MatDialogRef<ChoixProcessusComponent,any>;
  public openFormModal(){
    let { width,height,position}=this.getCorrectWidth();
    this.dialogRef = this.dialog.open(ChoixProcessusComponent, {
       data: null,
      panelClass:"sycad-dialog-form",
      width: width,
      height: height,
      position: position,
      disableClose:true
   });


 }


private getCorrectWidth() {

  if(this.mediaObserver.isActive("xs")) {
    return {
      width: '90vw',
      height: '30vh',
      position: {
        top:'2vh',
      }
    };
  }

  if(this.mediaObserver.isActive("sm")) {
    return {
      width: '70vw',
      height: '30vh',
      position: {
        top:'2vh',
      }
    };
  }

  if(this.mediaObserver.isActive("md")) {
    return {
      width: '50vw',
      height: '30vh',
      position: {
        top:'2vh',
      }
    };
  }

  if(this.mediaObserver.isActive("lg")) {
    return {
      width: '35vw',
      height: '30vh',
      position: {
        top:'2vh',
      }
    };
  }
  if(this.mediaObserver.isActive("xl")) {
    return {
      width: '30vw',
      height: '30vh',
      position: {
        top:'2vh',
      }
    };
  }
}

}
