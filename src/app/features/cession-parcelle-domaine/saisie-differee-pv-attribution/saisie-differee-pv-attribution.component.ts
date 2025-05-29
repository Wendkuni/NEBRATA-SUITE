import {
  Compiler,
  Component,
  Injector,
  NgModuleFactory,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {Subject} from 'rxjs';
import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MediaObserver} from '@angular/flex-layout';
import {Router} from '@angular/router';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {MatDialog} from '@angular/material/dialog';
import { LotissementService } from '@sycadApp/services/workflow/common/lotissement.service';
import {
  ActionProcessusEvent,
  GenericAction, GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import {StatsExport} from '@sycadShared/directives/export.service';
import { SdAttributionService } from '@sycadApp/services/workflow/sd-attribution.service';
import { AttributionParcelle } from '@sycadApp/models/workflow/sd-attribution.model';
import { environment } from 'environments/environment';
import { EnteteDossierService } from '@sycadApp/services/workflow/entete.service';
import { SdEntetePVService } from '@sycadApp/services/workflow/sd-entetePV.service';

@Component({
  selector: 'app-saisie-differee-pv-attribution',
  templateUrl: './saisie-differee-pv-attribution.component.html',
  styleUrls: ['./saisie-differee-pv-attribution.component.scss']
})
export class SaisieDiffereePvAttributionComponent extends AbstractSycadTableComponent  implements OnInit {



  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();
  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor( private _snackBar: MatSnackBar,
               private mediaObserver: MediaObserver,
               private router: Router,
               public confirmService: AppConfirmService,
               public dialog: MatDialog,private compiler: Compiler,
               private injector: Injector, public enteteDossierService: SdEntetePVService)
  { super();}

  ngOnInit(): void {


    this.monTableau=new SycadTableMetaData("Tableau des dossiers d'attributon",true,false);
    this.monTableau
    .pushColumn(new SycadTableColonne("numero","Numero dossier",true,TypeColonne.STRING,true,""))
    //.pushColumn(new SycadTableColonne("objet","Objet PV",true,TypeColonne.STRING,true,""))
   // .pushColumn(new SycadTableColonne("objet","Objet PV",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("documentDeSortie.numero","Numéro du PV",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("documentDeSortie.dateDoc","Date du PV",true,TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("documentDeSortie.libelle","Libelle du PV",true,TypeColonne.STRING,true,""))
     // .pushColumn(new SycadTableColonne("documentDeSortie.pieceJointe","Document de sortie",true,TypeColonne.LIEN,false,""))
    .pushColumn(new SycadTableColonne("cessionSource.libelle","Mode cession",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("etat","Etat",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("statusDossier","Statut dossier",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("arrondissement.commune.nom","Commune",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("arrondissement.nom","Arrondissement",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("transmission.transmission","Localisation dossier",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("dateModificationDossier","Date de modification",true,TypeColonne.DATETIME,true,""))


      .pushColumn(new SycadTableColonne("transmissionCreateur.transmission","Localisation créateur dossier",false,TypeColonne.STRING,true,""))


      .pushColumn(new SycadTableColonne("dateMajPlan","Date Mise à jour",false,TypeColonne.DATE,true,""));

      this.monTableau.typeRessource="DossierSaisieEntetePVResource";
      this.monTableau.isExport=true;

    this.monTableau.transformeToProcessus();

    this.loadComponent();
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
    tableauComponent.instance.backendApiService=this.enteteDossierService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onAddData.subscribe($event =>  this.actionProcessus(new ActionProcessusEvent(null,null)));
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.onActionProcessu.subscribe($event =>  this.actionProcessus($event));
    tableauComponent.instance.onPreviewData.subscribe($event =>  this.vueAttribution($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;
  }
  public finishExport(event: StatsExport) {
    this._snackBar.open(`Export attribution terminé. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }
  public actionProcessus(context: ActionProcessusEvent) {
    if(context.numero){
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_PV_ATTRIBUTION}/edition`, context.numero,context.transition.code],{
        state: {
          context
        }
      });
    }else {
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_PV_ATTRIBUTION}/edition`]);

    }

  }

  public vueAttribution(attribution: AttributionParcelle){
     this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_PV_ATTRIBUTION}/view`, attribution.numero]);
   }

  public genericAction(context: GenericActionEvent) {
  // // console.log("une action quelconque  ",context)
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top'

    });
  }
}
